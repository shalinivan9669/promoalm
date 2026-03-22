<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gorodViditMaskUrl from "~/assets/masks/gorod-vidit-mask.svg?url";

const props = defineProps<{
  backgroundSrc: string;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLDivElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);

const DESKTOP_INTRO_MASK_SIZE = "122%";
const DESKTOP_INTRO_MASK_POSITION = "49.8% 46%";
const MOBILE_MASK_SIZE = "135%";
const MOBILE_MASK_POSITION = "50% 52%";
const DESKTOP_SCRUB = 1.15;
const DESKTOP_STAGE_ENTRY_START = "top 82%";
const DESKTOP_STAGE_ENTRY_Y_PERCENT = -18;

interface MaskStage {
  size: string;
  position: string;
  duration?: number;
}

const DESKTOP_MASK_STAGES: Readonly<{
  intro: MaskStage;
  hold: MaskStage;
  revealOne: MaskStage;
  revealTwo: MaskStage;
  clear: MaskStage;
  final: MaskStage;
}> = {
  intro: {
    size: DESKTOP_INTRO_MASK_SIZE,
    position: DESKTOP_INTRO_MASK_POSITION
  },
  hold: {
    size: "130%",
    position: "49.8% 46.8%",
    duration: 0.42
  },
  revealOne: {
    size: "320%",
    position: "49.8% 47.8%",
    duration: 0.26
  },
  revealTwo: {
    size: "920%",
    position: "49.8% 49.5%",
    duration: 0.16
  },
  clear: {
    size: "3000%",
    position: "50% 43%",
    duration: 0.1
  },
  final: {
    size: "4200%",
    position: "50% 40%",
    duration: 0.06
  }
};

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

interface TweenHandle {
  kill: () => void;
  scrollTrigger?: {
    kill: () => void;
  } | null;
}

const sceneStyle = computed<Record<string, string>>(() => ({
  "--think-big-bg-image": `linear-gradient(180deg, rgba(17, 22, 28, 0.14), rgba(17, 22, 28, 0.2)), url("${props.backgroundSrc}")`,
  "--think-big-mask-image": `url("${gorodViditMaskUrl}")`,
  "--think-big-mask-size-intro": DESKTOP_INTRO_MASK_SIZE,
  "--think-big-mask-position-intro": DESKTOP_INTRO_MASK_POSITION,
  "--think-big-mask-size-mobile": MOBILE_MASK_SIZE,
  "--think-big-mask-position-mobile": MOBILE_MASK_POSITION
}));

let desktopTimeline: TimelineHandle | null = null;
let desktopStageParallaxTween: TweenHandle | null = null;
let mediaContext: MediaContextHandle | null = null;
let disposed = false;

function buildMaskVars(stage: MaskStage) {
  return {
    maskSize: `100% 100%, ${stage.size}`,
    webkitMaskSize: `100% 100%, ${stage.size}`,
    maskPosition: `50% 50%, ${stage.position}`,
    webkitMaskPosition: `50% 50%, ${stage.position}`
  };
}

onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  await nextTick();

  if (!sectionRef.value || !viewportRef.value || !stageRef.value || !overlayRef.value) {
    return;
  }

  // Boot GSAP only on the client so SSR stays deterministic.
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);

  if (disposed || !sectionRef.value || !viewportRef.value || !stageRef.value || !overlayRef.value) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  mediaContext = gsap.matchMedia();

  mediaContext.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
    const section = sectionRef.value;
    const viewport = viewportRef.value;
    const stage = stageRef.value;
    const overlay = overlayRef.value;

    if (!section || !viewport || !stage || !overlay) {
      return;
    }

    gsap.set(stage, { yPercent: DESKTOP_STAGE_ENTRY_Y_PERCENT });
    gsap.set(overlay, buildMaskVars(DESKTOP_MASK_STAGES.intro));

    desktopStageParallaxTween = gsap.to(stage, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: DESKTOP_STAGE_ENTRY_START,
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    desktopTimeline = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        pin: viewport,
        start: "top top",
        end: "bottom bottom",
        scrub: DESKTOP_SCRUB,
        anticipatePin: 1,
        refreshPriority: 99,
        invalidateOnRefresh: true
      }
    });

    const holdEnd = DESKTOP_MASK_STAGES.hold.duration ?? 0;
    const revealOneEnd = holdEnd + (DESKTOP_MASK_STAGES.revealOne.duration ?? 0);
    const revealTwoEnd = revealOneEnd + (DESKTOP_MASK_STAGES.revealTwo.duration ?? 0);
    const clearEnd = revealTwoEnd + (DESKTOP_MASK_STAGES.clear.duration ?? 0);

    desktopTimeline
      .to(overlay, { ...buildMaskVars(DESKTOP_MASK_STAGES.hold), duration: DESKTOP_MASK_STAGES.hold.duration })
      .to(
        overlay,
        { ...buildMaskVars(DESKTOP_MASK_STAGES.revealOne), duration: DESKTOP_MASK_STAGES.revealOne.duration },
        holdEnd
      )
      .to(
        overlay,
        { ...buildMaskVars(DESKTOP_MASK_STAGES.revealTwo), duration: DESKTOP_MASK_STAGES.revealTwo.duration },
        revealOneEnd
      )
      .to(
        overlay,
        { ...buildMaskVars(DESKTOP_MASK_STAGES.clear), duration: DESKTOP_MASK_STAGES.clear.duration },
        revealTwoEnd
      )
      .to(
        overlay,
        { ...buildMaskVars(DESKTOP_MASK_STAGES.final), duration: DESKTOP_MASK_STAGES.final.duration },
        clearEnd
      );

    ScrollTrigger.refresh();

    return () => {
      desktopStageParallaxTween?.scrollTrigger?.kill();
      desktopStageParallaxTween?.kill();
      desktopStageParallaxTween = null;
      desktopTimeline?.scrollTrigger?.kill();
      desktopTimeline?.kill();
      desktopTimeline = null;
      gsap.set(stage, {
        clearProps: "transform"
      });
      gsap.set(overlay, {
        clearProps: "maskSize,webkitMaskSize,maskPosition,webkitMaskPosition"
      });
    };
  });
});

