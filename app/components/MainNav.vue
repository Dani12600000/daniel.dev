<script setup lang="ts">
const props = defineProps<{ active?: string }>()
const content = useSiteContent()

const route = useRoute()
const activeKey = computed(() => {
  if (props.active) return props.active
  const p = route.path
  if (p === '/') return 'home'
  if (p.startsWith('/work')) return 'work'
  if (p.startsWith('/skills')) return 'skills'
  if (p.startsWith('/about')) return 'about'
  if (p.startsWith('/contact')) return 'contact'
  return 'home'
})

const drawerOpen = ref(false)
const toggleDrawer = () => (drawerOpen.value = !drawerOpen.value)
const closeDrawer = () => (drawerOpen.value = false)

const locale = useLocale()
const langs = computed(() => content.value?.languages ?? [
  { code: 'EN', active: locale.value === 'en' },
  { code: 'PT', active: locale.value === 'pt' },
])
const activeLang = computed(() => locale.value.toUpperCase())
const switchLang = async (code: string) => {
  const next = code.toLowerCase() as 'en' | 'pt'
  if (SUPPORTED_LOCALES.includes(next)) await setLocale(next)
}

const cv = computed(() => content.value?.site?.cv)

watch(() => route.fullPath, closeDrawer)

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDrawer()
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <nav class="navbar">
    <NuxtLink to="/" class="logo" data-cursor-hover>
      <span class="glyph">{{ content?.site?.brand ?? 'D' }}</span>
      <span>{{ content?.site?.name?.split('.')[0] ?? 'daniel' }}<span style="color: var(--neon)">.</span>{{ content?.site?.name?.split('.')[1] ?? 'dev' }}</span>
    </NuxtLink>

    <div class="links">
      <NuxtLink
        v-for="l in content?.navigation ?? []"
        :key="l.key"
        :to="l.path"
        :class="{ active: l.key === activeKey }"
        data-cursor-hover
      >
        <span class="num">{{ l.num }}</span>{{ l.label }}
      </NuxtLink>
    </div>

    <div class="actions">
      <div class="lang-switch">
        <button
          v-for="l in langs"
          :key="l.code"
          type="button"
          :class="{ active: activeLang === l.code }"
          data-cursor-hover
          @click="switchLang(l.code)"
        >{{ l.code }}</button>
      </div>
      <a v-if="cv" :href="$url(cv.href)" class="btn" download data-cursor-hover>
        {{ cv.label }} <span>↓</span>
      </a>
      <button
        type="button"
        class="menu-toggle"
        :class="{ open: drawerOpen }"
        aria-label="Toggle navigation"
        @click="toggleDrawer"
        data-cursor-hover
      >
        <span /><span /><span />
      </button>
    </div>

  </nav>

  <Teleport to="body">
    <div class="mobile-drawer" :class="{ open: drawerOpen }" @click.self="closeDrawer">
      <button
        type="button"
        class="drawer-close"
        aria-label="Close navigation"
        @click="closeDrawer"
      >×</button>
      <NuxtLink
        v-for="l in content?.navigation ?? []"
        :key="l.key"
        :to="l.path"
        :class="{ active: l.key === activeKey }"
        @click="closeDrawer"
      >
        <span class="num">{{ l.num }}</span>{{ l.label }}
      </NuxtLink>
      <div class="drawer-foot">
        <div class="lang-switch">
          <button
            v-for="l in langs"
            :key="l.code"
            type="button"
            :class="{ active: activeLang === l.code }"
            @click="switchLang(l.code)"
          >{{ l.code }}</button>
        </div>
        <a v-if="cv" :href="$url(cv.href)" class="btn" download>{{ cv.label }} ↓</a>
      </div>
    </div>
  </Teleport>
</template>
