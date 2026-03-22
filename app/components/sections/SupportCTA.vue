<script setup lang="ts">
import type { CTAConfig } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  cta: CTAConfig;
  secondaryCta?: CTAConfig;
}>();
</script>

<template>
  <FinalCtaSection
    :title="title"
    :description="description"
    :cta="cta"
    :secondary-cta="secondaryCta"
    variant="support"
  />
</template>
