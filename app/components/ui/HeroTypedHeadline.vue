<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    baseText: string;
    phrases: readonly string[];
    accessibleText?: string;
    initialIndex?: number;
    typeSpeedMs?: number;
    deleteSpeedMs?: number;
    holdMs?: number;
    nextDelayMs?: number;
  }>(),
  {
    accessibleText: "",
    initialIndex: 0,
    typeSpeedMs: 72,
    deleteSpeedMs: 42,
    holdMs: 2050,
    nextDelayMs: 240
  }
);

const normalizedPhrases = computed(() => props.phrases.filter((phrase) => phrase.trim().length > 0));
const safeInitialIndex = computed(() => {
  if (!normalizedPhrases.value.length) {
    return 0;
  }

  return Math.min(Math.max(props.initialIndex, 0), normalizedPhrases.value.length - 1);
});
const initialPhrase = computed(() => normalizedPhrases.value[safeInitialIndex.value] ?? "");
const longestPhrase = computed(() =>
  normalizedPhrases.value.reduce((longest, phrase) => (phrase.length > longest.length ? phrase : longest), initialPhrase.value)
);
const resolvedAccessibleText = computed(() => {
  if (props.accessibleText.trim().length > 0) {
    return props.accessibleText.trim();
  }

  return [props.baseText, initialPhrase.value].filter(Boolean).join(" ").trim();
});

const currentIndex = ref(safeInitialIndex.value);
const currentText = ref(initialPhrase.value);
const isDeleting = ref(false);
const prefersReducedMotion = ref(false);
const isReady = ref(false);

let stepTimer: number | undefined;
let motionQuery: MediaQueryList | null = null;
let motionQueryHandler: ((event: MediaQueryListEvent) => void) | null = null;

function clearStepTimer() {
  if (stepTimer !== undefined) {
    window.clearTimeout(stepTimer);
    stepTimer = undefined;
  }
}

function resetAnimationState() {
  currentIndex.value = safeInitialIndex.value;
  currentText.value = initialPhrase.value;
  isDeleting.value = false;
}

function queueNextStep(delay: number) {
  if (!import.meta.client || prefersReducedMotion.value || normalizedPhrases.value.length < 2) {
    return;
  }

  clearStepTimer();
  stepTimer = window.setTimeout(runStep, delay);
}

function queueDeleteStart(delay: number) {
  if (!import.meta.client || prefersReducedMotion.value || normalizedPhrases.value.length < 2) {
    return;
  }

  clearStepTimer();
  stepTimer = window.setTimeout(() => {
    isDeleting.value = true;
    runStep();
  }, delay);
}

function runStep() {
  const phrases = normalizedPhrases.value;

  if (!phrases.length || prefersReducedMotion.value) {
    return;
  }

  const activePhrase = phrases[currentIndex.value] ?? "";

  if (!isDeleting.value) {
    if (currentText.value.length < activePhrase.length) {
      currentText.value = activePhrase.slice(0, currentText.value.length + 1);
      queueNextStep(props.typeSpeedMs);
      return;
    }

    queueDeleteStart(props.holdMs);
    return;
  }

  if (currentText.value.length > 0) {
    currentText.value = activePhrase.slice(0, currentText.value.length - 1);
    queueNextStep(props.deleteSpeedMs);
    return;
  }

  isDeleting.value = false;
  currentIndex.value = (currentIndex.value + 1) % phrases.length;
  queueNextStep(props.nextDelayMs);
}

function syncMotionPreference(matchesReducedMotion: boolean) {
  prefersReducedMotion.value = matchesReducedMotion;
  clearStepTimer();
  resetAnimationState();

  if (!matchesReducedMotion) {
    queueNextStep(props.holdMs);
  }
}

watch([normalizedPhrases, safeInitialIndex], () => {
  clearStepTimer();
  resetAnimationState();

  if (isReady.value && !prefersReducedMotion.value) {
    queueNextStep(props.holdMs);
  }
});

onMounted(() => {
  isReady.value = true;

  if (!import.meta.client) {
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
  clearStepTimer();

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
  <span class="hero-typed-headline">
    <span class="sr-only">{{ resolvedAccessibleText }}</span>
    <span
      aria-hidden="true"
      class="hero-typed-headline__visual"
      :class="{ 'is-reduced': prefersReducedMotion }"
    >
      <span class="hero-typed-headline__base">{{ baseText }}</span>
      <span
        class="hero-typed-headline__tail-shell"
        :class="{ 'is-deleting': isDeleting }"
      >
        <span class="hero-typed-headline__tail-sizer">{{ longestPhrase }}</span>
        <span class="hero-typed-headline__tail">{{ currentText }}</span>
      </span>
    </span>
  </span>
</template>

<style scoped>
.hero-typed-headline {
  display: inline-block;
  color: inherit;
  max-width: 100%;
}

.hero-typed-headline__visual {
  display: inline-grid;
  grid-auto-flow: row;
  justify-items: start;
  row-gap: clamp(0.02em, 0.18vw, 0.12em);
  color: inherit;
  line-height: 0.92;
}

.hero-typed-headline__base {
  display: block;
  color: inherit;
}

.hero-typed-headline__tail-shell {
  display: grid;
  grid-template-columns: max-content;
  align-items: start;
  min-block-size: 1em;
  line-height: 0.92;
  white-space: nowrap;
}

.hero-typed-headline__tail-sizer,
.hero-typed-headline__tail {
  grid-area: 1 / 1;
}

.hero-typed-headline__tail-sizer {
  visibility: hidden;
  user-select: none;
  pointer-events: none;
}

.hero-typed-headline__tail {
  display: block;
  color: inherit;
  opacity: 0.98;
  transition: opacity 180ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .hero-typed-headline__tail {
    transition: none !important;
  }
}
</style>
