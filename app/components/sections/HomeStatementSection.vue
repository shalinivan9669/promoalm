<script setup lang="ts">
import type { NavItem, TrustStat } from "../../../shared/types/content";

withDefaults(
  defineProps<{
    statement: string;
    note?: string;
    cityNavigation: NavItem[];
    trustItems: TrustStat[];
    industries: string[];
    eyebrow?: string;
  }>(),
  {
    eyebrow: "Видимость, масштаб и контроль"
  }
);
</script>

<template>
  <section class="home-statement section-divider">
    <Container>
      <div class="home-statement__frame">
        <div class="home-statement__grid">
          <div>
            <p class="eyebrow">{{ eyebrow }}</p>
            <h2 class="home-statement__title">
              {{ statement }}
            </h2>
          </div>

          <div class="space-y-5">
            <article
              v-if="note"
              class="home-statement__aside"
            >
              <p class="home-statement__label">Коммерческий контекст</p>
              <p class="mt-3 text-sm leading-7 text-muted sm:text-base">
                {{ note }}
              </p>
            </article>

            <article class="home-statement__aside">
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
              <h3 class="mt-3 text-base font-semibold text-white">
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
