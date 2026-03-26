import { describe, expect, it } from "vitest";

import { buildSitemapXml, getSitemapPaths } from "../server/utils/sitemap";

describe("sitemap", () => {
  it("includes core published routes", () => {
    const paths = getSitemapPaths();

    expect(paths).toContain("/");
    expect(paths).toContain("/uslugi/fasadnye-vyveski/");
    expect(paths).toContain("/goroda/almaty/");
    expect(paths).toContain("/dostavka-po-kazahstanu/");
  });

  it("builds xml with absolute urls", () => {
    const xml = buildSitemapXml("https://example.com");

    expect(xml).toContain("https://example.com/uslugi/fasadnye-vyveski/");
    expect(xml).toContain("<urlset");
  });

  it("does not duplicate sitemap paths", () => {
    const paths = getSitemapPaths();

    expect(new Set(paths).size).toBe(paths.length);
  });
});
