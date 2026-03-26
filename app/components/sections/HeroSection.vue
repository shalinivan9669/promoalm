<script setup lang="ts">
import type { CitySlug, HeroBlock } from "../../../shared/types/content";

interface HeroMediaFrame {
  src: string;
  alt: string;
  fetchPriority?: "high" | "auto";
  loading?: "eager" | "lazy";
}

interface MountedHeroMediaFrame {
  frame: HeroMediaFrame;
  frameIndex: number;
}

const props = withDefaults(
  defineProps<{
    hero: HeroBlock;
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
    mediaMode?: "abstract" | "image";
    mediaFrames?: HeroMediaFrame[];
    cityName?: string;
    citySlug?: CitySlug;
  }>(),
  {
    variant: "default",
    mediaMode: "abstract",
    mediaFrames: () => []
  }
);

const HOME_HERO_TYPED_BASE = "Вывески";
const HOME_HERO_TYPED_PHRASES = ["для бизнеса", "для сетей", "под ключ", "для магазина"] as const;
const HOME_HERO_TYPED_ACCESSIBLE_TEXT = `${HOME_HERO_TYPED_BASE} ${HOME_HERO_TYPED_PHRASES[0]}`;

const INITIAL_HOLD_MS = 2200;
const SLIDE_VISIBLE_MS = 5200;
const CROSSFADE_MS = 1200;
const SLIDE_CYCLE_MS = SLIDE_VISIBLE_MS + CROSSFADE_MS;
const SLIDER_BOOT_DELAY_MS = 1200;

const isImageMode = computed(() => props.variant === "home" && props.mediaMode === "image" && props.mediaFrames.length > 0);
const internalVariant = computed(() => (props.variant === "home" ? "default" : props.variant));
const homeImageFrames = computed(() => (isImageMode.value ? props.mediaFrames : []));
const homeHeroMotionStyle = computed(() => ({
  "--home-hero-slide-cycle": `${SLIDE_CYCLE_MS}ms`,
  "--home-hero-slide-crossfade": `${CROSSFADE_MS}ms`
}));
const mountedHomeImageFrames = computed<MountedHeroMediaFrame[]>(() => {
  if (!isImageMode.value || homeImageFrames.value.length === 0) {
    return [];
  }

  if (!isSliderEnhanced.value) {
    return [{ frame: homeImageFrames.value[0]!, frameIndex: 0 }];
  }

  const mountedFrameIndices = leavingFrameIndex.value !== null ? [leavingFrameIndex.value, activeFrameIndex.value] : [activeFrameIndex.value];

  return mountedFrameIndices
    .filter((frameIndex, index, collection) => collection.indexOf(frameIndex) === index)
    .map((frameIndex) => ({
      frame: homeImageFrames.value[frameIndex]!,
      frameIndex
    }));
});

const activeFrameIndex = ref(0);
const leavingFrameIndex = ref<number | null>(null);
const prefersReducedMotion = ref(false);
const isSliderEnhanced = ref(false);
const loadedFrameIndices = ref([0]);

let advanceTimer: number | undefined;
let leavingTimer: number | undefined;
let sliderBootstrapTimer: number | undefined;
let sliderBootstrapRaf: number | undefined;
let sliderBootstrapFollowUpRaf: number | undefined;
let motionQuery: MediaQueryList | null = null;
let motionQueryHandler: ((event: MediaQueryListEvent) => void) | null = null;
let sliderBootstrapIdle: number | ReturnType<typeof globalThis.setTimeout> | undefined;
let isDisposed = false;

const preloadedFramePromises = new Map<number, Promise<void>>();

function clearAdvanceTimer() {
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = undefined;
  }
}

function clearLeavingTimer() {
  if (leavingTimer) {
    clearTimeout(leavingTimer);
    leavingTimer = undefined;
  }
}

function clearSliderTimers() {
  clearAdvanceTimer();
  clearLeavingTimer();
}

function clearSliderBootstrapTimers() {
  if (sliderBootstrapRaf !== undefined) {
    cancelAnimationFrame(sliderBootstrapRaf);
    sliderBootstrapRaf = undefined;
  }

  if (sliderBootstrapFollowUpRaf !== undefined) {
    cancelAnimationFrame(sliderBootstrapFollowUpRaf);
    sliderBootstrapFollowUpRaf = undefined;
  }

  if (sliderBootstrapTimer !== undefined) {
    clearTimeout(sliderBootstrapTimer);
    sliderBootstrapTimer = undefined;
  }

  if (sliderBootstrapIdle !== undefined && import.meta.client) {
    if ("cancelIdleCallback" in window) {
      window.cancelIdleCallback(sliderBootstrapIdle as number);
    } else {
      globalThis.clearTimeout(sliderBootstrapIdle);
    }

    sliderBootstrapIdle = undefined;
  }
}

