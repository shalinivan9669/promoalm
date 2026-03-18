<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    materials: string[];
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default");
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));
</script>

<template>
  <section :class="props.variant === 'default' ? 'section-divider section-space' : `section-divider section-space page-section page-section--${props.variant}`">
    <Container>
      <SectionHeader
        eyebrow="Материалы"
        :title="props.title"
        :description="props.description"
        :variant="headerVariant"
      />
      <div class="mt-8 flex flex-wrap gap-3">
        <span
          v-for="material in props.materials"
          :key="material"
          :class="`${isInternal ? 'page-chip' : 'chip'} section-signage-label`"
        >
          {{ material }}
        </span>
      </div>
    </Container>
  </section>
</template>
