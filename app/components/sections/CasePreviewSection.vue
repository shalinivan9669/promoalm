<script setup lang="ts">
import type { CaseStudy } from "../../../shared/types/content";
import { buildWidthSrcSet, CASE_CARD_IMAGE_HEIGHT, CASE_CARD_IMAGE_SIZES, CASE_CARD_IMAGE_WIDTH } from "../../utils/responsive-images";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    cases: CaseStudy[];
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default" && props.variant !== "home");
const isCasesVariant = computed(() => props.variant === "cases");
const sectionClass = computed(() =>
  props.variant === "home"
    ? "home-band-section"
    : isInternal.value
      ? `section-divider section-space page-section page-section--${props.variant}`
      : "section-divider section-space"
);
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));

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

type HomeCaseMediaKey = "game" | "cofe" | "retail";

interface CaseMediaItem {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
}

type CaseCardTone = {
  accent: string;
};

const CASE_CARD_TONES: CaseCardTone[] = [
  { accent: "198 90 58" },
  { accent: "86 129 120" },
  { accent: "122 132 151" },
  { accent: "166 143 82" },
  { accent: "100 129 140" },
  { accent: "151 123 96" },
  { accent: "132 118 103" }
];

const CASE_EDITORIAL_ORDER = [
  "coffee-lightbox-entry",
  "cyber-club-facade-rollout",
  "interior-logo-showroom",
  "letters-for-clinic",
  "roof-sign-retail",
  "neon-signage-showroom",
  "regional-delivery-pack"
] as const;

type CaseEditorialTone = "quiet" | "medium" | "strong";
type CaseEditorialPlacement =
  | "row1-left"
  | "row1-right"
  | "row2-left"
  | "row2-center"
  | "row2-right"
  | "row3-left"
  | "row3-right";

const HOME_CASE_MEDIA_FOLDER_BY_SLUG: Partial<Record<CaseStudy["slug"], HomeCaseMediaKey>> = {
  "cyber-club-facade-rollout": "game",
  "coffee-lightbox-entry": "cofe",
  "roof-sign-retail": "retail"
};

const HOME_CASE_MEDIA_FILES: Record<HomeCaseMediaKey, string[]> = {
  game: ["game.avif"],
  cofe: ["1.avif", "2.avif", "3.avif"],
  retail: ["retail.avif", "retail2.avif"]
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
      const mediaKey = HOME_CASE_MEDIA_FOLDER_BY_SLUG[item.slug];

      if (!mediaKey) {
        return [item.slug, []];
      }

      const media = HOME_CASE_MEDIA_FILES[mediaKey]
        .slice()
        .sort(mediaFileSorter.compare)
        .map((fileName, index) => ({
          src: `/images/cases/${mediaKey}/${fileName}`,
          alt: `${item.title} - изображение ${index + 1}`
        }));

      return [item.slug, media];
    })
  )
);
const responsiveHomeCaseMediaBySlug = computed<Record<string, CaseMediaItem[]>>(() =>
  Object.fromEntries(
    props.cases.map((item) => {
      const mediaKey = HOME_CASE_MEDIA_FOLDER_BY_SLUG[item.slug];

      if (!mediaKey) {
        return [item.slug, []];
      }

      const media = HOME_CASE_MEDIA_FILES[mediaKey]
        .slice()
        .sort(mediaFileSorter.compare)
        .map((fileName, index) => {
          const fileStem = fileName.replace(/\.avif$/u, "");

          return {
            src: `/images/cases/${mediaKey}/${fileName}`,
            srcset: buildWidthSrcSet(
              CASE_CARD_RESPONSIVE_WIDTHS.map((width) => ({
                src: `/images/cases/${mediaKey}/responsive/${fileStem}-card-${width}.webp`,
                width
              }))
            ),
            sizes: CASE_CARD_IMAGE_SIZES,
            width: CASE_CARD_IMAGE_WIDTH,
            height: CASE_CARD_IMAGE_HEIGHT,
            alt: `${item.title} - изображение ${index + 1}`
          };
        });

      return [item.slug, media];
    })
  )
);

const editorialCases = computed(() => {
  if (!isCasesVariant.value) {
    return props.cases;
  }

  const bySlug = new Map(props.cases.map((item) => [item.slug, item] as const));
  const ordered = CASE_EDITORIAL_ORDER.map((slug) => bySlug.get(slug)).filter(
    (item): item is CaseStudy => Boolean(item)
  );
  const seen = new Set(ordered.map((item) => item.slug));

  for (const item of props.cases) {
    if (!seen.has(item.slug)) {
      ordered.push(item);
    }
  }

  return ordered.slice(0, 7);
});

