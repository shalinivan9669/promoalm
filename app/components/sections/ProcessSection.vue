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
  return [
    "process-panel",
    props.variant === "home"
      ? "process-panel--home"
      : isInternal.value
        ? "process-panel--page"
        : "process-panel--default",
    index === 0 ? "process-panel--featured" : ""
  ].join(" ");
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
          <div class="process-panel__topline">
            <p class="process-panel__eyebrow">Шаг</p>
            <p class="process-panel__index">
              {{ String(index + 1).padStart(2, "0") }}
            </p>
          </div>

          <div class="process-panel__body">
            <h3 class="process-panel__title">
              {{ step.title }}
            </h3>
            <p class="process-panel__description">
              {{ step.description }}
            </p>
          </div>

          <p
            v-if="step.note"
            class="process-panel__note"
          >
            {{ step.note }}
          </p>
        </article>
      </div>
    </Container>
  </section>
</template>
