import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { contactInfo } from "../app/data/site";
import { buildFaqSchema, buildLocalBusinessSchema, buildServiceSchema } from "../app/utils/schema";

describe("schema guards", () => {
  it("creates LocalBusiness with confirmed address", () => {
    const schema = buildLocalBusinessSchema("https://example.com", contactInfo);

    expect(schema).not.toBeNull();
    expect(schema).toMatchObject({
      name: contactInfo.publicName,
      address: {
        "@type": "PostalAddress",
        streetAddress: contactInfo.address
      },
      telephone: contactInfo.channels.find((item) => item.type === "phone")?.value,
      email: contactInfo.channels.find((item) => item.type === "email")?.value
    });
  });

  it("does not mark city pages as having local business presence", () => {
    for (const city of cities.filter((item) => item.status === "published")) {
      expect(city.hasLocalAddress).toBe(false);
      expect(city.hero.note).toBeTruthy();
      expect(city.hero.facts.length).toBeGreaterThanOrEqual(3);
      expect(city.serviceHighlights.length).toBeGreaterThanOrEqual(3);
      expect(city.relatedServiceSlugs.length).toBeGreaterThanOrEqual(2);
      expect(city.relatedCaseIds.length).toBeGreaterThanOrEqual(1);
      expect(city.relatedCaseIds.length).toBeLessThanOrEqual(2);
    }
  });

  it("creates FAQ schema only when items exist", () => {
    expect(buildFaqSchema([])).toBeNull();
    expect(buildFaqSchema([cities[0]!.faq[0]!])).not.toBeNull();
  });

  it("builds city pages as services without local business claims", () => {
    for (const city of cities.filter((item) => item.status === "published")) {
      const schema = buildServiceSchema("https://example.com", {
        h1: city.h1,
        meta: city.meta,
        city: city.city
      });

      expect(schema.areaServed).toBe(city.city);
      expect(schema.name).toBe(city.h1);
    }
  });
});
