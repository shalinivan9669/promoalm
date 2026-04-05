<script setup lang="ts">
import { cases } from "../data/cases";
import { homeHeroHeadline } from "../data/site";
import { homeCityNavigation, serviceNavigation } from "../data/navigation";
import { homeFaqs } from "../data/faqs";
import { serviceCards } from "../data/services";
import { aboutPageData, contactInfo, globalTrustStats, homePageData, staticPageMeta } from "../data/site";
import { buildWidthSrcSet, HOME_HERO_IMAGE_HEIGHT, HOME_HERO_IMAGE_SIZES, HOME_HERO_IMAGE_WIDTH } from "../utils/responsive-images";
import { staticPagePaths } from "../utils/routes";
import { buildCollectionPageSchema, buildFaqSchema, buildLocalBusinessSchema, buildOrganizationSchema, buildWebSiteSchema } from "../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const publishedServiceCards = serviceCards.filter((item) => item.status === "published");
const featuredCases = cases.filter((item) => item.status === "published").slice(0, 3);
const homeHero = {
  ...homePageData.hero,
  note: undefined
};
const HOME_HERO_RESPONSIVE_WIDTHS = [640, 768, 960, 1280, 1536, 1920, 2560] as const;
const HOME_HERO_PRELOAD_FALLBACK_SRC = "/images/hero/responsive/1-960.webp";
const homeHeroFrames = ["1", "2", "3", "4", "5", "6"].map((name, index) => ({
  src: `/images/hero/${name}.avif`,
  srcset: buildWidthSrcSet(
    HOME_HERO_RESPONSIVE_WIDTHS.map((width) => ({
      src: `/images/hero/responsive/${name}-${width}.webp`,
      width
    }))
  ),
  sizes: HOME_HERO_IMAGE_SIZES,
  alt: "",
  width: HOME_HERO_IMAGE_WIDTH,
  height: HOME_HERO_IMAGE_HEIGHT,
  fetchPriority: index === 0 ? ("high" as const) : ("auto" as const),
  loading: index === 0 ? ("eager" as const) : ("lazy" as const)
}));
const homeTransitionImage = "/images/bg/bg.avif";

const heroQuickLinks = [
  {
    label: "Все услуги",
    href: staticPagePaths.uslugi
  },
  {
    label: "Все города",
    href: staticPagePaths.goroda
  },
  ...homeCityNavigation.slice(0, 3).map((item) => ({
    label: item.label,
    href: item.href
  })),
  ...[
    { slug: "fasadnye-vyveski", label: "Фасадные" },
    { slug: "obemnye-bukvy", label: "Объёмные буквы" },
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

const homeFaqLinks = ["fasadnye-vyveski", "svetovye-koroba", "vyveski-dlya-seti"]
  .map((slug) => serviceNavigation.find((service) => service.href.includes(`/${slug}/`)))
  .filter((item): item is (typeof serviceNavigation)[number] => Boolean(item))
  .map((item) => ({
    label: item.label,
    href: item.href,
    description: item.description || item.label
  }));

const homeGuideLinks = [
  {
    label: "Все услуги",
    href: staticPagePaths.uslugi,
    description: "Карта всех основных коммерческих направлений."
  },
  {
    label: "Все города",
    href: staticPagePaths.goroda,
    description: "Локальные страницы по Казахстану."
  },
  {
    label: "FAQ",
    href: staticPagePaths.faq,
    description: "Короткие ответы по цене, срокам, монтажу и удалённому запуску."
  },
  {
    label: "Доставка",
    href: staticPagePaths.delivery,
    description: "Как ведём проекты по Казахстану и что нужно для старта."
  },
  {
    label: "Оплата и гарантия",
    href: staticPagePaths.payment,
    description: "Предоплата, этапы запуска и гарантийные условия."
  },
  {
    label: "Кейсы",
    href: staticPagePaths.cases,
    description: "Посмотреть типовые сценарии по вывескам и сетевым проектам."
  },
  {
    label: "О компании",
    href: staticPagePaths.about,
    description: "Понять, как устроен проектный маршрут от брифа до монтажа."
  },
  {
    label: "Контакты",
    href: staticPagePaths.contacts,
    description: "Отправить вводные и получить расчёт по задаче."
  },
  {
    label: "Политика конфиденциальности",
    href: staticPagePaths.privacy,
    description: "Как мы обрабатываем данные, отправленные через форму."
  }
];

const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildWebSiteSchema(siteUrl, contactInfo),
  buildLocalBusinessSchema(siteUrl, contactInfo),
  buildCollectionPageSchema(
    siteUrl,
    "Кейсы",
    "Типовые сценарии по вывескам для бизнеса.",
    staticPagePaths.cases,
    featuredCases.map((item) => ({
      name: item.title,
      url: `/cases/#${item.slug}`
    }))
  ),
  buildFaqSchema(homeFaqs)
].filter(Boolean) as Record<string, unknown>[];

usePageSeo({
  meta: staticPageMeta.home,
  schemas
});

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: HOME_HERO_PRELOAD_FALLBACK_SRC,
      imagesrcset: homeHeroFrames[0]!.srcset,
      imagesizes: HOME_HERO_IMAGE_SIZES,
      type: "image/webp"
    }
  ]
});
</script>

