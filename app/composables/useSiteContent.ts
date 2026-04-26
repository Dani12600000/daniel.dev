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
  // Fetching the static JSON directly from the public folder.
  // This is highly robust for GitHub Pages, avoiding API query-param routing issues.
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  return await $fetch(`${baseURL}content/site.${locale}.json`)
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
