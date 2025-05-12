let chats: any[] = []

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    return chats
  }

  if (method === 'POST') {
    const body = await readBody<{ input: string }>(event)
    const newChat = {
      id: crypto.randomUUID(),
      title: body.input || 'Untitled',
      createdAt: new Date().toISOString()
    }
    chats.unshift(newChat)
    return newChat
  }

  if (method === 'DELETE') {
    const id = getRouterParam(event, 'id')
    chats = chats.filter((chat) => chat.id !== id)
    return { success: true }
  }
})
