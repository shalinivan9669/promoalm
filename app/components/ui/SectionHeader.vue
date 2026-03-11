<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="max-w-3xl">
    <p
      v-if="eyebrow"
      class="eyebrow"
    >
      {{ eyebrow }}
    </p>
    <h2 class="mt-4 text-3xl font-semibold text-white sm:text-4xl">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-4 text-base leading-7 text-muted sm:text-lg"
    >
      {{ description }}
    </p>
  </div>
</template>
