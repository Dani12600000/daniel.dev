export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: '/daniel.dev/', // For GitHub Pages (username.github.io/repo-name/)
    buildAssetsDir: 'nuxt', // Prevents GitHub Pages from ignoring the directory (no leading underscore)
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Daniel Pereira — Full-Stack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Daniel Pereira — Full-Stack Developer. Terminal-inspired portfolio built with Nuxt, Vue and GSAP.' },
        { name: 'theme-color', content: '#08090b' },
        { property: 'og:title', content: 'Daniel Pereira — Full-Stack Developer' },
        { property: 'og:description', content: 'Terminal-inspired portfolio built with Nuxt, Vue and GSAP.' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  nitro: {
    preset: 'github-pages',
    prerender: {
      routes: [
        '/api/github-stats',
        '/api/site-content?locale=en',
        '/api/site-content?locale=pt'
      ]
    }
  },
})

