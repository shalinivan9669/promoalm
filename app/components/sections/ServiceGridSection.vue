<script setup lang="ts">
import type { ServiceCard } from "../../../shared/types/content";

interface DescriptionHighlightConfig {
  text: string;
  tone?: "warm" | "gas" | "berry";
}

interface HomeServiceImageConfig {
  src: string;
  alt: string;
  position?: string;
}

const FEATURED_SLUG = "fasadnye-vyveski";
const PROMOTED_SLUGS = ["svetovye-koroba", "vyveski-dlya-seti"];
const LOWER_FEATURED_SLUG = "vyveski-pod-klyuch";
const LOWER_SUPPORTING_ORDER = [
  "obemnye-bukvy",
  "kryshnye-ustanovki",
  "interernye-vyveski-dlya-biznesa",
  "neonovye-vyveski",
  "montazh-vyvesok"
] as const;
const LOWER_WIDE_SLUGS = ["obemnye-bukvy", "interernye-vyveski-dlya-biznesa", "montazh-vyvesok"] as const;
const LOWER_SERVICE_SLUGS = ["interernye-vyveski-dlya-biznesa", "neonovye-vyveski", "montazh-vyvesok"] as const;
const LOWER_SUPPORTING_GRID_COLUMNS = 7;
const LOWER_SUPPORTING_WIDE_SPAN = 4;
const LOWER_SUPPORTING_NARROW_SPAN = 3;
const HOME_SERVICE_IMAGES: Partial<Record<ServiceCard["slug"], HomeServiceImageConfig>> = {
  "fasadnye-vyveski": {
    src: "/images/type/700x611.avif",
    position: "74% center",
    alt: "Фасадные вывески"
  },
  "vyveski-pod-klyuch": {
    src: "/images/type/464x684.avif",
    position: "72% center",
    alt: "Вывески под ключ"
  }
};

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    descriptionHighlight?: string;
    descriptionHighlightTone?: "warm" | "gas" | "berry";
    descriptionHighlights?: DescriptionHighlightConfig[];
    cards: ServiceCard[];
    variant?: "default" | "home" | "city" | "service" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default",
    descriptionHighlightTone: "warm"
  }
);

const isCity = computed(() => props.variant === "city");
const isInternal = computed(() => props.variant !== "default" && props.variant !== "home");
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));

const featuredCard = computed(() => props.cards.find((card) => card.slug === FEATURED_SLUG) ?? props.cards[0] ?? null);

const promotedCards = computed(() => {
  const reserved = new Set<string>();

  if (featuredCard.value) {
    reserved.add(featuredCard.value.slug);
  }

  const cards: ServiceCard[] = [];

  for (const slug of PROMOTED_SLUGS) {
    const match = props.cards.find((card) => card.slug === slug && !reserved.has(card.slug));

    if (match) {
      cards.push(match);
      reserved.add(match.slug);
    }
  }

  if (cards.length < 2) {
    for (const card of props.cards) {
      if (reserved.has(card.slug)) {
        continue;
      }

      cards.push(card);
      reserved.add(card.slug);

      if (cards.length === 2) {
        break;
      }
    }
  }

  return cards;
});

const supportingCards = computed(() => {
  const reserved = new Set<string>(promotedCards.value.map((card) => card.slug));

  if (featuredCard.value) {
    reserved.add(featuredCard.value.slug);
  }

  return props.cards.filter((card) => !reserved.has(card.slug));
});

const lowerFeaturedCard = computed(() => {
  const match = supportingCards.value.find((card) => card.slug === LOWER_FEATURED_SLUG);

  return match ?? supportingCards.value[0] ?? null;
});

const lowerSupportingCards = computed(() => {
  const reserved = new Set<string>();
  const orderedCards: ServiceCard[] = [];

  if (lowerFeaturedCard.value) {
    reserved.add(lowerFeaturedCard.value.slug);
  }

  for (const slug of LOWER_SUPPORTING_ORDER) {
    const match = supportingCards.value.find((card) => card.slug === slug && !reserved.has(card.slug));

    if (match) {
      orderedCards.push(match);
      reserved.add(match.slug);
    }
  }

  for (const card of supportingCards.value) {
    if (!reserved.has(card.slug)) {
      orderedCards.push(card);
    }
  }

  return orderedCards;
});

function getVisibleTags(card: ServiceCard, maxTags: number) {
  return (card.tags ?? []).slice(0, maxTags);
}

