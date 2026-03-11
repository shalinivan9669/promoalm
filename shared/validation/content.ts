import { z } from "zod";

import type {
  CaseStudy,
  CityPageData,
  ServicePageData,
  SupportPageData
} from "../types/content";
import { CITY_SLUGS, SERVICE_SLUGS, SUPPORT_PAGE_SLUGS } from "../types/content";

const publicationStatusSchema = z.enum(["published", "planned", "hidden"]);
const evidenceLevelSchema = z.enum(["confirmed", "placeholder", "hidden"]);
const pageSectionSchema = z.enum([
  "hero",
  "trust",
  "service-grid",
  "industries",
  "process",
  "pricing",
  "materials",
  "proof",
  "delivery",
  "installation",
  "network",
  "faq",
  "cta",
  "related"
]);
const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(8),
  answer: z.string().min(20)
});
const ctaSchema = z.object({
  label: z.string().min(2),
  href: z.string().min(1),
  intent: z.enum(["primary", "secondary", "ghost", "whatsapp", "call", "calculate"]),
  trackingEvent: z.string().optional(),
  note: z.string().optional(),
  external: z.boolean().optional()
});
const heroSchema = z.object({
  eyebrow: z.string().min(2),
  title: z.string().min(10),
  description: z.string().min(30),
  facts: z.array(z.string().min(2)).min(2),
  actions: z.array(ctaSchema).min(1),
  note: z.string().optional()
});
const trustItemSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
  description: z.string().min(10),
  evidenceLevel: evidenceLevelSchema,
  sourceType: z.string().optional()
});
const priceNoteSchema = z.object({
  title: z.string().min(2),
  text: z.string().min(12),
  emphasis: z.string().optional()
});
const processStepSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(12),
  note: z.string().optional()
});
const relatedLinkSchema = z.object({
  label: z.string().min(2),
  href: z.string().min(1),
  description: z.string().min(10)
});
const seoSchema = z.object({
  title: z.string().min(15),
  description: z.string().min(40),
  path: z.string().min(1),
  ogType: z.enum(["website", "article"]).optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional()
});

const serviceSchema = z.object({
  slug: z.enum(SERVICE_SLUGS),
  status: publicationStatusSchema,
  name: z.string().min(3),
  navLabel: z.string().min(3),
  h1: z.string().min(10),
  meta: seoSchema,
  hero: heroSchema,
  intro: z.string().min(30),
  sections: z.array(pageSectionSchema).min(4),
  useCases: z.array(z.string().min(4)).min(2),
  industries: z.array(z.string().min(4)).min(2),
  materials: z.array(z.string().min(4)).min(1),
  proofHighlights: z.array(z.string().min(8)).min(2),
  priceMode: z.enum(["from", "range", "request-only"]),
  minimumOrderApplies: z.boolean(),
  installationMode: z.enum(["available", "by-agreement", "not-offered"]),
  isOutdoor: z.boolean(),
  isIndoorOnly: z.boolean(),
  supportsUrgent: z.boolean(),
  supportsMultiLocation: z.boolean(),
  priceNotes: z.array(priceNoteSchema),
  processSteps: z.array(processStepSchema),
  trustItems: z.array(trustItemSchema),
  faq: z.array(faqSchema),
  relatedLinks: z.array(relatedLinkSchema),
  caseIds: z.array(z.string().min(1)),
  cta: ctaSchema
}) satisfies z.ZodType<ServicePageData>;

const citySchema = z.object({
  slug: z.enum(CITY_SLUGS),
  status: publicationStatusSchema,
  city: z.string().min(2),
  h1: z.string().min(10),
  meta: seoSchema,
  hero: heroSchema,
  intro: z.string().min(30),
  sections: z.array(pageSectionSchema).min(4),
  localAngle: z.string().min(30),
  logisticsNote: z.string().min(30),
  serviceModel: z.enum(["onsite", "delivery-partner-install", "delivery-only"]),
  hasLocalAddress: z.boolean(),
  hasRealCases: z.boolean(),
  serviceHighlights: z.array(z.string().min(8)).min(2),
  trustItems: z.array(trustItemSchema),
  faq: z.array(faqSchema),
  relatedServiceSlugs: z.array(z.enum(SERVICE_SLUGS)),
  relatedCaseIds: z.array(z.string().min(1)),
  relatedLinks: z.array(relatedLinkSchema),
  cta: ctaSchema
}) satisfies z.ZodType<CityPageData>;

