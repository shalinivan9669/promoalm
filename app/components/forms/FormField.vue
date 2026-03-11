<script setup lang="ts">
defineProps<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>();
</script>

<template>
  <label class="flex flex-col gap-2 text-sm text-white">
    <span class="flex items-center gap-1">
      <span>{{ label }}</span>
      <span
        v-if="required"
        class="text-danger"
      >
        *
      </span>
    </span>
    <slot />
    <span
      v-if="error"
      class="text-xs text-danger"
    >
      {{ error }}
    </span>
    <span
      v-else-if="hint"
      class="text-xs text-muted"
    >
      {{ hint }}
    </span>
  </label>
</template>
