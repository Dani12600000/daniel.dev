<script setup lang="ts">
const content = useSiteContent()
const music = computed(() => content.value?.music ?? { label: 'lo-fi radio', cover: '', url: null })

const playing = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const toggle = () => {
  if (!audioRef.value) return
  
  if (playing.value) {
    audioRef.value.pause()
    playing.value = false
  } else {
    audioRef.value.play().then(() => {
      playing.value = true
    }).catch((err) => {
      console.warn("Playback prevented:", err)
      playing.value = false
    })
  }
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.3 // Set a comfortable background volume
  }
})
</script>

<template>
  <button
    type="button"
    class="music-player"
    :class="{ paused: !playing, spinning: playing, disabled: !music.url }"
    :aria-label="!music.url ? 'Music' : (playing ? 'Pause music' : 'Play music')"
    :disabled="!music.url"
    data-cursor-hover
    @click="toggle"
  >
    <audio v-if="music.url" ref="audioRef" :src="$url(music.url)" loop preload="none"></audio>
    <span class="bars"><span></span><span></span><span></span></span>
    <span class="label">{{ music.label }}</span>
  </button>
</template>
