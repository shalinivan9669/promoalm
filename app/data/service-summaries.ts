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
      "Фасад — это не место для случайного декора. Здесь важны масштаб, видимость с дистанции, крепление и то, как вывеска работает в реальном городском потоке.",
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
      "Объёмные буквы не обязаны быть дорогой игрушкой. Они нужны там, где бренд должен смотреться собранно и держать нормальное качество по материалам и свету.",
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
      "Световой короб — это рабочий инструмент видимости, а не временная заглушка. Он особенно полезен, когда фасад небольшой, а точка должна читаться сразу.",
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
      "Крышная установка — не товар из прайса. Это проект, где ошибки на входе дорого стоят и по срокам, и по бюджету, и по монтажу.",
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
      "Сетевой заказ ломается не на дизайне, а на рассинхроне: разные материалы, плавающие размеры, хаос в логистике и монтаж без общей схемы. Мы закрываем именно это.",
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
      "Услуга под ключ нужна не ради красивой формулировки. Она нужна там, где у проекта много зависимостей и нужен один понятный подрядчик.",
    path: "/uslugi/vyveski-pod-klyuch/",
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
      "Эта страница не конкурирует с фасадом. Она нужна для задач внутри помещения, где бренд должен быть виден клиенту уже после входа в пространство.",
    path: "/uslugi/interernye-vyveski-dlya-biznesa/",
    isOutdoor: false,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "montazh-vyvesok",
    status: "published",
    name: "Монтаж вывесок",
    navLabel: "Монтаж",
    intro:
      "Самая частая ошибка в монтаже — считать его приложением к вывеске. На деле это отдельный блок риска, особенно на фасадах, высоте и в регионах.",
    path: "/uslugi/montazh-vyvesok/",
    isOutdoor: true,
    supportsMultiLocation: true,
    installationMode: "available"
  },
  {
    slug: "zamena-vyveski",
    status: "planned",
    name: "Замена вывески",
    navLabel: "Замена вывески",
    intro: "Служебная запись для будущего расширения семантики без тонкой и дублирующей страницы.",
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
    intro: "Черновая запись для будущего расширения. Не должна конкурировать с монтажом и новыми проектами.",
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
