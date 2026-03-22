<script setup lang="ts">
import { normalizePathForMatch } from "../../utils/routes";

const props = withDefaults(
  defineProps<{
    href: string;
    label?: string;
    eyebrow?: string;
    ariaLabel?: string;
    trackingEvent?: string;
  }>(),
  {
    label: "Обсудить проект",
    eyebrow: "WhatsApp",
    ariaLabel: "Обсудить проект в WhatsApp",
    trackingEvent: "click_whatsapp_companion"
  }
);

const companionRef = ref<HTMLAnchorElement | null>(null);
const route = useRoute();

const isDesktopEligible = ref(false);
const prefersReducedMotion = ref(false);
const hasMounted = ref(false);
const isRouteReady = ref(false);
const homeUnlocked = ref(false);
const hasVisibleLeadZone = ref(false);
const hasVisibleFooterZone = ref(false);
const hasManualHideZone = ref(false);
const hasOpenOverlay = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const isPressed = ref(false);
const currentX = ref(0);
const currentY = ref(0);
const currentTiltX = ref(0);
const currentTiltY = ref(0);
const currentGlow = ref(0);

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HOME_PATH = normalizePathForMatch("/");
const HOME_START_SELECTOR = "[data-companion-home-start]";
const LEAD_ZONE_SELECTOR = "[data-companion-lead-zone]";
const FOOTER_ZONE_SELECTOR = "[data-companion-footer-zone]";
const MANUAL_HIDE_SELECTOR = "[data-companion-hide]";
const OVERLAY_SELECTOR = '[data-companion-overlay-open="true"], dialog[open], [aria-modal="true"]';
const PROXIMITY_RADIUS = 220;
const MAX_TRANSLATE_X_NEGATIVE = -10;
const MAX_TRANSLATE_X_POSITIVE = 4;
const MAX_TRANSLATE_Y = 6;
const MAX_TILT = 2.25;
const MAX_SCROLL_DRIFT = 6;

const isHomeRoute = computed(() => normalizePathForMatch(route.path) === HOME_PATH);
const isSuppressed = computed(
  () => hasVisibleLeadZone.value || hasVisibleFooterZone.value || hasManualHideZone.value || hasOpenOverlay.value
);
const isVisible = computed(() => {
  if (!hasMounted.value || !isRouteReady.value || !isDesktopEligible.value || isSuppressed.value) {
    return false;
  }

  return isHomeRoute.value ? homeUnlocked.value : true;
});
const isEngaged = computed(() => !prefersReducedMotion.value && (isHovered.value || isFocused.value));

const surfaceStyle = computed<Record<string, string>>(() => ({
  "--companion-offset-x": `${currentX.value.toFixed(3)}px`,
  "--companion-offset-y": `${currentY.value.toFixed(3)}px`,
  "--companion-tilt-x": `${currentTiltX.value.toFixed(3)}deg`,
  "--companion-tilt-y": `${currentTiltY.value.toFixed(3)}deg`,
  "--companion-glow-strength": currentGlow.value.toFixed(3)
}));

const homeStartReachedElements = new Set<Element>();
const visibleLeadZones = new Set<Element>();
const visibleFooterZones = new Set<Element>();
const visibleManualHideZones = new Set<Element>();

let desktopMediaQuery: MediaQueryList | null = null;
let reducedMotionMediaQuery: MediaQueryList | null = null;
let desktopMediaHandler: ((event: MediaQueryListEvent) => void) | null = null;
let reducedMotionHandler: ((event: MediaQueryListEvent) => void) | null = null;
let homeStartObserver: IntersectionObserver | null = null;
let suppressionObserver: IntersectionObserver | null = null;
let overlayObserver: MutationObserver | null = null;
let animationFrameId: number | null = null;
let routeScanFrameId: number | null = null;
let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;
let targetTiltX = 0;
let targetTiltY = 0;
let targetGlow = 0;
let currentScrollDrift = 0;
let targetScrollDrift = 0;
let lastScrollY = 0;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function syncDesktopEligibility(matches: boolean) {
  isDesktopEligible.value = matches;

  if (!matches) {
    resetMotionTargets();
    currentX.value = 0;
    currentY.value = 0;
    currentTiltX.value = 0;
    currentTiltY.value = 0;
    currentGlow.value = 0;
  }
}

function syncReducedMotionPreference(matches: boolean) {
  prefersReducedMotion.value = matches;

  if (matches) {
    resetMotionTargets();
  }
}

