<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, ServicePageData } from "../../../shared/types/content";
import { cities } from "../../data/cities";
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
const serviceCopy = computed<
  Record<
    | "trustTitle"
    | "industryTitle"
    | "proofTitle"
    | "priceTitle"
    | "processTitle"
    | "materialsTitle"
    | "caseTitle"
    | "faqTitle"
    | "relatedTitle"
    | "ctaTitle",
    string
  >
>(() => {
  switch (page.value.slug) {
    case "fasadnye-vyveski":
      return {
        trustTitle: "Что важно по фасадной вывеске",
        industryTitle: "Где фасадная вывеска работает лучше всего",
        proofTitle: "Что проверяем по фасаду до запуска",
        priceTitle: "Как считаем фасадную вывеску",
        processTitle: "Как идёт проект по фасадной вывеске",
        materialsTitle: "Материалы под улицу и фасад",
        caseTitle: "Сценарии по фасадным вывескам",
        faqTitle: "Что спрашивают по фасадным вывескам",
        relatedTitle: "Что посмотреть рядом с фасадной вывеской",
        ctaTitle: "Нужен расчёт по фасаду?"
      };
    case "obemnye-bukvy":
      return {
        trustTitle: "Что важно по объёмным буквам",
        industryTitle: "Где объёмные буквы дают лучший эффект",
        proofTitle: "Что учитываем до запуска букв",
        priceTitle: "Как считаем объёмные буквы",
        processTitle: "Как идёт проект по объёмным буквам",
        materialsTitle: "Материалы и подсветка для букв",
        caseTitle: "Сценарии по объёмным буквам",
        faqTitle: "Что спрашивают по объёмным буквам",
        relatedTitle: "Что посмотреть рядом с объёмными буквами",
        ctaTitle: "Нужен расчёт по объёмным буквам?"
      };
    case "svetovye-koroba":
      return {
        trustTitle: "Что важно по световому коробу",
        industryTitle: "Где световой короб работает лучше всего",
        proofTitle: "Что учитываем по лайтбоксу до запуска",
        priceTitle: "Как считаем световой короб",
        processTitle: "Как идёт проект по лайтбоксу",
        materialsTitle: "Материалы для светового короба",
        caseTitle: "Сценарии по световым коробам",
        faqTitle: "Что спрашивают по световым коробам",
        relatedTitle: "Что посмотреть рядом со световым коробом",
        ctaTitle: "Нужен расчёт по лайтбоксу?"
      };
    case "kryshnye-ustanovki":
      return {
        trustTitle: "Что важно по крышной установке",
        industryTitle: "Для каких объектов подходят крышные установки",
        proofTitle: "Что нужно проверить до расчёта крыши",
        priceTitle: "Как считаем крышную установку",
        processTitle: "Как идёт проект по крышной установке",
        materialsTitle: "Материалы и конструктив для крыши",
        caseTitle: "Сценарии по крышным установкам",
        faqTitle: "Что спрашивают по крышным установкам",
        relatedTitle: "Что посмотреть рядом с крышной установкой",
        ctaTitle: "Нужна оценка крышной установки?"
      };
    case "vyveski-dlya-seti":
      return {
        trustTitle: "Что важно для сети и rollout",
        industryTitle: "Где rollout особенно нужен",
        proofTitle: "Что фиксируем по сети до запуска партии",
        priceTitle: "Как считаем проект для сети",
        processTitle: "Как идёт rollout по сети",
        materialsTitle: "Материалы и стандарты для сети",
        caseTitle: "Сценарии для сети и нескольких точек",
        faqTitle: "Что спрашивают по сетевым вывескам",
        relatedTitle: "Что посмотреть рядом с rollout-проектом",
        ctaTitle: "Нужен расчёт для сети?"
      };
    case "vyveski-pod-klyuch":
      return {
        trustTitle: "Что важно в проекте под ключ",
        industryTitle: "Для каких задач подходит формат под ключ",
        proofTitle: "Что входит в под ключ до запуска",
        priceTitle: "Как считаем проект под ключ",
        processTitle: "Как идёт проект под ключ",
        materialsTitle: "Из чего собираем проект под ключ",
        caseTitle: "Сценарии по вывескам под ключ",
        faqTitle: "Что спрашивают по проектам под ключ",
        relatedTitle: "Что посмотреть рядом с форматом под ключ",
        ctaTitle: "Нужен расчёт под ключ?"
      };
    case "interernye-vyveski-dlya-biznesa":
      return {
        trustTitle: "Что важно по интерьерной вывеске",
        industryTitle: "Где интерьерная вывеска работает лучше всего",
        proofTitle: "Что учитываем по интерьеру до запуска",
        priceTitle: "Как считаем интерьерную вывеску",
        processTitle: "Как идёт проект по интерьерной вывеске",
        materialsTitle: "Материалы для интерьерного знака",
        caseTitle: "Сценарии по интерьерным вывескам",
        faqTitle: "Что спрашивают по интерьерным вывескам",
        relatedTitle: "Что посмотреть рядом с интерьерной вывеской",
        ctaTitle: "Нужен расчёт по интерьерной вывеске?"
      };
    case "neonovye-vyveski":
      return {
        trustTitle: "Что важно по неону для интерьера",
        industryTitle: "Где неон уместен для бизнеса",
        proofTitle: "Что учитываем по неону до запуска",
        priceTitle: "Как считаем неоновую вывеску",
        processTitle: "Как идёт проект по неоновой вывеске",
        materialsTitle: "Материалы и контур для неона",
        caseTitle: "Сценарии по неону для бизнеса",
        faqTitle: "Что спрашивают по неоновым вывескам",
        relatedTitle: "Что посмотреть рядом с неоновой вывеской",
        ctaTitle: "Нужен расчёт по неону?"
      };
    default:
      return {
        trustTitle: "Что важно по монтажу вывесок",
        industryTitle: "Где монтаж особенно критичен",
        proofTitle: "Что проверяем до монтажа",
        priceTitle: "Как считаем монтаж вывесок",
        processTitle: "Как идёт монтаж по объекту",
        materialsTitle: "Что входит в монтажный комплект",
        caseTitle: "Сценарии по монтажу вывесок",
        faqTitle: "Что спрашивают по монтажу вывесок",
        relatedTitle: "Что посмотреть рядом с монтажом",
        ctaTitle: "Нужен монтажный расчёт?"
      };
  }
});
const cityHubLinks = computed(() => {
  const relatedCitySlugs = caseStudies.value.flatMap((item) => item.relatedCitySlugs);
  const uniqueSlugs = [...new Set(relatedCitySlugs)];

  return uniqueSlugs
    .map((slug) => cities.find((city) => city.slug === slug && city.status === "published"))
    .filter((city): city is (typeof cities)[number] => Boolean(city))
    .slice(0, 2)
    .map((city) => ({
      label: `Вывески в ${city.city}`,
      href: city.meta.path,
      description: `Локальный хаб по ${city.city}: расчёт, логистика и монтаж по объекту.`
    }));
});
const allRelatedLinks = computed(() => {
  const links = [...page.value.relatedLinks, ...cityHubLinks.value];
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
});

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
      :title="serviceCopy.trustTitle"
      description="Коротко о том, как устроен этот формат работ."
      :items="page.trustItems"
      variant="service"
    />

    <IndustryListSection
      :title="serviceCopy.industryTitle"
      description="Типы объектов и сценарии, где услуга даёт понятный коммерческий результат."
      :items="page.industries"
      variant="service"
    />

    <ProofSection
      :title="serviceCopy.proofTitle"
      description="Не скрываем ограничения, которые реально влияют на проект."
      :bullets="page.proofHighlights"
      :secondary-items="page.useCases"
      variant="service"
      secondary-title="Типовые сценарии"
    />

    <PriceNotesSection
      :title="serviceCopy.priceTitle"
      :description="priceDescription(page.priceMode)"
      :notes="page.priceNotes"
      variant="service"
    />

    <ProcessSection
      :title="serviceCopy.processTitle"
      description="Маршрут без лишних созвонов и разрыва между этапами."
      :steps="page.processSteps"
      variant="service"
    />

    <MaterialsSection
      :title="serviceCopy.materialsTitle"
      description="Набор материалов зависит от задачи, но базовый стек фиксируем честно."
      :materials="page.materials"
      variant="service"
    />

    <CasePreviewSection
      :title="serviceCopy.caseTitle"
      description="Ниже — типовые сценарии, близкие к реальным задачам бизнеса. Они помогают понять, как мы подходим к объектам разного масштаба и формата."
      :cases="caseStudies"
      variant="service"
    />

    <FaqSection
      :title="serviceCopy.faqTitle"
      description="Коротко закрываем вопросы по цене, срокам, монтажу и ограничениям."
      :items="page.faq"
      :answer-cta="{ label: page.cta.label, href: page.cta.href }"
      :related-links="allRelatedLinks"
      variant="service"
    />

    <RelatedLinksSection
      :title="serviceCopy.relatedTitle"
      description="Похожие разделы, которые помогут выбрать формат вывески, монтаж и сценарий запуска."
      :links="allRelatedLinks"
      variant="service"
    />

    <FinalCtaSection
      :title="serviceCopy.ctaTitle"
      description="Пришлите фото точки, размеры и задачу. Если нужна установка или несколько адресов, напишите это сразу."
      :cta="page.cta"
      variant="service"
    />
  </div>
</template>
