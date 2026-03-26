<script setup lang="ts">
import type { BreadcrumbItem, SupportPageData } from "../../../shared/types/content";
import { getSupportPageCopy } from "../../utils/support-copy";

const props = defineProps<{
  page: SupportPageData;
  breadcrumbs: BreadcrumbItem[];
}>();

const copy = computed(() => getSupportPageCopy(props.page.supportIntent));

const tocItems = computed(() => [
  {
    label: copy.value.quickFactsTitle,
    href: "#quick-facts"
  },
  ...props.page.sections.map((section) => ({
    label: section.title,
    href: `#${section.id}`
  })),
  {
    label: copy.value.faqTitle,
    href: "#faq-hub"
  },
  ...props.page.faqGroups.map((group) => ({
    label: group.title,
    href: `#${group.id}`
  }))
]);
</script>

<template>
  <div>
    <SupportHero
      :page="props.page"
      :breadcrumbs="props.breadcrumbs"
    />

    <SupportQuickFacts
      anchor-id="quick-facts"
      :title="copy.quickFactsTitle"
      :description="copy.quickFactsDescription"
      :facts="props.page.quickFacts"
    />

    <SupportTOC
      anchor-id="support-toc"
      :title="copy.tocTitle"
      :description="copy.tocDescription"
      :items="tocItems"
    />

    <SupportSections :sections="props.page.sections" />

    <SupportFaqGroups
      anchor-id="faq-hub"
      :title="copy.faqTitle"
      :description="copy.faqDescription"
      :groups="props.page.faqGroups"
      :related-links="props.page.relatedLinks"
      :answer-cta="{ label: props.page.cta.label, href: props.page.cta.href }"
    />

    <SupportRelatedLinks
      :title="copy.relatedLinksTitle"
      :description="copy.relatedLinksDescription"
      :links="props.page.relatedLinks"
    />

    <SupportCTA
      :title="copy.ctaTitle"
      :description="copy.ctaDescription"
      :cta="props.page.cta"
      :secondary-cta="props.page.secondaryCta"
    />
  </div>
</template>
