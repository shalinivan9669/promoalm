<script setup lang="ts">
import type { CaseStudy } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    cases: CaseStudy[];
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
        eyebrow="Кейсы"
        :title="title"
        :description="description"
      />

      <div
        v-if="props.variant === 'home'"
        class="mt-8 grid gap-5 lg:grid-cols-3"
      >
        <article
          v-for="item in cases"
          :id="item.slug"
          :key="item.id"
          class="home-case-card"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="chip">{{ item.proofMode === "scenario" ? "Типовой сценарий" : "Кейс" }}</span>
            <span class="text-xs text-muted">{{ item.cityLabel }}</span>
          </div>
          <h3 class="mt-5 text-xl font-semibold text-white">{{ item.title }}</h3>
          <p class="mt-4 text-sm leading-6 text-muted">{{ item.summary }}</p>
          <div class="home-case-card__split">
            <div class="home-case-card__block">
              <p class="home-case-card__label">Задача</p>
              <p class="mt-2 text-sm leading-6 text-muted">{{ item.challenge }}</p>
            </div>
            <div class="home-case-card__block">
              <p class="home-case-card__label">Решение</p>
              <p class="mt-2 text-sm leading-6 text-muted">{{ item.solution }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="metric in item.metrics.slice(0, 2)"
              :key="metric"
              class="chip"
            >
              {{ metric }}
            </span>
          </div>
          <ButtonLink
            :href="`/cases/#${item.slug}`"
            label="Открыть на странице кейсов"
            intent="secondary"
            tracking-event="open_case"
            block
          />
        </article>
      </div>

      <div
        v-else
        class="mt-8 grid gap-5 lg:grid-cols-3"
      >
        <article
          v-for="item in cases"
          :id="item.slug"
          :key="item.id"
          class="surface flex h-full flex-col gap-4 p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="chip">{{ item.proofMode === "scenario" ? "Типовой сценарий" : "Кейс" }}</span>
            <span class="text-xs text-muted">{{ item.cityLabel }}</span>
          </div>
          <h3 class="text-xl font-semibold text-white">{{ item.title }}</h3>
          <p class="text-sm leading-6 text-muted">{{ item.summary }}</p>
          <div class="rounded-3xl border border-line bg-canvas-soft p-4 text-sm leading-6 text-muted">
            <p class="font-semibold text-white">Задача</p>
            <p class="mt-2">{{ item.challenge }}</p>
          </div>
          <div class="rounded-3xl border border-line bg-canvas-soft p-4 text-sm leading-6 text-muted">
            <p class="font-semibold text-white">Решение</p>
            <p class="mt-2">{{ item.solution }}</p>
          </div>
          <ButtonLink
            :href="`/cases/#${item.slug}`"
            label="Открыть на странице кейсов"
            intent="secondary"
            tracking-event="open_case"
            block
          />
        </article>
      </div>
    </Container>
  </section>
</template>
