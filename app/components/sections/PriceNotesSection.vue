<script setup lang="ts">
import type { PriceNote } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    notes: PriceNote[];
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default" && props.variant !== "home");
const sectionClass = computed(() =>
  props.variant === "home"
    ? "home-band-section"
    : isInternal.value
      ? `section-divider section-space page-section page-section--${props.variant}`
      : "section-divider section-space"
);
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));
const gridClass = computed(() =>
  props.variant === "home"
    ? "mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"
    : isInternal.value
      ? "mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
      : "mt-8 grid gap-4 md:grid-cols-2"
);

function noteClass(index: number) {
  if (props.variant === "home") {
    return "home-price-card";
  }

  if (isInternal.value) {
    return index === 0 ? "page-card page-card--feature" : "page-card";
  }

  return "surface p-6";
}
</script>

<template>
  <section :class="sectionClass">
    <Container>
      <SectionHeader
        eyebrow="Цена и расчёт"
        :title="title"
        :description="description"
        :variant="headerVariant"
      />
      <div :class="gridClass">
        <article
          v-for="(note, index) in notes"
          :key="note.title"
          :class="noteClass(index)"
        >
          <h3 class="text-lg font-semibold text-ink">
            {{ note.title }}
          </h3>
          <p class="mt-3 text-sm leading-6 text-muted">
            {{ note.text }}
          </p>
          <p
            v-if="note.emphasis"
            class="mt-4 text-sm font-medium text-accent"
          >
            {{ note.emphasis }}
          </p>
        </article>
      </div>
    </Container>
  </section>
</template>
