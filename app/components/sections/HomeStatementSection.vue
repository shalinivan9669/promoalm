<script setup lang="ts">
import type { NavItem, TrustStat } from "../../../shared/types/content";

withDefaults(
  defineProps<{
    statement: string;
    note?: string;
    quickLinks: NavItem[];
    cityNavigation: NavItem[];
    trustItems: TrustStat[];
    industries: string[];
    eyebrow?: string;
  }>(),
  {
    eyebrow: "Вывески для бизнеса"
  }
);
</script>

<template>
  <section class="home-statement section-divider">
    <div
      v-if="quickLinks.length"
      class="home-statement__quick-links-wrap"
    >
      <nav
        aria-label="Быстрые входы"
        class="home-statement__quick-links"
      >
        <a
          v-for="item in quickLinks"
          :key="item.href + item.label"
          :href="item.href"
          class="home-statement__quick-link"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>

    <Container>
      <div class="home-statement__frame">
        <div class="home-statement__grid">
          <div class="home-statement__lead">
            <p class="eyebrow">{{ eyebrow }}</p>
            <h2 class="home-statement__title">
              {{ statement }}
            </h2>
          </div>
        </div>

        <div
          v-if="note || cityNavigation.length"
          class="home-statement__aside-band"
        >
          <article
            v-if="note"
            class="home-statement__aside home-statement__aside--brief"
          >
            <p class="home-statement__label">Подходит, когда нужно</p>
            <p class="mt-3 text-sm leading-7 text-muted sm:text-base">
              Оформить фасад, собрать заметную вывеску для точки, обновить объект или подготовить тираж для нескольких адресов.
            </p>
            <p class="mt-3 text-sm leading-7 text-muted/95 sm:text-base">
              {{ note }}
            </p>
          </article>

          <article class="home-statement__aside home-statement__aside--cities">
            <p class="home-statement__label">Города обслуживания</p>
            <nav
              aria-label="Города обслуживания"
              class="mt-4 flex flex-wrap gap-3"
            >
              <a
                v-for="item in cityNavigation"
                :key="item.href"
                :href="item.href"
                class="home-statement__city-link"
              >
                {{ item.label }}
              </a>
            </nav>
          </article>
        </div>

        <div class="home-statement__rail">
          <div class="home-statement__stats">
            <article
              v-for="item in trustItems"
              :key="item.label"
              class="home-statement__stat"
            >
              <p class="home-statement__stat-value">
                {{ item.value }}
              </p>
              <h3 class="mt-3 text-base font-semibold text-ink">
                {{ item.label }}
              </h3>
              <p
                v-if="item.note"
                class="mt-2 text-sm leading-6 text-muted"
              >
                {{ item.note }}
              </p>
            </article>
          </div>

          <div class="home-statement__industries">
            <p class="home-statement__label">Кому особенно полезно</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <span
                v-for="item in industries"
                :key="item"
                class="home-statement__industry-chip"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
