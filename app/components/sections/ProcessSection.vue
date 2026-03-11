<script setup lang="ts">
import type { ProcessStep } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  steps: ProcessStep[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Процесс"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="(step, index) in steps"
          :key="step.title"
          class="surface p-6"
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
