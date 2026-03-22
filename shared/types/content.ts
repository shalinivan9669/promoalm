export const SERVICE_SLUGS = [
  "fasadnye-vyveski",
  "obemnye-bukvy",
  "svetovye-koroba",
  "kryshnye-ustanovki",
  "vyveski-dlya-seti",
  "vyveski-pod-klyuch",
  "interernye-vyveski-dlya-biznesa",
  "montazh-vyvesok",
  "zamena-vyveski",
  "remont-vyvesok"
] as const;

export const CITY_SLUGS = [
  "almaty",
  "astana",
  "shymkent",
  "karaganda",
  "aktobe",
  "atyrau"
] as const;

export const SUPPORT_PAGE_SLUGS = [
  "dostavka-po-kazahstanu",
  "oplata-i-garantiya",
  "politika-konfidentsialnosti",
  "faq"
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type CitySlug = (typeof CITY_SLUGS)[number];
export type SupportPageSlug = (typeof SUPPORT_PAGE_SLUGS)[number];

export type PublicationStatus = "published" | "planned" | "hidden";
export type EvidenceLevel = "confirmed" | "placeholder" | "hidden";
export type CTAIntent = "primary" | "secondary" | "ghost" | "whatsapp" | "call" | "calculate";
export type PageSection =
  | "hero"
  | "trust"
  | "service-grid"
  | "industries"
  | "process"
  | "pricing"
  | "materials"
  | "proof"
  | "delivery"
  | "installation"
  | "network"
  | "faq"
  | "cta"
  | "related";
export type PriceMode = "from" | "range" | "request-only";
export type InstallationMode = "available" | "by-agreement" | "not-offered";
export type CityServiceModel = "onsite" | "delivery-partner-install" | "delivery-only";
export type ContactChannelType = "phone" | "whatsapp" | "email" | "form";
export type ProofMode = "scenario" | "real";

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface SeoMetaInput {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  ogType?: "website" | "article";
  image?: string;
  noindex?: boolean;
}

export interface CTAConfig {
  label: string;
  href: string;
  intent: CTAIntent;
  trackingEvent?: string;
  note?: string;
  external?: boolean;
}

export interface HeroBlock {
  eyebrow: string;
  title: string;
  description: string;
  facts: string[];
  actions: CTAConfig[];
  note?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TrustStat {
  label: string;
  value: string;
  note?: string;
  evidenceLevel: EvidenceLevel;
  sourceType?: string;
}

export interface TrustItem {
  label: string;
  value: string;
  description: string;
  evidenceLevel: EvidenceLevel;
  sourceType?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  note?: string;
}

export interface PriceNote {
  title: string;
  text: string;
  emphasis?: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface ServiceCard {
  slug: ServiceSlug;
  title: string;
  summary: string;
  path: string;
  status: PublicationStatus;
  tags?: string[];
}

export interface CaseStudy {
  id: string;
  status: PublicationStatus;
  proofMode: ProofMode;
  title: string;
  slug: string;
  summary: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: string[];
  industry: string;
  cityLabel: string;
  relatedServiceSlugs: ServiceSlug[];
  relatedCitySlugs: CitySlug[];
  evidenceLevel: EvidenceLevel;
}

export interface ServicePageData {
  slug: ServiceSlug;
  status: PublicationStatus;
  name: string;
  navLabel: string;
  h1: string;
  meta: SeoMetaInput;
  hero: HeroBlock;
  intro: string;
  sections: PageSection[];
  useCases: string[];
  industries: string[];
  materials: string[];
  proofHighlights: string[];
  priceMode: PriceMode;
  minimumOrderApplies: boolean;
  installationMode: InstallationMode;
  isOutdoor: boolean;
  isIndoorOnly: boolean;
  supportsUrgent: boolean;
  supportsMultiLocation: boolean;
  priceNotes: PriceNote[];
  processSteps: ProcessStep[];
  trustItems: TrustItem[];
  faq: FAQItem[];
  relatedLinks: RelatedLink[];
  caseIds: string[];
  cta: CTAConfig;
}

export interface CityPageData {
  slug: CitySlug;
  status: PublicationStatus;
  city: string;
  h1: string;
  meta: SeoMetaInput;
  hero: HeroBlock;
  intro: string;
  sections: PageSection[];
  localAngle: string;
  logisticsNote: string;
  serviceModel: CityServiceModel;
  hasLocalAddress: boolean;
  hasRealCases: boolean;
  serviceHighlights: string[];
  trustItems: TrustItem[];
  faq: FAQItem[];
  relatedServiceSlugs: ServiceSlug[];
  relatedCaseIds: string[];
  relatedLinks: RelatedLink[];
  cta: CTAConfig;
}

export interface SupportBodySection {
  title: string;
  body: string;
  bullets?: string[];
}

export type SupportIntent = "faq-hub" | "delivery" | "payment" | "privacy";
export type SupportServiceModel = "remote-first" | "hybrid" | "legal-support";
export type SupportSchemaType = "WebPage" | "BreadcrumbList" | "FAQPage" | "Service" | "Organization" | "LocalBusiness";

export interface SupportSchemaConfig {
  types: SupportSchemaType[];
  service?: {
    areaServed: string;
    serviceType?: string;
  };
  organizationReference?: boolean;
  localBusinessReference?: boolean;
}

export interface SupportFaqGroup {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export interface SupportSectionBase {
  id: string;
  title: string;
  description?: string;
}

export interface SupportRichSection extends SupportSectionBase {
  kind: "rich";
  body: string;
  bullets?: string[];
  note?: string;
  relatedLinks?: RelatedLink[];
}

export interface SupportStepsSection extends SupportSectionBase {
  kind: "steps";
  steps: ProcessStep[];
  note?: string;
}

export interface SupportGeoSection extends SupportSectionBase {
  kind: "geo";
  primaryCity: string;
  areaServed: string;
  notes: string[];
  serviceModel?: string;
}

export interface SupportRiskSection extends SupportSectionBase {
  kind: "risk";
  risks: string[];
  note?: string;
}

export interface SupportB2BSection extends SupportSectionBase {
  kind: "b2b";
  bullets: string[];
  note?: string;
  relatedLinks?: RelatedLink[];
}

export interface SupportLegalItem {
  label: string;
  value: string;
  note?: string;
}

export interface SupportLegalSection extends SupportSectionBase {
  kind: "legal";
  items: SupportLegalItem[];
  note?: string;
}

export type SupportSection =
  | SupportRichSection
  | SupportStepsSection
  | SupportGeoSection
  | SupportRiskSection
  | SupportB2BSection
  | SupportLegalSection;

export interface SupportPageData {
  slug: SupportPageSlug;
  status: PublicationStatus;
  h1: string;
  navLabel: string;
  meta: SeoMetaInput;
  supportIntent: SupportIntent;
  primaryCity: string;
  areaServed: string;
  serviceModel: SupportServiceModel;
  claimsLocalOffice: boolean;
  hasPublicAddress: boolean;
  hasLegalRequisites: boolean;
  hasRealRegionalInstall: boolean;
  minimumOrderApplies: boolean;
  supportsUrgent: boolean;
  supportsMultiLocation: boolean;
  installationMode: InstallationMode;
  guaranteeMode: "standard" | "project" | "custom";
  paymentMode: "prepayment" | "stage-based" | "mixed";
  evidenceLevel: EvidenceLevel;
  intro: string;
  hero: HeroBlock;
  quickFacts: TrustItem[];
  sections: SupportSection[];
  faqGroups: SupportFaqGroup[];
  relatedLinks: RelatedLink[];
  cta: CTAConfig;
  secondaryCta?: CTAConfig;
  schema: SupportSchemaConfig;
  legalPlaceholders?: {
    requisitesNote?: string;
    deletionContact?: string;
    retentionNote?: string;
    updateNote?: string;
  };
}

export interface ContactChannel {
  type: ContactChannelType;
  label: string;
  value: string;
  href?: string;
  note?: string;
  available: boolean;
  evidenceLevel: EvidenceLevel;
}

export interface ContactInfo {
  brandName: string;
  publicName: string;
  shortDescription: string;
  primaryCity?: string;
  coverage?: string;
  serviceArea: string;
  minOrder: string;
  leadTime: string;
  warranty: string;
  prepayment: string;
  designOffer: string;
  channels: ContactChannel[];
  address?: string;
  addressEvidenceLevel: EvidenceLevel;
  workingHours?: string;
  sameAs?: string[];
  legalNote: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface HomePageData {
  hero: HeroBlock;
  intro: string;
  industries: string[];
  pricingSummary: PriceNote[];
  deliveryHighlights: string[];
  finalCta: CTAConfig;
}

export interface AboutPageData {
  hero: HeroBlock;
  summary: string;
  strengths: string[];
  workPrinciples: ProcessStep[];
  finalCta: CTAConfig;
}

export interface SiteConfig {
  brandName: string;
  publicName: string;
  defaultTitleSuffix: string;
  baseDescription: string;
  primaryCity: string;
  coverage: string;
  minOrder: string;
  leadTime: string;
  warranty: string;
  prepayment: string;
  urgentOrders: string;
  designOffer: string;
}
