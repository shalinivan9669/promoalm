<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    value?: string;
    eyebrow?: string;
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const articleClass = computed(() => {
  if (props.variant === "default") {
    return "surface h-full p-6";
  }

  if (props.variant === "support") {
    return "page-card page-card--stat page-card--quiet h-full";
  }

  return "page-card page-card--stat h-full";
});
</script>

<template>
  <article :class="articleClass">
    <p
      v-if="props.eyebrow"
      class="eyebrow"
    >
      {{ props.eyebrow }}
    </p>
    <p
      v-if="props.value"
      :class="props.variant === 'default' ? 'mt-4 text-2xl font-semibold text-white' : 'page-card__value'"
    >
      {{ props.value }}
    </p>
    <h3 :class="props.variant === 'default' ? 'mt-2 text-lg font-semibold text-white' : 'page-card__title'">
      {{ props.title }}
    </h3>
    <p :class="props.variant === 'default' ? 'mt-3 text-sm leading-6 text-muted' : 'page-card__description'">
      {{ props.description }}
    </p>
  </article>
</template>
