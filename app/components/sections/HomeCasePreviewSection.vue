<script setup lang="ts">
import type { CaseStudy } from "../../../shared/types/content";
import { getCaseMediaAlt, getCaseMediaConfig } from "../../data/case-media";
import { buildWidthSrcSet, CASE_CARD_IMAGE_HEIGHT, CASE_CARD_IMAGE_SIZES, CASE_CARD_IMAGE_WIDTH } from "../../utils/responsive-images";

const props = defineProps<{
  title: string;
  description: string;
  cases: CaseStudy[];
}>();

interface CaseMediaItem {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
}

const CASE_CATEGORY_LABELS: Partial<Record<CaseStudy["relatedServiceSlugs"][number], string>> = {
  "fasadnye-vyveski": "Фасадный кейс",
  "svetovye-koroba": "Кейс: лайтбокс",
  "kryshnye-ustanovki": "Кейс: крышная установка",
  "interernye-vyveski-dlya-biznesa": "Интерьерный кейс",
  "neonovye-vyveski": "Кейс: неон",
  "obemnye-bukvy": "Кейс: объёмные буквы",
  "vyveski-pod-klyuch": "Кейс под ключ",
  "vyveski-dlya-seti": "Сетевой кейс",
  "montazh-vyvesok": "Монтажный кейс"
};

const CASE_CARD_RESPONSIVE_WIDTHS = [320, 420, CASE_CARD_IMAGE_WIDTH] as const;

const mediaFileSorter = new Intl.Collator("ru", {
  numeric: true,
  sensitivity: "base"
});

const activeSlides = ref<Record<string, number>>({});
const homeCaseMediaBySlug = computed<Record<string, CaseMediaItem[]>>(() =>
  Object.fromEntries(
    props.cases.map((item) => {
      const mediaConfig = getCaseMediaConfig(item.slug);

      if (!mediaConfig) {
        return [item.slug, []];
      }

      const media = mediaConfig.files
        .slice()
        .sort(mediaFileSorter.compare)
        .map((fileName, index) => ({
          src: `/images/cases/${mediaConfig.folder}/${fileName}`,
          alt: getCaseMediaAlt(item.slug, index, item.title)
        }));

      return [item.slug, media];
    })
  )
);
const responsiveHomeCaseMediaBySlug = computed<Record<string, CaseMediaItem[]>>(() =>
  Object.fromEntries(
    props.cases.map((item) => {
      const mediaConfig = getCaseMediaConfig(item.slug);

      if (!mediaConfig) {
        return [item.slug, []];
      }

      const media = mediaConfig.files
        .slice()
        .sort(mediaFileSorter.compare)
        .map((fileName, index) => {
          const fileStem = fileName.replace(/\.avif$/u, "");

          return {
            src: `/images/cases/${mediaConfig.folder}/${fileName}`,
            srcset: buildWidthSrcSet(
              CASE_CARD_RESPONSIVE_WIDTHS.map((width) => ({
                src: `/images/cases/${mediaConfig.folder}/responsive/${fileStem}-card-${width}.webp`,
                width
              }))
            ),
            sizes: CASE_CARD_IMAGE_SIZES,
            width: CASE_CARD_IMAGE_WIDTH,
            height: CASE_CARD_IMAGE_HEIGHT,
            alt: getCaseMediaAlt(item.slug, index, item.title)
          };
        });

      return [item.slug, media];
    })
  )
);

function getCaseCategoryLabel(item: CaseStudy) {
  for (const slug of item.relatedServiceSlugs) {
    const label = CASE_CATEGORY_LABELS[slug];

    if (label) {
      return label;
    }
  }

  return item.proofMode === "real" ? "Реальный кейс" : "Сценарный кейс";
}

function getCaseMedia(item: CaseStudy) {
  return responsiveHomeCaseMediaBySlug.value[item.slug] ?? homeCaseMediaBySlug.value[item.slug] ?? [];
}

function isVisualLeading(index: number) {
  return index % 2 === 1;
}

function homeCasePanelClass(index: number) {
  return [
    "home-case-card",
    "home-case-card--panel",
    "home-case-card--link",
    isVisualLeading(index) ? "home-case-card--visual-leading" : "home-case-card--dock-leading"
  ].join(" ");
}

