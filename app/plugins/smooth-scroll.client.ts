import Lenis from "lenis";

declare global {
  interface Window {
    __promoLenis?: Lenis;
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.client) {
    return;
  }

  const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const finePointer = window.matchMedia("(pointer: fine)");

  if (!prefersMotion.matches || !finePointer.matches || window.__promoLenis) {
    return;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    autoRaf: false,
    anchors: true,
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

  nuxtApp.hook("page:finish", refreshScrollTriggers);
  window.addEventListener("resize", refreshScrollTriggers, { passive: true });
});