function getHiddenTagCount(card: ServiceCard, maxTags: number) {
  return Math.max((card.tags?.length ?? 0) - maxTags, 0);
}

function isLowerWideCard(slug: ServiceCard["slug"]) {
  return LOWER_WIDE_SLUGS.includes(slug as (typeof LOWER_WIDE_SLUGS)[number]);
}

function isLowerServiceCard(slug: ServiceCard["slug"]) {
  return LOWER_SERVICE_SLUGS.includes(slug as (typeof LOWER_SERVICE_SLUGS)[number]);
}

function getLowerCtaLabel(slug: ServiceCard["slug"]) {
  return isLowerServiceCard(slug) ? "Подробнее" : "Открыть услугу";
}

function getLowerSupportingRowColumnsBefore(index: number) {
  let usedColumns = 0;

  for (let i = 0; i < index; i++) {
    const card = lowerSupportingCards.value[i];

    if (!card) {
      continue;
    }

    const span = isLowerWideCard(card.slug) ? LOWER_SUPPORTING_WIDE_SPAN : LOWER_SUPPORTING_NARROW_SPAN;

    if (usedColumns === 0) {
      usedColumns = span;
      continue;
    }

    if (usedColumns + span > LOWER_SUPPORTING_GRID_COLUMNS) {
      usedColumns = span;
      continue;
    }

    if (usedColumns + span === LOWER_SUPPORTING_GRID_COLUMNS) {
      usedColumns = 0;
      continue;
    }

    usedColumns += span;
  }

  return usedColumns;
}

function getLowerSupportingCardSpanClass(card: ServiceCard, index: number) {
  const naturalClass = isLowerWideCard(card.slug)
    ? "home-service-card--span-wide"
    : "home-service-card--span-narrow";

  if (index !== lowerSupportingCards.value.length - 1) {
    return naturalClass;
  }

  const currentRowColumns = getLowerSupportingRowColumnsBefore(index);
  const naturalSpan = isLowerWideCard(card.slug) ? LOWER_SUPPORTING_WIDE_SPAN : LOWER_SUPPORTING_NARROW_SPAN;

  return currentRowColumns + naturalSpan === LOWER_SUPPORTING_GRID_COLUMNS
    ? naturalClass
    : "home-service-card--span-full";
}

function getHomeServiceImage(card: ServiceCard | null) {
  if (!card) {
    return null;
  }

  return HOME_SERVICE_IMAGES[card.slug] ?? null;
}

function getHomeServiceImageStyle(card: ServiceCard | null) {
  const image = getHomeServiceImage(card);

  if (!image) {
    return undefined;
  }

  return {
    "--service-card-bg-image": `url("${image.src}")`,
    "--service-card-bg-position": image.position ?? "74% center"
  };
}
</script>

