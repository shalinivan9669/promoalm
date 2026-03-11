<script setup lang="ts">
import type { SupportBodySection } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  sections: SupportBodySection[];
  highlights?: string[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Содержание"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        <article
          v-for="section in sections"
          :key="section.title"
          class="surface p-6"
        >
          <h3 class="text-lg font-semibold text-white">
            {{ section.title }}
          </h3>
          <p class="mt-3 text-sm leading-6 text-muted">
            {{ section.body }}
          </p>
          <ul
            v-if="section.bullets?.length"
            class="mt-4 space-y-2 text-sm text-muted"
          >
            <li
              v-for="bullet in section.bullets"
              :key="bullet"
              class="rounded-2xl border border-line bg-canvas-soft px-3 py-2"
            >
              {{ bullet }}
            </li>
          </ul>
        </article>
      </div>

      <div
        v-if="highlights?.length"
        class="mt-8 flex flex-wrap gap-3"
      >
        <span
          v-for="highlight in highlights"
          :key="highlight"
          class="chip"
        >
          {{ highlight }}
        </span>
      </div>
    </Container>
  </section>
</template>
