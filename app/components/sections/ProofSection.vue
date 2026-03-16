<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    bullets: string[];
    secondaryItems?: string[];
    secondaryTitle?: string;
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
const gridClass = computed(() =>
  props.variant === "home"
    ? "grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
    : isInternal.value
      ? "grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
      : "grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
);
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));

function bulletClass(index: number) {
  if (props.variant === "home") {
    return "home-proof-card text-sm leading-6 text-muted";
  }

  if (isInternal.value) {
    return `${index === 0 ? "page-card page-card--feature" : "page-card page-card--quiet"} text-sm leading-6 text-muted`;
  }

  return "surface p-6 text-sm leading-6 text-muted";
}
</script>

<template>
  <section :class="sectionClass">
    <Container>
      <div :class="gridClass">
        <SectionHeader
          eyebrow="Почему это работает"
          :title="title"
          :description="description"
          :variant="headerVariant"
        />
        <div :class="isInternal ? 'page-rail' : 'grid gap-4'">
          <article
            v-for="(bullet, index) in bullets"
            :key="bullet"
            :class="bulletClass(index)"
          >
            {{ bullet }}
          </article>
        </div>
      </div>
      <div
        v-if="secondaryItems?.length"
        :class="props.variant === 'home' ? 'mt-6' : 'mt-8'"
      >
        <p class="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
          {{ secondaryTitle || "Где это уместно" }}
        </p>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="item in secondaryItems"
            :key="item"
            :class="props.variant === 'home' ? 'home-proof-chip' : isInternal ? 'page-chip' : 'chip'"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </Container>
  </section>
</template>
