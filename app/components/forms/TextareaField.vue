<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  placeholder?: string;
  rows?: number;
}>();
</script>

<template>
  <textarea
    v-model="model"
    :rows="rows || 5"
    :placeholder="placeholder"
    class="form-control form-control--textarea w-full rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white placeholder:text-muted"
  />
</template>
