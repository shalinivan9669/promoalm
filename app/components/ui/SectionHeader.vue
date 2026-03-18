<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    variant?: "default" | "page" | "support";
  }>(),
  {
    variant: "default"
  }
);

const rootClass = computed(() => {
  if (props.variant === "page") {
    return "page-section-header";
  }

  if (props.variant === "support") {
    return "page-section-header page-section-header--support";
  }

  return "max-w-3xl";
});

const titleClass = computed(() =>
  props.variant === "default"
    ? "section-header__title"
    : "page-section-header__title"
);

const descriptionClass = computed(() =>
  props.variant === "default"
    ? "section-header__description"
    : "page-section-header__description"
);
</script>

<template>
  <div :class="props.variant === 'default' ? `section-header ${rootClass}` : rootClass">
    <p
      v-if="props.eyebrow"
      class="eyebrow"
    >
      {{ props.eyebrow }}
    </p>
    <h2 :class="titleClass">
      {{ props.title }}
    </h2>
    <p
      v-if="props.description"
      :class="descriptionClass"
    >
      {{ props.description }}
    </p>
  </div>
</template>
