import type { NavItem } from "../../shared/types/content";
import { getPublishedSupportPages } from "../utils/content-guards";
import { staticPagePaths } from "../utils/routes";
import { publishedCityNavigation } from "./city-summaries";
import { publishedServiceNavigation } from "./service-summaries";
import { supportPages } from "./support-pages";

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

export const supportNavigation: NavItem[] = getPublishedSupportPages(supportPages)
  .filter((page) => page.slug !== "politika-konfidentsialnosti")
  .map((page) => ({
    label: page.navLabel,
    href: page.meta.path,
    description: page.h1
  }));

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
    description: "Типовые сценарии и proof layer"
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
