<script setup lang="ts">
import type { ProcessStep } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    steps: ProcessStep[];
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

function stepClass(index: number) {
  if (props.variant === "home") {
    return "home-process-step";
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
        eyebrow="Процесс"
        :title="title"
        :description="description"
        :variant="headerVariant"
      />

      <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="(step, index) in steps"
          :key="step.title"
          :class="stepClass(index)"
        >
          <p class="eyebrow">Шаг {{ index + 1 }}</p>
          <h3 class="mt-4 text-lg font-semibold text-white">
            {{ step.title }}
          </h3>
          <p class="mt-3 text-sm leading-6 text-muted">
            {{ step.description }}
          </p>
          <p
            v-if="step.note"
            class="mt-3 text-xs leading-5 text-muted"
          >
            {{ step.note }}
          </p>
        </article>
      </div>
    </Container>
  </section>
</template>