function isVisualLeading(index: number) {
  return index % 2 === 1;
}

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

function getCasePreviewMedia(item: CaseStudy) {
  return getCaseMedia(item)[0] ?? null;
}

function getCaseFacts(item: CaseStudy, maxFacts: number) {
  const facts: string[] = [];

  for (const fact of [...item.metrics, ...item.deliverables]) {
    if (!fact || facts.includes(fact)) {
      continue;
    }

    facts.push(fact);

    if (facts.length >= maxFacts) {
      break;
    }
  }

  return facts;
}

function getCaseCardTone(index: number) {
  return CASE_CARD_TONES[index % CASE_CARD_TONES.length] ?? CASE_CARD_TONES[0]!;
}

function getCaseCardStyle(index: number, item: CaseStudy) {
  const preview = getCasePreviewMedia(item);
  const tone = getCaseCardTone(index);
  const style: Record<string, string> = {
    "--case-card-accent": tone.accent
  };

  if (preview) {
    style["--case-card-image"] = `url("${preview.src}")`;
  }

  return style;
}

function getCaseEditorialTone(index: number): CaseEditorialTone {
  if (!isCasesVariant.value) {
    return "medium";
  }

  if (index === 1 || index === 5) {
    return "strong";
  }

  if (index === 2 || index === 3 || index === 4) {
    return "medium";
  }

  return "quiet";
}

function getCaseEditorialPlacement(index: number): CaseEditorialPlacement {
  if (!isCasesVariant.value) {
    return "row2-center";
  }

  if (index === 0) {
    return "row1-left";
  }

  if (index === 1) {
    return "row1-right";
  }

  if (index === 2) {
    return "row2-left";
  }

  if (index === 3) {
    return "row2-center";
  }

  if (index === 4) {
    return "row2-right";
  }

  if (index === 5) {
    return "row3-left";
  }

  return "row3-right";
}

function getCaseCardClass(index: number) {
  const classes = ["case-collection-card"];

  if (isCasesVariant.value) {
    classes.push(
      `case-collection-card--placement-${getCaseEditorialPlacement(index)}`,
      `case-collection-card--tier-${getCaseEditorialTone(index)}`
    );
  } else {
    classes.push("case-collection-card--regular");
  }

  return classes.join(" ");
}

function getCaseSummaryClampClass(index: number) {
  if (isCasesVariant.value && getCaseEditorialTone(index) === "medium") {
    return "case-collection-card__summary--compact";
  }

  return "case-collection-card__summary--wide";
}

function getCaseTitleClass(index: number) {
  if (!isCasesVariant.value) {
    return "case-collection-card__title--regular";
  }

  const tone = getCaseEditorialTone(index);

  if (tone === "strong") {
    return "case-collection-card__title--strong";
  }

  if (tone === "medium") {
    return "case-collection-card__title--medium";
  }

  return "case-collection-card__title--quiet";
}

function getCaseFactsLimit(index: number) {
  if (!isCasesVariant.value) {
    return 3;
  }

  if (getCaseEditorialTone(index) === "medium") {
    return 2;
  }

  return 3;
}

function getCasePreviewLabel(item: CaseStudy) {
  return item.proofMode === "real" ? "Реальный проект" : "Типовой сценарий";
}

