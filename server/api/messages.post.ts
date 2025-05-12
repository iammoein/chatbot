// server/api/messages.post.ts
import { readBody, setResponseHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // فقط POST رو پاسخ بده
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  console.log('📨 /api/messages called')

  const config = useRuntimeConfig()
  const body = await readBody<{ content: string }>(event)
  console.log('Prompt:', body.content)

  const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // برای OpenRouter از شناسه‌ی رسمی OpenAI استفاده کنید:
      model: 'openai/gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system',  content: 'You are a helpful assistant.' },
        { role: 'user',    content: body.content }
      ]
    })
  })

  console.log('[OpenRouter Status]', openRouterRes.status)

  if (!openRouterRes.body) {
    console.error('[ERROR] No stream returned')
    throw createError({ statusCode: 500, statusMessage: 'No stream returned' })
  }

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const reader = openRouterRes.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    console.log('[chunk]', chunk)

    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data:')) continue
      const jsonStr = line.replace(/^data:\s*/, '')
      if (jsonStr === '[DONE]') {
        event.node.res.write(`event: done\ndata: [DONE]\n\n`)
        event.node.res.end()
        return
      }
      try {
        const parsed = JSON.parse(jsonStr)
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) {
          console.log('[delta]', delta)
          event.node.res.write(`data: ${delta}\n\n`)
        }
      } catch (err) {
        console.error('[parse error]', err)
      }
    }
  }

  event.node.res.end()
})
