<script setup lang="ts">
import type { TrustItem } from "../../../shared/types/content";

defineProps<{
  anchorId?: string;
  title: string;
  description: string;
  facts: TrustItem[];
}>();
</script>

<template>
  <TrustStrip
    :anchor-id="anchorId"
    :title="title"
    :description="description"
    :items="facts"
    variant="support"
  />
</template>
