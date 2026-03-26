<script setup lang="ts">
import type { CTAConfig, RelatedLink, SupportFaqGroup } from "../../../shared/types/content";

const props = defineProps<{
  anchorId?: string;
  title: string;
  description: string;
  groups: SupportFaqGroup[];
  relatedLinks?: RelatedLink[];
  answerCta?: Pick<CTAConfig, "label" | "href">;
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
        :related-links="props.relatedLinks"
        :answer-cta="props.answerCta"
        variant="support"
      />
    </div>
  </div>
</template>
