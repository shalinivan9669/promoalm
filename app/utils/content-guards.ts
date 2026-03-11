import type {
  CaseStudy,
  CityPageData,
  EvidenceLevel,
  PublicationStatus,
  ServicePageData,
  SupportPageData
} from "../../shared/types/content";

export function isPublished(status: PublicationStatus) {
  return status === "published";
}

export function isRenderableEvidence(level: EvidenceLevel) {
  return level !== "hidden";
}

export function getPublishedServices(services: ServicePageData[]) {
  return services.filter((service) => isPublished(service.status));
}

export function getPublishedCities(cities: CityPageData[]) {
  return cities.filter((city) => isPublished(city.status));
}

export function getPublishedSupportPages(pages: SupportPageData[]) {
  return pages.filter((page) => isPublished(page.status));
}

export function getVisibleCases(caseStudies: CaseStudy[]) {
  return caseStudies.filter((item) => isPublished(item.status));
}
