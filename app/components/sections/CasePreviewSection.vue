<script setup lang="ts">
import type { CaseStudy } from "../../../shared/types/content";

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
  "obemnye-bukvy": "Кейс: объёмные буквы",
  "vyveski-pod-klyuch": "Кейс под ключ",
  "vyveski-dlya-seti": "Сетевой кейс",
  "montazh-vyvesok": "Монтажный кейс"
};

function cardClass(index: number) {
  const layoutClass = isInternal.value && index === 0 ? "lg:col-span-2" : "";
  const rowClass = props.variant === "cases" && index === 0 ? "lg:row-span-2" : "";

  return [
    "case-preview-card",
    index === 0 ? "case-preview-card--featured" : "",
    layoutClass,
    rowClass
  ].join(" ");
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

function homeCaseDockClass() {
  return ["home-case-card__dock"].join(" ");
}

function getCaseCategoryLabel(item: CaseStudy) {
  for (const slug of item.relatedServiceSlugs) {
    const label = CASE_CATEGORY_LABELS[slug];

    if (label) {
      return label;
    }
  }

  return item.proofMode === "real" ? "Реальный кейс" : "Категориальный кейс";
}
</script>

<template>
  <section :class="sectionClass">
    <Container>
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
        <a
          v-for="(item, index) in cases"
          :id="item.slug"
          :key="item.id"
          :href="`/cases/#${item.slug}`"
          :class="homeCasePanelClass(index)"
        >
          <div
            :class="homeCaseVisualClass(index)"
            aria-hidden="true"
          >
          
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

              <span class="home-case-card__cta">
                <span>Открыть на странице кейсов</span>
                <span
                  aria-hidden="true"
                  class="home-case-card__chevron"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </a>
      </div>

      <div
        v-else
        class="mt-8 grid gap-5 lg:grid-cols-3"
      >
        <article
          v-for="(item, index) in cases"
          :id="item.slug"
          :key="item.id"
          :class="cardClass(index)"
        >
          <div class="case-preview-card__meta-rail">
            <span class="section-signage-label">{{ getCaseCategoryLabel(item) }}</span>
            <span class="section-signage-label section-signage-label--ghost">{{ item.cityLabel }}</span>
          </div>
          <div
            class="case-preview-card__visual"
            aria-hidden="true"
          />
          <div class="case-preview-card__narrative">
            <h3 class="case-preview-card__title">{{ item.title }}</h3>
            <p class="case-preview-card__summary">{{ item.summary }}</p>
          </div>
          <div class="case-preview-card__operations">
            <div class="case-preview-card__operation">
              <p class="case-preview-card__label">Задача</p>
              <p class="case-preview-card__text">{{ item.challenge }}</p>
            </div>
            <div class="case-preview-card__operation">
              <p class="case-preview-card__label">Решение</p>
              <p class="case-preview-card__text">{{ item.solution }}</p>
            </div>
          </div>
          <ButtonLink
            :href="`/cases/#${item.slug}`"
            label="Открыть на странице кейсов"
            intent="secondary"
            tracking-event="open_case"
            block
          />
        </article>
      </div>
    </Container>
  </section>
</template>