function resetSliderState() {
  activeFrameIndex.value = 0;
  leavingFrameIndex.value = null;
}

function isFrameLoaded(frameIndex: number) {
  return loadedFrameIndices.value.includes(frameIndex);
}

function markFrameLoaded(frameIndex: number) {
  if (isFrameLoaded(frameIndex)) {
    return;
  }

  loadedFrameIndices.value = [...loadedFrameIndices.value, frameIndex];
}

function preloadFrame(frameIndex: number) {
  if (!import.meta.client || frameIndex < 0 || frameIndex >= homeImageFrames.value.length || isFrameLoaded(frameIndex)) {
    return Promise.resolve();
  }

  const existingPromise = preloadedFramePromises.get(frameIndex);

  if (existingPromise) {
    return existingPromise;
  }

  const frame = homeImageFrames.value[frameIndex];

  if (!frame) {
    return Promise.resolve();
  }

  const preloadPromise = new Promise<void>((resolve) => {
    const image = new window.Image();

    const finalize = () => {
      preloadedFramePromises.delete(frameIndex);
      markFrameLoaded(frameIndex);
      resolve();
    };

    image.onload = finalize;
    image.onerror = finalize;
    image.decoding = "async";
    image.src = frame.src;
  });

  preloadedFramePromises.set(frameIndex, preloadPromise);

  return preloadPromise;
}

function queueSlideAdvance(delay: number) {
  if (!import.meta.client || prefersReducedMotion.value || homeImageFrames.value.length < 2) {
    return;
  }

  clearAdvanceTimer();
  advanceTimer = window.setTimeout(async () => {
    const previousIndex = activeFrameIndex.value;
    const nextIndex = (previousIndex + 1) % homeImageFrames.value.length;

    await preloadFrame(nextIndex);

    if (isDisposed || prefersReducedMotion.value || !isSliderEnhanced.value) {
      return;
    }

    activeFrameIndex.value = nextIndex;
    leavingFrameIndex.value = previousIndex;

    clearLeavingTimer();
    leavingTimer = window.setTimeout(() => {
      if (leavingFrameIndex.value === previousIndex) {
        leavingFrameIndex.value = null;
      }
    }, CROSSFADE_MS);

    void preloadFrame((nextIndex + 1) % homeImageFrames.value.length);
    queueSlideAdvance(SLIDE_CYCLE_MS);
  }, delay);
}

function startAutoplay() {
  resetSliderState();
  void preloadFrame(1);
  queueSlideAdvance(INITIAL_HOLD_MS);
}

function stopAutoplay(resetToFirstSlide = false) {
  clearSliderTimers();
  leavingFrameIndex.value = null;

  if (resetToFirstSlide) {
    activeFrameIndex.value = 0;
  }
}

function commitSliderEnhancement() {
  sliderBootstrapTimer = undefined;
  sliderBootstrapIdle = undefined;

  if (prefersReducedMotion.value || homeImageFrames.value.length < 2 || isSliderEnhanced.value) {
    return;
  }

  isSliderEnhanced.value = true;
  startAutoplay();
}

function queueSliderEnhancement() {
  if (!import.meta.client || prefersReducedMotion.value || homeImageFrames.value.length < 2 || isSliderEnhanced.value) {
    return;
  }

  clearSliderBootstrapTimers();

  sliderBootstrapRaf = window.requestAnimationFrame(() => {
    sliderBootstrapRaf = undefined;

    sliderBootstrapFollowUpRaf = window.requestAnimationFrame(() => {
      sliderBootstrapFollowUpRaf = undefined;

      const scheduleCommit = () => {
        sliderBootstrapIdle = undefined;
        sliderBootstrapTimer = window.setTimeout(commitSliderEnhancement, SLIDER_BOOT_DELAY_MS);
      };

      if ("requestIdleCallback" in window) {
        sliderBootstrapIdle = window.requestIdleCallback(scheduleCommit, { timeout: SLIDER_BOOT_DELAY_MS });
        return;
      }

      sliderBootstrapIdle = globalThis.setTimeout(scheduleCommit, 0);
    });
  });
}

function syncMotionPreference(matchesReducedMotion: boolean) {
  prefersReducedMotion.value = matchesReducedMotion;

  if (matchesReducedMotion) {
    clearSliderBootstrapTimers();
    stopAutoplay(true);
    return;
  }

  if (isImageMode.value && homeImageFrames.value.length > 1) {
    if (isSliderEnhanced.value) {
      startAutoplay();
      return;
    }

    queueSliderEnhancement();
  }
}

