<script setup lang="ts">
import type { CTAConfig } from "../../shared/types/content";
import { contactFaqs } from "../data/faqs";
import { contactPageData } from "../data/contact-page";
import { contactInfo, staticPageMeta } from "../data/site";
import { buildBreadcrumbSchema, buildContactPageSchema, buildFaqSchema, buildOrganizationSchema } from "../utils/schema";

type QuickContactRenderCard =
  | {
      kind: "method";
      title: string;
      value: string;
      note: string;
      href?: string;
      intent?: CTAConfig["intent"];
      trackingEvent?: string;
      available: boolean;
    }
  | {
      kind: "info";
      title: string;
      description: string;
      chips?: string[];
    };

const route = useRoute();
const breadcrumbs = useBreadcrumbs([{ label: "Контакты", href: "/kontakty/", current: true }]);
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;

const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildContactPageSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildFaqSchema(contactFaqs)
].filter(Boolean) as Record<string, unknown>[];

const {
  hero,
  lead,
  quickContact,
  almaty,
  kazakhstan,
  b2b,
  start,
  trust,
  seo,
  closingCta,
  relatedLinks
} = contactPageData;

const quickContactCards: QuickContactRenderCard[] = [
  ...quickContact.methods.map((method) => ({
    kind: "method" as const,
    title: method.label,
    value: method.value,
    note: method.note,
    href: method.href,
    intent: method.intent,
    trackingEvent: method.trackingEvent,
    available: method.available
  })),
  ...quickContact.sideCards.map((card) => ({
    kind: "info" as const,
    title: card.title,
    description: card.description,
    chips: card.chips
  }))
];

usePageSeo({
  meta: staticPageMeta.contacts,
  breadcrumbs,
  schemas
});
</script>

