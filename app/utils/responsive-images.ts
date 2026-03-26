export interface ResponsiveImageCandidate {
  src: string;
  width: number;
}

export const HOME_HERO_IMAGE_WIDTH = 2560;
export const HOME_HERO_IMAGE_HEIGHT = 1365;
export const HOME_HERO_IMAGE_SIZES = "(max-width: 1536px) 100vw, 1536px";

export const CASE_CARD_IMAGE_WIDTH = 535;
export const CASE_CARD_IMAGE_HEIGHT = 334;
export const CASE_CARD_IMAGE_SIZES =
  "(max-width: 767px) calc(100vw - 1.5rem), (max-width: 1023px) calc(100vw - 3rem), 560px";

export function buildWidthSrcSet(candidates: readonly ResponsiveImageCandidate[]) {
  return candidates.map(({ src, width }) => `${src} ${width}w`).join(", ");
}
