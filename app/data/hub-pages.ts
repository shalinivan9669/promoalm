import type { CTAConfig, CaseStudy, HeroBlock, RelatedLink, SeoMetaInput, ServiceCard, TrustItem } from "../../shared/types/content";
import { cases } from "./cases";
import { publishedCitiesData } from "./cities-published";
import { serviceCards } from "./services";
import { staticPagePaths } from "../utils/routes";

type HubStat = Pick<TrustItem, "label" | "value" | "description" | "evidenceLevel">;

interface ServicesHubPageData {
  meta: SeoMetaInput;
  hero: HeroBlock;
  intro: string;
  stats: HubStat[];
  trustTitle: string;
  trustDescription: string;
  serviceCards: ServiceCard[];
  caseStudies: CaseStudy[];
  relatedLinks: RelatedLink[];
  relatedTitle: string;
  relatedDescription: string;
  cta: CTAConfig;
}

interface CitiesHubPageData {
  meta: SeoMetaInput;
  hero: HeroBlock;
  intro: string;
  stats: HubStat[];
  trustTitle: string;
  trustDescription: string;
  cityLinks: RelatedLink[];
  serviceCards: ServiceCard[];
  caseStudies: CaseStudy[];
  relatedLinks: RelatedLink[];
  relatedTitle: string;
  relatedDescription: string;
  cta: CTAConfig;
}

const publishedCases = cases.filter((item) => item.status === "published");
const publishedServiceCards = serviceCards.filter((item) => item.status === "published");
const coreCityServiceSlugs: Set<ServiceCard["slug"]> = new Set([
  "fasadnye-vyveski",
  "svetovye-koroba",
  "obemnye-bukvy",
  "vyveski-dlya-seti",
  "vyveski-pod-klyuch",
  "montazh-vyvesok"
] as const);

const coreCityServiceCards = publishedServiceCards.filter((item) => coreCityServiceSlugs.has(item.slug));

const cityLinks: RelatedLink[] = publishedCitiesData.map((city) => ({
  label: city.city,
  href: city.meta.path,
  description: city.localAngle
}));

const hubCta: CTAConfig = {
  label: "Рассчитать проект",
  href: "/kontakty/#lead-form",
  intent: "primary",
  trackingEvent: "click_calculate"
};

export const servicesHubPageData: ServicesHubPageData = {
  meta: {
    title: "Услуги по вывескам для бизнеса в Казахстане | Neon Market",
    description:
      "Собрали все основные услуги Neon Market в одной структуре: фасадные вывески, объёмные буквы, световые короба, монтаж и проекты для сети.",
    path: "/uslugi/"
  },
  hero: {
    eyebrow: "Карта услуг",
    title: "Услуги по вывескам для бизнеса",
    description:
      "Это главный хаб по услугам. Отсюда переходят в широкие money pages, узкие сценарии для сети, кейсы и контактный расчёт без лишних дублей.",
    facts: ["Опубликованные услуги", "Фасад, свет, монтаж", "Одна точка и сеть"],
    actions: [
      {
        label: "Рассчитать проект",
        href: hubCta.href,
        intent: "primary",
        trackingEvent: hubCta.trackingEvent
      },
      {
        label: "Смотреть кейсы",
        href: staticPagePaths.cases,
        intent: "secondary",
        trackingEvent: "open_case"
      }
    ]
  },
  intro:
    "Собрали все рабочие направления Neon Market в одну карту. Если вам нужна фасадная вывеска, объёмные буквы, световой короб, монтаж или сценарий для сети, отсюда проще всего попасть в нужную страницу без каннибализации.",
  trustTitle: "Что важно в хабе услуг",
  trustDescription:
    "Эта страница нужна, чтобы разнести широкий спрос, узкие сценарии и локальные маршруты по отдельным URL без повторов и подмены интента.",
  stats: [
    {
      label: "Направлений",
      value: "7 опубликованных",
      description: "Каждая услуга ведёт в отдельный коммерческий интент, а не в общий текстовый каталог.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Ядро спроса",
      value: "Фасад / свет / монтаж",
      description: "Держим на виду форматы, которые чаще всего приводят к расчёту и запуску.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Сценарии",
      value: "Одна точка и сеть",
      description: "Узкие страницы нужны для rollout, нескольких адресов и франшизных запусков.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Старт",
      value: "Фото + адрес + размеры",
      description: "Этого достаточно, чтобы собрать первый честный расчёт по объекту.",
      evidenceLevel: "confirmed"
    }
  ],
  serviceCards: publishedServiceCards,
  caseStudies: publishedCases.slice(0, 3),
  relatedLinks: [
    {
      label: "Города",
      href: staticPagePaths.goroda,
      description: "Локальные страницы по Алматы, Астане и Шымкенту."
    },
    {
      label: "Кейсы",
      href: staticPagePaths.cases,
      description: "Сценарии запуска, которые показывают логику по типам объектов."
    },
    {
      label: "FAQ",
      href: staticPagePaths.faq,
      description: "Короткие ответы по цене, срокам, монтажу и старту проекта."
    },
    {
      label: "Контакты",
      href: staticPagePaths.contacts,
      description: "Отправьте вводные на расчёт и быстро получите первый ответ."
    }
  ],
  relatedTitle: "Куда перейти дальше",
  relatedDescription:
    "Если уже понятен тип задачи, следующий шаг очевиден: города, кейсы, FAQ или быстрый расчёт через контактную форму.",
  cta: hubCta
};

