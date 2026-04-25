export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL
  
  return {
    provide: {
      url: (path: string) => {
        if (!path) return path
        if (path.startsWith('http') || path.startsWith('//') || !path.startsWith('/')) return path
        // Prepend baseURL and remove the leading slash from path to avoid double slashes
        return `${baseURL}${path.slice(1)}`
      }
    }
  }
})
