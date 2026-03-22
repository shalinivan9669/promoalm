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
  canonical: z.string().optional(),
  ogType: z.enum(["website", "article"]).optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional()
});

const supportSchemaTypeSchema = z.enum([
  "WebPage",
  "BreadcrumbList",
  "FAQPage",
  "Service",
  "Organization",
  "LocalBusiness"
]);
const supportSchemaConfigSchema = z.object({
  types: z.array(supportSchemaTypeSchema).min(2),
  service: z
    .object({
      areaServed: z.string().min(2),
      serviceType: z.string().min(2).optional()
    })
    .optional(),
  organizationReference: z.boolean().optional(),
  localBusinessReference: z.boolean().optional()
});
const supportFaqGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10),
  items: z.array(faqSchema).min(1)
});
const supportRichSectionSchema = z.object({
  kind: z.literal("rich"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  body: z.string().min(25),
  bullets: z.array(z.string().min(4)).optional(),
  note: z.string().min(10).optional(),
  relatedLinks: z.array(relatedLinkSchema).optional()
});
const supportStepsSectionSchema = z.object({
  kind: z.literal("steps"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  steps: z.array(processStepSchema).min(2),
  note: z.string().min(10).optional()
});
const supportGeoSectionSchema = z.object({
  kind: z.literal("geo"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  primaryCity: z.string().min(2),
  areaServed: z.string().min(2),
  notes: z.array(z.string().min(10)).min(2),
  serviceModel: z.string().min(2).optional()
});
const supportRiskSectionSchema = z.object({
  kind: z.literal("risk"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  risks: z.array(z.string().min(8)).min(2),
  note: z.string().min(10).optional()
});
const supportB2BSectionSchema = z.object({
  kind: z.literal("b2b"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  bullets: z.array(z.string().min(8)).min(2),
  note: z.string().min(10).optional(),
  relatedLinks: z.array(relatedLinkSchema).optional()
});
const supportLegalSectionSchema = z.object({
  kind: z.literal("legal"),
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(2),
        value: z.string().min(2),
        note: z.string().min(10).optional()
      })
    )
    .min(2),
  note: z.string().min(10).optional()
});
const supportSectionSchema = z.discriminatedUnion("kind", [
  supportRichSectionSchema,
  supportStepsSectionSchema,
  supportGeoSectionSchema,
  supportRiskSectionSchema,
  supportB2BSectionSchema,
  supportLegalSectionSchema
]);

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
  supportIntent: z.enum(["faq-hub", "delivery", "payment", "privacy"]),
  primaryCity: z.string().min(2),
  areaServed: z.string().min(2),
  serviceModel: z.enum(["remote-first", "hybrid", "legal-support"]),
  claimsLocalOffice: z.boolean(),
  hasPublicAddress: z.boolean(),
  hasLegalRequisites: z.boolean(),
  hasRealRegionalInstall: z.boolean(),
  minimumOrderApplies: z.boolean(),
  supportsUrgent: z.boolean(),
  supportsMultiLocation: z.boolean(),
  installationMode: z.enum(["available", "by-agreement", "not-offered"]),
  guaranteeMode: z.enum(["standard", "project", "custom"]),
  paymentMode: z.enum(["prepayment", "stage-based", "mixed"]),
  evidenceLevel: evidenceLevelSchema,
  intro: z.string().min(30),
  hero: heroSchema,
  quickFacts: z.array(trustItemSchema).min(3),
  sections: z.array(supportSectionSchema).min(4),
  faqGroups: z.array(supportFaqGroupSchema).min(1),
  relatedLinks: z.array(relatedLinkSchema).min(3),
  cta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  schema: supportSchemaConfigSchema,
  legalPlaceholders: z
    .object({
      requisitesNote: z.string().min(10).optional(),
      deletionContact: z.string().min(10).optional(),
      retentionNote: z.string().min(10).optional(),
      updateNote: z.string().min(10).optional()
    })
    .optional()
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
  assertUnique(pageMetas.map((item) => item.canonical ?? item.path), "canonical path");
  assertUnique(
    [...publishedServices.map((item) => item.h1), ...publishedCities.map((item) => item.h1), ...publishedSupportPages.map((item) => item.h1)],
    "h1"
  );

  const publishedServiceSlugs = new Set(publishedServices.map((item) => item.slug));
  const publishedCaseIds = new Set(publishedCases.map((item) => item.id));

  assertUnique(publishedCities.map((item) => item.hero.title), "city hero title");
  assertUnique(publishedCities.map((item) => item.hero.description), "city hero description");
  assertUnique(publishedCities.map((item) => item.hero.note ?? ""), "city hero note");
  assertUnique(publishedCities.map((item) => item.intro), "city intro");
  assertUnique(publishedCities.map((item) => item.localAngle), "city local angle");
  assertUnique(publishedCities.map((item) => item.logisticsNote), "city logistics note");
  assertUnique(publishedCities.map((item) => item.cta.label), "city CTA label");
  assertUnique(publishedCities.map((item) => item.hero.actions[0]?.label ?? ""), "city hero action label");

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
    if (city.meta.noindex) {
      throw new Error(`Published city "${city.slug}" must not be noindex.`);
    }

    if (city.hasLocalAddress) {
      throw new Error(`Published city "${city.slug}" must not claim a local address.`);
    }

    if (!city.hero.note?.trim()) {
      throw new Error(`Published city "${city.slug}" must include a service-area hero note.`);
    }

    if (city.hero.facts.length < 3) {
      throw new Error(`Published city "${city.slug}" must have at least three hero facts.`);
    }

    if (!city.localAngle || !city.logisticsNote) {
      throw new Error(`Published city "${city.slug}" must have local angle and logistics note.`);
    }

    if (city.serviceHighlights.length < 3) {
      throw new Error(`Published city "${city.slug}" must have at least three service highlights.`);
    }

    if (city.trustItems.length < 2) {
      throw new Error(`Published city "${city.slug}" must have at least two trust items.`);
    }

    if (city.faq.length < 4) {
      throw new Error(`Published city "${city.slug}" must have at least four FAQ items.`);
    }

    if (city.relatedServiceSlugs.length < 2) {
      throw new Error(`Published city "${city.slug}" must reference at least two related services.`);
    }

    if (city.relatedCaseIds.length < 1 || city.relatedCaseIds.length > 2) {
      throw new Error(`Published city "${city.slug}" must reference one or two cases.`);
    }

    if (city.relatedLinks.length < 3) {
      throw new Error(`Published city "${city.slug}" must reference at least three related links.`);
    }

    if (city.sections.length !== 7) {
      throw new Error(`Published city "${city.slug}" must keep the lean seven-section contract.`);
    }

    const requiredSections = ["hero", "trust", "proof", "delivery", "faq", "related", "cta"] as const;

    for (const section of requiredSections) {
      if (!city.sections.includes(section)) {
        throw new Error(`Published city "${city.slug}" must include "${section}" in sections.`);
      }
    }

    if (!city.cta.label.trim()) {
      throw new Error(`Published city "${city.slug}" must have a CTA label.`);
    }

    if (city.cta.intent !== "primary") {
      throw new Error(`Published city "${city.slug}" must use a primary CTA.`);
    }

    if (!city.hero.actions.length || city.hero.actions[0]!.intent !== "primary") {
      throw new Error(`Published city "${city.slug}" must start with a primary hero action.`);
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

  for (const page of publishedSupportPages) {
    if (page.quickFacts.length < 3) {
      throw new Error(`Published support page "${page.slug}" must have at least three quick facts.`);
    }

    if (page.sections.length < 4) {
      throw new Error(`Published support page "${page.slug}" must have at least four content sections.`);
    }

    if (page.faqGroups.length < 1) {
      throw new Error(`Published support page "${page.slug}" must have at least one FAQ group.`);
    }

    if (page.relatedLinks.length < 3) {
      throw new Error(`Published support page "${page.slug}" must have at least three related links.`);
    }

    if (page.claimsLocalOffice && !page.hasPublicAddress) {
      throw new Error(`Support page "${page.slug}" claims a local office but has no public address.`);
    }

    if (page.schema.localBusinessReference && (!page.hasPublicAddress || !page.hasLegalRequisites)) {
      throw new Error(`Support page "${page.slug}" cannot reference LocalBusiness without public address and legal requisites.`);
    }

    if (page.supportIntent === "delivery" && !page.schema.types.includes("Service")) {
      throw new Error(`Support page "${page.slug}" must declare Service schema.`);
    }

    if ((page.supportIntent === "faq-hub" || page.supportIntent === "delivery" || page.supportIntent === "payment") && !page.schema.types.includes("FAQPage")) {
      throw new Error(`Support page "${page.slug}" must declare FAQ schema.`);
    }

    if (page.supportIntent === "privacy" && page.schema.types.includes("Service")) {
      throw new Error(`Privacy page "${page.slug}" must not declare Service schema.`);
    }

    for (const section of page.sections) {
      if (section.kind === "rich") {
        if (section.relatedLinks?.length) {
          assertUnique(section.relatedLinks.map((link) => link.href), `support section related link (${page.slug}/${section.id})`);
        }
      }
    }

    for (const group of page.faqGroups) {
      assertUnique(group.items.map((item) => item.id), `FAQ item id in support page ${page.slug}`);
    }
  }

  return {
    services,
    cities,
    cases: caseStudies,
    supportPages
  };
}
