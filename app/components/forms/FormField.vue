<script setup lang="ts">
defineProps<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>();
</script>

<template>
  <label class="form-field flex flex-col gap-2 text-sm text-ink">
    <span class="form-field__label flex items-center gap-1">
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
      class="form-field__error text-xs text-danger"
    >
      {{ error }}
    </span>
    <span
      v-else-if="hint"
      class="form-field__hint text-xs text-muted"
    >
      {{ hint }}
    </span>
  </label>
</template>
