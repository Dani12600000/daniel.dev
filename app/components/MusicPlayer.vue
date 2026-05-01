<script setup lang="ts">
const { $url } = useNuxtApp()
const content = useSiteContent()
const music = computed(() => content.value?.music ?? { label: 'lo-fi radio', cover: '', url: null })

const encodePath = (path: string) => path.split('/').map(encodeURIComponent).join('/')

const audioSrc = computed(() => {
  const url = music.value.url
  if (!url) return ''
  const resolved = ($url as (p: string) => string)(url)
  if (resolved.startsWith('http') || resolved.startsWith('//')) return resolved
  return encodePath(resolved)
})

const coverSrc = computed(() => {
  const c = music.value.cover
  if (!c) return ''
  return ($url as (p: string) => string)(c)
})

const playing = ref(false)
const loading = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const srcLoaded = ref(false)

const ensureSrc = (el: HTMLAudioElement) => {
  if (srcLoaded.value && el.src) return
  if (!audioSrc.value) return
  el.src = audioSrc.value
  el.load()
  srcLoaded.value = true
}

const toggle = async () => {
  const el = audioRef.value
  if (!el || !music.value.url) return

  if (playing.value) {
    el.pause()
    return
  }

  ensureSrc(el)
  loading.value = true
  try {
    await el.play()
    playing.value = true
  } catch (err) {
    console.warn('[lo-fi] playback prevented:', err, 'src:', el.src)
    playing.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const el = audioRef.value
  if (!el) return
  el.volume = 0.3
  el.addEventListener('playing', () => { playing.value = true; loading.value = false })
  el.addEventListener('ended', () => { playing.value = false })
  el.addEventListener('pause', () => { playing.value = false })
  el.addEventListener('error', () => {
    const err = el.error
    console.warn('[lo-fi] audio error code:', err?.code, 'message:', err?.message, 'src:', el.src)
    playing.value = false
    loading.value = false
  })
})
</script>

<template>
  <div class="music-player-wrap">
    <audio ref="audioRef" loop preload="none"></audio>
    <button
      type="button"
      class="music-player"
      :class="{ paused: !playing, spinning: playing, loading }"
      :aria-label="playing ? 'Pause music' : 'Play music'"
      data-cursor-hover
      @click="toggle"
    >
      <span
        v-if="coverSrc"
        class="cover"
        :style="{ backgroundImage: `url(${coverSrc})` }"
      ></span>
      <span class="bars"><span></span><span></span><span></span></span>
      <span class="label">{{ music.label }}</span>
    </button>
  </div>
</template>
