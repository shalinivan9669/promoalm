import type { NavItem } from "../../shared/types/content";
import { staticPagePaths } from "../utils/routes";
import { publishedCityNavigation } from "./city-navigation";
import { publishedServiceNavigation } from "./service-summaries";
import { publishedSupportNavigation } from "./support-navigation";

export interface PrimaryNavigationLink extends NavItem {
  kind: "link";
}

export interface PrimaryNavigationGroup {
  kind: "group";
  label: string;
  description: string;
  items: NavItem[];
}

export type PrimaryNavigationItem = PrimaryNavigationLink | PrimaryNavigationGroup;

export const serviceNavigation: NavItem[] = publishedServiceNavigation;

export const cityNavigation: NavItem[] = publishedCityNavigation;

export const supportNavigation: NavItem[] = publishedSupportNavigation;

export const homeCityNavigation: NavItem[] = cityNavigation;

export const primaryNavigation: PrimaryNavigationItem[] = [
  {
    kind: "group",
    label: "Услуги",
    description: "Основные коммерческие направления",
    items: serviceNavigation
  },
  {
    kind: "group",
    label: "Города",
    description: "Опубликованные city pages по Казахстану",
    items: cityNavigation
  },
  {
    kind: "link",
    label: "Кейсы",
    href: staticPagePaths.cases,
    description: "Типовые сценарии по вывескам"
  },
  {
    kind: "group",
    label: "Условия",
    description: "Доставка, оплата, гарантия и FAQ",
    items: supportNavigation
  },
  {
    kind: "link",
    label: "О компании",
    href: staticPagePaths.about,
    description: "Как работает подрядчик"
  },
  {
    kind: "link",
    label: "Контакты",
    href: staticPagePaths.contacts,
    description: "Форма заявки и каналы связи"
  }
];

export function flattenPrimaryNavigation(items: PrimaryNavigationItem[] = primaryNavigation): NavItem[] {
  return items.flatMap((item) =>
    item.kind === "link"
      ? [{ label: item.label, href: item.href, description: item.description }]
      : item.items
  );
}

export const footerNavigation = {
  services: serviceNavigation,
  support: [
    ...supportNavigation,
    { label: "Политика конфиденциальности", href: staticPagePaths.privacy, description: "Обработка данных из формы" }
  ] satisfies NavItem[],
  company: [
    { label: "О компании", href: staticPagePaths.about, description: "Подход и фокус" },
    { label: "Кейсы", href: staticPagePaths.cases, description: "Типовые сценарии" },
    { label: "Контакты", href: staticPagePaths.contacts, description: "Форма заявки" }
  ] satisfies NavItem[],
  cities: cityNavigation
};
