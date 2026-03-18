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
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
    mediaMode?: "abstract" | "image";
    mediaFrames?: HeroMediaFrame[];
  }>(),
  {
    variant: "default",
    mediaMode: "abstract",
    mediaFrames: () => []
  }
);

const isImageMode = computed(() => props.variant === "home" && props.mediaMode === "image" && props.mediaFrames.length > 0);
const internalVariant = computed(() => (props.variant === "home" ? "default" : props.variant));
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
      <div class="home-hero__grid home-hero__grid--copy-only">
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
      </div>
    </Container>
  </section>

  <section
    v-else
    class="page-hero"
    :class="`page-hero--${internalVariant}`"
  >
    <Container>
      <div class="page-hero__frame">
        <div class="page-hero__grid">
          <div class="page-hero__copy">
            <p class="eyebrow">{{ hero.eyebrow }}</p>
            <h1 class="page-hero__title">
              {{ hero.title }}
            </h1>
            <p class="page-hero__description">
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
              class="page-hero__note"
            >
              {{ hero.note }}
            </p>
          </div>

          <div class="page-hero__aside">
            <div class="page-hero__signal">
              <div
                aria-hidden="true"
                class="page-hero__scene"
              >
                <div class="page-hero__plate page-hero__plate--one" />
                <div class="page-hero__plate page-hero__plate--two" />
                <div class="page-hero__line page-hero__line--one" />
                <div class="page-hero__line page-hero__line--two" />
                <div class="page-hero__node page-hero__node--one" />
                <div class="page-hero__node page-hero__node--two" />
              </div>

              <div class="page-hero__fact-list">
                <article
                  v-for="(fact, index) in hero.facts"
                  :key="fact"
                  class="page-hero__fact"
                >
                  <span class="page-hero__fact-index">
                    {{ String(index + 1).padStart(2, "0") }}
                  </span>
                  <span class="min-w-0">{{ fact }}</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
