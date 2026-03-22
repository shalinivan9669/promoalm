<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, ServicePageData } from "../../../shared/types/content";
import { serviceCards } from "../../data/service-summaries";

const props = defineProps<{
  page: ServicePageData;
  breadcrumbs: BreadcrumbItem[];
  caseStudies: CaseStudy[];
}>();

const page = computed(() => props.page);
const breadcrumbs = computed(() => props.breadcrumbs);
const caseStudies = computed(() => props.caseStudies);
const topChips = computed(() => serviceCards.find((item) => item.slug === page.value.slug)?.tags ?? []);

function priceDescription(mode: ServicePageData["priceMode"]) {
  if (mode === "request-only") {
    return "Для этой задачи честный расчёт даём только после вводных по объекту, конструктиву и монтажу.";
  }

  if (mode === "from") {
    return "Здесь можно быстро понять логику цены, но финальный расчёт всё равно зависит от размеров, света, крепления и логистики.";
  }

  return "Цена собирается из конструктора проекта: формат, материалы, монтаж, логистика и коммерческий контур объекта.";
}
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="topChips"
    />

    <HeroSection
      :hero="page.hero"
      variant="service"
    />

    <PageLeadSection
      :intro="page.intro"
      :stats="page.trustItems.slice(0, 2)"
      variant="service"
    />

    <TrustStrip
      title="Факты по задаче"
      description="Коротко о том, как устроен этот формат работ."
      :items="page.trustItems"
      variant="service"
    />

    <IndustryListSection
      title="Где этот формат работает лучше всего"
      description="Типы объектов и сценарии, где услуга даёт понятный коммерческий результат."
      :items="page.industries"
      variant="service"
    />

    <ProofSection
      title="Что важно учесть до запуска"
      description="Не скрываем ограничения, которые реально влияют на проект."
      :bullets="page.proofHighlights"
      :secondary-items="page.useCases"
      variant="service"
      secondary-title="Типовые сценарии"
    />

    <PriceNotesSection
      title="Как считаем стоимость"
      :description="priceDescription(page.priceMode)"
      :notes="page.priceNotes"
      variant="service"
    />

    <ProcessSection
      title="Как проходит проект"
      description="Маршрут без лишних созвонов и разрыва между этапами."
      :steps="page.processSteps"
      variant="service"
    />

    <MaterialsSection
      title="Из чего собираем решение"
      description="Набор материалов зависит от задачи, но базовый стек фиксируем честно."
      :materials="page.materials"
      variant="service"
    />

    <CasePreviewSection
      title="Релевантные сценарии"
      description="Ниже — типовые сценарии, близкие к реальным задачам бизнеса. Они помогают понять, как мы подходим к объектам разного масштаба и формата."
      :cases="caseStudies"
      variant="service"
    />

    <FaqSection
      title="Что спрашивают по этой услуге"
      description="Коротко закрываем вопросы по цене, срокам, монтажу и ограничениям."
      :items="page.faq"
      variant="service"
    />

    <RelatedLinksSection
      title="Куда смотреть дальше"
      description="Похожие разделы, которые помогут выбрать формат вывески, монтаж и сценарий запуска."
      :links="page.relatedLinks"
      variant="service"
    />

    <FinalCtaSection
      title="Нужен расчёт под конкретный объект?"
      description="Пришлите фото точки, размеры и задачу. Если нужна установка или несколько адресов, напишите это сразу."
      :cta="page.cta"
      variant="service"
    />
  </div>
</template>
