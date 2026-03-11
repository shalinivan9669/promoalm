import type { ServiceCard } from "../../shared/types/content";
import { servicePath } from "../utils/routes";
import { servicesGroupA } from "./services-group-a";
import { servicesGroupB } from "./services-group-b";
import { servicesGroupC } from "./services-group-c";
import { servicesGroupD } from "./services-group-d";
import { plannedServices } from "./services-planned";

export const services = [
  ...servicesGroupA,
  ...servicesGroupB,
  ...servicesGroupC,
  ...servicesGroupD,
  ...plannedServices
];

export const serviceCards: ServiceCard[] = services.map((service) => ({
  slug: service.slug,
  title: service.name,
  summary: service.intro,
  path: servicePath(service.slug),
  status: service.status,
  tags: [
    service.isOutdoor ? "Улица" : "Интерьер",
    service.supportsMultiLocation ? "Сети" : "Одна точка",
    service.installationMode === "available" ? "Монтаж" : "По согласованию"
  ]
}));
