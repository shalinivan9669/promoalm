<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import mapSvgUrl from "~/assets/map/map.svg?url";

const props = defineProps<{
  firstLine: string;
  secondLine: string;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const copyRef = ref<HTMLElement | null>(null);
const firstLineRef = ref<HTMLElement | null>(null);
const secondLineRef = ref<HTMLElement | null>(null);
const mapRef = ref<HTMLElement | null>(null);

interface MediaContextHandle {
  add: (query: string, setup: () => void | (() => void)) => void;
  revert: () => void;
}

interface TimelineHandle {
  to: (target: object, vars: Record<string, unknown>, position?: number) => TimelineHandle;
  kill: () => void;
  scrollTrigger?: {
    kill: () => void;
  } | null;
}

let mediaContext: MediaContextHandle | null = null;
let takeoverTimeline: TimelineHandle | null = null;
let disposed = false;

onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  await nextTick();

  if (
    !sectionRef.value ||
    !viewportRef.value ||
    !panelRef.value ||
    !copyRef.value ||
    !firstLineRef.value ||
    !secondLineRef.value ||
    !mapRef.value
  ) {
    return;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);

  if (
    disposed ||
    !sectionRef.value ||
    !viewportRef.value ||
    !panelRef.value ||
    !copyRef.value ||
    !firstLineRef.value ||
    !secondLineRef.value ||
    !mapRef.value
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  mediaContext = gsap.matchMedia();

  mediaContext.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    const section = sectionRef.value;
    const panel = panelRef.value;
    const firstLine = firstLineRef.value;
    const secondLine = secondLineRef.value;
    const map = mapRef.value;

    if (!section || !panel || !firstLine || !secondLine || !map) {
      return;
    }

    const isCompactViewport = window.matchMedia("(max-width: 767px)").matches;
    const panelStartYPercent = isCompactViewport ? 24 : 20;
    const textStartY = isCompactViewport ? 12 : 20;

    gsap.set(panel, {
      yPercent: panelStartYPercent
    });
    gsap.set(firstLine, {
      y: textStartY,
      opacity: 0
    });
    gsap.set(secondLine, {
      y: textStartY,
      opacity: 0
    });
    gsap.set(map, {
      y: isCompactViewport ? 28 : 42,
      opacity: 0,
      scale: 0.94
    });

    takeoverTimeline = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        start: "top 86%",
        end: "+=860",
        scrub: 1.6,
        invalidateOnRefresh: true,
        refreshPriority: 80
      }
    });

    takeoverTimeline
      .to(panel, {
        yPercent: 0,
        duration: 0.36
      })
      .to(
        firstLine,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        },
        0.2
      )
      .to(
        secondLine,
        {
          y: 0,
          opacity: 1,
          duration: 0.38,
          ease: "power2.out"
        },
        0.42
      )
      .to(
        map,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.44,
          ease: "power2.out"
        },
        0.68
      );

    ScrollTrigger.refresh();

    return () => {
      takeoverTimeline?.scrollTrigger?.kill();
      takeoverTimeline?.kill();
      takeoverTimeline = null;
      gsap.set(panel, { clearProps: "transform" });
      gsap.set(firstLine, { clearProps: "transform,opacity" });
      gsap.set(secondLine, { clearProps: "transform,opacity" });
      gsap.set(map, { clearProps: "transform,opacity" });
    };
  });

  mediaContext.add("(max-width: 767px)", () => {
    const panel = panelRef.value;
    const firstLine = firstLineRef.value;
    const secondLine = secondLineRef.value;
    const map = mapRef.value;

    if (!panel || !firstLine || !secondLine || !map) {
      return;
    }

    gsap.set(panel, { clearProps: "transform" });
    gsap.set(firstLine, { clearProps: "transform,opacity" });
    gsap.set(secondLine, { clearProps: "transform,opacity" });
    gsap.set(map, { clearProps: "transform,opacity" });

    return () => {
      gsap.set(panel, { clearProps: "transform" });
      gsap.set(firstLine, { clearProps: "transform,opacity" });
      gsap.set(secondLine, { clearProps: "transform,opacity" });
      gsap.set(map, { clearProps: "transform,opacity" });
    };
  });
});

onBeforeUnmount(() => {
  disposed = true;
  mediaContext?.revert();
  mediaContext = null;
  takeoverTimeline = null;
});
</script>

