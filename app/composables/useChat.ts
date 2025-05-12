import { ref, type Ref } from 'vue'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const messages: Ref<ChatMessage[]> = ref([])
  const loading = ref(false)

  const sendMessageWithStream = async (prompt: string) => {
    loading.value = true
    messages.value.push({ role: 'user', content: prompt })
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' }
    messages.value.push(assistantMessage)

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: prompt })
    })

    if (!response.body) {
      loading.value = false
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const content = line.replace(/^data:\s*/, '')
          if (content === '[DONE]') {
            loading.value = false
            return
          }
          assistantMessage.content += content
        }
      }
    }

    loading.value = false
  }

  return {
    messages,
    loading,
    sendMessageWithStream
  }
}
