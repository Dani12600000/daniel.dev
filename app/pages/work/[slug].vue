<script setup lang="ts">
const route = useRoute()
const content = useSiteContent()

const project = computed(() =>
  (content.value?.projects ?? []).find((p: any) => p.id === route.params.slug)
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const uiWork = computed(() => content.value?.ui?.work ?? ({} as any))

useHead({
  title: () => `Work — Daniel Pereira — ${project.value?.title}`,
})

const activeSection = ref(0)
const tocIds = computed<string[]>(() =>
  (project.value?.caseStudy?.sections ?? []).map((s: any, i: number) => `section-${i}`)
)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = tocIds.value.indexOf((entry.target as HTMLElement).id)
        if (idx >= 0) activeSection.value = idx
      }
    })
  }, { rootMargin: '-30% 0px -60% 0px' })

  tocIds.value.forEach((id: string) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  onBeforeUnmount(() => observer.disconnect())
})

useReveal()
</script>

<template>
  <main v-if="project" class="page">
    <div class="case-back">
      <NuxtLink to="/work">
        <span class="arr">←</span> work / <span class="cur">{{ project.id }}.md</span>
      </NuxtLink>
    </div>

    <section class="case-title-block reveal">
      <div>
        <div class="eyebrow" style="margin-bottom: 20px">
          {{ uiWork.caseStudy }} <span style="margin:0 8px;color:var(--paper-3)">·</span>
          {{ project.year }} <span style="margin:0 8px;color:var(--paper-3)">·</span>
          {{ project.tag?.toUpperCase() }}
        </div>
        <h1>
          {{ project.title }}<span class="dot">.</span>
        </h1>
        <p class="tagline">{{ project.tagline }}</p>
      </div>

      <div class="case-meta">
        <div class="row"><span>{{ uiWork.role }}</span><span class="v">{{ project.role }}</span></div>
        <div class="row"><span>{{ uiWork.timeline }}</span><span class="v">{{ project.timeline }}</span></div>
        <div class="row"><span>{{ uiWork.stack }}</span><span class="v cyan">{{ project.stack?.slice(0, 2).join(' · ') }}</span></div>
        <div v-if="project.links?.github" class="row">
          <span>{{ uiWork.link }}</span>
          <a :href="`https://${project.links.github}`" target="_blank" rel="noopener" class="v neon" data-cursor-hover>github ↗</a>
        </div>
      </div>
    </section>

    <section class="case-hero-visual reveal">
      <div
        class="visual"
        :style="project.img
          ? { background: `radial-gradient(600px 300px at 50% 40%, rgba(0,255,156,0.06), transparent 70%), #0b0d10 url(${project.img}) center/260px no-repeat` }
          : { background: '#0b0d10' }"
      >
        <div class="fig"><span class="sq">■</span> {{ uiWork.fig }}</div>
        <div class="dim">1920 × 1080</div>
      </div>
    </section>

    <section class="case-content">
      <aside class="case-toc">
        <div class="comment" style="margin-bottom: 16px">{{ uiWork.contents }}</div>
        <a
          v-for="(s, i) in project.caseStudy?.sections ?? []"
          :key="i"
          :href="`#section-${i}`"
          :class="{ active: activeSection === i }"
        >{{ s.num }} · {{ s.title }}</a>
      </aside>

      <article class="case-article">
        <div
          v-for="(s, i) in project.caseStudy?.sections ?? []"
          :id="`section-${i}`"
          :key="i"
          class="reveal"
        >
          <SectionLabel :num="s.num">{{ s.title }}</SectionLabel>
          <p v-if="s.body">{{ s.body }}</p>

          <pre v-if="s.code"><template v-for="(tok, ti) in s.code.tokens" :key="ti"><span :class="`code-${tok.c}`">{{ tok.t }}</span></template></pre>

          <ul v-if="s.bullets">
            <li v-for="(b, bi) in s.bullets" :key="bi">{{ b }}</li>
          </ul>
        </div>
      </article>
    </section>

    <SiteFooter />
  </main>
</template>
