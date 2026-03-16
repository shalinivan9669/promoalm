<script setup lang="ts">
import type { ProcessStep } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    steps: ProcessStep[];
    variant?: "default" | "home";
  }>(),
  {
    variant: "default"
  }
);
</script>

<template>
  <section :class="props.variant === 'home' ? 'home-band-section' : 'section-divider section-space'">
    <Container>
      <SectionHeader
        eyebrow="Процесс"
        :title="title"
        :description="description"
      />

      <div
        :class="
          props.variant === 'home'
            ? 'mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'
            : 'mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'
        "
      >
        <article
          v-for="(step, index) in steps"
          :key="step.title"
          :class="props.variant === 'home' ? 'home-process-step' : 'surface p-6'"
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
