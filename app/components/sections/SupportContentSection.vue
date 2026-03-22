<script setup lang="ts">
import type { SupportBodySection } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    sections: SupportBodySection[];
    highlights?: string[];
    variant?: "default" | "support" | "contact";
  }>(),
  {
    variant: "default",
    highlights: () => []
  }
);

const isInternal = computed(() => props.variant !== "default");
</script>

<template>
  <section :class="props.variant === 'default' ? 'section-divider section-space' : `section-divider section-space page-section page-section--${props.variant}`">
    <Container>
      <SectionHeader
        eyebrow="Содержание"
        :title="props.title"
        :description="props.description"
        :variant="props.variant === 'support' ? 'support' : 'page'"
      />
      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        <article
          v-for="(section, index) in props.sections"
          :key="section.title"
          :class="isInternal && index === 0 ? 'page-card page-card--feature lg:col-span-2' : isInternal ? 'page-card page-card--quiet' : 'surface p-6'"
        >
          <h3 class="text-lg font-semibold text-ink">
            {{ section.title }}
          </h3>
          <p class="mt-3 text-sm leading-6 text-muted">
            {{ section.body }}
          </p>
          <ul
            v-if="section.bullets?.length"
            class="mt-4 space-y-2 text-sm text-muted"
          >
            <li
              v-for="bullet in section.bullets"
              :key="bullet"
              class="rounded-2xl border border-line bg-canvas-soft px-3 py-2"
            >
              {{ bullet }}
            </li>
          </ul>
        </article>
      </div>

      <div
        v-if="props.highlights?.length"
        class="mt-8 flex flex-wrap gap-3"
      >
        <span
          v-for="highlight in props.highlights"
          :key="highlight"
          :class="`${isInternal ? 'page-chip' : 'chip'} section-signage-label`"
        >
          {{ highlight }}
        </span>
      </div>
    </Container>
  </section>
</template>
