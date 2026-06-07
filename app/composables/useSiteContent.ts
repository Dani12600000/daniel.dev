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
  // Static JSON files per locale — required for GitHub Pages (static hosting cannot
  // route by query param; /api/site-content?locale=pt would resolve the same file as EN).
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  return await $fetch<SiteContent>(`${baseURL}content/site.${locale}.json`)
}

export const useLoadSiteContent = async () => {
  const content = useSiteContent()
  const locale = useLocale()

  if (!content.value) {
    try {
      const { data, error } = await useAsyncData<SiteContent>(
        `site-content-${locale.value}`,
        () => fetchFor(locale.value),
        {
          server: true,
          lazy: false
        }
      )
      
      if (data.value) {
        content.value = data.value
      } else if (error.value || !data.value) {
        // If useAsyncData failed or returned null (common in some dev environments for static files)
        // we try a direct fetch on the client.
        if (import.meta.client) {
          console.warn('Initial content load via useAsyncData failed, retrying with direct fetch...')
          content.value = await fetchFor(locale.value)
        }
      }
    } catch (err) {
      console.error('useLoadSiteContent error:', err)
      if (import.meta.client) {
        content.value = await fetchFor(locale.value)
      }
    }
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
