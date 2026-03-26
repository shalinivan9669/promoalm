import { describe, expect, it, vi } from "vitest";

import { isAllowedOriginValue } from "../shared/utils/origin";

describe("request guards", () => {
  it("accepts the exact production origin", () => {
    expect(isAllowedOriginValue("https://www.neonmarket.kz", "https://www.neonmarket.kz")).toBe(true);
  });

  it("accepts localhost in non-production", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(isAllowedOriginValue("http://localhost:3000", "https://www.neonmarket.kz")).toBe(true);
    expect(isAllowedOriginValue("http://127.0.0.1:4173", "https://www.neonmarket.kz")).toBe(true);

    vi.unstubAllEnvs();
  });

  it("rejects foreign origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(isAllowedOriginValue("https://evil.example", "https://www.neonmarket.kz")).toBe(false);
    expect(isAllowedOriginValue("http://localhost:3000", "https://www.neonmarket.kz")).toBe(false);

    vi.unstubAllEnvs();
  });
});
