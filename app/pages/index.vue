<script setup lang="ts">
import { cases } from "../data/cases";
import { homeCityNavigation, serviceNavigation } from "../data/navigation";
import { homeFaqs } from "../data/faqs";
import { serviceCards } from "../data/service-summaries";
import { aboutPageData, contactInfo, globalTrustStats, homePageData, staticPageMeta } from "../data/site";
import { buildCollectionPageSchema, buildLocalBusinessSchema, buildOrganizationSchema } from "../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const publishedServiceCards = serviceCards.filter((item) => item.status === "published");
const featuredCases = cases.filter((item) => item.status === "published").slice(0, 3);
const homeHero = {
  ...homePageData.hero,
  note: undefined
};

const heroQuickLinks = [
  ...homeCityNavigation.slice(0, 3).map((item) => ({
    label: item.label,
    href: item.href
  })),
  ...[
    { slug: "fasadnye-vyveski", label: "Фасадные" },
    { slug: "svetovye-koroba", label: "Световые короба" },
    { slug: "vyveski-dlya-seti", label: "Для сети" },
    { slug: "vyveski-pod-klyuch", label: "Под ключ" },
    { slug: "montazh-vyvesok", label: "Монтаж" }
  ]
    .map((item) => {
      const match = serviceNavigation.find((service) => service.href.includes(`/${item.slug}/`));

      return match
        ? {
            label: item.label,
            href: match.href
          }
        : null;
    })
    .filter((item): item is { label: string; href: string } => Boolean(item))
];

const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildLocalBusinessSchema(siteUrl, contactInfo),
  buildCollectionPageSchema(siteUrl, "Кейсы", "Типовые сценарии по вывескам для бизнеса.", featuredCases)
].filter(Boolean) as Record<string, unknown>[];

usePageSeo({
  meta: staticPageMeta.home,
  schemas
});
</script>

<template>
  <div class="home-page">
    <HeroSection
      :hero="homeHero"
      variant="home"
      media-mode="abstract"
      :quick-links="heroQuickLinks"
    />

    <HomeStatementSection
      :statement="homePageData.intro"
      :note="homePageData.hero.note"
      :city-navigation="homeCityNavigation"
      :trust-items="globalTrustStats"
      :industries="homePageData.industries"
    />

    <ServiceGridSection
      variant="home"
      title="Какие вывески делаем для бизнеса"
      description="Основные направления собраны вокруг реального коммерческого спроса: фасад, объёмные буквы, световые короба, крышные решения, тиражирование для сети и запуск под ключ."
      :cards="publishedServiceCards"
    />

    <div class="home-confidence-band">
      <CasePreviewSection
        variant="home"
        title="Что получает бизнес на старте работы"
        description="Пока без выдуманных историй и декоративного портфолио ради галочки. Здесь важнее понятный рабочий маршрут и прозрачная логика запуска."
        :cases="featuredCases"
      />

      <ProcessSection
        variant="home"
        title="Как проходит заказ"
        description="Базовый маршрут один: заявка, бриф, макет, согласование, предоплата, производство, доставка и монтаж."
        :steps="aboutPageData.workPrinciples"
      />

      <PriceNotesSection
        variant="home"
        title="Как собирается цена"
        description="Стоимость считается по задаче, а не по шаблону. Цена зависит от формата изделия, размеров, конструкции, объёма работ и условий запуска."
        :notes="homePageData.pricingSummary"
      />

      <ProofSection
        variant="home"
        title="Доставка, монтаж и удалённый запуск"
        description="Сайт рассчитан на Казахстан, а не на один локальный офис и случайный самовывоз."
        :bullets="homePageData.deliveryHighlights"
        :secondary-items="['Онлайн-согласование', 'Срочность за доплату', 'Монтаж по согласованию']"
        secondary-title="Удалённый запуск возможен, когда по объекту есть нормальные вводные и понятный маршрут согласования."
      />
    </div>

    <FaqSection
      variant="home"
      title="Частые вопросы по старту проекта"
      description="Цена, сроки, предоплата, доставка, монтаж и разница между интерьером и улицей."
      :items="homeFaqs"
    />

    <FinalCtaSection
      variant="home"
      title="Нужен расчёт по конкретной точке или по сети?"
      description="Отправьте фото объекта, размеры и краткое описание задачи. Если адресов несколько, напишите количество точек сразу."
      :cta="homePageData.finalCta"
    />
  </div>
</template>
