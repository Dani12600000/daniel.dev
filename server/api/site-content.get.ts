import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = query.locale || 'en'
  
  try {
    // Read directly from the public folder on the server
    const filePath = resolve(process.cwd(), `public/content/site.${locale}.json`)
    const data = readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    throw createError({
      statusCode: 404,
      statusMessage: `Content for locale [${locale}] not found`,
    })
  }
})