export const citiesHubPageData: CitiesHubPageData = {
  meta: {
    title: "Вывески по городам Казахстана — Алматы, Астана, Шымкент | Neon Market",
    description:
      "Выберите город и перейдите на локальную страницу Neon Market: расчёт, логистика, монтажный сценарий и старт по объекту.",
    path: "/goroda/"
  },
  hero: {
    eyebrow: "Локальные страницы",
    title: "Вывески по городам Казахстана",
    description:
      "Это хаб для локального спроса. Здесь не копии услуг, а отдельные страницы по городам, где важны расчёт по объекту, логистика и монтажный сценарий.",
    facts: ["3 опубликованных города", "Расчёт по объекту", "Локальная логистика"],
    actions: [
      {
        label: "Рассчитать по городу",
        href: hubCta.href,
        intent: "primary",
        trackingEvent: hubCta.trackingEvent
      },
      {
        label: "Смотреть услуги",
        href: staticPagePaths.uslugi,
        intent: "secondary",
        trackingEvent: "open_services"
      }
    ]
  },
  intro:
    "Выберите город, чтобы перейти на отдельную локальную страницу. На каждой из них мы показываем не только расчёт, но и то, как проходит согласование, логистика и монтаж на месте.",
  trustTitle: "Что важно до старта по городу",
  trustDescription:
    "Локальная страница нужна не ради дублирования, а ради честного маршрута расчёта и монтажа на объекте.",
  stats: [
    {
      label: "Города",
      value: "Алматы, Астана, Шымкент",
      description: "Только опубликованные локальные страницы без псевдосеток и doorway-клонов.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Модель",
      value: "Локальный расчёт",
      description: "Сначала смотрим объект, потом собираем смету и маршрут запуска.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Старт",
      value: "Фото + адрес",
      description: "Этого достаточно, чтобы дать первый рабочий ответ по городу.",
      evidenceLevel: "confirmed"
    },
    {
      label: "Фокус",
      value: "Фасад, свет, монтаж",
      description: "На локальных страницах показываем именно эти сценарии, а не размытый общий текст.",
      evidenceLevel: "confirmed"
    }
  ],
  cityLinks,
  serviceCards: coreCityServiceCards,
  caseStudies: publishedCases.slice(1, 4),
  relatedLinks: [
    {
      label: "Услуги",
      href: staticPagePaths.uslugi,
      description: "Сначала посмотрите ядро услуг, если ещё не выбрали формат."
    },
    {
      label: "Кейсы",
      href: staticPagePaths.cases,
      description: "Сценарии, которые помогают понять тип задачи и маршрут запуска."
    },
    {
      label: "FAQ",
      href: staticPagePaths.faq,
      description: "Короткие ответы по расчёту, доставке и монтажу по городам."
    },
    {
      label: "Контакты",
      href: staticPagePaths.contacts,
      description: "Отправьте фото объекта, адрес и город для быстрого расчёта."
    }
  ],
  relatedTitle: "Куда перейти дальше",
  relatedDescription:
    "Если город уже выбран, переходите в локальную страницу. Если нет, сначала откройте услуги или кейсы, чтобы не распыляться на лишние шаги.",
  cta: {
    label: "Получить расчет",
    href: hubCta.href,
    intent: "primary",
    trackingEvent: hubCta.trackingEvent
  }
};
