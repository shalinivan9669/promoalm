<script setup lang="ts">
import { cases } from "../../data/cases";
import { contactInfo, staticPageMeta } from "../../data/site";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildOrganizationSchema } from "../../utils/schema";

const publishedCases = cases.filter((item) => item.status === "published");
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "Кейсы", href: "/cases/", current: true }]);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildCollectionPageSchema(siteUrl, "Кейсы и сценарии", "Типовые сценарии по вывескам для бизнеса.", publishedCases)
];

const hero = {
  eyebrow: "Кейсы",
  title: "Типовые кейсы по вывескам для бизнеса",
  description:
    "Здесь собраны типовые сценарии, близкие к реальным задачам бизнеса: фасадные вывески, световые решения, сетевые проекты и объекты со сложным монтажом. Раздел помогает понять формат задач, подход к расчёту и логику запуска проекта.",
  facts: ["Типовые задачи бизнеса", "Привязка к услугам и городам", "Понятный сценарий запуска"],
  actions: [
    {
      label: "Запросить проект",
      href: "/kontakty/#lead-form",
      intent: "calculate" as const,
      trackingEvent: "click_calculate"
    }
  ]
};

usePageSeo({
  meta: staticPageMeta.cases,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="hero.facts"
    />

    <HeroSection
      :hero="hero"
      variant="cases"
    />

    <PageLeadSection
      variant="cases"
    >
      <p class="max-w-3xl text-lg leading-8 text-muted">
        По мере публикации новых кейсов раздел будет расширяться по городам, форматам вывесок и типам объектов.
      </p>
    </PageLeadSection>

    <CasePreviewSection
      title="Все кейсы"
      description="Каждый кейс показывает тип задачи, ограничения по объекту и формат решения."
      :cases="publishedCases"
      variant="cases"
    />

    <FinalCtaSection
      title="Нужен похожий проект под ваш объект?"
      description="Пришлите задачу и город. Мы соберём расчёт под ваш объект и покажем подходящий сценарий запуска."
      :cta="{
        label: 'Получить расчёт',
        href: '/kontakty/#lead-form',
        intent: 'primary',
        trackingEvent: 'click_calculate'
      }"
      variant="cases"
    />
  </div>
</template>
