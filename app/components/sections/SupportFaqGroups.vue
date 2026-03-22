<script setup lang="ts">
import type { SupportFaqGroup } from "../../../shared/types/content";

const props = defineProps<{
  anchorId?: string;
  title: string;
  description: string;
  groups: SupportFaqGroup[];
}>();
</script>

<template>
  <div
    :id="props.anchorId"
    class="scroll-mt-32"
  >
    <Container>
      <SectionHeader
        eyebrow="FAQ"
        :title="props.title"
        :description="props.description"
        variant="support"
      />
    </Container>

    <div class="mt-8">
      <FaqSection
        v-for="group in props.groups"
        :key="group.id"
        :anchor-id="group.id"
        :title="group.title"
        :description="group.description"
        :items="group.items"
        variant="support"
      />
    </div>
  </div>
</template>