onMounted(() => {
  if (!isImageMode.value || !import.meta.client) {
    return;
  }

  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotionPreference(motionQuery.matches);

  motionQueryHandler = (event) => {
    syncMotionPreference(event.matches);
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", motionQueryHandler);
    return;
  }

  motionQuery.addListener(motionQueryHandler);
});

onBeforeUnmount(() => {
  isDisposed = true;
  clearSliderBootstrapTimers();
  clearSliderTimers();
  preloadedFramePromises.clear();

  if (!motionQuery || !motionQueryHandler) {
    return;
  }

  if (typeof motionQuery.removeEventListener === "function") {
    motionQuery.removeEventListener("change", motionQueryHandler);
    return;
  }

  motionQuery.removeListener(motionQueryHandler);
});
</script>

<template>
  <section
    v-if="props.variant === 'home'"
    class="home-hero"
  >
    <div
      aria-hidden="true"
      class="home-hero__backdrop"
      :class="{ 'home-hero__backdrop--image': isImageMode }"
      :style="isImageMode ? homeHeroMotionStyle : undefined"
    >
      <template v-if="isImageMode">
        <div class="home-hero__slide-track">
          <img
            v-for="{ frame, frameIndex } in mountedHomeImageFrames"
            :key="`${frame.src}-${frameIndex}`"
            :src="frame.src"
            alt=""
            aria-hidden="true"
            class="home-hero__slide"
            width="1536"
            height="1024"
            :class="{
              'is-active': frameIndex === activeFrameIndex,
              'is-leaving': frameIndex === leavingFrameIndex,
              'is-static': !isSliderEnhanced && frameIndex === 0,
              'is-reduced': prefersReducedMotion
            }"
            :decoding="!isSliderEnhanced && frameIndex === 0 ? 'sync' : 'async'"
            draggable="false"
            :fetchpriority="!isSliderEnhanced && frameIndex === 0 ? frame.fetchPriority ?? 'high' : 'low'"
            :loading="!isSliderEnhanced && frameIndex === 0 ? frame.loading ?? 'eager' : 'lazy'"
          />
        </div>
        <div class="home-hero__image-overlay" />
        <div class="home-hero__image-vignette" />
      </template>

      <template v-else>
        <div class="home-hero__ambient home-hero__ambient--one" />
        <div class="home-hero__ambient home-hero__ambient--two" />
        <div class="home-hero__ambient home-hero__ambient--three" />
      </template>
    </div>

    <div class="home-hero__content">
      <div class="home-hero__grid home-hero__grid--copy-only">
        <div class="home-hero__copy">
          <h1 class="home-hero__title">
            <HeroTypedHeadline
              :base-text="HOME_HERO_TYPED_BASE"
              :phrases="HOME_HERO_TYPED_PHRASES"
              :accessible-text="HOME_HERO_TYPED_ACCESSIBLE_TEXT"
            />
          </h1>
          <div class="home-hero__actions mt-8 flex flex-wrap gap-3">
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
    </div>
  </section>

  <section
    v-else
    class="page-hero"
    :class="[
      `page-hero--${internalVariant}`,
      props.variant === 'city' && props.citySlug ? `page-hero--city-${props.citySlug}` : ''
    ]"
  >
    <Container>
      <div class="page-hero__frame">
        <div
          v-if="props.variant === 'city'"
          class="page-hero__grid page-hero__grid--city"
        >
          <div class="page-hero__copy page-hero__copy--city">
            <p class="eyebrow section-signage-eyebrow page-hero__kicker">
              {{ hero.eyebrow }}
            </p>
            <p
              v-if="props.cityName"
              class="page-hero__city"
            >
              {{ props.cityName }}
            </p>
            <h1 class="page-hero__title">
              {{ hero.title }}
            </h1>
            <p class="page-hero__description">
              {{ hero.description }}
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
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

          <div class="page-hero__aside page-hero__aside--city">
            <div
              aria-hidden="true"
              class="page-hero__context"
            />

            <div class="page-hero__proof-card">
              <p class="page-hero__proof-label">
                3 аргумента
              </p>
              <ol class="page-hero__proof-list">
                <li
                  v-for="(fact, index) in hero.facts"
                  :key="fact"
                  class="page-hero__proof-item"
                >
                  <span class="page-hero__proof-index">
                    {{ String(index + 1).padStart(2, "0") }}
                  </span>
                  <span class="page-hero__proof-text">
                    {{ fact }}
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div
          v-else
          class="page-hero__grid"
        >
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

