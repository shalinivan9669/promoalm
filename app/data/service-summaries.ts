import type {
  InstallationMode,
  NavItem,
  PublicationStatus,
  ServiceCard,
  ServiceSlug
} from "../../shared/types/content";

interface ServiceSummary {
  slug: ServiceSlug;
  status: PublicationStatus;
  name: string;
  navLabel: string;
  intro: string;
  path: string;
  isOutdoor: boolean;
  supportsMultiLocation: boolean;
  installationMode: InstallationMode;
}

const serviceSummaries: ServiceSummary[] = [
  {
    slug: "fasadnye-vyveski",
    status: "published",
    name: "Фасадные вывески",
    navLabel: "Фасадные вывески",
    intro:
      "Фасадные вывески для бизнеса под улицу, читаемость, крепление и монтаж. Подходит для одной точки, сети и объектов по Казахстану.",
    path: "/uslugi/fasadnye-vyveski/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "obemnye-bukvy",
    status: "published",
    name: "Объёмные буквы",
    navLabel: "Объёмные буквы",
    intro:
      "Объёмные буквы для фасадов и фирменной подачи: подбор материалов, свет, производство и монтаж по объекту.",
    path: "/uslugi/obemnye-bukvy/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "svetovye-koroba",
    status: "published",
    name: "Световые короба",
    navLabel: "Световые короба",
    intro:
      "Световые короба и лайтбоксы для фасадов, входных зон и торговых точек, где важны быстрая видимость и понятный запуск.",
    path: "/uslugi/svetovye-koroba/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "kryshnye-ustanovki",
    status: "published",
    name: "Крышные установки",
    navLabel: "Крышные установки",
    intro:
      "Крышные установки для заметных объектов: сначала конструктив, доступ и монтажный сценарий, затем производство.",
    path: "/uslugi/kryshnye-ustanovki/",
    isOutdoor: true,
    supportsMultiLocation: false,
    installationMode: "by-agreement"
  },
  {
    slug: "vyveski-dlya-seti",
    status: "published",
    name: "Вывески для сети",
    navLabel: "Вывески для сети",
    intro:
      "Rollout для сети и нескольких точек: единый стандарт, повторяемое качество, логистика по адресам и монтаж по согласованию.",
    path: "/uslugi/vyveski-dlya-seti/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "by-agreement"
  },
  {
    slug: "vyveski-pod-klyuch",
    status: "published",
    name: "Вывески под ключ",
    navLabel: "Под ключ",
    intro:
      "Вывески под ключ для бизнеса: бриф, макет, производство, доставка и монтаж без сборки подрядчиков по частям.",
    path: "/uslugi/vyveski-pod-klyuch/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "montazh-vyvesok",
    status: "published",
    name: "Монтаж вывесок",
    navLabel: "Монтаж",
    intro:
      "Монтаж вывесок с учётом объекта, крепления, высоты и графика работ. Для регионов и нескольких адресов считаем отдельно.",
    path: "/uslugi/montazh-vyvesok/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "interernye-vyveski-dlya-biznesa",
    status: "published",
    name: "Интерьерные вывески для бизнеса",
    navLabel: "Интерьерные вывески",
    intro:
      "Интерьерные вывески, логотипы и световые акценты для шоурумов, офисов продаж и клиентских зон.",
    path: "/uslugi/interernye-vyveski-dlya-biznesa/",
    isOutdoor: false,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "neonovye-vyveski",
    status: "published",
    name: "Неоновые вывески",
    navLabel: "Неон",
    intro:
      "Неоновые вывески для коммерческих интерьеров, витрин и клиентских зон. Это отдельная интерьерная ветка, а не ядро фасадных услуг.",
    path: "/uslugi/neonovye-vyveski/",
    isOutdoor: false,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "zamena-vyveski",
    status: "planned",
    name: "Замена вывески",
    navLabel: "Замена вывески",
    intro: "Служебная запись для будущего расширения семантики без дубля с монтажом и новыми проектами.",
    path: "/uslugi/zamena-vyveski/",
    isOutdoor: true,
    supportsMultiLocation: false,
    installationMode: "by-agreement"
  },
  {
    slug: "remont-vyvesok",
    status: "planned",
    name: "Ремонт вывесок",
    navLabel: "Ремонт вывесок",
    intro: "Черновая запись для будущего расширения. Не должна конкурировать с монтажом и новыми вывесками.",
    path: "/uslugi/remont-vyvesok/",
    isOutdoor: true,
    supportsMultiLocation: false,
    installationMode: "by-agreement"
  }
];

function buildTags(summary: ServiceSummary) {
  return [
    summary.isOutdoor ? "Улица" : "Интерьер",
    summary.supportsMultiLocation ? "Сети" : "Одна точка",
    summary.installationMode === "available" ? "Монтаж" : "По согласованию"
  ];
}

export const serviceCards: ServiceCard[] = serviceSummaries.map((summary) => ({
  slug: summary.slug,
  title: summary.name,
  summary: summary.intro,
  path: summary.path,
  status: summary.status,
  tags: buildTags(summary)
}));

export const publishedServiceNavigation: NavItem[] = serviceSummaries
  .filter((summary) => summary.status === "published")
  .map((summary) => ({
    label: summary.navLabel,
    href: summary.path,
    description: summary.intro
  }));