function getCasePreviewCaption(item: CaseStudy) {
  return item.metrics[0] ?? item.cityLabel;
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

function homeCaseDockClass() {
  return ["home-case-card__dock"].join(" ");
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
  <section :class="sectionClass">
    <Container :class="{ 'site-shell--wide': isCasesVariant }">
      <SectionHeader
        eyebrow="Кейсы"
        :title="title"
        :description="description"
        :variant="headerVariant"
      />

      <div
        v-if="props.variant === 'home'"
        class="home-case-stack"
      >
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

          <div :class="homeCaseDockClass()">
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
                <span>Открыть на странице кейсов</span>
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

      <div
        v-else-if="isCasesVariant"
        class="case-collection-grid case-collection-grid--editorial mt-8"
      >
        <article
          v-for="(item, index) in editorialCases"
          :id="item.slug"
          :key="item.id"
          :class="getCaseCardClass(index)"
          :style="getCaseCardStyle(index, item)"
        >
          <div
            class="case-collection-card__preview"
            :class="{ 'case-collection-card__preview--has-image': Boolean(getCasePreviewMedia(item)) }"
          >
            <div class="case-collection-card__tags">
              <span class="case-collection-card__tag">
                {{ getCaseCategoryLabel(item) }}
              </span>
              <span class="case-collection-card__tag case-collection-card__tag--ghost">
                {{ item.cityLabel }}
              </span>
            </div>

            <img
              v-if="getCasePreviewMedia(item)"
              :src="getCasePreviewMedia(item)?.src"
              :alt="getCasePreviewMedia(item)?.alt ?? item.title"
              class="case-collection-card__media"
              loading="lazy"
              decoding="async"
            />

            <div
              v-else
              class="case-collection-card__preview-fallback"
            >
              <p class="case-collection-card__preview-eyebrow">
                {{ getCasePreviewLabel(item) }}
              </p>
              <h4 class="case-collection-card__preview-title">
                {{ item.industry }}
              </h4>
              <p class="case-collection-card__preview-note">
                {{ getCasePreviewCaption(item) }}
              </p>
            </div>

            <div
              aria-hidden="true"
              class="case-collection-card__preview-scrim"
            />
          </div>

          <div class="case-collection-card__body">
            <div class="case-collection-card__copy">
              <h3 :class="['case-collection-card__title', getCaseTitleClass(index)]">
                {{ item.title }}
              </h3>
              <p :class="['case-collection-card__summary', getCaseSummaryClampClass(index)]">
                {{ item.summary }}
              </p>
            </div>

            <ul class="case-collection-card__facts">
              <li
                v-for="(fact, factIndex) in getCaseFacts(item, getCaseFactsLimit(index))"
                :key="`${item.id}-fact-${factIndex}`"
                class="case-collection-card__fact"
              >
                <span
                  aria-hidden="true"
                  class="case-collection-card__fact-mark"
                />
                <span class="case-collection-card__fact-text">{{ fact }}</span>
              </li>
            </ul>

            <div class="case-collection-card__footer">
              <ButtonLink
                :href="`/cases/#${item.slug}`"
                label="Открыть кейс"
                intent="secondary"
                tracking-event="open_case"
                block
                :small="!(index === 1 || index === 5)"
              />
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="case-collection-grid case-collection-grid--compact mt-8"
      >
        <article
          v-for="(item, index) in editorialCases"
          :id="item.slug"
          :key="item.id"
          :class="getCaseCardClass(index)"
          :style="getCaseCardStyle(index, item)"
        >
          <div
            class="case-collection-card__preview"
            :class="{ 'case-collection-card__preview--has-image': Boolean(getCasePreviewMedia(item)) }"
          >
            <div class="case-collection-card__tags">
              <span class="case-collection-card__tag">
                {{ getCaseCategoryLabel(item) }}
              </span>
              <span class="case-collection-card__tag case-collection-card__tag--ghost">
                {{ item.cityLabel }}
              </span>
            </div>

            <img
              v-if="getCasePreviewMedia(item)"
              :src="getCasePreviewMedia(item)?.src"
              :alt="getCasePreviewMedia(item)?.alt ?? item.title"
              class="case-collection-card__media"
              loading="lazy"
              decoding="async"
            />

            <div
              v-else
              class="case-collection-card__preview-fallback"
            >
              <p class="case-collection-card__preview-eyebrow">
                {{ getCasePreviewLabel(item) }}
              </p>
              <h4 class="case-collection-card__preview-title">
                {{ item.industry }}
              </h4>
              <p class="case-collection-card__preview-note">
                {{ getCasePreviewCaption(item) }}
              </p>
            </div>

            <div
              aria-hidden="true"
              class="case-collection-card__preview-scrim"
            />
          </div>

          <div class="case-collection-card__body">
            <div class="case-collection-card__copy">
              <h3 :class="['case-collection-card__title', getCaseTitleClass(index)]">
                {{ item.title }}
              </h3>
              <p :class="['case-collection-card__summary', getCaseSummaryClampClass(index)]">
                {{ item.summary }}
              </p>
            </div>

            <ul class="case-collection-card__facts">
              <li
                v-for="(fact, factIndex) in getCaseFacts(item, getCaseFactsLimit(index))"
                :key="`${item.id}-fact-${factIndex}`"
                class="case-collection-card__fact"
              >
                <span
                  aria-hidden="true"
                  class="case-collection-card__fact-mark"
                />
                <span class="case-collection-card__fact-text">{{ fact }}</span>
              </li>
            </ul>

            <div class="case-collection-card__footer">
              <ButtonLink
                :href="`/cases/#${item.slug}`"
                label="Открыть кейс"
                intent="secondary"
                tracking-event="open_case"
                block
                small
              />
            </div>
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>


<style scoped>
.case-collection-grid {
  display: grid;
  gap: 1.25rem;
  align-items: stretch;
}

.case-collection-card {
  --case-card-accent: 198 90 58;
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0;
  overflow: visible;
  border-radius: 1.95rem;
  border: 1px solid color-mix(in srgb, var(--color-stroke) 84%, transparent);
  background:
    radial-gradient(circle at 84% 14%, rgb(var(--case-card-accent) / 0.05), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(251, 250, 247, 0.96));
  padding: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 18px 36px rgba(17, 22, 28, 0.08);
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.case-collection-card::before {
  content: "";
  position: absolute;
  inset: 0.8rem;
  border-radius: 1.45rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  pointer-events: none;
}

.case-collection-card:hover,
.case-collection-card:focus-within {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, rgb(var(--case-card-accent)) 26%, var(--color-stroke) 74%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 22px 42px rgba(17, 22, 28, 0.1);
}

.case-collection-card--tier-quiet {
  padding: 0.95rem;
  border-color: color-mix(in srgb, rgb(var(--case-card-accent)) 18%, var(--color-stroke) 82%);
  background:
    radial-gradient(circle at 84% 14%, rgb(var(--case-card-accent) / 0.05), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(250, 248, 243, 0.97));
  --case-card-preview-ratio: auto;
  --case-card-preview-height: clamp(10.75rem, 11vw, 11.5rem);
  --case-card-body-overlap: 1.7rem;
}

.case-collection-card--tier-medium {
  padding: 1rem;
  --case-card-preview-ratio: auto;
  --case-card-preview-height: clamp(8.85rem, 9vw, 9.5rem);
  --case-card-body-overlap: 1.35rem;
}

.case-collection-card--tier-strong {
  padding: 1.08rem;
  border-color: color-mix(in srgb, rgb(var(--case-card-accent)) 24%, var(--color-stroke) 76%);
  background:
    radial-gradient(circle at 84% 14%, rgb(var(--case-card-accent) / 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(247, 244, 238, 0.98));
  --case-card-preview-ratio: auto;
  --case-card-preview-height: clamp(11.4rem, 12vw, 12.5rem);
  --case-card-body-overlap: 2rem;
}

.case-collection-card__preview {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  aspect-ratio: var(--case-card-preview-ratio, 16 / 10);
  height: var(--case-card-preview-height, auto);
  min-height: 0;
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--color-stroke) 82%, transparent);
  background:
    radial-gradient(circle at 20% 18%, rgb(var(--case-card-accent) / 0.12), transparent 36%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(247, 244, 238, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    0 12px 24px rgba(17, 22, 28, 0.06);
}

.case-collection-card__preview--has-image {
  background: rgba(248, 246, 241, 0.96);
}

.case-collection-card__tags {
  position: absolute;
  inset: 0.95rem 0.95rem auto;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.case-collection-card__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  padding: 0.36rem 0.7rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-stroke) 82%, transparent);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(244, 241, 232, 0.8)),
    rgba(244, 241, 232, 0.74);
  font-size: 0.68rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 8px 16px rgba(17, 22, 28, 0.06);
}

.case-collection-card__tag--ghost {
  color: var(--color-text-muted);
}

.case-collection-card__media,
.case-collection-card__preview-scrim,
.case-collection-card__preview-fallback {
  position: absolute;
  inset: 0;
}

.case-collection-card__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.case-collection-card:hover .case-collection-card__media,
.case-collection-card:focus-within .case-collection-card__media {
  transform: scale(1.03);
}

.case-collection-card__preview-scrim {
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0) 24%),
    linear-gradient(180deg, rgba(17, 22, 28, 0.02), rgba(17, 22, 28, 0.08));
}

