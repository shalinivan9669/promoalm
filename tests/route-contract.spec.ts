import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { flattenPrimaryNavigation, footerNavigation, homeCityNavigation, primaryNavigation, serviceNavigation } from "../app/data/navigation";
import { services } from "../app/data/services";
import { supportPages } from "../app/data/support-pages";
import { getSitemapPaths } from "../server/utils/sitemap";

describe("route contract", () => {
  const plannedPaths = [
    ...services.filter((item) => item.status !== "published").map((item) => item.meta.path),
    ...cities.filter((item) => item.status !== "published").map((item) => item.meta.path),
    ...supportPages.filter((item) => item.status !== "published").map((item) => item.meta.path)
  ];

  it("keeps planned routes out of navigation", () => {
    const navPaths = [
      ...flattenPrimaryNavigation(primaryNavigation).map((item) => item.href),
      ...footerNavigation.services.map((item) => item.href),
      ...footerNavigation.support.map((item) => item.href),
      ...footerNavigation.company.map((item) => item.href),
      ...footerNavigation.cities.map((item) => item.href)
    ];

    for (const path of plannedPaths) {
      expect(navPaths).not.toContain(path);
    }
  });

  it("keeps planned routes out of sitemap", () => {
    const sitemapPaths = getSitemapPaths();

    for (const path of plannedPaths) {
      expect(sitemapPaths).not.toContain(path);
    }
  });

  it("keeps published related links away from planned routes", () => {
    const publishedPages = [
      ...services.filter((item) => item.status === "published"),
      ...cities.filter((item) => item.status === "published"),
      ...supportPages.filter((item) => item.status === "published")
    ];

    for (const page of publishedPages) {
      for (const link of page.relatedLinks) {
        expect(plannedPaths).not.toContain(link.href);
      }
    }
  });

  it("keeps key published city and support links in navigation surfaces", () => {
    const primaryLeafPaths = flattenPrimaryNavigation(primaryNavigation).map((item) => item.href);
    const homeCityPaths = homeCityNavigation.map((item) => item.href);

    expect(primaryLeafPaths).toContain("/faq/");
    expect(primaryLeafPaths).toContain("/goroda/almaty/");
    expect(primaryLeafPaths).toContain("/goroda/astana/");
    expect(primaryLeafPaths).toContain("/goroda/shymkent/");
    expect(homeCityPaths).toEqual(["/goroda/almaty/", "/goroda/astana/", "/goroda/shymkent/"]);
  });

  it("keeps neon below the core b2b services in service navigation", () => {
    const servicePaths = serviceNavigation.map((item) => item.href);
    const neonIndex = servicePaths.indexOf("/uslugi/neonovye-vyveski/");

    expect(neonIndex).toBeGreaterThan(servicePaths.indexOf("/uslugi/fasadnye-vyveski/"));
    expect(neonIndex).toBeGreaterThan(servicePaths.indexOf("/uslugi/svetovye-koroba/"));
    expect(neonIndex).toBeGreaterThan(servicePaths.indexOf("/uslugi/vyveski-dlya-seti/"));
    expect(neonIndex).toBeGreaterThan(servicePaths.indexOf("/uslugi/vyveski-pod-klyuch/"));
  });
});
