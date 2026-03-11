<script setup lang="ts">
import { aboutFaqs } from "../data/faqs";
import { cases } from "../data/cases";
import { aboutPageData, contactInfo, globalTrustStats, staticPageMeta } from "../data/site";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "О компании", href: "/o-kompanii/", current: true }]);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs)
];

usePageSeo({
  meta: staticPageMeta.about,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <HeroSection :hero="aboutPageData.hero" />

    <Container>
      <Breadcrumbs :items="breadcrumbs" />
      <p class="max-w-3xl text-lg leading-8 text-muted">
        {{ aboutPageData.summary }}
      </p>
    </Container>

    <ProofSection
      title="На чём держится подход"
      description="Это не студия декора и не агентство «на всё». Фокус на управляемом производственном результате."
      :bullets="aboutPageData.strengths"
      :secondary-items="['Фасады', 'Световые конструкции', 'Сети', 'Удалённые проекты']"
      secondary-title="Основной фокус"
    />

    <ProcessSection
      title="Как мы работаем как подрядчик"
      description="Внутренняя логика проекта важнее громких обещаний."
      :steps="aboutPageData.workPrinciples"
    />

    <TrustStrip
      title="Базовые условия"
      description="То, что владелец бизнеса должен понимать до запуска проекта."
      :items="globalTrustStats"
    />

    <CasePreviewSection
      title="Что считаем релевантным proof layer"
      description="Пока здесь типовые сценарии. После передачи реальных фото и кейсов блок просто усилится, а не поменяет структуру."
      :cases="cases.filter((item) => item.status === 'published').slice(0, 3)"
    />

    <FaqSection
      title="FAQ о подрядчике"
      description="Коротко о специализации, сетевых задачах и реальном фокусе сайта."
      :items="aboutFaqs"
    />

    <FinalCtaSection
      title="Если нужен подрядчик, а не просто изготовитель таблички"
      description="Пришлите задачу и город. В ответ соберём производственный маршрут, а не общие слова."
      :cta="aboutPageData.finalCta"
    />
  </div>
</template>
