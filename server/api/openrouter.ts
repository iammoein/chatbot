import { defineEventHandler } from 'h3';
import { callOpenRouter } from '../utils/openRouter';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { model, prompt } = body;

  if (!model || !prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'مدل و متن ورودی الزامی هستند',
    });
  }

  try {
    const result = await callOpenRouter(model, prompt);
    return result;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'خطا در فراخوانی OpenRouter',
    });
  }
});