.case-collection-card__preview-fallback {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 1rem;
  background:
    radial-gradient(circle at 84% 14%, rgb(var(--case-card-accent) / 0.14), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(247, 244, 238, 0.98));
}

.case-collection-card__preview-eyebrow {
  font-size: 0.68rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.case-collection-card__preview-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: var(--font-display);
  font-size: clamp(1.08rem, 1.8vw, 1.5rem);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--color-text);
}

.case-collection-card__preview-note {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.case-collection-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: calc(var(--case-card-body-overlap, 4.75rem) * -1);
  padding: 1.15rem 1.15rem 1.2rem;
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--color-stroke) 84%, transparent);
  background:
    radial-gradient(circle at 88% 0%, rgb(var(--case-card-accent) / 0.05), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(247, 244, 238, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 14px 30px rgba(17, 22, 28, 0.06);
}

.case-collection-card--tier-quiet .case-collection-card__body {
  padding: 1rem 1rem 1.08rem;
  gap: 0.72rem;
}

.case-collection-card--tier-medium .case-collection-card__body {
  padding: 0.94rem 0.94rem 1rem;
  gap: 0.66rem;
}

.case-collection-card--tier-strong .case-collection-card__body {
  padding: 1.18rem 1.18rem 1.25rem;
  gap: 0.84rem;
}

.case-collection-card__copy {
  display: grid;
  gap: 0.65rem;
  min-width: 0;
}

.case-collection-card__title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: var(--font-sans);
  letter-spacing: -0.024em;
  color: var(--color-text);
}

