<script setup lang="ts">
const route = useRoute()

await useLoadSiteContent()
onMounted(() => { initLocale() })

const path = computed(() => {
  const p = route.path
  if (p === '/') return '~/portfolio/index'
  return '~/portfolio' + p
})
</script>

<template>
  <div class="grain">
    <CustomCursor />
    <TopBar :path="path" />
    <MainNav />
    <slot />
    <MusicPlayer />
  </div>
</template>
