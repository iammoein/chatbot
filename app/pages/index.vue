<script setup lang="ts">
import { ref } from 'vue'
import { useChat } from '../composables/useChat'

const input = ref("")
const loading = ref(false)
const { model } = useLLM()
const { sendMessageWithStream, messages } = useChat()

async function onSubmit() {
  if (!input.value) return
  loading.value = true
  await sendMessageWithStream(input.value)
  input.value = ""
  loading.value = false
}

const quickChats = [
  { label: "Why use Nuxt UI Pro?", icon: "i-logos-nuxt-icon" },
  { label: "Help me create a Vue composable", icon: "i-logos-vue" },
  { label: "Tell me more about UnJS", icon: "i-logos-unjs" },
  { label: "Why should I consider VueUse?", icon: "i-logos-vueuse" },
  { label: "Tailwind CSS best practices", icon: "i-logos-tailwindcss-icon" }
]

function quickSend(prompt: string) {
  input.value = prompt
  onSubmit()
}
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral" />
          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </UChatPrompt>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
            @click="quickSend(quickChat.label)"
          />
        </div>

        <div class="mt-8 space-y-2">
          <div v-for="(msg, i) in messages" :key="i">
            <strong>{{ msg.role }}:</strong> {{ msg.content }}
          </div>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
