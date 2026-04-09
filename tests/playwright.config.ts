import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.TEST_PORT || "3100";
const BASE_URL = `http://localhost:${PORT}`;
const isCI = process.env.CI;

export default defineConfig({
  testDir: "./src/e2e",
  timeout: 30000,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: BASE_URL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `yarn workspace @portfolio/v1 dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
});