function resetZoneState() {
  homeStartReachedElements.clear();
  visibleLeadZones.clear();
  visibleFooterZones.clear();
  visibleManualHideZones.clear();
  homeUnlocked.value = !isHomeRoute.value;
  hasVisibleLeadZone.value = false;
  hasVisibleFooterZone.value = false;
  hasManualHideZone.value = false;
}

function resetMotionTargets() {
  targetX = 0;
  targetY = 0;
  targetTiltX = 0;
  targetTiltY = 0;
  targetGlow = 0;
  targetScrollDrift = 0;
  isPressed.value = false;
}

function disconnectZoneObservers() {
  homeStartObserver?.disconnect();
  homeStartObserver = null;
  suppressionObserver?.disconnect();
  suppressionObserver = null;
}

function cancelRouteScanFrame() {
  if (routeScanFrameId !== null) {
    cancelAnimationFrame(routeScanFrameId);
    routeScanFrameId = null;
  }
}

function resolveHomeStartState(target: Element) {
  if (!import.meta.client) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const unlockThreshold = window.innerHeight * 0.82;

  if (rect.top <= unlockThreshold) {
    homeStartReachedElements.add(target);
  } else {
    homeStartReachedElements.delete(target);
  }

  homeUnlocked.value = homeStartReachedElements.size > 0;
}

function refreshZoneFlag(kind: "lead" | "footer" | "manual") {
  if (kind === "lead") {
    hasVisibleLeadZone.value = visibleLeadZones.size > 0;
    return;
  }

  if (kind === "footer") {
    hasVisibleFooterZone.value = visibleFooterZones.size > 0;
    return;
  }

  hasManualHideZone.value = visibleManualHideZones.size > 0;
}

function updateSuppressionSet(target: Element, kind: "lead" | "footer" | "manual", isActive: boolean) {
  const store =
    kind === "lead" ? visibleLeadZones : kind === "footer" ? visibleFooterZones : visibleManualHideZones;

  if (isActive) {
    store.add(target);
  } else {
    store.delete(target);
  }

  refreshZoneFlag(kind);
}

function refreshSuppressionState(target: Element, kind: "lead" | "footer" | "manual") {
  if (!import.meta.client) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const isActive = rect.top < window.innerHeight && rect.bottom > 0;

  updateSuppressionSet(target, kind, isActive);
}

function updateOverlayState() {
  if (!import.meta.client) {
    return;
  }

  hasOpenOverlay.value = Boolean(document.body.querySelector(OVERLAY_SELECTOR));
}

function scanZones() {
  if (!import.meta.client) {
    return;
  }

  disconnectZoneObservers();
  resetZoneState();

  if (isHomeRoute.value) {
    const homeStartTargets = Array.from(document.querySelectorAll<HTMLElement>(HOME_START_SELECTOR));

    if (homeStartTargets.length > 0) {
      homeStartObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            resolveHomeStartState(entry.target);
          }
        },
        {
          root: null,
          threshold: [0, 1],
          rootMargin: "0px 0px -18% 0px"
        }
      );

      for (const target of homeStartTargets) {
        homeStartObserver.observe(target);
        resolveHomeStartState(target);
      }
    } else {
      homeUnlocked.value = false;
    }
  }

  suppressionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target;

        if (target instanceof HTMLElement && target.hasAttribute("data-companion-lead-zone")) {
          updateSuppressionSet(target, "lead", entry.isIntersecting);
          continue;
        }

        if (target instanceof HTMLElement && target.hasAttribute("data-companion-footer-zone")) {
          updateSuppressionSet(target, "footer", entry.isIntersecting);
          continue;
        }

        updateSuppressionSet(target, "manual", entry.isIntersecting);
      }
    },
    {
      root: null,
      threshold: [0, 0.12]
    }
  );

  const leadZones = Array.from(document.querySelectorAll<HTMLElement>(LEAD_ZONE_SELECTOR));
  const footerZones = Array.from(document.querySelectorAll<HTMLElement>(FOOTER_ZONE_SELECTOR));
  const manualHideZones = Array.from(document.querySelectorAll<HTMLElement>(MANUAL_HIDE_SELECTOR));

  for (const target of leadZones) {
    suppressionObserver.observe(target);
    refreshSuppressionState(target, "lead");
  }

  for (const target of footerZones) {
    suppressionObserver.observe(target);
    refreshSuppressionState(target, "footer");
  }

  for (const target of manualHideZones) {
    suppressionObserver.observe(target);
    refreshSuppressionState(target, "manual");
  }

  updateOverlayState();
  isRouteReady.value = true;
}

