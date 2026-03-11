<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, ServicePageData } from "../../../shared/types/content";

defineProps<{
  page: ServicePageData;
  breadcrumbs: BreadcrumbItem[];
  caseStudies: CaseStudy[];
}>();

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
    <HeroSection :hero="page.hero" />

    <Container>
      <Breadcrumbs :items="breadcrumbs" />
      <p class="max-w-3xl text-lg leading-8 text-muted">
        {{ page.intro }}
      </p>
    </Container>

    <TrustStrip
      title="Факты по задаче"
      description="Коротко о том, как устроен этот формат работ."
      :items="page.trustItems"
    />

    <IndustryListSection
      title="Где этот формат работает лучше всего"
      description="Типы объектов и сценарии, где услуга даёт понятный коммерческий результат."
      :items="page.industries"
    />

    <ProofSection
      title="Что важно учесть до запуска"
      description="Не скрываем ограничения, которые реально влияют на проект."
      :bullets="page.proofHighlights"
      :secondary-items="page.useCases"
      secondary-title="Типовые сценарии"
    />

    <PriceNotesSection
      title="Как считаем стоимость"
      :description="priceDescription(page.priceMode)"
      :notes="page.priceNotes"
    />

    <ProcessSection
      title="Как проходит проект"
      description="Маршрут без лишних созвонов и разрыва между этапами."
      :steps="page.processSteps"
    />

    <MaterialsSection
      title="Из чего собираем решение"
      description="Набор материалов зависит от задачи, но базовый стек фиксируем честно."
      :materials="page.materials"
    />

    <CasePreviewSection
      title="Релевантные сценарии"
      description="Пока без вымышленных брендов и адресов. Только типовые задачи, близкие по формату."
      :cases="caseStudies"
    />

    <FaqSection
      title="Что спрашивают по этой услуге"
      description="Коротко закрываем вопросы по цене, срокам, монтажу и ограничениям."
      :items="page.faq"
    />

    <RelatedLinksSection
      title="Куда смотреть дальше"
      description="Связанные страницы, которые помогают дособрать решение без SEO-мусора."
      :links="page.relatedLinks"
    />

    <FinalCtaSection
      title="Нужен расчёт под конкретный объект?"
      description="Пришлите фото точки, размеры и задачу. Если нужна установка или несколько адресов, напишите это сразу."
      :cta="page.cta"
    />
  </div>
</template>
