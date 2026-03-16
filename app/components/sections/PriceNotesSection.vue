<script setup lang="ts">
import type { PriceNote } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    notes: PriceNote[];
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
      <SectionHeader
        eyebrow="Цена и расчёт"
        :title="title"
        :description="description"
      />
      <div
        :class="
          props.variant === 'home'
            ? 'mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]'
            : 'mt-8 grid gap-4 md:grid-cols-2'
        "
      >
        <article
          v-for="note in notes"
          :key="note.title"
          :class="props.variant === 'home' ? 'home-price-card' : 'surface p-6'"
        >
          <h3 class="text-lg font-semibold text-white">
            {{ note.title }}
          </h3>
          <p class="mt-3 text-sm leading-6 text-muted">
            {{ note.text }}
          </p>
          <p
            v-if="note.emphasis"
            class="mt-4 text-sm font-medium text-accent"
          >
            {{ note.emphasis }}
          </p>
        </article>
      </div>
    </Container>
  </section>
</template>