function homeCaseVisualClass(index: number) {
  const themeClass =
    index === 0
      ? "home-case-card__visual--rollout"
      : index === 1
        ? "home-case-card__visual--lightbox"
        : "home-case-card__visual--roof";

  return ["home-case-card__visual", themeClass].join(" ");
}

function getActiveSlide(caseId: string, slideCount: number) {
  const activeSlide = activeSlides.value[caseId] ?? 0;

  if (activeSlide < 0 || activeSlide >= slideCount) {
    return 0;
  }

  return activeSlide;
}

function setActiveSlide(caseId: string, slideIndex: number) {
  activeSlides.value = {
    ...activeSlides.value,
    [caseId]: slideIndex
  };
}

function advanceSlide(caseId: string, slideCount: number) {
  if (slideCount < 2) {
    return;
  }

  setActiveSlide(caseId, (getActiveSlide(caseId, slideCount) + 1) % slideCount);
}

function handleMediaKeydown(event: KeyboardEvent, caseId: string, slideCount: number) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  advanceSlide(caseId, slideCount);
}
</script>

<template>
  <section class="home-band-section">
    <Container>
      <SectionHeader
        eyebrow="Кейсы"
        :title="title"
        :description="description"
      />

      <div class="home-case-stack">
        <article
          v-for="(item, index) in cases"
          :id="item.slug"
          :key="item.id"
          :class="homeCasePanelClass(index)"
        >
          <div :class="[homeCaseVisualClass(index), { 'home-case-card__visual--media': getCaseMedia(item).length > 0 }]">
            <template v-if="getCaseMedia(item).length">
              <div
                class="home-case-card__media-stage"
                :class="{ 'is-clickable': getCaseMedia(item).length > 1 }"
                :role="getCaseMedia(item).length > 1 ? 'button' : undefined"
                :tabindex="getCaseMedia(item).length > 1 ? 0 : undefined"
                :aria-label="getCaseMedia(item).length > 1 ? `Показать следующее изображение кейса ${item.title}` : undefined"
                @click="advanceSlide(item.id, getCaseMedia(item).length)"
                @keydown="handleMediaKeydown($event, item.id, getCaseMedia(item).length)"
              >
                <figure
                  v-for="(image, slideIndex) in getCaseMedia(item)"
                  :key="image.src"
                  class="home-case-card__media-slide"
                  :class="{ 'is-active': slideIndex === getActiveSlide(item.id, getCaseMedia(item).length) }"
                >
                  <img
                    :src="image.src"
                    :srcset="image.srcset"
                    :sizes="image.sizes"
                    :width="image.width"
                    :height="image.height"
                    :alt="image.alt"
                    class="home-case-card__media-image"
                    loading="lazy"
                    fetchpriority="low"
                    decoding="async"
                    draggable="false"
                  />
                </figure>
              </div>

              <div
                v-if="getCaseMedia(item).length > 1"
                class="home-case-card__media-dots"
              >
                <button
                  v-for="(_, slideIndex) in getCaseMedia(item)"
                  :key="`${item.id}-dot-${slideIndex}`"
                  type="button"
                  class="home-case-card__media-dot"
                  :class="{ 'is-active': slideIndex === getActiveSlide(item.id, getCaseMedia(item).length) }"
                  :aria-label="`Показать изображение ${slideIndex + 1}`"
                  :aria-pressed="slideIndex === getActiveSlide(item.id, getCaseMedia(item).length)"
                  @click="setActiveSlide(item.id, slideIndex)"
                />
              </div>
            </template>
          </div>

          <div class="home-case-card__dock">
            <div class="home-case-card__meta-rail">
              <span class="home-case-card__meta-chip section-signage-label">{{ getCaseCategoryLabel(item) }}</span>
              <span class="home-case-card__city section-signage-label section-signage-label--ghost">{{ item.cityLabel }}</span>
            </div>

            <div class="home-case-card__panel-grid">
              <div class="home-case-card__narrative">
                <h3 class="home-case-card__title">
                  {{ item.title }}
                </h3>
                <p class="home-case-card__summary">
                  {{ item.summary }}
                </p>
              </div>

              <div class="home-case-card__operations">
                <div class="home-case-card__operation">
                  <p class="home-case-card__label">Задача</p>
                  <p class="home-case-card__text text-sm leading-6 text-muted">{{ item.challenge }}</p>
                </div>
                <div class="home-case-card__operation">
                  <p class="home-case-card__label">Решение</p>
                  <p class="home-case-card__text text-sm leading-6 text-muted">{{ item.solution }}</p>
                </div>
              </div>
            </div>

            <div class="home-case-card__action-rail">
              <div class="home-case-card__metrics">
                <span
                  v-for="metric in item.metrics.slice(0, 2)"
                  :key="metric"
                  class="home-case-card__metric section-signage-label section-signage-label--ghost"
                >
                  {{ metric }}
                </span>
              </div>

              <a
                :href="`/cases/#${item.slug}`"
                class="home-case-card__cta"
              >
                <span>{{ item.title }}</span>
                <span
                  aria-hidden="true"
                  class="home-case-card__chevron"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.home-case-card__visual,
