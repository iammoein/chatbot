import { isToday, isYesterday, subDays, subMonths } from 'date-fns'
import { computed, type Ref } from 'vue'

interface Chat {
  id: string
  label: string
  icon?: string
  createdAt: string
}

interface ChatGroup {
  id: string
  label: string
  items: Chat[]
}

export function useChats(chats: Ref<Chat[] | undefined>) {
  const groups = computed<ChatGroup[]>(() => {
    const today: Chat[] = []
    const yesterday: Chat[] = []
    const lastWeek: Chat[] = []
    const lastMonth: Chat[] = []
    const older: Record<string, Chat[]> = {}

    const oneWeekAgo = subDays(new Date(), 7)
    const oneMonthAgo = subMonths(new Date(), 1)

    chats.value?.forEach((chat) => {
      const date = new Date(chat.createdAt)

      if (isToday(date)) today.push(chat)
      else if (isYesterday(date)) yesterday.push(chat)
      else if (date >= oneWeekAgo) lastWeek.push(chat)
      else if (date >= oneMonthAgo) lastMonth.push(chat)
      else {
        const key = date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })
        if (!older[key]) older[key] = []
        older[key].push(chat)
      }
    })

    const sorted = Object.keys(older).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const formatted: ChatGroup[] = []

    if (today.length) formatted.push({ id: 'today', label: 'Today', items: today })
    if (yesterday.length) formatted.push({ id: 'yesterday', label: 'Yesterday', items: yesterday })
    if (lastWeek.length) formatted.push({ id: 'last-week', label: 'Last week', items: lastWeek })
    if (lastMonth.length) formatted.push({ id: 'last-month', label: 'Last month', items: lastMonth })

    sorted.forEach((key) => {
      formatted.push({ id: key, label: key, items: older[key] })
    })

    return formatted
  })

  return { groups }
}
