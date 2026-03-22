<script setup lang="ts">
import type { CitySlug } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    anchorId?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    items: Array<{
      label: string;
      value: string;
      note?: string;
      description?: string;
    }>;
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
    citySlug?: CitySlug;
  }>(),
  {
    variant: "default"
  }
);

const sectionClass = computed(() =>
  props.variant === "default"
    ? "section-divider section-space trust-strip"
    : `section-divider section-space page-section page-section--${props.variant} trust-strip trust-strip--${props.variant}`
);

const headerVariant = computed(() => (props.variant === "support" ? "support" : props.variant === "default" ? "default" : "page"));
const isCityVariant = computed(() => props.variant === "city");
const cityVariantClass = computed(() =>
  isCityVariant.value && props.citySlug ? `trust-strip--city-${props.citySlug}` : ""
);

function cardClass(index: number) {
  if (!isCityVariant.value) {
    return "";
  }

  if (index === 0) {
    return "trust-strip__city-card trust-strip__city-card--lead";
  }

  if (index === 1) {
    return "trust-strip__city-card trust-strip__city-card--mid";
  }

  return "trust-strip__city-card trust-strip__city-card--tail";
}
</script>

<template>
  <section
    :id="props.anchorId"
    :class="[sectionClass, cityVariantClass]"
  >
    <Container :class="isCityVariant ? 'site-shell--wide' : ''">
      <SectionHeader
        v-if="props.title"
        :eyebrow="props.eyebrow"
        :title="props.title"
        :description="props.description"
        :variant="headerVariant"
      />

      <div
        v-if="isCityVariant"
        class="trust-strip__city-grid mt-8"
      >
        <InfoCard
          v-for="(item, index) in props.items"
          :key="item.label"
          :class="cardClass(index)"
          :title="item.label"
          :value="item.value"
          :description="item.description || item.note || ''"
          :variant="props.variant"
        />
      </div>

      <div
        v-else
        class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <InfoCard
          v-for="item in props.items"
          :key="item.label"
          :title="item.label"
          :value="item.value"
          :description="item.description || item.note || ''"
          :variant="props.variant"
        />
      </div>
    </Container>
  </section>
</template>