<style scoped>
.home-hero__content {
  position: relative;
  z-index: 1;
  padding-top: clamp(3.2rem, 7vh, 5.2rem);
  padding-right: clamp(1.25rem, 4.8vw, 4.75rem);
  padding-bottom: 0;
  padding-left: max(0px, calc(clamp(1.25rem, 4.8vw, 4.75rem) - 25px));
}

.home-hero__grid--copy-only {
  max-width: 52rem;
}

.home-hero__copy {
  display: flex;
  min-height: clamp(38rem, calc(100svh - 6rem), 49rem);
  flex-direction: column;
  max-width: min(100%, 45rem);
  padding-top: 0;
}

.home-hero__copy::before {
  display: none;
}

.home-hero__title,
.home-hero__description {
  color: #c65a3a;
}

.home-hero__title {
  font-size: clamp(5.8rem, 6.5vw, 9.8rem);
  line-height: 0.88;
}

.home-hero__actions {
  margin-top: auto;
  padding-top: clamp(1rem, 6vh, 3.5rem);
}

.home-hero__note {
  color: var(--color-warning);
}

.home-hero__actions :deep(a) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background-repeat: no-repeat;
  background-position: right center;
  transition:
    color 260ms ease,
    border-color 260ms ease,
    background-size 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms ease;
}

.home-hero__actions :deep(a:nth-child(1)) {
  border-color: var(--color-accent-cta);
  background-color: var(--color-accent-cta);
  background-image: linear-gradient(270deg, rgba(8, 11, 16, 0.96), rgba(8, 11, 16, 0.96));
  background-size: 0% 100%;
  color: var(--color-surface-dark);
  box-shadow: 0 16px 30px rgba(198, 90, 58, 0.2);
}

.home-hero__actions :deep(a:nth-child(1):hover),
.home-hero__actions :deep(a:nth-child(1):focus-visible) {
  border-color: rgba(8, 11, 16, 0.92);
  background-size: 100% 100%;
  color: var(--color-surface);
  box-shadow: 0 18px 32px rgba(8, 11, 16, 0.2);
}

.home-hero__actions :deep(a:nth-child(2)) {
  border-color: rgba(8, 11, 16, 0.82);
  background-color: rgba(8, 11, 16, 0.82);
  background-image: linear-gradient(270deg, var(--color-accent-cta), var(--color-accent-cta));
  background-size: 0% 100%;
  color: var(--color-surface);
}

.home-hero__actions :deep(a:nth-child(2):hover),
.home-hero__actions :deep(a:nth-child(2):focus-visible) {
  border-color: var(--color-accent-cta);
  background-size: 100% 100%;
  color: var(--color-surface-dark);
  box-shadow: 0 18px 32px rgba(198, 90, 58, 0.18);
}

.home-hero__backdrop--image {
  background: #0a1016;
}

.home-hero__slide-track,
.home-hero__image-overlay,
.home-hero__image-vignette {
  position: absolute;
  inset: 0;
}

.home-hero__slide-track,
.home-hero__image-overlay,
.home-hero__image-vignette {
  pointer-events: none;
}

.home-hero__slide {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1536px;
  height: 1024px;
  max-width: none;
  max-height: none;
  object-fit: contain;
  object-position: center;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity var(--home-hero-slide-crossfade) cubic-bezier(0.4, 0, 0.2, 1);
}

.home-hero__slide.is-active,
.home-hero__slide.is-leaving {
  will-change: opacity;
}

.home-hero__slide.is-active,
.home-hero__slide.is-static {
  opacity: 1;
  animation: none;
}

.home-hero__slide.is-static {
  transition: none;
}

.home-hero__slide.is-leaving {
  opacity: 0;
}

.home-hero__slide.is-reduced,
.home-hero__slide.is-reduced.is-active,
.home-hero__slide.is-reduced.is-leaving {
  animation: none;
  transform: translate(-50%, -50%);
}

.home-hero__slide.is-reduced.is-active {
  opacity: 1;
}

.home-hero__image-overlay {
  display: none;
}

.home-hero__image-vignette {
  display: none;
}

@media (max-width: 1536px), (max-height: 1024px) {
  .home-hero__slide {
    width: 100%;
    height: auto;
  }
}

@media (max-width: 767px) {
  .home-hero__content {
    padding-top: clamp(2.4rem, 6vh, 3.2rem);
    padding-right: 0.85rem;
    padding-bottom: 0;
    padding-left: max(0px, calc(0.85rem - 25px));
  }

  .home-hero__copy {
    min-height: clamp(25rem, 66svh, 33rem);
    max-width: 100%;
  }

  .home-hero__title {
    font-size: clamp(2.25rem, 7.8vw, 3.75rem);
    line-height: 0.86;
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__slide {
    animation: none !important;
    transition: none;
    transform: translate(-50%, -50%) !important;
  }
}
</style>
