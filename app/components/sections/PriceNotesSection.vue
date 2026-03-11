<script setup lang="ts">
import type { PriceNote } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  notes: PriceNote[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Цена и расчёт"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article
          v-for="note in notes"
          :key="note.title"
          class="surface p-6"
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
