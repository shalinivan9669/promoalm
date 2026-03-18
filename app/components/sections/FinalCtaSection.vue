<script setup lang="ts">
import type { CTAConfig } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description: string;
    cta: CTAConfig;
    variant?: "default" | "home" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const isInternal = computed(() => props.variant !== "default" && props.variant !== "home");
</script>

<template>
  <section :class="props.variant === 'home' ? 'home-final-cta section-divider' : isInternal ? `section-divider section-space page-section page-section--${props.variant}` : 'section-divider section-space'">
    <Container>
      <div :class="props.variant === 'home' ? 'home-final-cta__frame' : isInternal ? 'page-terminal-cta' : 'surface p-8 sm:p-10 lg:p-12'">
        <div :class="props.variant === 'home' ? 'home-final-cta__grid' : isInternal ? 'page-terminal-cta__grid' : 'grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end'">
          <div>
            <p class="eyebrow">{{ eyebrow || "Следующий шаг" }}</p>
            <h2 :class="props.variant === 'home' ? 'home-final-cta__title' : isInternal ? 'page-terminal-cta__title' : 'section-header__title'">
              {{ title }}
            </h2>
            <p :class="props.variant === 'home' ? 'home-final-cta__description' : isInternal ? 'page-terminal-cta__description' : 'section-header__description'">
              {{ description }}
            </p>
          </div>
          <div :class="props.variant === 'home' ? 'home-final-cta__action' : isInternal ? 'page-terminal-cta__action' : 'flex flex-col gap-3'">
            <p
              v-if="cta.note"
              :class="props.variant === 'home' ? 'home-final-cta__note' : 'text-sm text-muted'"
            >
              {{ cta.note }}
            </p>
            <ButtonLink
              :href="cta.href"
              :label="cta.label"
              :intent="cta.intent"
              :tracking-event="cta.trackingEvent"
              :block="props.variant !== 'home'"
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
