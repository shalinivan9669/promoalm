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

function cardClass(index: number) {
  if (props.variant === "home") {
    return "home-case-card";
  }

  if (isInternal.value) {
    const featured = index === 0 ? "page-card page-card--feature lg:col-span-2" : "page-card";
    return props.variant === "cases" && index === 0 ? `${featured} lg:row-span-2` : featured;
  }

  return "surface flex h-full flex-col gap-4 p-6";
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
  const themeClass = index === 0 ? "home-case-card__visual--rollout" : index === 1 ? "home-case-card__visual--lightbox" : "home-case-card__visual--roof";

  return ["home-case-card__visual", themeClass].join(" ");
}

function homeCaseDockClass() {
  return ["home-case-card__dock"].join(" ");
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
            <span class="home-case-card__visual-vignette"></span>
            <span class="home-case-card__visual-grid"></span>
            <span class="home-case-card__visual-frame"></span>
            <span class="home-case-card__visual-object home-case-card__visual-object--primary"></span>
            <span class="home-case-card__visual-object home-case-card__visual-object--secondary"></span>
            <span class="home-case-card__visual-line"></span>
          </div>

          <div :class="homeCaseDockClass()">
            <div class="home-case-card__meta-rail">
              <span class="home-case-card__meta-chip">{{ item.proofMode === "scenario" ? "Типовой сценарий" : "Кейс" }}</span>
              <span class="home-case-card__city">{{ item.cityLabel }}</span>
            </div>

            <div class="home-case-card__panel-grid">
              <div class="home-case-card__narrative">
                <h3 class="home-case-card__title text-2xl font-semibold text-white">
                  {{ item.title }}
                </h3>
                <p class="home-case-card__summary text-sm leading-7 text-muted sm:text-[15px]">
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
                  class="home-case-card__metric"
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
          <div class="flex items-center justify-between gap-3">
            <span class="chip">{{ item.proofMode === "scenario" ? "Типовой сценарий" : "Кейс" }}</span>
            <span class="text-xs text-muted">{{ item.cityLabel }}</span>
          </div>
          <h3 class="text-xl font-semibold text-white">{{ item.title }}</h3>
          <p class="text-sm leading-6 text-muted">{{ item.summary }}</p>
          <div class="rounded-3xl border border-line bg-canvas-soft p-4 text-sm leading-6 text-muted">
            <p class="font-semibold text-white">Задача</p>
            <p class="mt-2">{{ item.challenge }}</p>
          </div>
          <div class="rounded-3xl border border-line bg-canvas-soft p-4 text-sm leading-6 text-muted">
            <p class="font-semibold text-white">Решение</p>
            <p class="mt-2">{{ item.solution }}</p>
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
