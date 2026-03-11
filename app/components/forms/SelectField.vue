<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  options: Array<{
    label: string;
    value: string;
  }>;
}>();
</script>

<template>
  <select
    v-model="model"
    class="w-full rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
