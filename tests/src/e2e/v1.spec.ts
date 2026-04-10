import { test, expect } from "@playwright/test";

test.describe("V1 Portfolio", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Valentin/);
    await expect(page.locator("text=Valentin").first()).toBeVisible();
  });

  test("displays main sections", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Default language is German — check section headings in sidebar + content
    await expect(
      page.getByText("Über mich").or(page.getByText("About Me")).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Erfahrung").or(page.getByText("Experience")).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Projekte").or(page.getByText("Projects")).first(),
    ).toBeVisible();
  });

  test("language switch works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const langButton = page.getByRole("button", { name: /^(EN|DE)$/ });
    await expect(langButton).toBeVisible();

    const initialText = (await langButton.textContent())?.trim();

    if (initialText === "EN") {
      // Currently German, switch to English
      await langButton.click();
      await expect(
        page.getByText("About Me").first(),
      ).toBeVisible();
    } else {
      // Currently English, switch to German
      await langButton.click();
      await expect(
        page.getByText("Über mich").first(),
      ).toBeVisible();
    }
  });

  test("projects page loads", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByText("All Projects").first()).toBeVisible();
  });

  test("templates page loads", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.getByText("All Templates").first()).toBeVisible();
  });

  test("github repos load on projects page", async ({ page }) => {
    await page.goto("/projects");
    // Wait for repo names to render (GitHub API may be slow)
    await expect(page.getByText("Portfolio").first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("social links are present", async ({ page }) => {
    await page.goto("/");

    const githubLink = page.locator(
      "a[href='https://github.com/EinfachValle']",
    );
    await expect(githubLink).toBeVisible();

    const linkedinLink = page.locator(
      "a[href='https://www.linkedin.com/in/einfachvalle/']",
    );
    await expect(linkedinLink).toBeVisible();
  });

  test("navigation back from projects", async ({ page }) => {
    await page.goto("/projects");

    const backLink = page.getByRole("link", { name: /Valentin/ });
    await expect(backLink).toBeVisible();
    await backLink.click();

    await expect(page).toHaveURL("/");
  });

  test("mobile viewport renders", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("text=Valentin").first()).toBeVisible();
  });

  test("legal notice page loads with required content", async ({ page }) => {
    await page.goto("/legal-notice");
    await expect(
      page.getByText("Impressum").or(page.getByText("Legal Notice")).first(),
    ).toBeVisible();
    await expect(page.getByText(/§5 DDG/).first()).toBeVisible();
  });

  test("privacy policy page loads with required content", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(
      page
        .getByText("Datenschutzerklärung")
        .or(page.getByText("Privacy Policy"))
        .first(),
    ).toBeVisible();
    await expect(page.getByText(/DSGVO|GDPR/).first()).toBeVisible();
  });

  test("side menu has legal links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("link", { name: /Impressum|Legal Notice/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Datenschutz|Privacy Policy/ }),
    ).toBeVisible();
  });
});
