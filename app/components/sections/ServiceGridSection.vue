<script setup lang="ts">
import type { ServiceCard } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  cards: ServiceCard[];
}>();
</script>

<template>
  <section
    id="services"
    class="section-divider section-space scroll-mt-32"
  >
    <Container>
      <SectionHeader
        eyebrow="Услуги"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in cards"
          :key="card.slug"
          class="surface flex h-full flex-col gap-4 p-6"
        >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="chip"
            >
              {{ tag }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-white">
            {{ card.title }}
          </h3>
          <p class="text-sm leading-6 text-muted">
            {{ card.summary }}
          </p>
          <div class="mt-auto pt-2">
            <ButtonLink
              :href="card.path"
              label="Открыть услугу"
              intent="secondary"
              tracking-event="open_service_page"
              block
            />
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>
