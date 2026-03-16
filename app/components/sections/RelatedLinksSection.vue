<script setup lang="ts">
import type { RelatedLink } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    links: RelatedLink[];
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default");
const headerVariant = computed(() => (props.variant === "support" ? "support" : isInternal.value ? "page" : "default"));

function cardClass(index: number) {
  if (!isInternal.value) {
    return "surface flex h-full flex-col gap-4 p-6";
  }

  return `${index === 0 && props.variant !== "support" ? "page-card page-card--feature" : "page-card"} h-full`;
}
</script>

<template>
  <section :class="props.variant === 'default' ? 'section-divider section-space' : `section-divider section-space page-section page-section--${props.variant}`">
    <Container>
      <SectionHeader
        eyebrow="Связанные разделы"
        :title="props.title"
        :description="props.description"
        :variant="headerVariant"
      />
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article
          v-for="(link, index) in props.links"
          :key="link.href"
          :class="cardClass(index)"
        >
          <h3 class="text-lg font-semibold text-white">
            {{ link.label }}
          </h3>
          <p class="text-sm leading-6 text-muted">
            {{ link.description }}
          </p>
          <div class="mt-auto">
            <ButtonLink
              :href="link.href"
              label="Открыть"
              intent="secondary"
              block
            />
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>
