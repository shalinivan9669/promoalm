<script setup lang="ts">
import { servicesHubPageData } from "../../data/hub-pages";
import { staticPagePaths } from "../../utils/routes";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildWebPageSchema } from "../../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "Услуги", href: staticPagePaths.uslugi, current: true }]);
const schemas = [
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildWebPageSchema(siteUrl, servicesHubPageData.meta.title, servicesHubPageData.meta.description, servicesHubPageData.meta.path),
  buildCollectionPageSchema(
    siteUrl,
    servicesHubPageData.meta.title,
    servicesHubPageData.meta.description,
    servicesHubPageData.meta.path,
    servicesHubPageData.serviceCards.map((card) => ({
      name: card.title,
      url: card.path
    }))
  )
];

usePageSeo({
  meta: servicesHubPageData.meta,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="servicesHubPageData.hero.facts"
    />

    <HeroSection
      :hero="servicesHubPageData.hero"
      variant="service"
    />

    <PageLeadSection
      :intro="servicesHubPageData.intro"
      variant="service"
    />

    <TrustStrip
      eyebrow="Почему этот хаб нужен"
      :title="servicesHubPageData.trustTitle"
      :description="servicesHubPageData.trustDescription"
      :items="servicesHubPageData.stats"
      variant="service"
    />

    <ServiceGridSection
      title="Основные услуги"
      description="Каждая карточка ведёт в отдельную money page без повторов и без внутренней конкуренции за один и тот же запрос."
      :cards="servicesHubPageData.serviceCards"
      variant="service"
    />

    <CasePreviewSection
      title="Какие сценарии закрываем"
      description="Сюда вынесены типовые проекты, которые помогают быстро увидеть логику по фасаду, свету, сетям и монтажу."
      :cases="servicesHubPageData.caseStudies"
      variant="service"
    />

    <RelatedLinksSection
      :title="servicesHubPageData.relatedTitle"
      :description="servicesHubPageData.relatedDescription"
      :links="servicesHubPageData.relatedLinks"
      variant="service"
    />

    <FinalCtaSection
      title="Нужен расчет по услуге?"
      description="Отправьте фото фасада, адрес или список адресов. Дальше соберём первый расчёт и переведём задачу в рабочий маршрут."
      :cta="servicesHubPageData.cta"
      variant="service"
    />
  </div>
</template>
