<script setup lang="ts">
defineProps<{ num: string }>()
</script>

<template>
  <div class="sec-label">
    <span class="num">{{ num }}</span>
    <span><slot /></span>
    <span class="line" />
  </div>
</template>
