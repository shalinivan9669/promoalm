import type { CitySlug, NavItem, PublicationStatus } from "../../shared/types/content";

interface CitySummary {
  slug: CitySlug;
  status: PublicationStatus;
  city: string;
  path: string;
  localAngle: string;
}

const citySummaries: CitySummary[] = [
  {
    slug: "almaty",
    status: "published",
    city: "Алматы",
    path: "/goroda/almaty/",
    localAngle:
      "Алматы часто требует более точного фасадного решения: на плотной улице слабая вывеска просто теряется. Поэтому здесь особенно важны размер, тип света и контроль над тем, как знак читается в реальной среде."
  },
  {
    slug: "astana",
    status: "published",
    city: "Астана",
    path: "/goroda/astana/",
    localAngle:
      "Если объект в Астане рассчитывает на заметность с дистанции, простого макета мало. Нужно заранее понимать тип конструкции, режим света, высоту и монтажный маршрут."
  },
  {
    slug: "shymkent",
    status: "published",
    city: "Шымкент",
    path: "/goroda/shymkent/",
    localAngle:
      "По Шымкенту особенно удобны проекты, где заказчик сразу понимает, что ему нужен не просто дизайн, а полный маршрут с доставкой, установкой и понятными сроками по производству."
  },
  {
    slug: "karaganda",
    status: "planned",
    city: "Караганде",
    path: "/goroda/karaganda/",
    localAngle: "Черновая local angle до наполнения."
  },
  {
    slug: "aktobe",
    status: "planned",
    city: "Актобе",
    path: "/goroda/aktobe/",
    localAngle: "Черновая local angle до наполнения."
  },
  {
    slug: "atyrau",
    status: "planned",
    city: "Атырау",
    path: "/goroda/atyrau/",
    localAngle: "Черновая local angle до наполнения."
  }
];

export const publishedCityNavigation: NavItem[] = citySummaries
  .filter((summary) => summary.status === "published")
  .map((summary) => ({
    label: summary.city,
    href: summary.path,
    description: summary.localAngle
  }));
