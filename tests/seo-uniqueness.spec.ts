import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { caseMediaBySlug } from "../app/data/case-media";
import { casesPageHero } from "../app/data/cases-page";
import { contactPageData } from "../app/data/contact-page";
import { citiesHubPageData, servicesHubPageData } from "../app/data/hub-pages";
import { services } from "../app/data/services";
import { aboutPageData, homePageData, staticPageMeta } from "../app/data/site";
import { supportPages as supportData } from "../app/data/support-pages";

describe("seo uniqueness", () => {
  const publishedServices = services.filter((item) => item.status === "published");
  const publishedCities = cities.filter((item) => item.status === "published");
  const publishedSupport = supportData.filter((item) => item.status === "published");
  const staticMetas = Object.values(staticPageMeta);
  const hubMetas = [servicesHubPageData.meta, citiesHubPageData.meta];
  const staticH1s = [
    homePageData.hero.title,
    aboutPageData.hero.title,
    contactPageData.hero.title,
    casesPageHero.title,
    servicesHubPageData.hero.title,
    citiesHubPageData.hero.title
  ];

  it("keeps titles unique", () => {
    const titles = [
      ...publishedServices.map((item) => item.meta.title),
      ...publishedCities.map((item) => item.meta.title),
      ...publishedSupport.map((item) => item.meta.title),
      ...staticMetas.map((item) => item.title),
      ...hubMetas.map((item) => item.title)
    ];

    expect(new Set(titles).size).toBe(titles.length);
  });

  it("keeps descriptions unique", () => {
    const descriptions = [
      ...publishedServices.map((item) => item.meta.description),
      ...publishedCities.map((item) => item.meta.description),
      ...publishedSupport.map((item) => item.meta.description),
      ...staticMetas.map((item) => item.description),
      ...hubMetas.map((item) => item.description)
    ];

    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps h1 values unique", () => {
    const h1s = [
      ...publishedServices.map((item) => item.h1),
      ...publishedCities.map((item) => item.h1),
      ...publishedSupport.map((item) => item.h1),
      ...staticH1s
    ];

    expect(new Set(h1s).size).toBe(h1s.length);
  });

  it("keeps canonical paths unique", () => {
    const paths = [
      ...publishedServices.map((item) => item.meta.canonical ?? item.meta.path),
      ...publishedCities.map((item) => item.meta.canonical ?? item.meta.path),
      ...publishedSupport.map((item) => item.meta.canonical ?? item.meta.path),
      ...staticMetas.map((item) => item.path),
      ...hubMetas.map((item) => item.path)
    ];

    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps published pages from missing core seo fields", () => {
    const pages = [
      ...publishedServices.map((item) => ({
        title: item.meta.title,
        description: item.meta.description,
        h1: item.h1,
        canonical: item.meta.canonical ?? item.meta.path
      })),
      ...publishedCities.map((item) => ({
        title: item.meta.title,
        description: item.meta.description,
        h1: item.h1,
        canonical: item.meta.canonical ?? item.meta.path
      })),
      ...publishedSupport.map((item) => ({
        title: item.meta.title,
        description: item.meta.description,
        h1: item.h1,
        canonical: item.meta.canonical ?? item.meta.path
      })),
      ...hubMetas.map((item, index) => ({
        title: item.title,
        description: item.description,
        h1: staticH1s[4 + index]!,
        canonical: item.path
      })),
      ...staticMetas.map((item, index) => ({
        title: item.title,
        description: item.description,
        h1: staticH1s[index]!,
        canonical: item.path
      }))
    ];

    for (const page of pages) {
      expect(page.title.trim().length).toBeGreaterThan(0);
      expect(page.description.trim().length).toBeGreaterThan(0);
      expect(page.h1.trim().length).toBeGreaterThan(0);
      expect(page.canonical.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps case media alt text meaningful", () => {
    for (const config of Object.values(caseMediaBySlug)) {
      expect(config?.alts.length).toBe(config?.files.length);
      expect(new Set(config?.alts ?? []).size).toBe(config?.alts.length ?? 0);

      for (const alt of config?.alts ?? []) {
        expect(alt.trim().length).toBeGreaterThan(0);
        expect(alt).not.toMatch(/^(image|изображение)\b/i);
        expect(alt).not.toMatch(/\bизображение\s*\d+\b/i);
      }
    }
  });
});
