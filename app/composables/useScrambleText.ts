import { watch, nextTick } from 'vue'

export const useScrambleText = () => {
  const content = useSiteContent()
  const chars = '!<>-_\\/[]{}—=+*^?#_'

  // Snapshot of text nodes before content changes
  let snapshot = new Map<string, string>()

  const getTextSelector = () =>
    'h1, h2, h3, p, .btn, .comment, .card-title, .card-sub, .row span, .name, .desc, .tag, .section-label, .eyebrow, .lede, .channel-row .k, .channel-row .v, .navbar .links a, .mobile-drawer a, .topbar .path'

  // Build a unique path for a text node so we can match before/after
  const getNodePath = (node: Node): string => {
    const parts: string[] = []
    let current: Node | null = node
    while (current && current !== document.body) {
      if (current.parentNode) {
        const siblings = Array.from(current.parentNode.childNodes)
        const idx = siblings.indexOf(current as ChildNode)
        parts.unshift(`${(current as Element).tagName || 'T'}[${idx}]`)
      }
      current = current.parentNode
    }
    return parts.join('/')
  }

  const takeSnapshot = () => {
    snapshot.clear()
    const els = document.querySelectorAll(getTextSelector())
    els.forEach((el) => {
      if (el.closest('.typed-line') || el.closest('.term-card') || el.closest('.no-scramble')) return
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
      let node
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.trim().length > 0) {
          snapshot.set(getNodePath(node), node.nodeValue)
        }
      }
    })
  }

  const scrambleChanged = () => {
    const els = document.querySelectorAll(getTextSelector())
    els.forEach((el) => {
      if (el.closest('.typed-line') || el.closest('.term-card') || el.closest('.no-scramble')) return
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
      let node
      while ((node = walker.nextNode())) {
        const textNode = node as Text
        const newText = textNode.nodeValue
        if (!newText || newText.trim().length === 0) continue

        const path = getNodePath(textNode)
        const oldText = snapshot.get(path)

        // Only scramble if the text actually changed
        if (oldText !== undefined && oldText === newText) continue
        // Skip nodes that didn't exist before (new elements) - they get reveal animation
        if (oldText === undefined) continue

        const target = newText
        const length = target.length
        let frame = 0
        const maxFrames = 12 + Math.floor(Math.random() * 10)

        const animate = () => {
          frame++
          let out = ''
          for (let i = 0; i < length; i++) {
            if (i < (frame / maxFrames) * length) {
              out += target[i]
            } else {
              out += chars[Math.floor(Math.random() * chars.length)]
            }
          }
          textNode.nodeValue = out
          if (frame < maxFrames) {
            requestAnimationFrame(animate)
          } else {
            textNode.nodeValue = target
          }
        }
        requestAnimationFrame(animate)
      }
    })
    snapshot.clear()
  }

  let isFirstLoad = true

  // Watch content — fires after reloadSiteContent completes
  watch(content, async () => {
    if (isFirstLoad) {
      isFirstLoad = false
      return
    }
    await nextTick()
    scrambleChanged()
  })

  // Snapshot before content changes by watching locale (fires synchronously before reload)
  const locale = useLocale()
  watch(locale, () => {
    takeSnapshot()
  })

  return { scrambleChanged }
}
