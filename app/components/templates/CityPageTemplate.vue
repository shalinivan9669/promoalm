<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, CityPageData, ServiceCard } from "../../../shared/types/content";

type CityHubCopy = {
  proofTitle: string;
  proofSecondaryTitle: string;
  trustTitle: string;
  trustDescription: string;
  caseTitle: string;
  caseDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  relatedTitle: string;
  relatedDescription: string;
  faqTitle: string;
  faqDescription: string;
  ctaTitle: string;
  ctaDescription: string;
};

type PublishedCitySlug = "almaty" | "astana" | "shymkent";

const CITY_COPY = {
  almaty: {
    proofTitle: "Почему по Алматы расчёт отличается",
    proofSecondaryTitle: "Чаще считают вместе",
    trustTitle: "Как ведём проект по Алматы",
    trustDescription: "Работаем по Казахстану, но по Алматы быстрее закрываем фасадные и сетевые задачи. Адрес не показываем как local office без подтверждения.",
    caseTitle: "Сценарии, близкие к Алматы",
    caseDescription: "Показываем не выдуманные локальные кейсы, а честные сценарии с той же логикой: фасад, свет и быстрый запуск.",
    servicesTitle: "Какие решения чаще берут в Алматы",
    servicesDescription: "На странице оставляем только те форматы, которые реально закрывают плотный городской поток.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Если нужно сверить условия, доставку или связаться с командой, дальше удобно идти по этим страницам.",
    faqTitle: "FAQ по Алматы",
    faqDescription: "Короткие ответы на вопросы о расчёте, монтаже и старте по фото фасада.",
    ctaTitle: "Получить расчёт по Алматы",
    ctaDescription: "Пришлите фото объекта, адрес и логотип. Если у вас несколько точек, сразу добавьте список адресов."
  },
  astana: {
    proofTitle: "Что в Астане считаем заранее",
    proofSecondaryTitle: "Чаще закладывают вместе",
    trustTitle: "Как ведём проект по Астане",
    trustDescription: "По Астане особенно внимательно смотрим на высоту, конструктив и маршрут монтажа. Адрес не выдаём за local office без подтверждения.",
    caseTitle: "Сценарии, близкие к Астане",
    caseDescription: "Здесь важны масштаб и заметность с дистанции, поэтому показываем сценарии с похожим монтажным контуром.",
    servicesTitle: "Какие решения чаще берут в Астане",
    servicesDescription: "На заметных объектах чаще собирают не один носитель, а связку фасада, высоты и под ключ-маршрута.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Если нужен расчёт под сложный объект, сначала удобно открыть условия, доставку и контакт.",
    faqTitle: "FAQ по Астане",
    faqDescription: "Ответы на вопросы о цене, высоте, крыше и удалённом старте без лишних обещаний.",
    ctaTitle: "Обсудить проект по Астане",
    ctaDescription: "Пришлите фото объекта, ориентир по высоте и задачу. Если нужна крышная конструкция, пишите об этом сразу."
  },
  shymkent: {
    proofTitle: "Что важно для Шымкента",
    proofSecondaryTitle: "Чаще запускают вместе",
    trustTitle: "Как запускаем проект по Шымкенту",
    trustDescription: "По Шымкенту удобно стартовать удалённо: сначала фото и адрес, потом расчёт и макет. Local office без подтверждения не заявляем.",
    caseTitle: "Сценарии, близкие к Шымкенту",
    caseDescription: "Показываем сценарии, где важны быстрый старт, понятная отправка и аккуратный маршрут до монтажа.",
    servicesTitle: "Какие решения чаще берут в Шымкенте",
    servicesDescription: "Здесь чаще работают фасад и интерьер для B2B, а не декоративные единичные решения.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Когда задача уже понятна, удобно открыть доставку, FAQ и контакты без лишних кругов.",
    faqTitle: "FAQ по Шымкенту",
    faqDescription: "Коротко отвечаем, как согласовать всё онлайн и что нужно для быстрого расчёта.",
    ctaTitle: "Запросить расчёт по Шымкенту",
    ctaDescription: "Пришлите фото объекта, адрес и логотип. Если нужен монтаж, отметьте это в первом сообщении."
  }
} satisfies Record<PublishedCitySlug, CityHubCopy>;

const props = defineProps<{
  page: CityPageData;
  breadcrumbs: BreadcrumbItem[];
  caseStudies: CaseStudy[];
  relatedServiceCards: ServiceCard[];
}>();

const copy = computed(() => CITY_COPY[props.page.slug as PublishedCitySlug]);
const leadStats = computed(() =>
  props.page.trustItems.slice(0, 2).map((item) => ({
    label: item.label,
    value: item.value,
    note: item.description
  }))
);
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="props.breadcrumbs"
      :chips="props.page.serviceHighlights"
    />

    <HeroSection
      :hero="props.page.hero"
      variant="city"
    />

    <PageLeadSection
      :intro="props.page.intro"
      :stats="leadStats"
      variant="city"
    />

    <ProofSection
      :title="copy.proofTitle"
      :description="props.page.localAngle"
      :bullets="[props.page.logisticsNote, ...props.page.serviceHighlights]"
      :secondary-items="props.relatedServiceCards.map((item) => item.title)"
      :secondary-title="copy.proofSecondaryTitle"
      variant="city"
    />

    <TrustStrip
      :title="copy.trustTitle"
      :description="copy.trustDescription"
      :items="props.page.trustItems"
      variant="city"
    />

    <CasePreviewSection
      :title="copy.caseTitle"
      :description="copy.caseDescription"
      :cases="props.caseStudies"
      variant="city"
    />

    <ServiceGridSection
      :title="copy.servicesTitle"
      :description="copy.servicesDescription"
      :cards="props.relatedServiceCards"
      variant="city"
    />

    <FaqSection
      :title="copy.faqTitle"
      :description="copy.faqDescription"
      :items="props.page.faq"
      variant="city"
    />

    <RelatedLinksSection
      :title="copy.relatedTitle"
      :description="copy.relatedDescription"
      :links="props.page.relatedLinks"
      variant="city"
    />

    <FinalCtaSection
      :title="copy.ctaTitle"
      :description="copy.ctaDescription"
      :cta="props.page.cta"
      variant="city"
    />
  </div>
</template>
