import type { CTAConfig } from "../../shared/types/content";
import { staticPagePaths } from "../utils/routes";

export const leadFormHref = `${staticPagePaths.contacts}#lead-form`;
export const baseMaterials = ["Акрил 3 мм", "Оргстекло 5 мм", "ПВХ 8 мм", "Светодиоды", "Блоки питания"];

export function makeHeroActions(primaryLabel: string, secondaryHref = staticPagePaths.cases): CTAConfig[] {
  return [
    {
      label: primaryLabel,
      href: leadFormHref,
      intent: "calculate",
      trackingEvent: "click_calculate"
    },
    {
      label: "Смотреть кейсы",
      href: secondaryHref,
      intent: "secondary",
      trackingEvent: "open_case"
    }
  ];
}

export function makeFinalCta(label: string): CTAConfig {
  return {
    label,
    href: leadFormHref,
    intent: "primary",
    trackingEvent: "click_calculate",
    note: "Приложите фото объекта и короткое описание задачи."
  };
}
