<script setup lang="ts">
import type { BreadcrumbItem, CaseStudy, CityPageData, ServiceCard } from "../../../shared/types/content";
import { staticPagePaths } from "../../utils/routes";

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
    trustDescription: "По Алматы чаще ведём фасадные и сетевые задачи: считаем вывеску под улицу, заранее проверяем крепление и собираем проект так, чтобы точка не зависла между макетом, производством и монтажом.",
    caseTitle: "Типовые задачи для Алматы",
    caseDescription: "Ниже — форматы, которые чаще всего работают по городу: фасадные вывески для плотного потока, световые решения для быстрого запуска и rollout-подход для нескольких точек.",
    servicesTitle: "Какие решения чаще берут в Алматы",
    servicesDescription: "Для Алматы чаще выбирают решения, которые читаются с улицы, быстро запускаются и не теряются на фоне соседних фасадов.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Ниже — страницы, которые помогают быстро закрыть оставшиеся вопросы: посмотреть типовые проекты, понять доставку и сразу отправить задачу в расчёт.",
    faqTitle: "FAQ по Алматы",
    faqDescription: "Короткие ответы на вопросы о расчёте, монтаже и старте по фото фасада.",
    ctaTitle: "Получить расчёт по Алматы",
    ctaDescription: "Пришлите фото объекта, адрес и логотип. Если у вас несколько точек, сразу добавьте список адресов."
  },
  astana: {
    proofTitle: "Что в Астане считаем заранее",
    proofSecondaryTitle: "Чаще закладывают вместе",
    trustTitle: "Как ведём проект по Астане",
    trustDescription: "По Астане проект обычно начинается с высоты, конструктивной схемы и монтажного доступа. Это помогает сразу понять реальный бюджет, срок и ограничения по объекту.",
    caseTitle: "Типовые задачи для Астаны",
    caseDescription: "Ниже — типовые задачи для Астаны: объекты с высотой, сложным доступом и повышенными требованиями к заметности.",
    servicesTitle: "Какие решения чаще берут в Астане",
    servicesDescription: "В Астане чаще заказывают не один носитель, а связку решений: фасад, конструктив по высоте и единый маршрут запуска под ключ.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Ниже — страницы, которые помогают быстро закрыть оставшиеся вопросы: посмотреть типовые проекты, понять доставку и сразу отправить задачу в расчёт.",
    faqTitle: "FAQ по Астане",
    faqDescription: "Коротко отвечаем на вопросы, которые чаще всего возникают по заметным объектам: цена, высота, крыша, доступ и порядок запуска проекта.",
    ctaTitle: "Обсудить проект по Астане",
    ctaDescription: "Пришлите фото объекта, ориентир по высоте и задачу. Если нужна крышная конструкция, пишите об этом сразу."
  },
  shymkent: {
    proofTitle: "Что важно для Шымкента",
    proofSecondaryTitle: "Чаще запускают вместе",
    trustTitle: "Как запускаем проект по Шымкенту",
    trustDescription: "По Шымкенту проект удобно запускать в коротком цикле: быстро собираем вводные по объекту, считаем решение, показываем макет и переводим задачу в производство без лишней бюрократии.",
    caseTitle: "Типовые задачи для Шымкента",
    caseDescription: "Ниже — типовые задачи для Шымкента: быстрый запуск фасадных и интерьерных решений, понятная логистика и спокойное согласование без перегруза процесса.",
    servicesTitle: "Какие решения чаще берут в Шымкенте",
    servicesDescription: "В Шымкенте чаще выбирают фасадные и интерьерные решения для B2B, где важны понятный старт и предсказуемый маршрут производства.",
    relatedTitle: "Куда перейти дальше",
    relatedDescription: "Ниже — страницы, которые помогают быстро закрыть оставшиеся вопросы: посмотреть типовые проекты, понять доставку и сразу отправить задачу в расчёт.",
    faqTitle: "FAQ по Шымкенту",
    faqDescription: "Ниже — короткие ответы по онлайн-согласованию, расчёту, монтажу и тому, какие данные нужны для быстрого старта проекта.",
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
const faqRelatedLinks = computed(() =>
  props.relatedServiceCards.slice(0, 2).map((item) => ({
    label: item.title,
    href: item.path,
    description: item.summary
  }))
);
const hubLinks = computed(() => [
  {
    label: "Все услуги",
    href: staticPagePaths.uslugi,
    description: "Основные коммерческие направления и money pages."
  },
  {
    label: "Все города",
    href: staticPagePaths.goroda,
    description: "Карта локальных страниц по Казахстану."
  }
]);
const allRelatedLinks = computed(() => {
  const links = [...props.page.relatedLinks, ...hubLinks.value];
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="props.breadcrumbs"
      :chips="props.page.serviceHighlights"
    />

    <HeroSection
      :hero="props.page.hero"
      :city-name="props.page.city"
      :city-slug="props.page.slug"
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
      :city-slug="props.page.slug"
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
      :answer-cta="{ label: props.page.cta.label, href: props.page.cta.href }"
      :related-links="faqRelatedLinks"
      variant="city"
    />

    <RelatedLinksSection
      :title="copy.relatedTitle"
      :description="copy.relatedDescription"
      :links="allRelatedLinks"
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
