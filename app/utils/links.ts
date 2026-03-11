import type { CaseStudy, CitySlug, ServiceCard, ServicePageData, SupportPageData } from "../../shared/types/content";

export function getCasesByIds(caseStudies: CaseStudy[], ids: string[]) {
  const idSet = new Set(ids);
  return caseStudies.filter((item) => idSet.has(item.id));
}

export function getServiceCardsBySlugs(cards: ServiceCard[], slugs: ServicePageData["slug"][]) {
  const slugSet = new Set(slugs);
  return cards.filter((item) => slugSet.has(item.slug));
}

export function getCityCases(caseStudies: CaseStudy[], slug: CitySlug) {
  return caseStudies.filter((item) => item.relatedCitySlugs.includes(slug));
}

export function getSupportPage(pages: SupportPageData[], slug: SupportPageData["slug"]) {
  return pages.find((page) => page.slug === slug);
}
