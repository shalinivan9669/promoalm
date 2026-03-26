import type { BreadcrumbItem, CaseStudy, ContactChannelType, ContactInfo, FAQItem, SupportFaqGroup, SupportPageData } from "../../shared/types/content";
import { absoluteUrl } from "./seo";

function getPublicAddress(contact: ContactInfo) {
  if (!contact.address || contact.addressEvidenceLevel !== "confirmed") {
    return undefined;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: contact.address
  };
}

function getPrimaryChannelValue(contact: ContactInfo, type: ContactChannelType) {
  return contact.channels.find((channel) => channel.type === type && channel.available && channel.value)?.value;
}

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
  const contactPoints = contact.channels
    .filter((channel) => channel.available && channel.href)
    .map((channel) => {
      if (channel.type === "email") {
        return {
          "@type": "ContactPoint",
          contactType: channel.label,
          email: channel.value,
          availableLanguage: ["ru"]
        };
      }

      if (channel.type === "phone") {
        return {
          "@type": "ContactPoint",
          contactType: channel.label,
          telephone: channel.value,
          availableLanguage: ["ru"]
        };
      }

      return {
        "@type": "ContactPoint",
        contactType: channel.label,
        url: absoluteUrl(siteUrl, channel.href!),
        availableLanguage: ["ru"]
      };
    });

  const areaServed = [contact.primaryCity, contact.coverage].filter((item): item is string => Boolean(item));
  const address = getPublicAddress(contact);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contact.publicName,
    url: siteUrl,
    description: contact.shortDescription,
    areaServed,
    address,
    telephone: getPrimaryChannelValue(contact, "phone"),
    email: getPrimaryChannelValue(contact, "email"),
    contactPoint: contactPoints,
    sameAs: contact.sameAs?.length ? contact.sameAs : undefined
  };
}

export function buildWebSiteSchema(siteUrl: string, contact: ContactInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: contact.publicName,
    url: siteUrl,
    inLanguage: "ru",
    publisher: {
      "@type": "Organization",
      name: contact.publicName,
      url: siteUrl
    }
  };
}

export function buildWebPageSchema(siteUrl: string, title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(siteUrl, path),
    inLanguage: "ru"
  };
}

export function buildLocalBusinessSchema(siteUrl: string, contact: ContactInfo) {
  const address = getPublicAddress(contact);

  if (!address) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contact.publicName,
    url: siteUrl,
    description: contact.shortDescription,
    address,
    telephone: getPrimaryChannelValue(contact, "phone"),
    email: getPrimaryChannelValue(contact, "email")
  };
}

export function buildServiceSchema(
  siteUrl: string,
  page: { h1: string; meta: { description: string; path: string }; city?: string; areaServed?: string }
) {
  const areaServed = page.city || page.areaServed || "Казахстан";

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

function flattenSupportFaqGroups(groups: SupportFaqGroup[]) {
  return groups.flatMap((group) => group.items);
}

export function buildSupportPageSchemas(siteUrl: string, page: SupportPageData, breadcrumbs: BreadcrumbItem[], contact: ContactInfo) {
  const schemas: Record<string, unknown>[] = [
    buildWebPageSchema(siteUrl, page.h1, page.meta.description, page.meta.canonical || page.meta.path),
    buildBreadcrumbSchema(siteUrl, breadcrumbs)
  ];

  if (page.schema.organizationReference !== false) {
    schemas.push(buildOrganizationSchema(siteUrl, contact));
  }

  if (page.schema.types.includes("Service")) {
    schemas.push(
      buildServiceSchema(siteUrl, {
        h1: page.h1,
        meta: {
          description: page.meta.description,
          path: page.meta.canonical || page.meta.path
        },
        areaServed: page.schema.service?.areaServed || page.areaServed
      })
    );
  }

  if (page.schema.types.includes("FAQPage")) {
    const faqItems = flattenSupportFaqGroups(page.faqGroups);

    if (faqItems.length) {
      const faqSchema = buildFaqSchema(faqItems);

      if (faqSchema) {
        schemas.push(faqSchema);
      }
    }
  }

  if (page.schema.types.includes("LocalBusiness")) {
    const localBusiness = buildLocalBusinessSchema(siteUrl, contact);

    if (localBusiness) {
      schemas.push(localBusiness);
    }
  }

  return schemas.filter(Boolean) as Record<string, unknown>[];
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
    name: `Контакты ${contact.publicName}`,
    description: contact.shortDescription,
    url: absoluteUrl(siteUrl, "/kontakty/"),
    about: {
      "@type": "Organization",
      name: contact.publicName,
      url: siteUrl
    }
  };
}
