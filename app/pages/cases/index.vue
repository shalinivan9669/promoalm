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
  eyebrow: "Proof layer",
  title: "Пока здесь типовые сценарии вместо вымышленных кейсов с чужими логотипами",
  description:
    "В v1 proof layer строится честно: показываем формат задач, логику решения и коммерческий контур. Как только владелец добавит реальные фото и факты, этот раздел усилится без смены архитектуры.",
  facts: ["Сценарии вместо фейков", "Привязка к услугам и городам", "Готово к росту до /cases/[slug]/"],
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
        Как только число реальных кейсов перевалит за 12–15 и появятся разные сценарии по городам и нишам, раздел логично развернуть в `/cases/[slug]/`.
      </p>
    </PageLeadSection>

    <CasePreviewSection
      title="Все сценарии v1"
      description="Каждая карточка привязана к услуге и региональному слою, чтобы не быть декоративным proof-блоком."
      :cases="publishedCases"
      variant="cases"
    />

    <FinalCtaSection
      title="Нужен похожий проект под ваш объект?"
      description="Пришлите задачу и город. Мы соберём расчёт без выдуманных цифр и без неподтверждённых обещаний."
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
