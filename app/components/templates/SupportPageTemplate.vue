<script setup lang="ts">
import type { BreadcrumbItem, SupportPageData } from "../../../shared/types/content";

defineProps<{
  page: SupportPageData;
  breadcrumbs: BreadcrumbItem[];
}>();
</script>

<template>
  <div>
    <HeroSection
      :hero="page.hero"
      variant="support"
    />

    <PageLeadSection
      :breadcrumbs="breadcrumbs"
      :chips="page.highlights"
      variant="support"
    />

    <SupportContentSection
      title="Что нужно знать"
      description="Коротко и по делу: без длинных юридических простыней и без пустого SEO-текста."
      :sections="page.sections"
      :highlights="page.highlights"
      variant="support"
    />

    <TrustStrip
      title="Короткие факты"
      description="Только то, что влияет на решение и ожидания по проекту."
      :items="page.trustItems"
      variant="support"
    />

    <FaqSection
      v-if="page.faq?.length"
      title="Частые вопросы"
      description="Дополнительные ответы по странице."
      :items="page.faq"
      variant="support"
    />

    <RelatedLinksSection
      title="Связанные разделы"
      description="Переходите туда, где продолжение маршрута логично, а не случайно."
      :links="page.relatedLinks"
      variant="support"
    />

    <FinalCtaSection
      title="Если нужна конкретика по вашему проекту"
      description="Лучше не гадать по абстрактной странице, а сразу отправить фото объекта и короткое описание задачи."
      :cta="page.cta"
      variant="support"
    />
  </div>
</template>
