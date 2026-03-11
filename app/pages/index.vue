<script setup lang="ts">
import { cases } from "../data/cases";
import { homeFaqs } from "../data/faqs";
import { serviceCards } from "../data/service-summaries";
import { aboutPageData, contactInfo, globalTrustStats, homePageData, staticPageMeta } from "../data/site";
import { buildCollectionPageSchema, buildLocalBusinessSchema, buildOrganizationSchema } from "../utils/schema";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const publishedServiceCards = serviceCards.filter((item) => item.status === "published");
const featuredCases = cases.filter((item) => item.status === "published").slice(0, 3);
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
  <div>
    <HeroSection :hero="homePageData.hero" />

    <Container>
      <p class="max-w-3xl text-lg leading-8 text-muted">
        {{ homePageData.intro }}
      </p>
    </Container>

    <TrustStrip
      title="Короткие факты"
      description="Подтверждённые ограничения и условия, которые влияют на решение ещё до расчёта."
      :items="globalTrustStats"
    />

    <ServiceGridSection
      title="Основные коммерческие страницы"
      description="Не распыляемся на всё подряд. В v1 собираем только те направления, где есть нормальный спрос и понятная производственная логика."
      :cards="publishedServiceCards"
    />

    <IndustryListSection
      title="Кому это особенно полезно"
      description="Типичные клиенты, где важны управляемый подряд, сроки и repeatable quality."
      :items="homePageData.industries"
    />

    <CasePreviewSection
      title="Что уже умеет proof layer"
      description="Пока без вымышленных клиентов и адресов. Только типовые сценарии, близкие к реальным коммерческим задачам."
      :cases="featuredCases"
    />

    <ProcessSection
      title="Как проходит заказ"
      description="Базовый маршрут один: заявка, бриф, макет, согласование, предоплата, производство, доставка и монтаж."
      :steps="aboutPageData.workPrinciples"
    />

    <PriceNotesSection
      title="Как собирается цена"
      description="На сайте нет фальшивого прайса. Есть честная логика расчёта и понятный порог входа."
      :notes="homePageData.pricingSummary"
    />

    <ProofSection
      title="Доставка, монтаж и удалённый запуск"
      description="Сайт рассчитан на Казахстан, а не на один локальный офис и случайный самовывоз."
      :bullets="homePageData.deliveryHighlights"
      :secondary-items="['Онлайн-согласование', 'Срочность за доплату', 'Монтаж по согласованию']"
      secondary-title="Что важно помнить"
    />

    <FaqSection
      title="Частые вопросы по старту проекта"
      description="Цена, сроки, предоплата, доставка, монтаж и разница между интерьером и улицей."
      :items="homeFaqs"
    />

    <FinalCtaSection
      title="Нужен расчёт по конкретной точке или по сети?"
      description="Отправьте фото объекта, размеры и краткое описание задачи. Если адресов несколько, напишите количество точек сразу."
      :cta="homePageData.finalCta"
    />
  </div>
</template>
