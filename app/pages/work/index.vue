<script setup lang="ts">
const content = useSiteContent()
const projects = computed(() => content.value?.projects ?? [])
const uiWork = computed(() => content.value?.ui?.work ?? ({} as any))

const { $url } = useNuxtApp()
useHead({ title: `${uiWork.value.label ?? 'Work'} — Daniel Pereira` })

const hoverIndex = ref<number | null>(null)
const previewStyle = computed(() => {
  if (hoverIndex.value === null) return {}
  const p = projects.value[hoverIndex.value]
  if (!p?.img) return {}
  return { background: `#0b0d10 url(${$url(p.img)}) center/contain no-repeat` }
})
const previewVisible = computed(() =>
  hoverIndex.value !== null && !!projects.value[hoverIndex.value]?.img
)

useReveal()
</script>

<template>
  <main class="page">
    <header class="page-head reveal">
      <SectionLabel num="01">
        {{ uiWork.label }} / {{ uiWork.projectsCount?.replace('{n}', projects.length.toString()) }}
      </SectionLabel>
      <h1>
        {{ uiWork.heading1 }}<br>
        <span class="muted">{{ uiWork.heading2 }}<span class="dot">.</span></span>
      </h1>
      <p>
        {{ uiWork.paragraph }}
      </p>
    </header>

    <section class="work-list-wrap">
      <div class="work-list">
        <NuxtLink
          v-for="(p, i) in projects"
          :key="p.id"
          :to="`/work/${p.id}`"
          class="work-row reveal"
          data-cursor-hover
          @mouseenter="hoverIndex = i"
          @mouseleave="hoverIndex = null"
          @focusin="hoverIndex = i"
          @focusout="hoverIndex = null"
        >
          <span class="n">{{ p.n }}</span>
          <span class="title">{{ p.title }}</span>
          <span class="subtitle">{{ p.subtitle }}</span>
          <span class="stack">
            <span v-for="s in p.stack" :key="s" class="tag no-upper">{{ s }}</span>
          </span>
          <span class="year">{{ p.year }}</span>
          <span class="arrow">→</span>
        </NuxtLink>
      </div>

      <div
        class="work-preview"
        :class="{ visible: previewVisible }"
        :style="previewStyle"
      />
    </section>

    <SiteFooter />
  </main>
</template>
