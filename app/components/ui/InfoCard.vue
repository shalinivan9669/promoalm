<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  value?: string;
  eyebrow?: string;
}>();
</script>

<template>
  <article class="surface h-full p-6">
    <p
      v-if="eyebrow"
      class="eyebrow"
    >
      {{ eyebrow }}
    </p>
    <p
      v-if="value"
      class="mt-4 text-2xl font-semibold text-white"
    >
      {{ value }}
    </p>
    <h3 class="mt-2 text-lg font-semibold text-white">
      {{ title }}
    </h3>
    <p class="mt-3 text-sm leading-6 text-muted">
      {{ description }}
    </p>
  </article>
</template>
