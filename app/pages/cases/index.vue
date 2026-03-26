<script setup lang="ts">
import { cases } from "../../data/cases";
import { casesPageHero, casesPageLeadIntro } from "../../data/cases-page";
import { contactInfo, staticPageMeta } from "../../data/site";
import { cityPath, servicePath, staticPagePaths } from "../../utils/routes";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildOrganizationSchema, buildWebPageSchema } from "../../utils/schema";

const publishedCases = cases.filter((item) => item.status === "published");
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "Кейсы", href: "/cases/", current: true }]);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildWebPageSchema(siteUrl, casesPageHero.title, staticPageMeta.cases.description, staticPageMeta.cases.path),
  buildCollectionPageSchema(siteUrl, "Кейсы и сценарии", "Типовые сценарии по вывескам для бизнеса.", publishedCases)
];
const relatedLinks = [
  {
    label: "Фасадные вывески",
    href: servicePath("fasadnye-vyveski"),
    description: "Основная money page по фасадным вывескам и уличной читаемости."
  },
  {
    label: "Световые короба",
    href: servicePath("svetovye-koroba"),
    description: "Лайтбоксы и световые короба для точек, которым нужна быстрая видимость."
  },
  {
    label: "Вывески для сети",
    href: servicePath("vyveski-dlya-seti"),
    description: "Rollout для нескольких адресов, франшиз и повторяемых запусков."
  },
  {
    label: "Алматы",
    href: cityPath("almaty"),
    description: "Локальный хаб по фасадным и сетевым вывескам в Алматы."
  },
  {
    label: "Астана",
    href: cityPath("astana"),
    description: "Хаб по заметным объектам, крышным и фасадным решениям в Астане."
  },
  {
    label: "Контакты",
    href: staticPagePaths.contacts,
    description: "Отправьте объект, адрес и задачу, чтобы перейти от сценария к расчёту."
  }
];

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
      :chips="casesPageHero.facts"
    />

    <HeroSection
      :hero="casesPageHero"
      variant="cases"
    />

    <PageLeadSection
      variant="cases"
    >
      <p class="max-w-3xl text-lg leading-8 text-muted">
        {{ casesPageLeadIntro }}
      </p>
    </PageLeadSection>

    <CasePreviewSection
      title="Все кейсы"
      description="Каждый кейс показывает тип задачи, ограничения по объекту и формат решения."
      :cases="publishedCases"
      variant="cases"
    />

    <RelatedLinksSection
      title="Куда перейти из сценария"
      description="Если вы нашли похожий формат задачи, ниже короткий путь к нужной услуге, городскому хабу и форме расчёта."
      :links="relatedLinks"
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
