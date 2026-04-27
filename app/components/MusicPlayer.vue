<script setup lang="ts">
const { $url } = useNuxtApp()
const content = useSiteContent()
const music = computed(() => content.value?.music ?? { label: 'lo-fi radio', cover: '', url: null })
const audioSrc = computed(() => music.value.url ? ($url as (p: string) => string)(music.value.url) : '')

const playing = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const toggle = () => {
  const el = audioRef.value
  if (!el || !music.value.url) return

  if (playing.value) {
    el.pause()
    playing.value = false
  } else {
    el.play().then(() => {
      playing.value = true
    }).catch((err) => {
      console.warn('Playback prevented:', err)
      playing.value = false
    })
  }
}

onMounted(() => {
  if (audioRef.value) audioRef.value.volume = 0.3
})
</script>

<template>
  <button
    type="button"
    class="music-player"
    :class="{ paused: !playing, spinning: playing }"
    :aria-label="playing ? 'Pause music' : 'Play music'"
    data-cursor-hover
    @click="toggle"
  >
    <audio ref="audioRef" :src="audioSrc" loop preload="none"></audio>
    <span class="bars"><span></span><span></span><span></span></span>
    <span class="label">{{ music.label }}</span>
  </button>
</template>
