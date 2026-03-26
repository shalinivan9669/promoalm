<script setup lang="ts">
declare global {
  interface Window {
    __promoLenis?: import("lenis").default;
  }
}

const nuxtApp = useNuxtApp();

let removePageFinishHook: (() => void) | undefined;
let resizeHandler: (() => void) | undefined;
let idleBootstrapId: number | ReturnType<typeof globalThis.setTimeout> | undefined;
let isDisposed = false;
let lenisCleanup: (() => void) | undefined;

function clearIdleBootstrap() {
  if (idleBootstrapId === undefined || !import.meta.client) {
    return;
  }

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(idleBootstrapId as number);
  } else {
    globalThis.clearTimeout(idleBootstrapId);
  }

  idleBootstrapId = undefined;
}

onMounted(() => {
  if (!import.meta.client || window.__promoLenis) {
    return;
  }

  const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const finePointer = window.matchMedia("(pointer: fine)");

  if (!prefersMotion.matches || !finePointer.matches) {
    return;
  }

  const initSmoothScroll = async () => {
    idleBootstrapId = undefined;

    if (isDisposed || window.__promoLenis) {
      return;
    }

    const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]);

    if (isDisposed || window.__promoLenis) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.075,
      wheelMultiplier: 0.9
    });

    const refreshScrollTriggers = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    window.__promoLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const maybeRemovePageFinishHook = nuxtApp.hook("page:finish", refreshScrollTriggers);

    if (typeof maybeRemovePageFinishHook === "function") {
      removePageFinishHook = maybeRemovePageFinishHook;
    }

    resizeHandler = refreshScrollTriggers;
    window.addEventListener("resize", refreshScrollTriggers, { passive: true });

    lenisCleanup = () => {
      removePageFinishHook?.();
      removePageFinishHook = undefined;

      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = undefined;
      }

      gsap.ticker.remove(tick);
      lenis.destroy();

      if (window.__promoLenis === lenis) {
        delete window.__promoLenis;
      }
    };
  };

  if ("requestIdleCallback" in window) {
    idleBootstrapId = window.requestIdleCallback(() => {
      void initSmoothScroll();
    }, { timeout: 2200 });
    return;
  }

  idleBootstrapId = globalThis.setTimeout(() => {
    void initSmoothScroll();
  }, 1200);
});

onBeforeUnmount(() => {
  isDisposed = true;
  clearIdleBootstrap();
  lenisCleanup?.();
  lenisCleanup = undefined;
});
</script>

<template>
  <span hidden aria-hidden="true"></span>
</template>
