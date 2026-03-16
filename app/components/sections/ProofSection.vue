<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    bullets: string[];
    secondaryItems?: string[];
    secondaryTitle?: string;
    variant?: "default" | "home";
  }>(),
  {
    variant: "default"
  }
);
</script>

<template>
  <section :class="props.variant === 'home' ? 'home-band-section' : 'section-divider section-space'">
    <Container>
      <div
        :class="
          props.variant === 'home'
            ? 'grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start'
            : 'grid gap-8 lg:grid-cols-[0.9fr_1.1fr]'
        "
      >
        <SectionHeader
          eyebrow="Почему это работает"
          :title="title"
          :description="description"
        />
        <div class="grid gap-4">
          <article
            v-for="bullet in bullets"
            :key="bullet"
            :class="
              props.variant === 'home'
                ? 'home-proof-card text-sm leading-6 text-muted'
                : 'surface p-6 text-sm leading-6 text-muted'
            "
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
            :class="props.variant === 'home' ? 'home-proof-chip' : 'chip'"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </Container>
  </section>
</template>
