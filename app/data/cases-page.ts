import type { HeroBlock } from "../../shared/types/content";

export const casesPageHero: HeroBlock = {
  eyebrow: "Кейсы и сценарии",
  title: "Кейсы и сценарии вывесок для бизнеса",
  description:
    "Здесь собраны типовые сценарии под реальные B2B-задачи: фасадные вывески, световые короба, объёмные буквы, сетевые rollout-проекты и объекты со сложным монтажом.",
  facts: ["Типовые B2B-сценарии", "Связка с услугами и городами", "Понятный путь к расчёту"],
  actions: [
    {
      label: "Запросить проект",
      href: "/kontakty/#lead-form",
      intent: "calculate",
      trackingEvent: "click_calculate"
    }
  ]
};

export const casesPageLeadIntro =
  "Показываем только типовые сценарии без выдуманных адресов, логотипов и псевдокейсов. Раздел помогает быстро понять формат задачи, ограничения по объекту и подход к запуску.";
