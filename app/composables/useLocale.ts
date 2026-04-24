export type Locale = 'en' | 'pt'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'pt']
const STORAGE_KEY = 'daniel.dev.locale'

export const useLocale = () => {
  return useState<Locale>('locale', () => 'en')
}

export const initLocale = async () => {
  const locale = useLocale()
  if (import.meta.server) return
  const prev = locale.value
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    locale.value = saved
  } else {
    const nav = (window.navigator.language || 'en').toLowerCase()
    if (nav.startsWith('pt')) locale.value = 'pt'
  }
  document.documentElement.lang = locale.value
  if (locale.value !== prev) await reloadSiteContent()
}

export const setLocale = async (next: Locale) => {
  const locale = useLocale()
  if (locale.value === next) return
  locale.value = next
  if (import.meta.client) {
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
  }
  await reloadSiteContent()
}
