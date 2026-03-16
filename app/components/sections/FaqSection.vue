<script setup lang="ts">
import type { FAQItem } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    items: FAQItem[];
    variant?: "default" | "home";
  }>(),
  {
    variant: "default"
  }
);
</script>

<template>
  <section :class="props.variant === 'home' ? 'home-faq section-divider' : 'section-divider section-space'">
    <Container>
      <SectionHeader
        eyebrow="FAQ"
        :title="title"
        :description="description"
      />
      <div :class="props.variant === 'home' ? 'home-faq__list' : 'mt-8 grid gap-4'">
        <details
          v-for="item in items"
          :key="item.id"
          :class="props.variant === 'home' ? 'home-faq__item group' : 'surface group p-6'"
        >
          <summary :class="props.variant === 'home' ? 'home-faq__summary' : 'cursor-pointer list-none text-base font-semibold text-white'">
            <span>{{ item.question }}</span>
            <span
              v-if="props.variant === 'home'"
              aria-hidden="true"
              class="home-faq__indicator"
            >
              <span class="home-faq__indicator-line home-faq__indicator-line--horizontal" />
              <span class="home-faq__indicator-line home-faq__indicator-line--vertical" />
            </span>
          </summary>
          <p :class="props.variant === 'home' ? 'home-faq__answer' : 'mt-4 text-sm leading-6 text-muted'">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </Container>
  </section>
</template>