function scheduleZoneScan() {
  if (!import.meta.client) {
    return;
  }

  cancelRouteScanFrame();
  isRouteReady.value = false;
  resetZoneState();
  updateOverlayState();
  resetMotionTargets();

  routeScanFrameId = window.requestAnimationFrame(() => {
    routeScanFrameId = null;
    scanZones();
  });
}

function handlePointerMove(event: PointerEvent) {
  pointerX = event.clientX;
  pointerY = event.clientY;

  if (!isVisible.value || prefersReducedMotion.value || !companionRef.value) {
    resetMotionTargets();
    return;
  }

  const rect = companionRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = pointerX - centerX;
  const deltaY = pointerY - centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > PROXIMITY_RADIUS) {
    targetX = 0;
    targetY = 0;
    targetTiltX = 0;
    targetTiltY = 0;
    targetGlow = 0;
    return;
  }

  const influence = 1 - distance / PROXIMITY_RADIUS;
  const normalizedX = clamp(deltaX / PROXIMITY_RADIUS, -1, 1);
  const normalizedY = clamp(deltaY / PROXIMITY_RADIUS, -1, 1);

  targetX = clamp(normalizedX * 14, MAX_TRANSLATE_X_NEGATIVE, MAX_TRANSLATE_X_POSITIVE) * influence;
  targetY = clamp(normalizedY * 8, -MAX_TRANSLATE_Y, MAX_TRANSLATE_Y) * influence;
  targetTiltX = clamp(normalizedY * -3.1, -MAX_TILT, MAX_TILT) * influence;
  targetTiltY = clamp(normalizedX * 3.1, -MAX_TILT, MAX_TILT) * influence;
  targetGlow = clamp(influence, 0, 1);
}

function handlePointerLeave() {
  resetMotionTargets();
}

function handleScroll() {
  if (!import.meta.client) {
    return;
  }

  const nextScrollY = window.scrollY;
  const delta = nextScrollY - lastScrollY;
  lastScrollY = nextScrollY;

  if (!isVisible.value || prefersReducedMotion.value) {
    targetScrollDrift = 0;
    return;
  }

  targetScrollDrift = clamp(delta * -0.35, -MAX_SCROLL_DRIFT, MAX_SCROLL_DRIFT);
}

function animate() {
  currentX.value = lerp(currentX.value, targetX, 0.14);
  currentY.value = lerp(currentY.value, targetY + currentScrollDrift, 0.14);
  currentTiltX.value = lerp(currentTiltX.value, targetTiltX, 0.12);
  currentTiltY.value = lerp(currentTiltY.value, targetTiltY, 0.12);
  currentGlow.value = lerp(currentGlow.value, targetGlow, 0.16);
  currentScrollDrift = lerp(currentScrollDrift, targetScrollDrift, 0.11);
  targetScrollDrift = lerp(targetScrollDrift, 0, 0.08);

  animationFrameId = window.requestAnimationFrame(animate);
}

function handlePressStart() {
  isPressed.value = true;
}

function handlePressEnd() {
  isPressed.value = false;
}

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
  handlePointerLeave();
}

function handleFocus() {
  isFocused.value = true;
}

function handleBlur() {
  isFocused.value = false;
  handlePointerLeave();
}

watch(
  () => route.fullPath,
  async () => {
    resetMotionTargets();
    currentX.value = 0;
    currentY.value = 0;
    currentTiltX.value = 0;
    currentTiltY.value = 0;
    currentGlow.value = 0;

    await nextTick();

    if (!import.meta.client) {
      return;
    }

    scheduleZoneScan();
  }
);

watch(isVisible, (visible) => {
  if (visible) {
    return;
  }

  resetMotionTargets();

  if (document.activeElement === companionRef.value) {
    companionRef.value?.blur();
  }
});

