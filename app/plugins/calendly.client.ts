export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Load Calendly assets
  const link = document.createElement('link')
  link.href = 'https://assets.calendly.com/assets/external/widget.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://assets.calendly.com/assets/external/widget.js'
  script.async = true
  document.head.appendChild(script)

  return {
    provide: {
      openCalendly: (url: string = 'https://calendly.com/dani1260000/30min') => {
        // @ts-ignore
        if (window.Calendly) {
          // @ts-ignore
          window.Calendly.initPopupWidget({ url })
        } else {
          console.error("Calendly script not loaded yet")
          window.location.href = `mailto:dp709020@gmail.com?subject=Meeting%20Request`
        }
      }
    }
  }
})
