<script setup lang="ts">
const model = defineModel<boolean>();
</script>

<template>
  <label class="flex items-start gap-3 rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-ink">
    <input
      v-model="model"
      type="checkbox"
      class="mt-1 h-4 w-4 rounded border-line bg-canvas-soft"
    >
    <span><slot /></span>
  </label>
</template>
