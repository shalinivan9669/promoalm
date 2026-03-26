import type { NavItem } from "../../shared/types/content";
import { cityPath } from "../utils/routes";

export const publishedCityNavigation: NavItem[] = [
  {
    label: "Алматы",
    href: cityPath("almaty"),
    description: "Фасадные вывески, световые короба и rollout для точек в плотной городской среде."
  },
  {
    label: "Астана",
    href: cityPath("astana"),
    description: "Фасадные и крышные решения для объектов, где важны высота, конструктив и дистанция чтения."
  },
  {
    label: "Шымкент",
    href: cityPath("shymkent"),
    description: "Быстрый удалённый запуск по фасадным вывескам, световым коробам и проектам под ключ."
  }
];
