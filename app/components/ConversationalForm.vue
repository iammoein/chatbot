<template>
  <div id="cf-context">
    <form id="cf-form" style="display: none">
      <input type="text" name="name" placeholder="What's your name?" />
      <input type="email" name="email" placeholder="Your email address" />
      <select name="experience">
        <option value="">How was your experience?</option>
        <option value="great">Great</option>
        <option value="ok">Okay</option>
        <option value="bad">Bad</option>
      </select>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  const { ConversationalForm } = await import("conversational-form");
  ConversationalForm.startTheConversation({
    formEl: document.getElementById("cf-form"),
    context: document.getElementById("cf-context"),
    submitCallback: () => {
      const formData = new FormData(document.getElementById("cf-form"));
      const result = Object.fromEntries(formData.entries());
      console.log("Form submitted:", result);
    },
  });
});
</script>

<style>

cf-chat-response,
cf-chat-type,
cf-input {
  font-family: inherit;
}
</style>
