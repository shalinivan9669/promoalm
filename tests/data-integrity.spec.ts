import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { cases } from "../app/data/cases";
import { services } from "../app/data/services";

describe("data integrity", () => {
  const publishedCases = new Set(cases.filter((item) => item.status === "published").map((item) => item.id));
  const publishedServices = new Set(services.filter((item) => item.status === "published").map((item) => item.slug));

  it("keeps published services wired to valid cases and CTA", () => {
    for (const service of services.filter((item) => item.status === "published")) {
      expect(service.hero.title.length).toBeGreaterThan(10);
      expect(service.cta.href.length).toBeGreaterThan(1);
      expect(service.relatedLinks.length).toBeGreaterThan(0);

      for (const caseId of service.caseIds) {
        expect(publishedCases.has(caseId)).toBe(true);
      }
    }
  });

  it("keeps published cities wired to valid services and cases", () => {
    for (const city of cities.filter((item) => item.status === "published")) {
      expect(city.hero.title.length).toBeGreaterThan(10);
      expect(city.cta.href.length).toBeGreaterThan(1);

      for (const caseId of city.relatedCaseIds) {
        expect(publishedCases.has(caseId)).toBe(true);
      }

      for (const slug of city.relatedServiceSlugs) {
        expect(publishedServices.has(slug)).toBe(true);
      }
    }
  });
});
