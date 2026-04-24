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
  if (import.meta.server) {
    // On the server, read the file directly from the public directory
    const { readFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    const filePath = resolve(process.cwd(), `public/content/site.${locale}.json`)
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  // On the client, use a plain fetch to avoid Vue Router interception
  const res = await globalThis.fetch(`/content/site.${locale}.json`)
  return res.json()
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
