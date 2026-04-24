import { onMounted, onBeforeUnmount } from 'vue'

export const useReveal = (selector = '.reveal', options: IntersectionObserverInit = { rootMargin: '-8% 0px', threshold: 0.05 }) => {
  let observer: IntersectionObserver | null = null

  const init = () => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      document.querySelectorAll<HTMLElement>(selector).forEach(el => el.classList.add('is-visible'))
      return
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    }, options)

    document.querySelectorAll<HTMLElement>(selector).forEach(el => observer!.observe(el))
  }

  onMounted(() => {
    // Wait one frame so child content is rendered.
    requestAnimationFrame(() => init())
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
