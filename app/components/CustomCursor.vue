<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const ringRef = ref<HTMLElement | null>(null)
const dotRef = ref<HTMLElement | null>(null)
const enabled = ref(false)

let mouseX = 0
let mouseY = 0
let ringX = 0
let ringY = 0
let raf = 0

const move = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  if (dotRef.value) {
    dotRef.value.style.transform = `translate(${mouseX}px, ${mouseY}px)`
  }
}

const loop = () => {
  ringX += (mouseX - ringX) * 0.18
  ringY += (mouseY - ringY) * 0.18
  if (ringRef.value) {
    ringRef.value.style.transform = `translate(${ringX}px, ${ringY}px)`
  }
  raf = requestAnimationFrame(loop)
}

const onOver = (e: MouseEvent) => {
  const target = (e.target as HTMLElement | null)?.closest?.(
    'a, button, [data-cursor-hover], input, textarea, select'
  )
  if (ringRef.value) {
    ringRef.value.classList.toggle('hover', !!target)
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!supportsHover) return
  enabled.value = true
  document.body.classList.add('has-custom-cursor')
  window.addEventListener('mousemove', move, { passive: true })
  window.addEventListener('mouseover', onOver)
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseover', onOver)
  document.body.classList.remove('has-custom-cursor')
})
</script>

<template>
  <template v-if="enabled">
    <div ref="ringRef" class="custom-cursor-ring" aria-hidden="true" />
    <div ref="dotRef" class="custom-cursor-dot" aria-hidden="true" />
  </template>
</template>