const caseSchema = z.object({
  id: z.string().min(2),
  status: publicationStatusSchema,
  proofMode: z.enum(["scenario", "real"]),
  title: z.string().min(8),
  slug: z.string().min(2),
  summary: z.string().min(20),
  challenge: z.string().min(20),
  solution: z.string().min(20),
  deliverables: z.array(z.string().min(4)).min(2),
  metrics: z.array(z.string().min(4)).min(1),
  industry: z.string().min(2),
  cityLabel: z.string().min(2),
  relatedServiceSlugs: z.array(z.enum(SERVICE_SLUGS)).min(1),
  relatedCitySlugs: z.array(z.enum(CITY_SLUGS)).min(1),
  evidenceLevel: evidenceLevelSchema
}) satisfies z.ZodType<CaseStudy>;

const supportSchema = z.object({
  slug: z.enum(SUPPORT_PAGE_SLUGS),
  status: publicationStatusSchema,
  h1: z.string().min(10),
  navLabel: z.string().min(2),
  meta: seoSchema,
  hero: heroSchema,
  sections: z.array(
    z.object({
      title: z.string().min(2),
      body: z.string().min(25),
      bullets: z.array(z.string().min(4)).optional()
    })
  ).min(1),
  highlights: z.array(z.string().min(4)).min(2),
  trustItems: z.array(trustItemSchema).min(1),
  faq: z.array(faqSchema).optional(),
  relatedLinks: z.array(relatedLinkSchema).min(1),
  cta: ctaSchema
}) satisfies z.ZodType<SupportPageData>;

interface ContentBundle {
  services: ServicePageData[];
  cities: CityPageData[];
  cases: CaseStudy[];
  supportPages: SupportPageData[];
}

function assertUnique(items: string[], label: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item)) {
      throw new Error(`Duplicate ${label}: ${item}`);
    }

    seen.add(item);
  }
}

export function validateContentOrThrow(bundle: ContentBundle) {
  const services = z.array(serviceSchema).parse(bundle.services);
  const cities = z.array(citySchema).parse(bundle.cities);
  const caseStudies = z.array(caseSchema).parse(bundle.cases);
  const supportPages = z.array(supportSchema).parse(bundle.supportPages);

  const publishedServices = services.filter((item) => item.status === "published");
  const publishedCities = cities.filter((item) => item.status === "published");
  const publishedSupportPages = supportPages.filter((item) => item.status === "published");
  const publishedCases = caseStudies.filter((item) => item.status === "published");

  const pageMetas = [
    ...publishedServices.map((item) => item.meta),
    ...publishedCities.map((item) => item.meta),
    ...publishedSupportPages.map((item) => item.meta)
  ];

  assertUnique(pageMetas.map((item) => item.title), "meta title");
  assertUnique(pageMetas.map((item) => item.description), "meta description");
  assertUnique(pageMetas.map((item) => item.path), "canonical path");
  assertUnique(
    [...publishedServices.map((item) => item.h1), ...publishedCities.map((item) => item.h1), ...publishedSupportPages.map((item) => item.h1)],
    "h1"
  );

  const publishedServiceSlugs = new Set(publishedServices.map((item) => item.slug));
  const publishedCaseIds = new Set(publishedCases.map((item) => item.id));

  for (const service of publishedServices) {
    if (service.priceNotes.length < 1) {
      throw new Error(`Published service "${service.slug}" must have at least one price note.`);
    }

    if (service.processSteps.length < 1) {
      throw new Error(`Published service "${service.slug}" must have at least one process step.`);
    }

    if (service.trustItems.length < 1) {
      throw new Error(`Published service "${service.slug}" must have at least one trust item.`);
    }

    if (service.faq.length < 4) {
      throw new Error(`Published service "${service.slug}" must have at least four FAQ items.`);
    }

    if (service.relatedLinks.length < 1) {
      throw new Error(`Published service "${service.slug}" must have related links.`);
    }

    for (const caseId of service.caseIds) {
      if (!publishedCaseIds.has(caseId)) {
        throw new Error(`Service "${service.slug}" references missing published case "${caseId}".`);
      }
    }
  }

  for (const city of publishedCities) {
    if (!city.localAngle || !city.logisticsNote) {
      throw new Error(`Published city "${city.slug}" must have local angle and logistics note.`);
    }

    if (city.faq.length < 4) {
      throw new Error(`Published city "${city.slug}" must have at least four FAQ items.`);
    }

    if (city.relatedServiceSlugs.length < 1 || city.relatedCaseIds.length < 1) {
      throw new Error(`Published city "${city.slug}" must reference services and cases.`);
    }

    for (const serviceSlug of city.relatedServiceSlugs) {
      if (!publishedServiceSlugs.has(serviceSlug)) {
        throw new Error(`City "${city.slug}" references unpublished service "${serviceSlug}".`);
      }
    }

    for (const caseId of city.relatedCaseIds) {
      if (!publishedCaseIds.has(caseId)) {
        throw new Error(`City "${city.slug}" references missing published case "${caseId}".`);
      }
    }
  }

  return {
    services,
    cities,
    cases: caseStudies,
    supportPages
  };
}