onBeforeUnmount(() => {
  disposed = true;
  mediaContext?.revert();
  mediaContext = null;
  desktopTimeline = null;
});
</script>

<template>
  <section
    ref="sectionRef"
    aria-hidden="true"
    class="think-big"
    :style="sceneStyle"
  >
    <div
      ref="viewportRef"
      class="think-big__viewport"
    >
      <div class="think-big__stage">
        <div
          ref="stageRef"
          aria-hidden="true"
          class="think-big__stage-media"
        />
      </div>
      <div
        ref="overlayRef"
        class="think-big__overlay"
      />
    </div>
  </section>
</template>

<style scoped>
.think-big {
  position: relative;
  min-height: 340vh;
  block-size: 340vh;
}

.think-big__viewport {
  position: relative;
  min-height: 100svh;
  block-size: 100svh;
  width: 100%;
  overflow: hidden;
  isolation: isolate;
}

.think-big__stage {
  position: absolute;
  inset-block: -30svh;
  inset-inline: 0;
  overflow: hidden;
  pointer-events: none;
}

.think-big__stage-media {
  position: absolute;
  inset-block: 30svh;
  inset-inline: 0;
  background-image: var(--think-big-bg-image);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;
  will-change: transform;
}

.think-big__overlay {
  display: block;
  position: relative;
  z-index: 1;
  min-height: 100svh;
  block-size: 100svh;
  width: 100%;
  pointer-events: none;
  background: #fff;
  mask-image: linear-gradient(#fff 0 0), var(--think-big-mask-image);
  -webkit-mask-image: linear-gradient(#fff 0 0), var(--think-big-mask-image);
  mask-repeat: no-repeat, no-repeat;
  -webkit-mask-repeat: no-repeat, no-repeat;
  mask-position: 50% 50%, var(--think-big-mask-position-intro);
  -webkit-mask-position: 50% 50%, var(--think-big-mask-position-intro);
  mask-size: 100% 100%, var(--think-big-mask-size-intro);
  -webkit-mask-size: 100% 100%, var(--think-big-mask-size-intro);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  will-change: mask-size, mask-position, -webkit-mask-size, -webkit-mask-position;
}

@media (max-width: 800px) {
  .think-big {
    min-height: 100svh;
    block-size: 100svh;
  }

  .think-big__viewport {
    min-height: 100svh;
    block-size: 100svh;
  }

  .think-big__overlay {
    mask-position: 50% 50%, var(--think-big-mask-position-mobile);
    -webkit-mask-position: 50% 50%, var(--think-big-mask-position-mobile);
    mask-size: 100% 100%, var(--think-big-mask-size-mobile);
    -webkit-mask-size: 100% 100%, var(--think-big-mask-size-mobile);
  }

  .think-big__stage {
    inset: 0;
  }

  .think-big__stage-media {
    inset: 0;
    will-change: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .think-big {
    min-height: 100svh;
    block-size: 100svh;
  }

  .think-big__viewport {
    min-height: 100svh;
    block-size: 100svh;
  }

  .think-big__overlay {
    mask-position: 50% 50%, var(--think-big-mask-position-mobile);
    -webkit-mask-position: 50% 50%, var(--think-big-mask-position-mobile);
    mask-size: 100% 100%, var(--think-big-mask-size-mobile);
    -webkit-mask-size: 100% 100%, var(--think-big-mask-size-mobile);
    will-change: auto;
  }

  .think-big__stage {
    inset: 0;
  }

  .think-big__stage-media {
    inset: 0;
    will-change: auto;
  }
}
</style>
