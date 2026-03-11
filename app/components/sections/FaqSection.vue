<script setup lang="ts">
import type { FAQItem } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  items: FAQItem[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="FAQ"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4">
        <details
          v-for="item in items"
          :key="item.id"
          class="surface group p-6"
        >
          <summary class="cursor-pointer list-none text-base font-semibold text-white">
            {{ item.question }}
          </summary>
          <p class="mt-4 text-sm leading-6 text-muted">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </Container>
  </section>
</template>