onMounted(() => {
  if (!import.meta.client) {
    return;
  }

  hasMounted.value = true;
  isRouteReady.value = false;
  homeUnlocked.value = !isHomeRoute.value;
  lastScrollY = window.scrollY;

  desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  syncDesktopEligibility(desktopMediaQuery.matches);
  syncReducedMotionPreference(reducedMotionMediaQuery.matches);

  desktopMediaHandler = (event) => {
    syncDesktopEligibility(event.matches);
    scheduleZoneScan();
  };

  reducedMotionHandler = (event) => {
    syncReducedMotionPreference(event.matches);
  };

  if (typeof desktopMediaQuery.addEventListener === "function") {
    desktopMediaQuery.addEventListener("change", desktopMediaHandler);
  } else {
    desktopMediaQuery.addListener(desktopMediaHandler);
  }

  if (typeof reducedMotionMediaQuery.addEventListener === "function") {
    reducedMotionMediaQuery.addEventListener("change", reducedMotionHandler);
  } else {
    reducedMotionMediaQuery.addListener(reducedMotionHandler);
  }

  overlayObserver = new MutationObserver(() => {
    updateOverlayState();
  });

  overlayObserver.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["open", "aria-modal", "data-companion-overlay-open"]
  });

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });

  scheduleZoneScan();
  animationFrameId = window.requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return;
  }

  cancelRouteScanFrame();
  disconnectZoneObservers();
  overlayObserver?.disconnect();
  overlayObserver = null;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.removeEventListener("scroll", handleScroll);

  if (desktopMediaQuery && desktopMediaHandler) {
    if (typeof desktopMediaQuery.removeEventListener === "function") {
      desktopMediaQuery.removeEventListener("change", desktopMediaHandler);
    } else {
      desktopMediaQuery.removeListener(desktopMediaHandler);
    }
  }

  if (reducedMotionMediaQuery && reducedMotionHandler) {
    if (typeof reducedMotionMediaQuery.removeEventListener === "function") {
      reducedMotionMediaQuery.removeEventListener("change", reducedMotionHandler);
    } else {
      reducedMotionMediaQuery.removeListener(reducedMotionHandler);
    }
  }
});
</script>

<template>
  <a
    ref="companionRef"
    :href="props.href"
    :aria-label="props.ariaLabel"
    :aria-hidden="!isVisible"
    :tabindex="isVisible ? undefined : -1"
    target="_blank"
    rel="noreferrer noopener"
    class="project-companion"
    :class="{
      'is-visible': isVisible,
      'is-engaged': isEngaged,
      'is-pressed': isPressed,
      'is-reduced': prefersReducedMotion
    }"
    :data-tracking-event="props.trackingEvent"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @pointerdown="handlePressStart"
    @pointerup="handlePressEnd"
    @pointercancel="handlePressEnd"
    @keydown.space="handlePressStart"
    @keyup.space="handlePressEnd"
    @keydown.enter="handlePressStart"
    @keyup.enter="handlePressEnd"
  >
    <span
      class="project-companion__surface"
      :style="surfaceStyle"
    >
      <span
        aria-hidden="true"
        class="project-companion__ember"
      />
      <span class="project-companion__copy">
        <span class="project-companion__eyebrow">{{ props.eyebrow }}</span>
        <span class="project-companion__label">{{ props.label }}</span>
      </span>
      <span
        aria-hidden="true"
        class="project-companion__pod"
      >
        <span class="project-companion__pod-core">
          <svg
            viewBox="0 0 24 24"
            class="project-companion__icon"
          >
            <path
              d="M19.2 4.8A9.73 9.73 0 0 0 12.2 2a9.8 9.8 0 0 0-8.43 14.8L2 22l5.4-1.7A9.8 9.8 0 1 0 19.2 4.8Zm-7 13.74a8.05 8.05 0 0 1-4.1-1.12l-.3-.17-3.2 1 1.05-3.1-.2-.32a8.05 8.05 0 1 1 6.75 3.71Zm4.4-6.02c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.16-1.38-1.3-1.62-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.06 3.6.57.24 1.02.38 1.36.48.57.18 1.1.16 1.5.1.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </span>
  </a>
</template>

<style scoped>
.project-companion {
  position: fixed;
  right: 1.25rem;
  bottom: 1.5rem;
  z-index: 50;
  display: block;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, 0.8rem, 0);
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.project-companion.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translate3d(0, 0, 0);
}

