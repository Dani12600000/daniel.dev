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
    <div class="site-header">
      <TopBar :path="path" />
      <MainNav />
    </div>
    <slot />
    <MusicPlayer />
  </div>
</template>
