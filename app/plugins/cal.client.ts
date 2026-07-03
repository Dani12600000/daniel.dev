export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const w = window as any

  // Cal.com embed bootstrap (queues calls until embed.js loads)
  ;(function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar) }
    const d = C.document
    C.Cal = C.Cal || function () {
      const cal = C.Cal
      // eslint-disable-next-line prefer-rest-params
      const ar = arguments
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        d.head.appendChild(d.createElement('script')).src = A
        cal.loaded = true
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments) }
        const namespace = ar[1]
        api.q = api.q || []
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api
          p(cal.ns[namespace], ar)
          p(cal, ['initNamespace', namespace])
        } else p(cal, ar)
        return
      }
      p(cal, ar)
    }
  })(w, 'https://app.cal.com/embed/embed.js', 'init')

  const Cal = w.Cal
  Cal('init', 'discovery-call', { origin: 'https://app.cal.com' })
  Cal.config = Cal.config || {}
  Cal.config.forwardQueryParams = true
  Cal.ns['discovery-call']('ui', { hideEventTypeDetails: false, layout: 'month_view', theme: 'auto' })

  return {
    provide: {
      openCal: (calLink = 'dani1260000/discovery-call') => {
        const CalRef = (window as any).Cal
        if (CalRef?.ns?.['discovery-call']) {
          CalRef.ns['discovery-call']('modal', {
            calLink,
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'auto' }
          })
        } else {
          console.error('Cal.com script not loaded yet')
          window.location.href = 'mailto:dp709020@gmail.com?subject=Meeting%20Request'
        }
      }
    }
  }
})
