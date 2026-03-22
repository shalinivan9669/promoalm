<script setup lang="ts">
import type { FAQItem } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    anchorId?: string;
    title: string;
    description: string;
    items: FAQItem[];
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default" && props.variant !== "home");
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));
</script>

<template>
  <section
    :id="props.anchorId"
    :class="props.variant === 'home' ? 'home-faq section-divider' : isInternal ? `section-divider section-space page-section page-section--${props.variant}` : 'section-divider section-space'"
  >
    <Container>
      <SectionHeader
        eyebrow="FAQ"
        :title="title"
        :description="description"
        :variant="headerVariant"
      />
      <div :class="props.variant === 'home' ? 'home-faq__list' : isInternal ? 'page-faq__list' : 'mt-8 grid gap-4'">
        <details
          v-for="item in items"
          :key="item.id"
          :class="props.variant === 'home' ? 'home-faq__item group' : isInternal ? 'page-faq__item group' : 'surface group p-6'"
        >
          <summary :class="props.variant === 'home' ? 'home-faq__summary' : isInternal ? 'page-faq__summary' : 'cursor-pointer list-none text-base font-semibold text-ink'">
            <span>{{ item.question }}</span>
            <span
              v-if="props.variant === 'home' || isInternal"
              aria-hidden="true"
              :class="props.variant === 'home' ? 'home-faq__indicator' : 'page-faq__indicator'"
            >
              <span :class="props.variant === 'home' ? 'home-faq__indicator-line home-faq__indicator-line--horizontal' : 'page-faq__indicator-line page-faq__indicator-line--horizontal'" />
              <span :class="props.variant === 'home' ? 'home-faq__indicator-line home-faq__indicator-line--vertical' : 'page-faq__indicator-line page-faq__indicator-line--vertical'" />
            </span>
          </summary>
          <p :class="props.variant === 'home' ? 'home-faq__answer' : isInternal ? 'page-faq__answer' : 'mt-4 text-sm leading-6 text-muted'">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </Container>
  </section>
</template>
