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
const homeHeroFrames = [
  { src: "/images/hero/1.avif", alt: "", fetchPriority: "high" as const, loading: "eager" as const },
  { src: "/images/hero/2.avif", alt: "", fetchPriority: "auto" as const, loading: "lazy" as const },
  { src: "/images/hero/3.avif", alt: "", fetchPriority: "auto" as const, loading: "lazy" as const },
  { src: "/images/hero/4.avif", alt: "", fetchPriority: "auto" as const, loading: "lazy" as const },
  { src: "/images/hero/5.avif", alt: "", fetchPriority: "auto" as const, loading: "lazy" as const },
  { src: "/images/hero/6.avif", alt: "", fetchPriority: "auto" as const, loading: "lazy" as const },
 
];
const homeTransitionImage = "/images/bg/bg.avif";

const heroQuickLinks = [
  ...homeCityNavigation.slice(0, 3).map((item) => ({
    label: item.label,
    href: item.href
  })),
  ...[
    { slug: "fasadnye-vyveski", label: "Фасадные" },
    { slug: "svetovye-koroba", label: "Световые короба" },
    { slug: "neonovye-vyveski", label: "Неон" },
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

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: homeHeroFrames[0]!.src,
      type: "image/avif"
    },
    {
      rel: "preload",
      as: "image",
      href: homeTransitionImage,
      type: "image/avif"
    }
  ]
});
</script>

<template>
  <div class="home-page">
    <HeroSection
      :hero="homeHero"
      variant="home"
      media-mode="image"
      :media-frames="homeHeroFrames"
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

    <ServiceGridSection
      variant="home"
      title="Какие вывески делаем для бизнеса"
      description="Собрали направления под реальные задачи бизнеса: оформить фасад, сделать точку заметной, собрать единый формат для сети и запустить проект под ключ без поиска разных подрядчиков."
      :description-highlights="[
        { text: 'сделать точку заметной', tone: 'warm' },
        { text: 'единый формат', tone: 'gas' },
        { text: 'проект под ключ', tone: 'berry' }
      ]"
      :cards="publishedServiceCards"
    />

    <div class="home-confidence-band">
      <CasePreviewSection
        variant="home"
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
    />

    <FinalCtaSection
      variant="home"
      title="Нужен расчёт по точке, нескольким адресам или всей сети?"
      description="Отправьте фото объекта, размеры, логотип и краткое описание задачи. Если точек несколько, сразу укажите количество адресов и города, чтобы быстрее получить понятный старт проекта."
      :cta="homePageData.finalCta"
    />
  </div>
</template>
