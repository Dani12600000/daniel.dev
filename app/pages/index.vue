<script setup lang="ts">
const content = useSiteContent()
const hero = computed(() => content.value?.hero ?? ({} as any))
const now = computed(() => content.value?.nowCard ?? ({} as any))
const term = computed(() => content.value?.terminalCard ?? ({} as any))
const projects = computed(() => (content.value?.projects ?? []).slice(0, 3))

const locale = useLocale()

const { data: githubRepo } = await useFetch<any>('https://api.github.com/repos/Dani12600000/daniel.dev', {
  query: { t: Date.now() },
  headers: { 'User-Agent': 'daniel-dev-portfolio' }
})

const dynamicMeta = computed(() => {
  if (!githubRepo.value?.pushed_at) return now.value?.meta
  
  const diff = Date.now() - new Date(githubRepo.value.pushed_at).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  const isPt = locale.value === 'pt'

  let str = ''
  if (days > 0) {
    str = isPt ? `há ${days}d` : `${days}d ago`
  } else if (hours > 0) {
    str = isPt ? `há ${hours}h` : `${hours}h ago`
  } else if (mins > 0) {
    str = isPt ? `há ${mins}m` : `${mins}m ago`
  } else {
    str = isPt ? 'agora mesmo' : 'just now'
  }

  const prefix = isPt ? 'último push' : 'last pushed'
  return `${prefix} · ${str}`
})

useHead({
  title: () => content.value?.site?.title ?? 'Daniel Pereira',
})

const typed = ref('')
const typedEl = ref<HTMLElement | null>(null)
let typingTimer: number | undefined
let typedObserver: IntersectionObserver | null = null

const runTypedAnimation = () => {
  const full: string = hero.value?.typedLine ?? ''
  if (!full) return
  if (typingTimer) window.clearInterval(typingTimer)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) { typed.value = full; return }
  typed.value = ''
  let i = 0
  typingTimer = window.setInterval(() => {
    i++
    typed.value = full.slice(0, i)
    if (i >= full.length) {
      window.clearInterval(typingTimer)
      typingTimer = undefined
    }
  }, 35)
}

const terminalLines = ref<any[]>([])
const termEl = ref<HTMLElement | null>(null)
let termTimer: number | undefined
let termObserver: IntersectionObserver | null = null
let termHasAnimated = false

const populateTerminalInstantly = () => {
  const lines = term.value?.lines ?? []
  terminalLines.value = lines.map((l: any) => ({ ...l }))
}

const runTerminalAnimation = () => {
  const lines = term.value?.lines ?? []
  if (!lines.length) return
  if (termTimer) window.clearTimeout(termTimer)
  termHasAnimated = true
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) { 
    populateTerminalInstantly()
    return 
  }
  
  terminalLines.value = []
  let lineIdx = 0
  let charIdx = 0
  
  const typeChar = () => {
    if (lineIdx >= lines.length) return
    const currentLine = lines[lineIdx]
    
    if (currentLine.prompt) {
      if (charIdx === 0) {
        terminalLines.value.push({ prompt: true, text: '', cursor: true })
      }
      
      const currentText = currentLine.text
      if (charIdx < currentText.length) {
        terminalLines.value[lineIdx].text += currentText[charIdx]
        charIdx++
        termTimer = window.setTimeout(typeChar, 40)
      } else {
        terminalLines.value[lineIdx].cursor = false
        lineIdx++
        charIdx = 0
        termTimer = window.setTimeout(typeChar, 200)
      }
    } else {
      terminalLines.value.push({ ...currentLine, cursor: currentLine.cursor })
      lineIdx++
      charIdx = 0
      termTimer = window.setTimeout(typeChar, 450)
    }
  }
  
  typeChar()
}

onMounted(() => {
  // Immediately populate terminal lines so they're never empty on load
  populateTerminalInstantly()

  if (typedEl.value) {
    typedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runTypedAnimation()
          typedObserver?.disconnect()
        }
      })
    }, { threshold: 0.4 })
    typedObserver.observe(typedEl.value)
  }

  if (termEl.value) {
    termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runTerminalAnimation()
          termObserver?.disconnect()
        }
      })
    }, { threshold: 0.4 })
    termObserver.observe(termEl.value)
  }
})

// Track whether first load has happened
let hasLoaded = false

