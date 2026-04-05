import { cities } from "../app/data/cities";
import { caseMediaBySlug } from "../app/data/case-media";
import { casesPageHero } from "../app/data/cases-page";
import { cases } from "../app/data/cases";
import { contactPageData } from "../app/data/contact-page";
import { citiesHubPageData, servicesHubPageData } from "../app/data/hub-pages";
import { services } from "../app/data/services";
import { aboutPageData, homePageData, staticPageMeta } from "../app/data/site";
import { supportPages } from "../app/data/support-pages";
import { validateContentOrThrow } from "../shared/validation/content";

function assertUnique(items: string[], label: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item)) {
      throw new Error(`Duplicate ${label}: ${item}`);
    }

    seen.add(item);
  }
}

function assertMeaningfulAlt(slug: string, alt: string) {
  const value = alt.trim();

  if (!value) {
    throw new Error(`Case media alt is empty for "${slug}".`);
  }

  if (/^(image|изображение)\b/i.test(value) || /\bизображение\s*\d+\b/i.test(value)) {
    throw new Error(`Case media alt uses a placeholder for "${slug}": ${value}`);
  }
}

try {
  validateContentOrThrow({
    services,
    cities,
    cases,
    supportPages
  });

  const publishedServices = services.filter((item) => item.status === "published");
  const publishedCities = cities.filter((item) => item.status === "published");
  const publishedSupportPages = supportPages.filter((item) => item.status === "published");
  const seoEntries = [
    {
      key: "home",
      title: staticPageMeta.home.title,
      description: staticPageMeta.home.description,
      h1: homePageData.hero.title,
      canonical: staticPageMeta.home.path
    },
    {
      key: "about",
      title: staticPageMeta.about.title,
      description: staticPageMeta.about.description,
      h1: aboutPageData.hero.title,
      canonical: staticPageMeta.about.path
    },
    {
      key: "contacts",
      title: staticPageMeta.contacts.title,
      description: staticPageMeta.contacts.description,
      h1: contactPageData.hero.title,
      canonical: staticPageMeta.contacts.path
    },
    {
      key: "cases",
      title: staticPageMeta.cases.title,
      description: staticPageMeta.cases.description,
      h1: casesPageHero.title,
      canonical: staticPageMeta.cases.path
    },
    {
      key: "uslugi-hub",
      title: servicesHubPageData.meta.title,
      description: servicesHubPageData.meta.description,
      h1: servicesHubPageData.hero.title,
      canonical: servicesHubPageData.meta.path
    },
    {
      key: "goroda-hub",
      title: citiesHubPageData.meta.title,
      description: citiesHubPageData.meta.description,
      h1: citiesHubPageData.hero.title,
      canonical: citiesHubPageData.meta.path
    },
    ...publishedServices.map((item) => ({
      key: item.slug,
      title: item.meta.title,
      description: item.meta.description,
      h1: item.h1,
      canonical: item.meta.canonical ?? item.meta.path
    })),
    ...publishedCities.map((item) => ({
      key: item.slug,
      title: item.meta.title,
      description: item.meta.description,
      h1: item.h1,
      canonical: item.meta.canonical ?? item.meta.path
    })),
    ...publishedSupportPages.map((item) => ({
      key: item.slug,
      title: item.meta.title,
      description: item.meta.description,
      h1: item.h1,
      canonical: item.meta.canonical ?? item.meta.path
    }))
  ];

  for (const entry of seoEntries) {
    if (!entry.title.trim() || !entry.description.trim() || !entry.h1.trim() || !entry.canonical.trim()) {
      throw new Error(`SEO entry "${entry.key}" is missing title, description, h1 or canonical.`);
    }
  }

  assertUnique(
    seoEntries.map((entry) => entry.title),
    "SEO title"
  );
  assertUnique(
    seoEntries.map((entry) => entry.description),
    "SEO description"
  );
  assertUnique(
    seoEntries.map((entry) => entry.h1),
    "SEO h1"
  );
  assertUnique(
    seoEntries.map((entry) => entry.canonical),
    "SEO canonical"
  );

  for (const [slug, config] of Object.entries(caseMediaBySlug)) {
    if (!config) {
      continue;
    }

    if (config.alts.length !== config.files.length) {
      throw new Error(`Case media alt count mismatch for "${slug}".`);
    }

    assertUnique(config.alts, `case media alt (${slug})`);

    for (const alt of config.alts) {
      assertMeaningfulAlt(slug, alt);
    }
  }

  console.log("Content and SEO validation passed.");
} catch (error) {
  console.error("Content or SEO validation failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
