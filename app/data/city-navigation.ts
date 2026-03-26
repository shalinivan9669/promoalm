import type { NavItem } from "../../shared/types/content";
import { cityPath } from "../utils/routes";

export const publishedCityNavigation: NavItem[] = [
  {
    label: "Алматы",
    href: cityPath("almaty"),
    description: "Фасадные и сетевые вывески для плотной городской среды."
  },
  {
    label: "Астана",
    href: cityPath("astana"),
    description: "Крышные и фасадные решения для заметных объектов."
  },
  {
    label: "Шымкент",
    href: cityPath("shymkent"),
    description: "Быстрый удалённый запуск без лишних пересборок."
  }
];
