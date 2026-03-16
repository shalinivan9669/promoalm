<script setup lang="ts">
import type { HeroBlock } from "../../../shared/types/content";

interface HeroMediaFrame {
  src: string;
  alt: string;
  fetchPriority?: "high" | "auto";
  loading?: "eager" | "lazy";
}

const props = withDefaults(
  defineProps<{
  hero: HeroBlock;
    variant?: "default" | "home";
    mediaMode?: "abstract" | "image";
    mediaFrames?: HeroMediaFrame[];
    quickLinks?: Array<{
      label: string;
      href: string;
    }>;
  }>(),
  {
    variant: "default",
    mediaMode: "abstract",
    mediaFrames: () => [],
    quickLinks: () => []
  }
);

const isImageMode = computed(() => props.variant === "home" && props.mediaMode === "image" && props.mediaFrames.length > 0);
</script>

<template>
  <section
    v-if="props.variant === 'home'"
    class="home-hero"
  >
    <div
      aria-hidden="true"
      class="home-hero__backdrop"
    >
      <div class="home-hero__ambient home-hero__ambient--one" />
      <div class="home-hero__ambient home-hero__ambient--two" />
      <div class="home-hero__ambient home-hero__ambient--three" />
    </div>

    <Container class="relative">
      <div class="home-hero__grid">
        <div class="home-hero__copy">
          <p class="eyebrow">{{ hero.eyebrow }}</p>
          <h1 class="home-hero__title">
            {{ hero.title }}
          </h1>
          <p class="home-hero__description">
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
            class="home-hero__note"
          >
            {{ hero.note }}
          </p>
        </div>

        <div class="home-hero__signal">
          <div class="home-hero__signal-frame">
            <div
              v-if="isImageMode"
              class="home-hero__media-stack"
            >
              <img
                v-for="(frame, index) in mediaFrames.slice(0, 3)"
                :key="frame.src + index"
                :src="frame.src"
                :alt="frame.alt"
                :width="960"
                :height="920"
                :fetchpriority="frame.fetchPriority || (index === 0 ? 'high' : 'auto')"
                :loading="frame.loading || (index === 0 ? 'eager' : 'lazy')"
                class="home-hero__media-frame"
              >
            </div>

            <div
              v-else
              aria-hidden="true"
              class="home-hero__abstract-scene"
            >
              <div class="home-hero__plate home-hero__plate--one" />
              <div class="home-hero__plate home-hero__plate--two" />
              <div class="home-hero__plate home-hero__plate--three" />
              <div class="home-hero__geometry home-hero__geometry--grid" />
              <div class="home-hero__geometry home-hero__geometry--facade" />
              <div class="home-hero__signal-beam home-hero__signal-beam--one" />
              <div class="home-hero__signal-beam home-hero__signal-beam--two" />
              <div class="home-hero__signal-node home-hero__signal-node--one" />
              <div class="home-hero__signal-node home-hero__signal-node--two" />
              <div class="home-hero__signal-node home-hero__signal-node--three" />
            </div>
          </div>

          <div class="home-hero__facts">
            <article
              v-for="fact in hero.facts"
              :key="fact"
              class="home-hero__fact-plate"
            >
              <span class="home-hero__fact-mark" />
              <span class="min-w-0">{{ fact }}</span>
            </article>
          </div>
        </div>
      </div>

      <nav
        v-if="quickLinks.length"
        aria-label="Быстрые входы"
        class="home-hero__quick-links"
      >
        <a
          v-for="item in quickLinks"
          :key="item.href + item.label"
          :href="item.href"
          class="home-hero__quick-link"
        >
          {{ item.label }}
        </a>
      </nav>
    </Container>
  </section>

  <section
    v-else
    class="section-space"
  >
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