<template>
  <section
    id="services"
    :class="
      props.variant === 'home'
        ? 'home-service-cluster section-divider scroll-mt-32'
        : isInternal
          ? `section-divider section-space page-section page-section--${props.variant} scroll-mt-32`
          : 'section-divider section-space scroll-mt-32'
    "
  >
    <Container>
      <SectionHeader
        eyebrow="Услуги"
        :title="title"
        :description="description"
        :description-highlight="props.descriptionHighlight"
        :description-highlight-tone="props.descriptionHighlightTone"
        :description-highlights="props.descriptionHighlights"
        eyebrow-style="plain"
        :variant="headerVariant"
      />

      <template v-if="props.variant === 'home' && featuredCard">
        <div class="home-service-cluster__layout">
          <article
            class="home-service-card home-service-card--featured"
            :class="{
              'home-service-card--image': Boolean(getHomeServiceImage(featuredCard)),
              'home-service-card--interactive-image': Boolean(getHomeServiceImage(featuredCard)),
              'home-service-card--featured-with-bg': Boolean(getHomeServiceImage(featuredCard))
            }"
            :style="getHomeServiceImageStyle(featuredCard)"
          >
            <div
              v-if="getHomeServiceImage(featuredCard)"
              aria-hidden="true"
              class="home-service-card__media"
            />
            <div class="home-service-card__content-stack home-service-card__content-stack--featured home-service-card__content-stack--image">
              <div class="home-service-card__chips">
                <span
                  v-for="tag in featuredCard.tags"
                  :key="tag"
                  class="home-service-card__chip"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="home-service-card__body home-service-card__body--feature">
                <h3 class="home-service-card__title home-service-card__title--featured">
                  {{ featuredCard.title }}
                </h3>
                <p class="max-w-2xl text-base leading-7 text-muted">
                  {{ featuredCard.summary }}
                </p>
              </div>
              <div class="mt-auto pt-4">
                <ButtonLink
                  :href="featuredCard.path"
                  class="home-service-card__image-cta-link"
                  label="Открыть услугу"
                  intent="secondary"
                  tracking-event="open_service_page"
                />
              </div>
            </div>
          </article>

          <div class="home-service-cluster__secondary">
            <article
              v-for="card in promotedCards"
              :key="card.slug"
              class="home-service-card home-service-card--promoted"
            >
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="home-service-card__chip"
                >
                  {{ tag }}
                </span>
              </div>
              <h3 class="home-service-card__title home-service-card__title--promoted">
                {{ card.title }}
              </h3>
              <p class="text-sm leading-6 text-muted">
                {{ card.summary }}
              </p>
              <div class="mt-auto pt-3">
                <ButtonLink
                  :href="card.path"
                  label="Открыть услугу"
                  intent="secondary"
                  tracking-event="open_service_page"
                  block
                />
              </div>
            </article>
          </div>
        </div>

        <div
          v-if="lowerFeaturedCard"
          class="home-service-cluster__supporting home-service-cluster__supporting--architected"
        >
          <a
            :href="lowerFeaturedCard.path"
            class="home-service-card home-service-card--link home-service-card--lower-feature"
            :class="{
              'home-service-card--image': Boolean(getHomeServiceImage(lowerFeaturedCard)),
              'home-service-card--interactive-image': Boolean(getHomeServiceImage(lowerFeaturedCard)),
              'home-service-card--lower-feature-with-bg': Boolean(getHomeServiceImage(lowerFeaturedCard))
            }"
            :style="getHomeServiceImageStyle(lowerFeaturedCard)"
          >
            <div
              v-if="getHomeServiceImage(lowerFeaturedCard)"
              aria-hidden="true"
              class="home-service-card__media"
            />
            <div class="home-service-card__content-stack home-service-card__content-stack--lower home-service-card__content-stack--image">
              <div class="home-service-card__chips">
                <span
                  v-for="tag in getVisibleTags(lowerFeaturedCard, 3)"
                  :key="tag"
                  class="home-service-card__chip"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="home-service-card__body home-service-card__body--feature">
                <h3 class="home-service-card__title home-service-card__title--featured">
                  {{ lowerFeaturedCard.title }}
                </h3>
                <p class="text-base leading-7 text-muted">
                  {{ lowerFeaturedCard.summary }}
                </p>
              </div>
              <div class="home-service-card__footer home-service-card__footer--feature">
                <span class="home-service-card__button">Открыть услугу</span>
                <span
                  v-if="getHiddenTagCount(lowerFeaturedCard, 3)"
                  class="home-service-card__meta"
                >
                  +{{ getHiddenTagCount(lowerFeaturedCard, 3) }}
                </span>
              </div>
            </div>
          </a>

          <div class="home-service-cluster__supporting-matrix">
            <a
              v-for="(card, index) in lowerSupportingCards"
              :key="card.slug"
              :href="card.path"
              :class="[
                'home-service-card home-service-card--link home-service-card--lower-supporting',
                isLowerServiceCard(card.slug)
                  ? 'home-service-card--supporting-service'
                  : 'home-service-card--supporting-product',
                getLowerSupportingCardSpanClass(card, index)
              ]"
            >
              <div class="home-service-card__chips">
                <span
                  v-for="tag in getVisibleTags(card, 2)"
                  :key="tag"
                  class="home-service-card__chip"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="getHiddenTagCount(card, 2)"
                  class="home-service-card__chip home-service-card__chip--more"
                >
                  +{{ getHiddenTagCount(card, 2) }}
                </span>
              </div>
              <div class="home-service-card__body">
                <h3 class="home-service-card__title home-service-card__title--compact">
                  {{ card.title }}
                </h3>
                <p class="home-service-card__summary home-service-card__summary--compact text-sm leading-6 text-muted">
                  {{ card.summary }}
                </p>
              </div>
              <div class="home-service-card__footer">
                <span class="home-service-card__cta">{{ getLowerCtaLabel(card.slug) }}</span>
                <span
                  aria-hidden="true"
                  class="home-service-card__chevron"
                >
                  →
                </span>
              </div>
            </a>
          </div>
        </div>
      </template>

      <div
        v-else
        class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <article
          v-for="(card, index) in cards"
          :key="card.slug"
          :class="
            isCity && index === 0
              ? 'page-card page-card--feature md:col-span-2 xl:col-span-2'
              : isInternal
                ? 'page-card h-full'
                : 'surface flex h-full flex-col gap-4 p-6'
          "
        >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in card.tags"
              :key="tag"
              :class="`${isInternal ? 'page-chip' : 'chip'} section-signage-label`"
            >
              {{ tag }}
            </span>
          </div>
          <h3 class="page-card__title">
            {{ card.title }}
          </h3>
          <p class="page-card__summary">
            {{ card.summary }}
          </p>
          <div class="mt-auto pt-2">
            <ButtonLink
              :href="card.path"
              label="Открыть услугу"
              intent="secondary"
              tracking-event="open_service_page"
              block
            />
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.home-service-card--featured,
.home-service-card--lower-feature {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.home-service-card--interactive-image {
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease;
  will-change: transform, box-shadow;
}

.home-service-card__content-stack {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  min-height: 100%;
  flex-direction: column;
  gap: 1rem;
  isolation: isolate;
}

.home-service-card__content-stack--featured {
  max-width: min(45%, 25.5rem);
}

.home-service-card__content-stack--lower {
  max-width: min(43%, 21.5rem);
}

.home-service-card--image {
  border-color: rgba(245, 239, 230, 0.14);
  background-color: rgb(19, 24, 29);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 20px 40px rgba(17, 22, 28, 0.18);
}

.home-service-card__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: var(--service-card-bg-image);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: var(--service-card-bg-position, 74% center);
  transform: scale(1);
  transform-origin: center;
  transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.home-service-card--image::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(19, 24, 29, 0.8) 0%,
      rgba(19, 24, 29, 0.56) 34%,
      rgba(19, 24, 29, 0.22) 68%,
      rgba(19, 24, 29, 0.04) 100%
    ),
    linear-gradient(
      to right,
      rgba(19, 24, 29, 0.72) 0%,
      rgba(19, 24, 29, 0.44) 38%,
      rgba(19, 24, 29, 0) 72%
    );
  opacity: 0.92;
  pointer-events: none;
  transition: opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-service-card--image::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 84% 18%, rgba(216, 95, 59, 0.12), rgba(216, 95, 59, 0) 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0) 16%),
    linear-gradient(132deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0.012) 24%, rgba(255, 255, 255, 0) 56%);
  opacity: 0.7;
  pointer-events: none;
  transition:
    opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-service-card__content-stack--image::before {
  content: "";
  position: absolute;
  inset: -1.4rem auto -1.65rem -1.5rem;
  z-index: -1;
  width: min(40rem, calc(100% + 2.4rem));
  background:
    radial-gradient(circle at 16% 22%, rgba(19, 24, 29, 0.66) 0%, rgba(19, 24, 29, 0.5) 34%, rgba(19, 24, 29, 0.28) 58%, rgba(19, 24, 29, 0.08) 76%, rgba(19, 24, 29, 0) 88%),
    linear-gradient(90deg, rgba(19, 24, 29, 0.62) 0%, rgba(19, 24, 29, 0.34) 56%, rgba(19, 24, 29, 0.08) 82%, rgba(19, 24, 29, 0) 100%);
  filter: blur(22px);
  opacity: 1;
  pointer-events: none;
  transition:
    opacity 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-service-card--image .home-service-card__title {
  color: rgba(245, 239, 230, 0.96);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
  transition:
    color 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-service-card--image .home-service-card__title--featured {
  line-height: 0.98;
  letter-spacing: -0.038em;
}

.home-service-card--image .text-muted,
.home-service-card--image .home-service-card__summary,
.home-service-card--image .home-service-card__summary--compact {
  color: rgba(245, 239, 230, 0.88);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  opacity: 0.9;
  transition:
    color 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-service-card--image .home-service-card__body--feature > .text-muted {
  max-width: 31ch;
}

.home-service-card--image .home-service-card__content-stack--lower .home-service-card__body--feature > .text-muted {
  max-width: 28ch;
}

.home-service-card--image .home-service-card__footer {
  border-top-color: rgba(245, 239, 230, 0.14);
}

.home-service-card--image .home-service-card__meta {
  color: rgba(245, 239, 230, 0.58);
}

.home-service-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.home-service-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.home-service-card__footer {
  transition:
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 240ms ease;
  will-change: transform;
}

.home-service-card__chips .home-service-card__chip:nth-child(1) {
  transition-delay: 0ms;
}

.home-service-card__chips .home-service-card__chip:nth-child(2) {
  transition-delay: 24ms;
}

.home-service-card__chips .home-service-card__chip:nth-child(3) {
  transition-delay: 48ms;
}

.home-service-card--image .home-service-card__image-cta-link,
.home-service-card--image .home-service-card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.8rem;
  padding: 0.72rem 1.15rem;
  border-radius: 999px;
  border: 1px solid rgba(245, 239, 230, 0.26);
  background:
    linear-gradient(180deg, rgba(251, 250, 247, 0.98), rgba(241, 236, 226, 0.9)),
    rgba(251, 250, 247, 0.9);
  color: rgb(19, 24, 29);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 12px 24px rgba(17, 22, 28, 0.18);
  text-decoration: none;
  transition:
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 240ms ease,
    background-color 240ms ease,
    color 240ms ease;
  will-change: transform;
}

.home-service-card--interactive-image:is(:hover, :focus-within) {
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 26px 52px rgba(17, 22, 28, 0.24);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__media {
  transform: scale(1.04);
}

.home-service-card--interactive-image:is(:hover, :focus-within)::before {
  opacity: 1;
}

.home-service-card--interactive-image:is(:hover, :focus-within)::after,
.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__content-stack--image::before {
  opacity: 0.94;
  transform: translateY(-2px);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__chips {
  transform: translateY(-2px);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__body {
  transform: translateY(-3px);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__footer {
  transform: translateY(-2px);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__title {
  color: rgba(255, 248, 242, 0.99);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .text-muted,
.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__summary,
.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__summary--compact {
  opacity: 0.98;
  color: rgba(245, 239, 230, 0.94);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__chip {
  transform: translateY(-2px);
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0) 44%),
    linear-gradient(180deg, rgba(255, 249, 232, 0.98), rgba(238, 219, 164, 0.94) 58%, rgba(214, 181, 93, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 10px 24px rgba(199, 170, 71, 0.2),
    0 16px 34px rgba(17, 22, 28, 0.12);
}

.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__image-cta-link,
.home-service-card--interactive-image:is(:hover, :focus-within) .home-service-card__button {
  border-color: rgba(216, 95, 59, 0.34);
  background:
    linear-gradient(180deg, rgba(253, 251, 246, 0.99), rgba(244, 236, 224, 0.94)),
    rgba(251, 250, 247, 0.94);
  color: rgb(216, 95, 59);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 16px 30px rgba(17, 22, 28, 0.22),
    0 0 0 1px rgba(216, 95, 59, 0.08);
  transform: translateY(-2px);
}

.home-service-card--image .home-service-card__image-cta-link {
  font-weight: 700;
}

.home-service-card--image.home-service-card--link:is(:hover, :focus-visible) .home-service-card__title {
  color: rgba(245, 239, 230, 0.96);
}

@media (max-width: 1279px) {
  .home-service-card__content-stack--featured {
    max-width: min(48%, 24rem);
  }

  .home-service-card__content-stack--lower {
    max-width: min(46%, 20.5rem);
  }
}

@media (max-width: 1023px) {
  .home-service-card__content-stack--featured,
  .home-service-card__content-stack--lower {
    max-width: 100%;
  }

  .home-service-card__media {
    background-position: center;
  }

  .home-service-card__content-stack--image::before {
    inset: -1rem -1rem -1.2rem -1rem;
    width: auto;
    filter: blur(18px);
  }
}

@media (max-width: 767px) {
  .home-service-card--image::before {
    background:
      linear-gradient(
        to top,
        rgba(19, 24, 29, 0.84) 0%,
        rgba(19, 24, 29, 0.62) 38%,
        rgba(19, 24, 29, 0.24) 74%,
        rgba(19, 24, 29, 0.04) 100%
      ),
      linear-gradient(
        to right,
        rgba(19, 24, 29, 0.62) 0%,
        rgba(19, 24, 29, 0.34) 42%,
        rgba(19, 24, 29, 0) 78%
      );
  }

  .home-service-card__content-stack--image::before {
    inset: -0.8rem -0.8rem -1rem -0.8rem;
    filter: blur(14px);
  }
}
</style>
