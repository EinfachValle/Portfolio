import { defineConfig, devices } from "@playwright/test";

const V1_PORT = process.env.V1_PORT || "3100";
const V2_PORT = process.env.V2_PORT || "3200";
const V1_URL = `http://localhost:${V1_PORT}`;
const V2_URL = `http://localhost:${V2_PORT}`;
const isCI = process.env.CI;

export default defineConfig({
  testDir: "./src/e2e",
  timeout: 30000,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: [["html"], ["list"]],
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "v1-chromium",
      testMatch: "v1.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: V1_URL },
    },
    {
      name: "v2-chromium",
      testMatch: "v2.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: V2_URL },
    },
    // ── v2 responsive tests across devices & browsers ──
    {
      name: "v2-mobile-chrome",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["Pixel 7"], baseURL: V2_URL },
    },
    {
      name: "v2-mobile-safari",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["iPhone 14"], baseURL: V2_URL },
    },
    {
      name: "v2-tablet-safari",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["iPad Pro 11"], baseURL: V2_URL },
    },
    {
      name: "v2-tablet-landscape",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["iPad Pro 11 landscape"], baseURL: V2_URL },
    },
    {
      name: "v2-desktop-firefox",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["Desktop Firefox"], baseURL: V2_URL },
    },
    {
      name: "v2-desktop-safari",
      testMatch: "v2-responsive.spec.ts",
      use: { ...devices["Desktop Safari"], baseURL: V2_URL },
    },
  ],
  webServer: [
    {
      command: `yarn workspace @portfolio/v1 dev -- --port ${V1_PORT}`,
      url: V1_URL,
      reuseExistingServer: !isCI,
      timeout: 30_000,
    },
    {
      command: `yarn workspace @portfolio/v2 dev -- --port ${V2_PORT}`,
      url: V2_URL,
      reuseExistingServer: !isCI,
      timeout: 30_000,
    },
  ],
});
