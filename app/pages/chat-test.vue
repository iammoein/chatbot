<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">فرم چتی تستی</h1>
    <div id="cf-context">
      <form id="cf-form" style="display: none">
        <input type="text" name="name" placeholder="اسم شما چیه؟" />
        <input type="email" name="email" placeholder="ایمیل شما" />
        <select name="experience">
          <option value="">تجربه‌ت با ما چطور بود؟</option>
          <option value="great">عالی</option>
          <option value="ok">خوب</option>
          <option value="bad">ضعیف</option>
        </select>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  if (process.client) {
    const { ConversationalForm } = await import("conversational-form");
    ConversationalForm.startTheConversation({
      formEl: document.getElementById("cf-form"),
      context: document.getElementById("cf-context"),
      submitCallback: () => {
        const formData = new FormData(document.getElementById("cf-form"));
        const result = Object.fromEntries(formData.entries());
        console.log("📨 فرم ارسال شد:", result);
        alert(`فرم با موفقیت ارسال شد:\n${JSON.stringify(result, null, 2)}`);
      },
    });
  }
});
</script>

<style>
/* استایل پیشنهادی */
body {
  font-family: sans-serif;
}
#cf-context {
  max-width: 600px;
  margin: auto;
}
</style>