<template>
  <HeroSection
    :hero="homeHero"
    variant="home"
    media-mode="image"
    :media-frames="homeHeroFrames"
    :typed-headline="homeHeroHeadline"
  />

    <HomeHeroTransitionScene :background-src="homeTransitionImage" />

    <HomeAfterHeroTakeoverSection
      first-line="По всему Казахстану"
      second-line="Работаем"
    />

    <HomeStatementSection
      :statement="homePageData.intro"
      :note="homePageData.hero.note"
      :quick-links="heroQuickLinks"
      :city-navigation="homeCityNavigation"
      :trust-items="globalTrustStats"
      :industries="homePageData.industries"
    />

    <RelatedLinksSection
      title="Быстрые разделы"
      description="Если уже понятен формат задачи, здесь собраны страницы, которые быстрее всего ведут к расчёту и условиям работы."
      :links="homeGuideLinks"
    />

    <ServiceGridSection
      variant="home"
      title="Какие вывески делаем для бизнеса"
      description="Собрали основные направления под реальные B2B-задачи: фасад, уличная видимость, единый формат для сети, проект под ключ и монтаж без лишних подрядчиков."
      :description-highlights="[
        { text: 'уличная видимость', tone: 'warm' },
        { text: 'единый формат', tone: 'gas' },
        { text: 'проект под ключ', tone: 'berry' }
      ]"
      :cards="publishedServiceCards"
    />

    <div class="home-confidence-band">
      <HomeCasePreviewSection
        title="Что получает бизнес на старте работы"
        description="На старте важны не обещания, а понятный план: расчёт по вводным, макет до запуска, прозрачная логика работ и контроль, если адресов несколько."
        :cases="featuredCases"
      />

      <ProcessSection
        variant="home"
        title="Как проходит заказ"
        description="Маршрут прозрачен с первого шага: фиксируем задачу, показываем точки контроля и заранее собираем запуск так, чтобы одна точка или сеть двигались по понятному сценарию."
        :steps="aboutPageData.workPrinciples"
      />

      <PriceNotesSection
        variant="home"
        title="Как собирается цена"
        description="Стоимость считаем по задаче и раскладываем по понятным составляющим. Для сетей и удалённых запусков это снижает ошибки и помогает сразу видеть объём работ."
        :notes="homePageData.pricingSummary"
      />

      <ProofSection
        variant="home"
        title="Доставка, монтаж и удалённый запуск"
        description="Если объект не в одном городе, проект всё равно можно вести управляемо: с дистанционным согласованием, понятной логистикой и отдельным монтажным сценарием по каждой точке."
        :bullets="homePageData.deliveryHighlights"
        :secondary-items="['Онлайн-согласование', 'Срочность за доплату', 'Монтаж по согласованию']"
        secondary-title="Удалённый запуск работает, когда по объекту заранее собраны вводные, понятны адреса и не теряется контроль по каждому этапу."
      />
    </div>

    <FaqSection
      variant="home"
      title="Частые вопросы по старту проекта"
      description="Разобрали базовые вопросы по расчёту, срокам, удалённому согласованию, монтажу и запуску одной точки или сети."
      :items="homeFaqs"
      :answer-cta="{ label: homePageData.finalCta.label, href: homePageData.finalCta.href }"
      :related-links="homeFaqLinks"
    />

    <FinalCtaSection
      variant="home"
      title="Нужен расчёт по точке, нескольким адресам или всей сети?"
      description="Отправьте фото объекта, размеры, логотип и краткое описание задачи. Если точек несколько, сразу укажите количество адресов и города, чтобы быстрее получить понятный старт проекта."
      :cta="homePageData.finalCta"
    />
</template>
