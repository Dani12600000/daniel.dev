export interface SiteContent {
  site: Record<string, any>
  navigation: Array<{ key: string; num: string; label: string; path: string }>
  languages: Array<{ code: string; active: boolean }>
  hero: Record<string, any>
  nowCard: Record<string, any>
  terminalCard: Record<string, any>
  stats: Array<{ k: string; v: string }>
  projects: Array<any>
  skills: { legend: string; groups: Array<{ group: string; items: Array<any> }> }
  about: Record<string, any>
  contact: Record<string, any>
  music: Record<string, any>
  footer: Record<string, any>
  ui?: Record<string, any>
}

export const useSiteContent = () => {
  return useState<SiteContent | null>('site-content', () => null)
}

const fetchFor = async (locale: string): Promise<SiteContent> => {
  // Fetching from an internal API route is the standard Nuxt way.
  // It bypasses router warnings and is easily pre-rendered for GitHub Pages.
  return await $fetch('/api/site-content', { query: { locale } })
}

export const useLoadSiteContent = async () => {
  const content = useSiteContent()
  const locale = useLocale()

  // SSR / first load
  if (!content.value) {
    const { data } = await useAsyncData<SiteContent>(
      `site-content-${locale.value}`,
      () => fetchFor(locale.value),
    )
    if (data.value) content.value = data.value
  }

  return content.value
}

export const reloadSiteContent = async () => {
  const content = useSiteContent()
  const locale = useLocale()
  try {
    content.value = await fetchFor(locale.value)
  } catch (err) {
    console.error('Failed to load locale content', err)
  }
  return content.value
}
