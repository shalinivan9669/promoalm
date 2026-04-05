<script setup lang="ts">
import { citiesHubPageData } from "../../data/hub-pages";
import { staticPagePaths } from "../../utils/routes";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildWebPageSchema } from "../../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "Города", href: staticPagePaths.goroda, current: true }]);
const schemas = [
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildWebPageSchema(siteUrl, citiesHubPageData.meta.title, citiesHubPageData.meta.description, citiesHubPageData.meta.path),
  buildCollectionPageSchema(
    siteUrl,
    citiesHubPageData.meta.title,
    citiesHubPageData.meta.description,
    citiesHubPageData.meta.path,
    citiesHubPageData.cityLinks.map((city) => ({
      name: city.label,
      url: city.href
    }))
  )
];

usePageSeo({
  meta: citiesHubPageData.meta,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="citiesHubPageData.hero.facts"
    />

    <HeroSection
      :hero="citiesHubPageData.hero"
      variant="city"
    />

    <PageLeadSection
      :intro="citiesHubPageData.intro"
      variant="city"
    />

    <TrustStrip
      eyebrow="Почему города вынесены отдельно"
      :title="citiesHubPageData.trustTitle"
      :description="citiesHubPageData.trustDescription"
      :items="citiesHubPageData.stats"
      variant="city"
    />

    <RelatedLinksSection
      title="Выберите город"
      description="Три опубликованные локальные страницы. Остальные города не показываем до появления реального proof и рабочей структуры."
      :links="citiesHubPageData.cityLinks"
      variant="city"
    />

    <ServiceGridSection
      title="Какие услуги чаще всего запрашивают"
      description="На городских страницах не прячем core услуги. Показываем те форматы, которые чаще всего переходят в расчёт."
      :cards="citiesHubPageData.serviceCards"
      variant="city"
    />

    <CasePreviewSection
      title="Какие сценарии помогают по городам"
      description="Реальные или сценарные кейсы помогают сразу понять, как выглядит локальный запуск и где обычно возникают ограничения."
      :cases="citiesHubPageData.caseStudies"
      variant="city"
    />

    <RelatedLinksSection
      :title="citiesHubPageData.relatedTitle"
      :description="citiesHubPageData.relatedDescription"
      :links="citiesHubPageData.relatedLinks"
      variant="city"
    />

    <FinalCtaSection
      title="Нужен расчет по городу?"
      description="Пришлите фото объекта, адрес и город. Этого достаточно, чтобы быстро собрать первый ответ без лишней переписки."
      :cta="citiesHubPageData.cta"
      variant="city"
    />
  </div>
</template>