.home-case-card__dock {
  z-index: 1;
}

.home-case-card--panel:focus-within .home-case-card__title {
  color: #ffffff;
}

.home-case-card--panel:focus-within .home-case-card__chevron {
  transform: translateX(0.25rem);
  color: #ffffff;
}

.home-case-card__visual--media {
  background: transparent;
}

.home-case-card__media-stage,
.home-case-card__media-slide {
  position: absolute;
}

.home-case-card__media-stage {
  inset: 0.1rem;
  overflow: hidden;
  border: 1px solid rgba(199, 193, 182, 0.7);
  border-radius: 1.15rem;
  background: rgba(251, 250, 247, 0.96);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 22px rgba(17, 22, 28, 0.06);
}

.home-case-card__media-stage.is-clickable {
  cursor: pointer;
}

.home-case-card__media-stage.is-clickable:focus-visible {
  outline: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 1px rgba(142, 218, 228, 0.38),
    0 0 0 4px rgba(142, 218, 228, 0.14),
    0 10px 22px rgba(17, 22, 28, 0.06);
}

.home-case-card__media-slide {
  inset: 0;
}

.home-case-card__media-slide,
.home-case-card__media-image {
  border-radius: inherit;
}

.home-case-card__media-slide {
  opacity: 0;
  transform: scale(1.015);
  transition:
    opacity 220ms ease,
    transform 320ms ease;
}

.home-case-card__media-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

.home-case-card__media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.home-case-card__media-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.36rem 0.5rem;
  border: 1px solid rgba(199, 193, 182, 0.56);
  border-radius: 999px;
  background: rgba(251, 250, 247, 0.82);
  box-shadow: 0 8px 18px rgba(17, 22, 28, 0.08);
  backdrop-filter: blur(14px) saturate(120%);
  transform: translateX(-50%);
}

.home-case-card__media-dot {
  width: 0.48rem;
  height: 0.48rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(75, 83, 92, 0.34);
  cursor: pointer;
  opacity: 0.92;
  transition:
    width 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.home-case-card__media-dot:hover,
.home-case-card__media-dot:focus-visible {
  background: rgba(75, 83, 92, 0.56);
  transform: translateY(-1px);
}

.home-case-card__media-dot:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px rgba(142, 218, 228, 0.48),
    0 0 0 4px rgba(142, 218, 228, 0.18);
}

.home-case-card__media-dot.is-active {
  width: 1.2rem;
  background: rgba(19, 24, 29, 0.84);
}

.home-case-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

@media (max-width: 767px) {
  .home-case-card__media-stage {
    inset: 0.25rem;
    border-radius: 0.95rem;
  }

  .home-case-card__media-dots {
    bottom: 0.8rem;
    gap: 0.34rem;
    padding: 0.3rem 0.44rem;
  }

  .home-case-card__media-dot {
    width: 0.42rem;
    height: 0.42rem;
  }

  .home-case-card__media-dot.is-active {
    width: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-case-card__media-slide,
  .home-case-card__media-dot {
    transition: none;
  }

  .home-case-card__media-slide {
    transform: none;
  }
}
</style>
