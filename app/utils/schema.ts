import type { BreadcrumbItem, CaseStudy, CityPageData, ContactInfo, FAQItem, ServicePageData } from "../../shared/types/content";
import { absoluteUrl } from "./seo";

export function buildBreadcrumbSchema(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(siteUrl, item.href)
    }))
  };
}

export function buildOrganizationSchema(siteUrl: string, contact: ContactInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contact.publicName,
    url: siteUrl,
    description: contact.shortDescription,
    areaServed: contact.serviceArea
  };
}

export function buildLocalBusinessSchema(siteUrl: string, contact: ContactInfo) {
  if (!contact.address || contact.addressEvidenceLevel !== "confirmed") {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contact.publicName,
    url: siteUrl,
    description: contact.shortDescription,
    address: contact.address
  };
}

export function buildServiceSchema(siteUrl: string, page: ServicePageData | CityPageData) {
  const areaServed = "city" in page ? page.city : "Казахстан";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.meta.description,
    provider: {
      "@type": "Organization",
      name: "Neon Market"
    },
    areaServed,
    url: absoluteUrl(siteUrl, page.meta.path)
  };
}

export function buildFaqSchema(faq: FAQItem[]) {
  if (!faq.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildCollectionPageSchema(siteUrl: string, title: string, description: string, items: CaseStudy[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl(siteUrl, "/cases/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: absoluteUrl(siteUrl, `/cases/#${item.slug}`)
      }))
    }
  };
}

export function buildContactPageSchema(siteUrl: string, contact: ContactInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Контакты",
    description: contact.shortDescription,
    url: absoluteUrl(siteUrl, "/kontakty/")
  };
}
