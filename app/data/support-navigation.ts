import type { NavItem } from "../../shared/types/content";
import { staticPagePaths } from "../utils/routes";

export const publishedSupportNavigation: NavItem[] = [
  {
    label: "FAQ",
    href: staticPagePaths.faq,
    description: "Цена, сроки, монтаж, доставка и запуск без лишней воды."
  },
  {
    label: "Доставка",
    href: staticPagePaths.delivery,
    description: "Логистика, удалённый старт и работа по Казахстану."
  },
  {
    label: "Оплата и гарантия",
    href: staticPagePaths.payment,
    description: "Предоплата, сроки запуска и гарантийный контур проекта."
  }
];
