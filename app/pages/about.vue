<script setup lang="ts">
const content = useSiteContent()
const about = computed(() => content.value?.about ?? ({} as any))
const timeline = computed(() => about.value?.timeline ?? [])

useHead({ title: 'About — Daniel Pereira' })

const activeIdx = ref(timeline.value.length - 1)
let observer: IntersectionObserver | null = null

onMounted(() => {
  nextTick(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.idx ?? 0)
          activeIdx.value = idx
        }
      })
    }, { rootMargin: '-40% 0px -50% 0px' })

    document.querySelectorAll<HTMLElement>('.tl-event').forEach(el => observer!.observe(el))
  })
})

onBeforeUnmount(() => observer?.disconnect())

useReveal()
</script>

<template>
  <main class="page">
    <header class="page-head reveal">
      <SectionLabel num="03">{{ content?.ui?.labels?.aboutJourney ?? 'About / Journey' }}</SectionLabel>
    </header>

    <section class="about-intro">
      <div class="reveal">
        <h1>
          {{ about.intro }}<br>
          <span class="muted">{{ about.introAccent?.replace(/\.$/, '') }}<span class="dot">.</span></span>
        </h1>
        <p v-html="about.paragraph" />
      </div>

      <div class="bio-card reveal">
        <div class="comment" style="margin-bottom: 12px">bio.json</div>
        <div class="row"><span>name:</span><span class="v cyan">"{{ about.bio?.name }}"</span></div>
        <div class="row"><span>born:</span><span class="v amber">"{{ about.bio?.born }}"</span></div>
        <div class="row"><span>based:</span><span class="v cyan">"{{ about.bio?.based }}"</span></div>
        <div class="row"><span>role:</span><span class="v cyan">"{{ about.bio?.role }}"</span></div>
        <div class="row"><span>langs:</span><span class="v amber">{{ JSON.stringify(about.bio?.langs ?? []) }}</span></div>
      </div>
    </section>

    <section class="timeline-wrap">
      <aside class="timeline-years">
        <div class="stick">
          <div class="comment" style="margin-bottom: 12px">chronos</div>
          <div
            v-for="(t, i) in timeline"
            :key="i"
            class="yr"
            :class="{ active: i === activeIdx }"
          >{{ t.year }}</div>
        </div>
      </aside>

      <div class="timeline-events">
        <div
          v-for="(t, i) in timeline"
          :key="i"
          class="tl-event reveal"
          :class="{ current: i === timeline.length - 1, 'has-img': !!t.img }"
          :data-idx="i"
        >
          <div class="node" />
          <div class="card-inner">
            <div
              v-if="t.img"
              class="thumb"
              :style="{ backgroundImage: `url($url(t.img))` }"
            />
            <div class="body">
              <div class="head-row">
                <span class="tag accent">{{ t.tag }}</span>
                <span class="loc">◇ {{ t.loc }}</span>
              </div>
              <h3>{{ t.title }}</h3>
              <p>{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
