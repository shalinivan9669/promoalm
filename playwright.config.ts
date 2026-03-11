import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:4173"
  },
  webServer: {
    command:
      "cmd /c \"set HOST=localhost&& set PORT=4173&& set NUXT_PUBLIC_SITE_URL=http://localhost:4173&& node .output\\server\\index.mjs\"",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