// When content changes, update animated elements (handles first load + text changes)
watch(content, (newContent) => {
  if (!newContent) return

  if (!hasLoaded) {
    // First load — populate terminal instantly, IntersectionObserver will animate both
    hasLoaded = true
    populateTerminalInstantly()
    return
  }

  // Content changed (e.g. language switch) — replay animations
  if (typedEl.value && isElementInViewport(typedEl.value)) {
    runTypedAnimation()
  } else {
    typed.value = newContent.hero?.typedLine ?? ''
  }

  if (termEl.value && isElementInViewport(termEl.value)) {
    runTerminalAnimation()
  } else {
    populateTerminalInstantly()
  }
}, { immediate: true })

const isElementInViewport = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return r.top < window.innerHeight && r.bottom > 0
}

onBeforeUnmount(() => {
  if (typingTimer) window.clearInterval(typingTimer)
  typedObserver?.disconnect()
  if (termTimer) window.clearTimeout(termTimer)
  termObserver?.disconnect()
})

useReveal()
const { $openCalendly } = useNuxtApp()
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="guides" />
      <div class="hero-grid">
        <div>
          <div class="eyebrow reveal" style="margin-bottom:32px">
            <span class="diamond">◆</span>{{ hero.eyebrow }}
          </div>

          <h1 class="reveal">
            {{ hero.firstName }}<br>
            {{ hero.lastName }}<span class="dot">.</span><br>
            <span class="muted">{{ hero.titleLine1 }}</span><br>
            <span class="muted title-with-cursor">{{ hero.titleLine2 }}</span>
          </h1>

          <p class="lede reveal" v-html="hero.paragraph" />

          <div class="cta-row reveal">
            <NuxtLink v-if="hero.primaryCta" :to="hero.primaryCta.href" class="btn primary" data-cursor-hover>
              {{ hero.primaryCta.label }} <span>→</span>
            </NuxtLink>
            <button
              v-if="hero.secondaryCta"
              class="btn"
              data-cursor-hover
              @click="hero.secondaryCta.label.includes('call') || hero.secondaryCta.label.includes('conversa') ? $openCalendly() : $router.push(hero.secondaryCta.href)"
            >
              {{ hero.secondaryCta.label }}
              <span v-if="hero.secondaryCta.kbd" class="kbd">{{ hero.secondaryCta.kbd }}</span>
            </button>
          </div>

          <div ref="typedEl" class="typed-line reveal">
            <span class="chevron">&gt; </span>
            <span class="typed">{{ typed }}</span>
            <span class="blink" style="color: var(--neon)">|</span>
          </div>
        </div>

        <aside class="right-rail reveal">
          <div class="card">
            <div class="dots-tr">
              <span /><span /><span class="live" />
            </div>
            <div class="comment" style="margin-bottom:12px">{{ now.label }}</div>
            <div class="card-title">
              <span class="arrow">▸</span> {{ now.title }}
            </div>
            <div class="card-sub">{{ dynamicMeta }}</div>

            <div class="divider" style="margin:16px 0" />

            <div class="comment" style="margin-bottom:12px">{{ now.systemLabel || 'system' }}</div>
            <div v-for="(row, i) in now.system" :key="i" class="row">
              <span>{{ row.k }}</span>
              <span class="v" :class="row.color">{{ row.v }}</span>
            </div>
          </div>

          <div ref="termEl" class="term-card">
            <div class="term-head">
              <span>{{ term.file }}</span>
              <span>{{ term.shell }}</span>
            </div>
            <div class="term-body">
              <template v-for="(line, i) in terminalLines" :key="i">
                <div v-if="line.prompt">
                  <span class="prompt-c">$</span> {{ line.text }}<span v-if="line.cursor" class="blink">_</span>
                </div>
                <div v-else :class="['out', { cyan: line.color === 'cyan' }]">
                  {{ line.text }}<span v-if="line.cursor" class="blink">_</span>
                </div>
              </template>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="selected-work">
      <SectionLabel num="01">{{ content?.ui?.labels?.selectedWork ?? 'Selected Work' }}</SectionLabel>
      <div class="sw-grid">
        <NuxtLink
          v-for="(p, i) in projects"
          :key="p.id"
          :to="`/work/${p.id}`"
          class="sw-card reveal"
          data-cursor-hover
        >
          <div
            class="thumb"
            :style="p.img
              ? { background: `#0b0d10 url(${$url(p.img)}) center/contain no-repeat` }
              : { background: 'repeating-linear-gradient(135deg, #12141a 0 8px, #0e1014 8px 16px)' }"
          >
            <span class="idx">0{{ i + 1 }}</span>
          </div>
          <div class="meta-line">
            <div class="title-row">
              <span class="name">{{ p.title }}</span>
              <span style="color: var(--paper-2); font-size: 11px">→</span>
            </div>
            <div class="desc">{{ p.desc }}</div>
            <span class="tag">{{ p.tag }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
