<script setup lang="ts">
import type { ServiceCard } from "../../../shared/types/content";

const FEATURED_SLUG = "fasadnye-vyveski";
const PROMOTED_SLUGS = ["svetovye-koroba", "vyveski-dlya-seti"];

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    cards: ServiceCard[];
    variant?: "default" | "home";
  }>(),
  {
    variant: "default"
  }
);

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
</script>

<template>
  <section
    id="services"
    :class="
      props.variant === 'home'
        ? 'home-service-cluster section-divider scroll-mt-32'
        : 'section-divider section-space scroll-mt-32'
    "
  >
    <Container>
      <SectionHeader
        eyebrow="Услуги"
        :title="title"
        :description="description"
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

        <div class="home-service-cluster__supporting">
          <article
            v-for="card in supportingCards"
            :key="card.slug"
            class="home-service-card home-service-card--supporting"
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
            <h3 class="text-lg font-semibold text-white">
              {{ card.title }}
            </h3>
            <p class="text-sm leading-6 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] overflow-hidden">
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
      </template>

      <div
        v-else
        class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <article
          v-for="card in cards"
          :key="card.slug"
          class="surface flex h-full flex-col gap-4 p-6"
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
