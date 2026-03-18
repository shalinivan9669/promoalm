<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    items: string[];
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default");
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));
const eyebrow = computed(() => props.eyebrow);
</script>

<template>
  <section :class="props.variant === 'default' ? 'section-divider section-space' : `section-divider section-space page-section page-section--${props.variant}`">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow || 'Для кого'"
        :title="props.title"
        :description="props.description"
        :variant="headerVariant"
      />
      <div class="mt-8 flex flex-wrap gap-3">
        <span
          v-for="item in props.items"
          :key="item"
          :class="`${isInternal ? 'page-chip' : 'chip'} section-signage-label`"
        >
          {{ item }}
        </span>
      </div>
    </Container>
  </section>
</template>
