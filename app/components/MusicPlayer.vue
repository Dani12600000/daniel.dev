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
    v-if="music.url"
    type="button"
    class="music-player"
    :class="{ paused: !playing, spinning: playing }"
    :aria-label="playing ? 'Pause music' : 'Play music'"
    data-cursor-hover
    @click="toggle"
  >
    <audio ref="audioRef" :src="music.url" loop preload="none"></audio>
    <span class="cover" :style="{ backgroundImage: `url('${music.cover}')` }" />
    <span class="bars"><span /><span /><span /></span>
    <span>{{ music.label }}</span>
  </button>
  <button
    v-else
    type="button"
    class="music-player paused"
    data-cursor-hover
  >
    <span class="cover" :style="{ backgroundImage: `url('${music.cover}')` }" />
    <span class="bars"><span /><span /><span /></span>
    <span>{{ music.label }}</span>
  </button>
</template>
