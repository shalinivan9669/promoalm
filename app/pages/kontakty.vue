<script setup lang="ts">
import { contactFaqs } from "../data/faqs";
import { contactInfo, staticPageMeta } from "../data/site";
import { buildBreadcrumbSchema, buildContactPageSchema, buildOrganizationSchema } from "../utils/schema";

const route = useRoute();
const breadcrumbs = useBreadcrumbs([{ label: "Контакты", href: "/kontakty/", current: true }]);
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildContactPageSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs)
];

const hero = {
  eyebrow: "Контакты и форма",
  title: "Самый короткий путь к расчёту — прислать фото объекта и задачу",
  description:
    "Если реальный телефон и WhatsApp владелец ещё не подключил, форма остаётся главным маршрутом. Для v1 этого достаточно, чтобы не держать пустую контактную страницу.",
  facts: ["Форма для расчёта", "Город можно не указывать", "Монтаж и сеть отмечаются в заявке"],
  actions: [
    {
      label: "Открыть форму",
      href: "#lead-form",
      intent: "calculate" as const,
      trackingEvent: "click_calculate"
    }
  ]
};

usePageSeo({
  meta: staticPageMeta.contacts,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <HeroSection :hero="hero" />

    <Container>
      <Breadcrumbs :items="breadcrumbs" />
    </Container>

    <ContactChannelsSection :channels="contactInfo.channels" />

    <section class="section-divider section-space">
      <Container>
        <SectionHeader
          eyebrow="Форма расчёта"
          title="Опишите задачу один раз"
          description="Не делаем из формы мини-CRM. Нам нужен только тот минимум, который позволяет дать рабочий следующий шаг."
        />
        <div class="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div class="surface p-6">
            <h2 class="text-xl font-semibold text-white">
              Что написать в заявке
            </h2>
            <ul class="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>Фото объекта или помещения</li>
              <li>Примерные размеры или ориентир по масштабу</li>
              <li>Логотип или название</li>
              <li>Город и нужен ли монтаж</li>
              <li>Количество точек, если проект сетевой</li>
            </ul>
          </div>
          <LeadForm
            :source-page="route.fullPath"
            :show-locations="false"
          />
        </div>
      </Container>
    </section>

    <FaqSection
      title="FAQ по заявке"
      description="Коротко о том, что чаще всего мешает отправить форму с первого раза."
      :items="contactFaqs"
    />
  </div>
</template>
