<script setup lang="ts">
import { aboutFaqs } from "../data/faqs";
import { cases } from "../data/cases";
import { aboutPageData, contactInfo, globalTrustStats, staticPageMeta } from "../data/site";
import { buildBreadcrumbSchema, buildOrganizationSchema, buildWebPageSchema } from "../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "О компании", href: "/o-kompanii/", current: true }]);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildWebPageSchema(siteUrl, aboutPageData.hero.title, staticPageMeta.about.description, staticPageMeta.about.path)
];

usePageSeo({
  meta: staticPageMeta.about,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="aboutPageData.strengths"
    />

    <HeroSection
      :hero="aboutPageData.hero"
      variant="about"
    />

    <PageLeadSection
      :intro="aboutPageData.summary"
      variant="about"
    />

    <ProofSection
      title="На чём держится подход"
      description="Это не студия декора и не агентство «на всё». Фокус на управляемом производственном результате."
      :bullets="aboutPageData.strengths"
      variant="about"
      :secondary-items="['Фасады', 'Световые конструкции', 'Сети', 'Удалённые проекты']"
      secondary-title="Основной фокус"
    />

    <ProcessSection
      title="Как мы работаем как подрядчик"
      description="Внутренняя логика проекта важнее громких обещаний."
      :steps="aboutPageData.workPrinciples"
      variant="about"
    />

    <TrustStrip
      title="Базовые условия"
      description="То, что владелец бизнеса должен понимать до запуска проекта."
      :items="globalTrustStats"
      variant="about"
    />

    <CasePreviewSection
      title="Какие задачи мы берём в работу"
      description="Ниже — типовые сценарии, с которыми к нам обращаются чаще всего: фасадные вывески, световые конструкции, сетевые запуски и проекты с монтажом по графику."
      :cases="cases.filter((item) => item.status === 'published').slice(0, 3)"
      variant="about"
    />

    <FaqSection
      title="FAQ о подрядчике"
      description="Коротко о специализации, сетевых задачах и реальном фокусе сайта."
      :items="aboutFaqs"
      :answer-cta="{ label: aboutPageData.finalCta.label, href: aboutPageData.finalCta.href }"
      variant="about"
    />

    <FinalCtaSection
      title="Если нужен подрядчик, а не просто изготовитель таблички"
      description="Пришлите задачу и город. В ответ соберём производственный маршрут, а не общие слова."
      :cta="aboutPageData.finalCta"
      variant="about"
    />
  </div>
</template>
