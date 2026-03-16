<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title?: string;
    description?: string;
    items: Array<{
      label: string;
      value: string;
      note?: string;
      description?: string;
    }>;
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const sectionClass = computed(() =>
  props.variant === "default" ? "section-divider section-space" : `section-divider section-space page-section page-section--${props.variant}`
);

const headerVariant = computed(() => (props.variant === "support" ? "support" : props.variant === "default" ? "default" : "page"));
</script>

<template>
  <section :class="sectionClass">
    <Container>
      <SectionHeader
        v-if="props.title"
        :eyebrow="props.eyebrow"
        :title="props.title"
        :description="props.description"
        :variant="headerVariant"
      />
      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          v-for="item in props.items"
          :key="item.label"
          :title="item.label"
          :value="item.value"
          :description="item.description || item.note || ''"
          :variant="props.variant"
        />
      </div>
    </Container>
  </section>
</template>
