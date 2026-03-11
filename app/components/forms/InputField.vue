<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  type?: string;
  placeholder?: string;
  autocomplete?: string;
}>();
</script>

<template>
  <input
    v-model="model"
    :type="type || 'text'"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    class="w-full rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white placeholder:text-muted"
  >
</template>
