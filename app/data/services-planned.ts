import type { ServicePageData } from "../../shared/types/content";
import { servicePath, staticPagePaths } from "../utils/routes";
import { makeFinalCta, makeHeroActions } from "./services-helpers";

export const plannedServices: ServicePageData[] = [
  {
    slug: "zamena-vyveski",
    status: "planned",
    name: "Замена вывески",
    navLabel: "Замена вывески",
    h1: "Замена вывески",
    meta: {
      title: "Замена вывески | Neon Market",
      description: "Планируемая страница. Не публиковать без нормального контента и подтверждённого производственного сценария.",
      path: servicePath("zamena-vyveski"),
      noindex: true
    },
    hero: {
      eyebrow: "Planned",
      title: "Страница замены вывески готовится к публикации",
      description: "Не публикуйте этот маршрут, пока не собран отдельный контент по демонтажу, замене и ограничениям по объекту.",
      facts: ["planned", "noindex", "content required"],
      actions: makeHeroActions("Запросить расчёт")
    },
    intro: "Служебная запись для будущего расширения семантики без тонкой и дублирующей страницы.",
    sections: ["hero", "faq", "cta", "related"],
    useCases: ["Будущая страница", "Нужен отдельный сценарий"],
    industries: ["Будущая страница", "Нужен отдельный сценарий"],
    materials: ["Будущая страница"],
    proofHighlights: ["Не публиковать без реального контента.", "Нужен отдельный сценарий по демонтажу и замене."],
    priceMode: "request-only",
    minimumOrderApplies: true,
    installationMode: "by-agreement",
    isOutdoor: true,
    isIndoorOnly: false,
    supportsUrgent: false,
    supportsMultiLocation: false,
    priceNotes: [{ title: "Planned", text: "Черновая запись.", emphasis: "Не публиковать." }],
    processSteps: [{ title: "Planned", description: "Нужно подготовить отдельный контент." }],
    trustItems: [{ label: "Статус", value: "planned", description: "Пока не опубликовано.", evidenceLevel: "placeholder" }],
    faq: [
      { id: "replace-planned-1", question: "Когда публиковать эту страницу?", answer: "Только после подготовки отдельного контента, отличающегося от монтажа и новых вывесок." },
      { id: "replace-planned-2", question: "Почему нельзя дублировать монтаж?", answer: "Потому что иначе страница станет thin page и будет каннибализировать уже опубликованные маршруты." },
      { id: "replace-planned-3", question: "Что нужно для публикации?", answer: "Сценарии замены, ограничения по демонтажу, отдельная FAQ-логика и реальные связи с кейсами." },
      { id: "replace-planned-4", question: "Почему здесь noindex?", answer: "Чтобы planned-страница не попала в индекс раньше времени." }
    ],
    relatedLinks: [{ label: "Монтаж вывесок", href: servicePath("montazh-vyvesok"), description: "Ближайшая опубликованная страница по логике объекта." }],
    caseIds: ["regional-delivery-pack"],
    cta: makeFinalCta("Открыть форму")
  },
  {
    slug: "remont-vyvesok",
    status: "planned",
    name: "Ремонт вывесок",
    navLabel: "Ремонт вывесок",
    h1: "Ремонт вывесок",
    meta: {
      title: "Ремонт вывесок | Neon Market",
      description: "Планируемая страница. Публиковать только после появления отдельного контента и подтверждённой модели работ.",
      path: servicePath("remont-vyvesok"),
      noindex: true
    },
    hero: {
      eyebrow: "Planned",
      title: "Страница ремонта вывесок пока не готова к публикации",
      description: "Не выводите её в sitemap и навигацию, пока не будет отдельного контента по диагностике, ремонту и ограничениям по модели обслуживания.",
      facts: ["planned", "noindex", "needs dedicated content"],
      actions: makeHeroActions("Запросить расчёт")
    },
    intro: "Черновая запись для будущего расширения. Не должна конкурировать с монтажом и новыми проектами.",
    sections: ["hero", "faq", "cta", "related"],
    useCases: ["Будущая страница", "Нужен отдельный сценарий"],
    industries: ["Будущая страница", "Нужен отдельный сценарий"],
    materials: ["Будущая страница"],
    proofHighlights: ["Нужна отдельная модель ремонта.", "Без реального контента публиковать нельзя."],
    priceMode: "request-only",
    minimumOrderApplies: true,
    installationMode: "by-agreement",
    isOutdoor: true,
    isIndoorOnly: false,
    supportsUrgent: false,
    supportsMultiLocation: false,
    priceNotes: [{ title: "Planned", text: "Черновая запись.", emphasis: "Не публиковать." }],
    processSteps: [{ title: "Planned", description: "Нужно подготовить отдельную логику ремонта." }],
    trustItems: [{ label: "Статус", value: "planned", description: "Не входит в v1.", evidenceLevel: "placeholder" }],
    faq: [
      { id: "repair-planned-1", question: "Почему страница ремонта не опубликована?", answer: "Потому что без подтверждённой модели работ это будет слабая и дублирующая страница." },
      { id: "repair-planned-2", question: "Что нужно подготовить до публикации?", answer: "Типы неисправностей, географию ремонта, ограничения по выезду и честный SLA." },
      { id: "repair-planned-3", question: "Можно ли связать её с монтажом?", answer: "Только частично. Это разные пользовательские задачи, и контент должен их различать." },
      { id: "repair-planned-4", question: "Почему у planned-страниц есть data contract?", answer: "Чтобы расширение v2 не ломало типы и route contract проекта." }
    ],
    relatedLinks: [{ label: "Контакты", href: staticPagePaths.contacts, description: "На текущем этапе заявки идут через общую форму." }],
    caseIds: ["regional-delivery-pack"],
    cta: makeFinalCta("Открыть форму")
  }
];
