<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  bullets: string[];
  secondaryItems?: string[];
  secondaryTitle?: string;
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          eyebrow="Почему это работает"
          :title="title"
          :description="description"
        />
        <div class="grid gap-4">
          <article
            v-for="bullet in bullets"
            :key="bullet"
            class="surface p-6 text-sm leading-6 text-muted"
          >
            {{ bullet }}
          </article>
        </div>
      </div>
      <div
        v-if="secondaryItems?.length"
        class="mt-8"
      >
        <p class="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
          {{ secondaryTitle || "Где это уместно" }}
        </p>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="item in secondaryItems"
            :key="item"
            class="chip"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </Container>
  </section>
</template>