.project-companion__surface {
  --companion-offset-x: 0px;
  --companion-offset-y: 0px;
  --companion-tilt-x: 0deg;
  --companion-tilt-y: 0deg;
  --companion-glow-strength: 0;
  position: relative;
  display: grid;
  width: 11rem;
  min-height: 4rem;
  grid-template-columns: minmax(0, 1fr) 2.75rem;
  align-items: center;
  gap: 0.62rem;
  overflow: hidden;
  padding: 0.55rem 0.5rem 0.55rem 0.92rem;
  border: 1px solid rgba(244, 241, 232, 0.08);
  border-radius: 1.375rem;
  background:
    radial-gradient(circle at 76% 18%, rgba(141, 218, 228, 0.06), transparent 24%),
    linear-gradient(180deg, rgba(26, 32, 40, 0.98), rgba(12, 16, 22, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 44px rgba(17, 22, 28, 0.24),
    0 8px 20px rgba(198, 90, 58, 0.1);
  transform:
    translate3d(var(--companion-offset-x), var(--companion-offset-y), 0)
    perspective(1200px)
    rotateX(var(--companion-tilt-x))
    rotateY(var(--companion-tilt-y));
  transform-origin: 78% 50%;
  transition:
    width 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms ease,
    border-color 220ms ease,
    background-color 220ms ease;
  will-change: transform, width, box-shadow;
}

.project-companion__surface::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: calc(1.375rem - 1px);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 32%),
    linear-gradient(180deg, rgba(8, 11, 16, 0.08), transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(255, 255, 255, 0.03);
  pointer-events: none;
}

.project-companion__ember {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle at 22% 50%, rgba(216, 95, 59, 0.18), transparent 26%),
    radial-gradient(circle at 72% 50%, rgba(216, 95, 59, calc(0.1 + var(--companion-glow-strength) * 0.16)), transparent 20%);
  filter: blur(22px);
  opacity: calc(0.2 + var(--companion-glow-strength) * 0.36);
  pointer-events: none;
  animation: companion-breathe 6.4s ease-in-out infinite;
}

.project-companion__copy {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  gap: 0.18rem;
  padding-left: 0.72rem;
}

.project-companion__copy::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2rem;
  bottom: 0.2rem;
  width: 2px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(245, 214, 130, 0.94), rgba(216, 95, 59, 0.94));
  box-shadow:
    0 0 12px rgba(216, 95, 59, calc(0.08 + var(--companion-glow-strength) * 0.2)),
    0 0 24px rgba(245, 214, 130, calc(0.04 + var(--companion-glow-strength) * 0.08));
}

.project-companion__eyebrow {
  color: rgba(235, 223, 197, 0.72);
  font-size: 0.58rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.project-companion__label {
  overflow: hidden;
  color: rgba(251, 250, 247, 0.96);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.91rem;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.015em;
}

.project-companion__pod {
  position: relative;
  z-index: 1;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(244, 241, 232, 0.1), rgba(244, 241, 232, 0.04)),
    rgba(16, 21, 28, 0.86);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 16px rgba(8, 11, 16, 0.2);
}

.project-companion__pod-core {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 0.82rem;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.18), transparent 52%),
    linear-gradient(180deg, rgba(216, 95, 59, 0.24), rgba(17, 22, 28, 0.2));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 18px rgba(216, 95, 59, calc(0.08 + var(--companion-glow-strength) * 0.16));
}

.project-companion__icon {
  width: 1rem;
  height: 1rem;
  color: rgba(251, 250, 247, 0.92);
}

.project-companion.is-engaged .project-companion__surface {
  width: 14rem;
  border-color: rgba(216, 95, 59, 0.24);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 22px 46px rgba(17, 22, 28, 0.28),
    0 10px 24px rgba(198, 90, 58, 0.13);
}

.project-companion.is-engaged .project-companion__label {
  text-overflow: clip;
}

.project-companion.is-pressed .project-companion__surface {
  transform:
    translate3d(var(--companion-offset-x), calc(var(--companion-offset-y) + 1px), 0)
    perspective(1200px)
    rotateX(var(--companion-tilt-x))
    rotateY(var(--companion-tilt-y))
    scale(0.985);
}

.project-companion.is-reduced .project-companion__surface {
  width: 11rem;
  transform: none;
}

.project-companion.is-reduced .project-companion__ember {
  animation: none;
  opacity: 0.22;
}

.project-companion:focus-visible {
  outline: none;
}

.project-companion:focus-visible .project-companion__surface {
  border-color: rgba(142, 218, 228, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 0 1px rgba(142, 218, 228, 0.22),
    0 0 0 4px rgba(142, 218, 228, 0.12),
    0 18px 44px rgba(17, 22, 28, 0.24),
    0 8px 20px rgba(198, 90, 58, 0.1);
}

@media (min-width: 1280px) {
  .project-companion {
    right: 1.75rem;
    bottom: 1.75rem;
  }
}

@media (max-width: 1023px), (hover: none), (pointer: coarse) {
  .project-companion {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-companion,
  .project-companion__surface {
    transition:
      opacity 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }
}

@keyframes companion-breathe {
  0%,
  100% {
    opacity: calc(0.18 + var(--companion-glow-strength) * 0.3);
  }

  50% {
    opacity: calc(0.28 + var(--companion-glow-strength) * 0.42);
  }
}
</style>
