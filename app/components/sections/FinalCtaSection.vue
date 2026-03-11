<script setup lang="ts">
import type { CTAConfig } from "../../../shared/types/content";

defineProps<{
  eyebrow?: string;
  title: string;
  description: string;
  cta: CTAConfig;
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <div class="surface p-8 sm:p-10 lg:p-12">
        <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="eyebrow">{{ eyebrow || "Следующий шаг" }}</p>
            <h2 class="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {{ title }}
            </h2>
            <p class="mt-4 max-w-3xl text-base leading-7 text-muted">
              {{ description }}
            </p>
            <p
              v-if="cta.note"
              class="mt-4 text-sm text-muted"
            >
              {{ cta.note }}
            </p>
          </div>
          <div class="flex flex-col gap-3">
            <ButtonLink
              :href="cta.href"
              :label="cta.label"
              :intent="cta.intent"
              :tracking-event="cta.trackingEvent"
              block
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
