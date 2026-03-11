import type { CityPageData } from "../../shared/types/content";
import { cityPath, staticPagePaths } from "../utils/routes";

const leadFormHref = `${staticPagePaths.contacts}#lead-form`;

function plannedCity(slug: "karaganda" | "aktobe" | "atyrau", city: string): CityPageData {
  return {
    slug,
    status: "planned",
    city,
    h1: `Вывески для бизнеса в ${city}`,
    meta: {
      title: `Вывески для бизнеса в ${city} | Neon Market`,
      description: "Планируемая city page. Публиковать только после появления отдельного local angle и логистического контента.",
      path: cityPath(slug),
      noindex: true
    },
    hero: {
      eyebrow: "Planned",
      title: "Черновая страница города",
      description: "Маршрут подготовлен для v2, но не должен появляться в индексе и навигации.",
      facts: ["planned", "noindex", "needs city-specific content"],
      actions: [{ label: "Открыть форму", href: leadFormHref, intent: "primary" }]
    },
    intro: "Черновая запись для расширения города.",
    sections: ["hero", "faq", "cta", "related"],
    localAngle: "Черновая local angle до наполнения.",
    logisticsNote: "Черновая логистическая заметка до наполнения.",
    serviceModel: "delivery-only",
    hasLocalAddress: false,
    hasRealCases: false,
    serviceHighlights: ["Черновик", "Черновик"],
    trustItems: [{ label: "Статус", value: "planned", description: "Не публиковать.", evidenceLevel: "placeholder" }],
    faq: [
      { id: `${slug}-1`, question: "Когда публиковать страницу?", answer: "Когда будет отдельный содержательный контент." },
      { id: `${slug}-2`, question: "Почему нельзя брать общий шаблон?", answer: "Потому что city page без local angle станет тонкой страницей." },
      { id: `${slug}-3`, question: "Что обязательно нужно?", answer: "Уникальный hero, logistics note, FAQ и связи с услугами." },
      { id: `${slug}-4`, question: "Почему route скрыт?", answer: "Чтобы v2-заготовка не вела к SEO-мусору." }
    ],
    relatedServiceSlugs: ["vyveski-pod-klyuch"],
    relatedCaseIds: ["regional-delivery-pack"],
    relatedLinks: [{ label: "Контакты", href: staticPagePaths.contacts, description: "На текущем этапе заявки принимает общая форма." }],
    cta: { label: "Открыть форму", href: leadFormHref, intent: "primary" }
  };
}

export const plannedCitiesData: CityPageData[] = [
  plannedCity("karaganda", "Караганде"),
  plannedCity("aktobe", "Актобе"),
  plannedCity("atyrau", "Атырау")
];
