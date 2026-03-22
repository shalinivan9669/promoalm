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
  title: "Самый короткий путь к расчёту: фото объекта, размеры и короткая задача",
  description:
    "Если прямой номер и WhatsApp ещё не подключены, форма остаётся главным маршрутом. Для v1 этого достаточно: лид захватывается быстро, без лишнего слоя на странице контактов.",
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
    <HeroSection
      :hero="hero"
      variant="contact"
    />

    <PageLeadSection
      :breadcrumbs="breadcrumbs"
      :chips="hero.facts"
      variant="contact"
    />

    <ContactChannelsSection
      :channels="contactInfo.channels"
      variant="contact"
    />

    <section
      class="section-divider section-space page-section page-section--contact"
      data-companion-lead-zone
    >
      <Container>
        <SectionHeader
          eyebrow="Форма расчёта"
          title="Опишите задачу один раз"
          description="Не делаем из формы мини-CRM. Нужен только минимум, который позволяет дать следующий коммерческий шаг."
          variant="page"
        />
        <div class="page-contact-grid contact-intake-layout mt-8">
          <aside class="contact-intake-panel page-card page-card--feature">
            <div class="contact-intake-panel__section">
              <p class="contact-intake-panel__eyebrow">
                Что достаточно прислать
              </p>
              <div class="contact-intake-panel__chips">
                <span class="page-chip contact-intake-panel__chip">Фото объекта</span>
                <span class="page-chip contact-intake-panel__chip">Размер или ориентир</span>
                <span class="page-chip contact-intake-panel__chip">Логотип / название</span>
                <span class="page-chip contact-intake-panel__chip">Город</span>
                <span class="page-chip contact-intake-panel__chip">Нужен ли монтаж</span>
              </div>
            </div>

            <div class="contact-intake-panel__section">
              <p class="contact-intake-panel__eyebrow">
                Что получите
              </p>
              <div class="contact-intake-panel__payoffs">
                <article class="contact-intake-panel__payoff">
                  <h2 class="contact-intake-panel__title">
                    Предварительный расчёт
                  </h2>
                  <p class="contact-intake-panel__text">
                    Быстро соберём ориентир по стоимости и следующему шагу.
                  </p>
                </article>
                <article class="contact-intake-panel__payoff">
                  <h2 class="contact-intake-panel__title">
                    Рекомендацию по формату
                  </h2>
                  <p class="contact-intake-panel__text">
                    Подскажем, что лучше подойдёт под фасад, интерьер или сеть.
                  </p>
                </article>
                <article class="contact-intake-panel__payoff">
                  <h2 class="contact-intake-panel__title">
                    Ответ в удобный канал
                  </h2>
                  <p class="contact-intake-panel__text">
                    Вернёмся с ответом в WhatsApp или по телефону, как вам удобнее.
                  </p>
                </article>
              </div>
            </div>

            <div class="contact-intake-panel__section">
              <p class="contact-intake-panel__eyebrow">
                Подходит для
              </p>
              <div class="contact-intake-panel__trust">
                <span class="contact-intake-panel__trust-item">По Казахстану</span>
                <span class="contact-intake-panel__trust-item">Сетевые проекты</span>
                <span class="contact-intake-panel__trust-item">Монтаж обсудим</span>
                <span class="contact-intake-panel__trust-item">Для бизнеса</span>
              </div>
            </div>
          </aside>

          <LeadForm
            :source-page="route.path"
            :show-locations="false"
            variant="contact"
          />
        </div>
      </Container>
    </section>

    <FaqSection
      title="FAQ по заявке"
      description="Коротко о том, что чаще всего мешает отправить форму с первого раза."
      :items="contactFaqs"
      variant="contact"
    />
  </div>
</template>