<template>
  <div>
    <PageTopStrip
      :breadcrumbs="breadcrumbs"
      :chips="lead.chips"
    />

    <HeroSection
      :hero="hero"
      variant="contact"
    />

    <PageLeadSection
      :intro="lead.intro"
      :stats="lead.stats"
      variant="contact"
    />

    <section
      class="section-divider section-space page-section page-section--contact"
      data-companion-lead-zone
    >
      <Container>
        <SectionHeader
          eyebrow="Быстрый контакт"
          :title="quickContact.title"
          :description="quickContact.description"
          variant="page"
        />

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(card, index) in quickContactCards"
            :key="card.title"
            :class="[
              'page-card h-full',
              card.kind === 'method' && index < 2 ? 'page-card--feature' : 'page-card--quiet'
            ]"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="page-card__title">
                {{ card.title }}
              </h3>
              <span
                v-if="card.kind === 'method'"
                class="page-chip shrink-0"
              >
                {{ card.available ? "Активно" : "Пока не опубликовано" }}
              </span>
            </div>

            <p
              v-if="card.kind === 'method'"
              class="page-card__value mt-4"
            >
              {{ card.value }}
            </p>

            <p
              v-if="card.kind === 'method'"
              class="page-card__description mt-3"
            >
              {{ card.note }}
            </p>

            <p
              v-else
              class="page-card__description mt-4"
            >
              {{ card.description }}
            </p>

            <div
              v-if="card.kind === 'info' && card.chips?.length"
              class="mt-4 flex flex-wrap gap-2"
            >
              <span
                v-for="chip in card.chips"
                :key="chip"
                class="page-chip"
              >
                {{ chip }}
              </span>
            </div>

            <div
              v-if="card.kind === 'method' && card.href"
              class="mt-5"
            >
              <ButtonLink
                :href="card.href"
                :label="card.intent === 'whatsapp' ? 'Написать' : 'Открыть форму'"
                :intent="card.intent || 'secondary'"
                :tracking-event="card.trackingEvent"
                :external="card.intent === 'whatsapp'"
                block
              />
            </div>
          </article>
        </div>
      </Container>
    </section>

    <section class="section-divider section-space page-section page-section--contact">
      <Container>
        <SectionHeader
          eyebrow="Алматы"
          :title="almaty.title"
          description="Локальный блок нужен не для ключей, а для ясного сигнала: мы базируемся в Алматы и понимаем формат коммерческих объектов в городе."
          variant="page"
        />

        <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_0.88fr]">
          <div class="grid gap-5">
            <p
              v-for="paragraph in almaty.paragraphs"
              :key="paragraph"
              class="text-sm leading-7 text-muted sm:text-base"
            >
              {{ paragraph }}
            </p>

            <div class="flex flex-wrap gap-3">
              <span
                v-for="chip in almaty.chips"
                :key="chip"
                class="page-chip"
              >
                {{ chip }}
              </span>
            </div>
          </div>

          <article class="page-card page-card--feature">
            <p class="eyebrow">
              {{ almaty.sidebar.title }}
            </p>
            <p class="page-card__description mt-3">
              {{ almaty.sidebar.description }}
            </p>

            <ul class="mt-5 grid gap-3">
              <li
                v-for="bullet in almaty.sidebar.bullets"
                :key="bullet"
                class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
              >
                {{ bullet }}
              </li>
            </ul>
          </article>
        </div>
      </Container>
    </section>

    <section class="section-divider section-space page-section page-section--contact">
      <Container>
        <SectionHeader
          eyebrow="Казахстан"
          :title="kazakhstan.title"
          description="Алматы остаётся базой, но проекты не заканчиваются на границе города. Для заказов по стране достаточно хороших вводных на старте."
          variant="page"
        />

        <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_0.88fr]">
          <div class="grid gap-5">
            <p
              v-for="paragraph in kazakhstan.paragraphs"
              :key="paragraph"
              class="text-sm leading-7 text-muted sm:text-base"
            >
              {{ paragraph }}
            </p>
          </div>

          <article class="page-card page-card--quiet">
            <p class="eyebrow">
              Города и формат старта
            </p>
            <p class="page-card__description mt-3">
              Можно начинать из любого города, если у вас есть фото объекта, адрес и короткое описание задачи.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="city in kazakhstan.cities"
                :key="city"
                class="page-chip"
              >
                {{ city }}
              </span>
            </div>
          </article>
        </div>
      </Container>
    </section>

    <section class="section-divider section-space page-section page-section--contact">
      <Container>
        <SectionHeader
          eyebrow="Для сетей и B2B"
          :title="b2b.title"
          :description="b2b.description"
          variant="page"
        />

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="(card, index) in b2b.cards"
            :key="card.title"
            :class="index === 0 ? 'page-card page-card--feature h-full' : 'page-card page-card--quiet h-full'"
          >
            <h3 class="page-card__title">
              {{ card.title }}
            </h3>
            <p class="page-card__description mt-3">
              {{ card.description }}
            </p>
          </article>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <span
            v-for="chip in b2b.chips"
            :key="chip"
            class="page-chip"
          >
            {{ chip }}
          </span>
        </div>
      </Container>
    </section>

    <section
      class="section-divider section-space page-section page-section--contact"
      data-companion-lead-zone
    >
      <Container>
        <SectionHeader
          eyebrow="Форма заявки"
          title="Опишите задачу один раз"
          description="Поля ниже помогают быстрее понять объект, формат конструкции и готовность проекта. Если задача сетевая, это сразу видно в форме."
          variant="page"
        />

        <div class="page-contact-grid contact-intake-layout mt-8">
          <aside class="contact-intake-panel page-card page-card--feature">
            <div class="contact-intake-panel__section">
              <p class="contact-intake-panel__eyebrow">
                Что удобно прислать
              </p>
              <div class="contact-intake-panel__chips">
                <span class="contact-intake-panel__chip">Фото фасада</span>
                <span class="contact-intake-panel__chip">Адрес точки</span>
                <span class="contact-intake-panel__chip">Размеры</span>
                <span class="contact-intake-panel__chip">Брендбук</span>
                <span class="contact-intake-panel__chip">Несколько адресов</span>
                <span class="contact-intake-panel__chip">Нужен монтаж</span>
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
                    Смотрим вводные и даём следующий коммерческий шаг.
                  </p>
                </article>
                <article class="contact-intake-panel__payoff">
                  <h2 class="contact-intake-panel__title">
                    Подсказка по формату
                  </h2>
                  <p class="contact-intake-panel__text">
                    Подскажем, какой тип конструкции лучше подходит под объект.
                  </p>
                </article>
                <article class="contact-intake-panel__payoff">
                  <h2 class="contact-intake-panel__title">
                    Следующий шаг без хаоса
                  </h2>
                  <p class="contact-intake-panel__text">
                    Если это сеть или rollout, сразу учитываем количество адресов и порядок запуска.
                  </p>
                </article>
              </div>
            </div>

            <div class="contact-intake-panel__section">
              <p class="contact-intake-panel__eyebrow">
                Для кого это удобно
              </p>
              <div class="contact-intake-panel__trust">
                <span class="contact-intake-panel__trust-item">Алматы</span>
                <span class="contact-intake-panel__trust-item">Казахстан</span>
                <span class="contact-intake-panel__trust-item">Одна точка</span>
                <span class="contact-intake-panel__trust-item">Сеть</span>
                <span class="contact-intake-panel__trust-item">Быстрый старт</span>
              </div>
            </div>
          </aside>

          <LeadForm
            :source-page="route.path"
            :preset-city="contactInfo.primaryCity ?? ''"
            :show-locations="true"
            variant="contact"
          />
        </div>
      </Container>
    </section>

    <ProcessSection
      eyebrow="Как удобнее начать"
      :title="start.title"
      :description="start.description"
      :steps="start.steps"
      variant="contact"
    />

    <TrustStrip
      eyebrow="Честные сигналы"
      title="Без фальшивых адресов и пустых обещаний"
      description="Ниже только те вещи, которые можно безопасно сказать на контактах: база, география, формат старта и сценарии работы."
      :items="trust"
      variant="contact"
    />

    <section class="section-divider section-space page-section page-section--contact">
      <Container>
        <SectionHeader
          eyebrow="SEO-текст"
          :title="seo.title"
          :description="seo.description"
          variant="page"
        />

        <div class="mt-8 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div class="grid gap-5">
            <p
              v-for="paragraph in seo.paragraphs"
              :key="paragraph"
              class="text-sm leading-7 text-muted sm:text-base"
            >
              {{ paragraph }}
            </p>
          </div>

          <article class="page-card page-card--feature">
            <p class="eyebrow">
              Что покрывает страница
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="chip in seo.chips"
                :key="chip"
                class="page-chip"
              >
                {{ chip }}
              </span>
            </div>
            <p class="page-card__description mt-4">
              Текст ниже помогает охватить коммерческий и локальный интент без лишнего шума и без SEO-спама.
            </p>
          </article>
        </div>
      </Container>
    </section>

    <FaqSection
      title="Частые вопросы по контакту и старту"
      description="Эти ответы закрывают географию, типы конструкций, удалённый старт и сетевые запросы."
      :items="contactFaqs"
      variant="contact"
    />

    <FinalCtaSection
      v-bind="closingCta"
      variant="contact"
    />

    <RelatedLinksSection
      title="Куда перейти дальше"
      description="Контакты не должны быть тупиком. Ниже разделы, которые помогают продолжить выбор и закрыть вопросы до заявки."
      :links="relatedLinks"
      variant="contact"
    />
  </div>
</template>
