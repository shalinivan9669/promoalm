<script setup lang="ts">
import type { HeroBlock } from "../../../shared/types/content";

defineProps<{
  hero: HeroBlock;
}>();
</script>

<template>
  <section class="section-space">
    <Container>
      <div class="surface overflow-hidden p-8 sm:p-10 lg:p-12">
        <div class="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p class="eyebrow">{{ hero.eyebrow }}</p>
            <h1 class="mt-5 max-w-4xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              {{ hero.title }}
            </h1>
            <p class="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              {{ hero.description }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                v-for="action in hero.actions"
                :key="action.href + action.label"
                :href="action.href"
                :label="action.label"
                :intent="action.intent"
                :tracking-event="action.trackingEvent"
                :external="action.external"
              />
            </div>
            <p
              v-if="hero.note"
              class="mt-6 max-w-2xl text-sm leading-6 text-muted"
            >
              {{ hero.note }}
            </p>
          </div>

          <div class="grid gap-3">
            <div
              v-for="fact in hero.facts"
              :key="fact"
              class="rounded-3xl border border-line bg-canvas-soft px-4 py-4 text-sm text-white"
            >
              {{ fact }}
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
