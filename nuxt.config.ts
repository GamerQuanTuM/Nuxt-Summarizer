export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  plugins: [
    "~/plugins/authModal.client.ts",
    "~/plugins/userDetails.client.ts",
  ],
  modules: ["@nuxtjs/tailwindcss", "nuxt-cron"],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  runtimeConfig: {
    public: {},
  },

  cron: {
    runOnInit: true,
    timeZone: 'Asia/Kolkata',
    jobsDir: 'cron'
  },
  ssr: false,
  build: {
    transpile: ['pdfjs-dist']
  },
  vite: {
    resolve: {
      alias: {
        'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
      },
    },
  },
});
