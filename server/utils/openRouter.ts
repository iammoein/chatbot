import axios from 'axios';
import { useRuntimeConfig } from '#imports';

export async function callOpenRouter(model: string, prompt: string) {
  const config = useRuntimeConfig();
  const apiKey = config.openRouterApiKey;

  if (!apiKey) {
    throw new Error('کلید API OpenRouter تنظیم نشده است');
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('خطا در ارتباط با OpenRouter:', error);
    throw error;
  }
}