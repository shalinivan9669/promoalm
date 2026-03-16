<script setup lang="ts">
import type { CTAConfig } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description: string;
    cta: CTAConfig;
    variant?: "default" | "home";
  }>(),
  {
    variant: "default"
  }
);
</script>

<template>
  <section :class="props.variant === 'home' ? 'home-final-cta section-divider' : 'section-divider section-space'">
    <Container>
      <div :class="props.variant === 'home' ? 'home-final-cta__frame' : 'surface p-8 sm:p-10 lg:p-12'">
        <div :class="props.variant === 'home' ? 'home-final-cta__grid' : 'grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end'">
          <div>
            <p class="eyebrow">{{ eyebrow || "Следующий шаг" }}</p>
            <h2 :class="props.variant === 'home' ? 'home-final-cta__title' : 'mt-4 text-3xl font-semibold text-white sm:text-4xl'">
              {{ title }}
            </h2>
            <p :class="props.variant === 'home' ? 'home-final-cta__description' : 'mt-4 max-w-3xl text-base leading-7 text-muted'">
              {{ description }}
            </p>
          </div>
          <div :class="props.variant === 'home' ? 'home-final-cta__action' : 'flex flex-col gap-3'">
            <p
              v-if="cta.note"
              :class="props.variant === 'home' ? 'home-final-cta__note' : 'mt-4 text-sm text-muted'"
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