.case-collection-card__title--strong {
  font-size: clamp(1.18rem, 1.55vw, 1.48rem);
  line-height: 1.05;
  font-weight: 700;
}

.case-collection-card__title--medium {
  font-size: clamp(1.04rem, 1.18vw, 1.16rem);
  line-height: 1.08;
  font-weight: 700;
}

.case-collection-card__title--regular {
  font-size: clamp(1.02rem, 1.12vw, 1.12rem);
  line-height: 1.1;
  font-weight: 700;
}

.case-collection-card__title--quiet {
  font-size: clamp(1rem, 1.12vw, 1.08rem);
  line-height: 1.1;
  font-weight: 700;
}

.case-collection-card__summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  font-size: 0.88rem;
  line-height: 1.58;
  color: var(--color-text-secondary);
}

.case-collection-card__summary--wide {
  -webkit-line-clamp: 3;
}

.case-collection-card__summary--compact {
  -webkit-line-clamp: 2;
}

.case-collection-card__facts {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.55rem 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.case-collection-card__fact {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--color-text-secondary);
}

.case-collection-card__fact-mark {
  margin-top: 0.4rem;
  width: 0.42rem;
  height: 0.42rem;
  flex: none;
  border-radius: 999px;
  background: rgb(var(--case-card-accent) / 0.72);
  box-shadow: 0 0 0 0.3rem rgb(var(--case-card-accent) / 0.1);
}

.case-collection-card__fact-text {
  display: -webkit-box;
  min-width: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.case-collection-card__footer {
  margin-top: auto;
  padding-top: 0.15rem;
}

@media (min-width: 640px) {
  .case-collection-card__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .case-collection-grid--compact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }

  .case-collection-grid--editorial {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .case-collection-grid--compact {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .case-collection-grid--editorial {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    width: min(100%, 85rem);
    margin-inline: auto;
    grid-template-rows:
      minmax(clamp(22.5rem, 24vw, 25rem), auto)
      minmax(clamp(18.75rem, 20vw, 20.625rem), auto)
      minmax(clamp(22.5rem, 24vw, 25rem), auto);
    grid-auto-rows: minmax(18rem, auto);
    align-content: start;
  }

  .case-collection-card--placement-row1-left {
    grid-column: 1 / span 5;
    grid-row: 1;
  }

  .case-collection-card--placement-row1-right {
    grid-column: 6 / span 7;
    grid-row: 1;
  }

  .case-collection-card--placement-row2-left {
    grid-column: 1 / span 4;
    grid-row: 2;
  }

  .case-collection-card--placement-row2-center {
    grid-column: 5 / span 4;
    grid-row: 2;
  }

  .case-collection-card--placement-row2-right {
    grid-column: 9 / span 4;
    grid-row: 2;
  }

  .case-collection-card--placement-row3-left {
    grid-column: 1 / span 7;
    grid-row: 3;
  }

  .case-collection-card--placement-row3-right {
    grid-column: 8 / span 5;
    grid-row: 3;
  }
}

.home-case-card--panel {
  position: relative;
}

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
  .home-case-card__media-dot,
  .case-collection-card,
  .case-collection-card__media {
    transition: none;
  }

  .home-case-card__media-slide {
    transform: none;
  }

  .case-collection-card:hover,
  .case-collection-card:focus-within,
  .case-collection-card:hover .case-collection-card__media,
  .case-collection-card:focus-within .case-collection-card__media {
    transform: none;
  }
}
</style>