<template>
  <section
    ref="sectionRef"
    class="section-after-hero"
    aria-labelledby="section-after-hero-title"
    aria-describedby="section-after-hero-description"
  >
    <div
      ref="viewportRef"
      class="section-after-hero__viewport"
    >
      <div
        ref="panelRef"
        class="section-after-hero__panel"
      >
        <Container class="section-after-hero__shell">
          <div class="section-after-hero__layout">
            <div
              ref="copyRef"
              class="section-after-hero__copy"
            >
              <h2
                id="section-after-hero-title"
                class="section-after-hero__title"
              >
                <span
                  ref="firstLineRef"
                  class="section-after-hero__title-line"
                >
                  {{ props.firstLine }}
                </span>
                <span
                  ref="secondLineRef"
                  id="section-after-hero-description"
                  class="section-after-hero__title-line section-after-hero__title-line--secondary"
                >
                  {{ props.secondLine }}
                </span>
              </h2>
            </div>

            <div
              ref="mapRef"
              class="section-after-hero__map"
              aria-hidden="true"
            >
              <img
                :src="mapSvgUrl"
                alt=""
                class="section-after-hero__map-image"
              >
            </div>
          </div>
        </Container>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-after-hero {
  position: relative;
  z-index: 3;
  min-height: 200svh;
  block-size: 200svh;
  margin-top: -18svh;
  isolation: isolate;
  background:
    radial-gradient(circle at 50% 0%, rgba(216, 95, 59, 0.12), transparent 20%),
    radial-gradient(circle at 14% 86%, rgba(142, 218, 228, 0.12), transparent 30%),
    radial-gradient(circle at 88% 86%, rgba(255, 255, 255, 0.04), transparent 26%),
    linear-gradient(180deg, rgba(6, 9, 13, 0.98), rgba(12, 16, 22, 1));
}

.section-after-hero__viewport {
  position: sticky;
  top: 0;
  display: grid;
  min-height: 100svh;
  block-size: 118svh;
  padding: clamp(0.8rem, 1.6vw, 1.25rem);
  align-items: center;
}

.section-after-hero__panel {
  position: relative;
  overflow: clip;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: clamp(1.6rem, 2.4vw, 2.4rem);
  background:
    radial-gradient(circle at 50% 16%, rgba(216, 95, 59, 0.12), transparent 22%),
    radial-gradient(circle at 84% 82%, rgba(142, 218, 228, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(19, 24, 31, 0.98), rgba(11, 15, 20, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 26px 60px rgba(6, 9, 13, 0.26);
  will-change: transform;
}

.section-after-hero__shell {
  display: grid;
  min-height: calc(100svh - clamp(1.6rem, 3.2vw, 2.5rem));
  width: 100%;
  max-width: 1600px;
  align-content: start;
  justify-items: stretch;
  gap: clamp(0.9rem, 2vw, 1.6rem);
  padding-block: clamp(2.6rem, 5vw, 4.5rem);
}

.section-after-hero__layout {
  position: relative;
  display: grid;
  width: 100%;
  min-height: calc(100svh - clamp(1.6rem, 3.2vw, 2.5rem));
  gap: clamp(1.4rem, 3vw, 3rem);
  align-items: start;
}

.section-after-hero__copy {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  max-width: none;
  justify-items: start;
  text-align: left;
}

.section-after-hero__title {
  display: grid;
  width: 100%;
  gap: 0.08em;
  max-width: none;
  font-family: var(--font-display);
  font-size: clamp(5rem, 13vw, 200px);
  line-height: 0.9;
  font-weight: 700;
  letter-spacing: var(--tracking-display);
  color: #f6f4ef;
}

.section-after-hero__title-line {
  display: block;
  width: 100%;
  will-change: transform, opacity;
}

.section-after-hero__title-line--secondary {
  font-size: clamp(2.2rem, 4.6vw, 70px);
  color: rgba(236, 241, 246, 0.86);
}

.section-after-hero__map {
  position: absolute;
  right: calc(clamp(1.1rem, 3.6vw, 3rem) - 6px);
  bottom: calc(clamp(1rem, 2.6vw, 2rem) + 30px);
  width: min(56vw, 780px);
  max-width: 780px;
  z-index: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.section-after-hero__map-image {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 767px) {
  .section-after-hero {
    min-height: 0;
    block-size: auto;
    margin-top: -6svh;
  }

  .section-after-hero__viewport {
    position: static;
    min-height: 0;
    block-size: auto;
    padding: 0.5rem 0.5rem 0;
  }

  .section-after-hero__panel {
    min-height: 0;
  }

  .section-after-hero__shell {
    gap: 0.5rem;
    min-height: 0;
    padding-block: 0.85rem 1rem;
  }

  .section-after-hero__layout {
    display: flex;
    min-height: clamp(16rem, 44svh, 22rem);
    flex-direction: column;
    justify-content: space-between;
    gap: 0.9rem;
  }

  .section-after-hero__map {
    position: relative;
    right: auto;
    bottom: auto;
    align-self: stretch;
    margin-top: auto;
    width: 100%;
    max-width: none;
  }

  .section-after-hero__title {
    max-width: 100%;
    font-size: 45px;
    line-height: 0.86;
    letter-spacing: -0.05em;
    white-space: normal;
  }

  .section-after-hero__title-line--secondary {
    font-size: 40px;
  }

  .section-after-hero__title-line {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-after-hero {
    min-height: 100svh;
    block-size: auto;
    margin-top: 0;
  }

  .section-after-hero__viewport {
    position: static;
    min-height: 100svh;
    block-size: auto;
  }

  .section-after-hero__panel,
  .section-after-hero__copy {
    transform: none !important;
  }
}

@media (max-width: 767px) and (prefers-reduced-motion: reduce) {
  .section-after-hero {
    min-height: 0;
    block-size: auto;
    margin-top: -6svh;
  }

  .section-after-hero__viewport {
    min-height: 0;
    block-size: auto;
  }
}
</style>
