<script setup lang="ts">
const props = defineProps<{ path?: string }>()

const content = useSiteContent()

const segments = computed(() => {
  const raw = (props.path || 'portfolio').replace(/^~?\//, '').replace(/^portfolio\/?/, '')
  return raw.split('/').filter(Boolean)
})

const userHandle = computed(() => content.value?.site?.brand ? 'daniel' : 'daniel')
const tz = computed(() => content.value?.site?.timezone ?? 'UTC+00')
</script>

<template>
  <div class="titlebar">
    <div class="dots">
      <div class="dot r" />
      <div class="dot y" />
      <div class="dot g" />
    </div>
    <div class="path">
      <span class="slash">~/</span>
      <span class="accent">{{ userHandle }}</span><!--
   --><template v-for="(seg, i) in segments" :key="i"><span class="slash">/</span>{{ seg }}</template>
    </div>
    <div class="meta">
      <span><span class="dot-live" />online</span>
      <span class="chip">{{ tz }}</span>
    </div>
  </div>
</template>
