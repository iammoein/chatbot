export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui-pro",
    "@nuxtjs/mdc",
    "@nuxthub/core",
    "nuxt-auth-utils"
  ],

  impound: {
    enabled: false
  },

  ui: {
    fonts: false
  },

  devtools: {
    enabled: true
  },

  css: ["~/assets/css/main.css"],

  mdc: {
    highlight: {
      shikiEngine: "javascript"
    }
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  runtimeConfig: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    public: {}
  },

  uiPro: {
    openai: {
      provider: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY
    }
  }
})
