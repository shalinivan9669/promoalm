<script setup lang="ts">
import type { BreadcrumbItem, SupportPageData } from "../../../shared/types/content";

const props = defineProps<{
  page: SupportPageData;
  breadcrumbs: BreadcrumbItem[];
}>();

const hero = computed(() => ({
  ...props.page.hero,
  note: props.page.intro
}));

const badges = computed(() => {
  const items = [
    `База: ${props.page.primaryCity}`,
    `Зона: ${props.page.areaServed}`
  ];

  if (props.page.supportIntent === "privacy") {
    items.push("Обработка данных и формы");
    return items;
  }

  if (props.page.supportsMultiLocation) {
    items.push("Сети и несколько точек");
  }

  if (props.page.supportsUrgent) {
    items.push("Срочность по согласованию");
  }

  return items;
});
</script>

<template>
  <div>
    <Container>
      <div class="pt-4 sm:pt-6">
        <Breadcrumbs
          :items="props.breadcrumbs"
          compact
        />
        <div class="mt-4 flex flex-wrap gap-3">
          <span
            v-for="badge in badges"
            :key="badge"
            class="page-chip"
          >
            {{ badge }}
          </span>
        </div>
      </div>
    </Container>

    <HeroSection
      :hero="hero"
      variant="support"
    />
  </div>
</template>
