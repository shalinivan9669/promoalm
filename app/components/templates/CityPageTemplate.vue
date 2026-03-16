<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, CityPageData, ServiceCard } from "../../../shared/types/content";

defineProps<{
  page: CityPageData;
  breadcrumbs: BreadcrumbItem[];
  caseStudies: CaseStudy[];
  relatedServiceCards: ServiceCard[];
}>();
</script>

<template>
  <div>
    <HeroSection
      :hero="page.hero"
      variant="city"
    />

    <PageLeadSection
      :breadcrumbs="breadcrumbs"
      :intro="page.intro"
      :chips="page.serviceHighlights"
      :stats="page.trustItems.slice(0, 2)"
      variant="city"
    />

    <ProofSection
      title="Что важно по этому городу"
      :description="page.localAngle"
      :bullets="[page.logisticsNote, ...page.serviceHighlights]"
      :secondary-items="relatedServiceCards.map((item) => item.title)"
      variant="city"
      secondary-title="Чаще считают вместе"
    />

    <TrustStrip
      title="Как ведём проект по городу"
      description="Без фейкового local office и без обещаний, которые нельзя подтвердить."
      :items="page.trustItems"
      variant="city"
    />

    <CasePreviewSection
      title="Сценарии, близкие по формату"
      description="Если локальных подтверждённых кейсов пока нет, показываем только честные типовые сценарии."
      :cases="caseStudies"
      variant="city"
    />

    <ServiceGridSection
      title="Связанные услуги"
      description="Для этого города чаще всего открывают эти маршруты."
      :cards="relatedServiceCards"
      variant="city"
    />

    <FaqSection
      title="FAQ по городу"
      description="Разбираем доставку, монтаж, city-specific логику и ограничения."
      :items="page.faq"
      variant="city"
    />

    <RelatedLinksSection
      title="Полезные страницы рядом"
      description="Продолжение маршрута без дублей и doorway-логики."
      :links="page.relatedLinks"
      variant="city"
    />

    <FinalCtaSection
      title="Нужен расчёт по этому городу?"
      description="Пришлите адрес, фото точки и тип задачи. Если монтаж критичен, напишите это сразу."
      :cta="page.cta"
      variant="city"
    />
  </div>
</template>
