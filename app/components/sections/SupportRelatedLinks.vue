<script setup lang="ts">
import type { RelatedLink } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  links: RelatedLink[];
}>();
</script>

<template>
  <RelatedLinksSection
    :title="title"
    :description="description"
    :links="links"
    variant="support"
  />
</template>
