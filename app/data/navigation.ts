import type { NavItem } from "../../shared/types/content";
import { getPublishedSupportPages } from "../utils/content-guards";
import { staticPagePaths } from "../utils/routes";
import { publishedCityNavigation } from "./city-summaries";
import { publishedServiceNavigation } from "./service-summaries";
import { supportPages } from "./support-pages";

const publishedSupportPages = getPublishedSupportPages(supportPages).filter(
  (page) => !["faq", "politika-konfidentsialnosti"].includes(page.slug)
);

export const primaryNavigation: NavItem[] = [
  { label: "Услуги", href: "#services", description: "Основные коммерческие направления" },
  { label: "Кейсы", href: staticPagePaths.cases, description: "Типовые сценарии и proof layer" },
  ...publishedSupportPages.map((page) => ({
    label: page.navLabel,
    href: page.meta.path,
    description: page.h1
  })),
  { label: "О компании", href: staticPagePaths.about, description: "Как работает подрядчик" },
  { label: "Контакты", href: staticPagePaths.contacts, description: "Форма заявки и каналы связи" }
];

export const serviceNavigation: NavItem[] = publishedServiceNavigation;

export const cityNavigation: NavItem[] = publishedCityNavigation;

export const footerNavigation = {
  services: serviceNavigation,
  support: [
    { label: "Доставка", href: staticPagePaths.delivery, description: "Удалённые заказы по Казахстану" },
    { label: "Оплата и гарантия", href: staticPagePaths.payment, description: "Коммерческие условия" },
    { label: "FAQ", href: staticPagePaths.faq, description: "Частые вопросы" },
    { label: "Политика конфиденциальности", href: staticPagePaths.privacy, description: "Обработка данных из формы" }
  ] satisfies NavItem[],
  company: [
    { label: "О компании", href: staticPagePaths.about, description: "Подход и фокус" },
    { label: "Кейсы", href: staticPagePaths.cases, description: "Типовые сценарии" },
    { label: "Контакты", href: staticPagePaths.contacts, description: "Форма заявки" }
  ] satisfies NavItem[],
  cities: cityNavigation
};
