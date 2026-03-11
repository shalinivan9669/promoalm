import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { footerNavigation, primaryNavigation } from "../app/data/navigation";
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
      ...primaryNavigation.map((item) => item.href),
      ...footerNavigation.services.map((item) => item.href),
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
});
