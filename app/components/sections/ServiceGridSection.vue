<script setup lang="ts">
import type { ServiceCard } from "../../../shared/types/content";

const FEATURED_SLUG = "fasadnye-vyveski";
const PROMOTED_SLUGS = ["svetovye-koroba", "vyveski-dlya-seti"];
const LOWER_FEATURED_SLUG = "vyveski-pod-klyuch";
const LOWER_SUPPORTING_ORDER = [
  "obemnye-bukvy",
  "kryshnye-ustanovki",
  "interernye-vyveski-dlya-biznesa",
  "montazh-vyvesok"
] as const;
const LOWER_WIDE_SLUGS = ["obemnye-bukvy", "interernye-vyveski-dlya-biznesa"] as const;
const LOWER_SERVICE_SLUGS = ["interernye-vyveski-dlya-biznesa", "montazh-vyvesok"] as const;

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    cards: ServiceCard[];
    variant?: "default" | "home" | "city" | "service" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
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
        :variant="headerVariant"
      />

      <template v-if="props.variant === 'home' && featuredCard">
        <div class="home-service-cluster__layout">
          <article class="home-service-card home-service-card--featured">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in featuredCard.tags"
                :key="tag"
                class="chip"
              >
                {{ tag }}
              </span>
            </div>
            <h3 class="text-2xl font-semibold text-white sm:text-[2rem]">
              {{ featuredCard.title }}
            </h3>
            <p class="max-w-2xl text-base leading-7 text-muted">
              {{ featuredCard.summary }}
            </p>
            <div class="mt-auto pt-4">
              <ButtonLink
                :href="featuredCard.path"
                label="Открыть услугу"
                intent="secondary"
                tracking-event="open_service_page"
              />
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
                  class="chip"
                >
                  {{ tag }}
                </span>
              </div>
              <h3 class="text-xl font-semibold text-white">
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
          >
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
              <h3 class="home-service-card__title text-2xl font-semibold text-white sm:text-[2rem]">
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
          </a>

          <div class="home-service-cluster__supporting-matrix">
            <a
              v-for="card in lowerSupportingCards"
              :key="card.slug"
              :href="card.path"
              :class="
                isLowerServiceCard(card.slug)
                  ? `home-service-card home-service-card--link home-service-card--lower-supporting home-service-card--supporting-service ${isLowerWideCard(card.slug) ? 'home-service-card--span-wide' : 'home-service-card--span-narrow'}`
                  : `home-service-card home-service-card--link home-service-card--lower-supporting home-service-card--supporting-product ${isLowerWideCard(card.slug) ? 'home-service-card--span-wide' : 'home-service-card--span-narrow'}`
              "
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
                <h3 class="home-service-card__title text-lg font-semibold text-white sm:text-[1.15rem]">
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
              :class="isInternal ? 'page-chip' : 'chip'"
            >
              {{ tag }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-white">
            {{ card.title }}
          </h3>
          <p class="text-sm leading-6 text-muted">
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
