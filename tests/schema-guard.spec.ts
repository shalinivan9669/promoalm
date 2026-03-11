import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { contactInfo } from "../app/data/site";
import { buildFaqSchema, buildLocalBusinessSchema } from "../app/utils/schema";

describe("schema guards", () => {
  it("does not create LocalBusiness without confirmed address", () => {
    expect(buildLocalBusinessSchema("https://example.com", contactInfo)).toBeNull();
  });

  it("does not mark city pages as having local business presence", () => {
    for (const city of cities.filter((item) => item.status === "published")) {
      expect(city.hasLocalAddress).toBe(false);
    }
  });

  it("creates FAQ schema only when items exist", () => {
    expect(buildFaqSchema([])).toBeNull();
    expect(buildFaqSchema([cities[0]!.faq[0]!])).not.toBeNull();
  });
});
