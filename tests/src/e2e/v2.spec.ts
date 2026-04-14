import { expect, test } from "@playwright/test";

test.describe("V2 Portfolio", () => {
  test("homepage loads and shows all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Valentin/);
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("theme toggle works and persists", async ({ page }) => {
    await page.goto("/");

    const themeBtn = page.locator('[data-testid="theme-toggle"]');
    await expect(themeBtn).toBeVisible();

    const initialTheme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );

    await themeBtn.click();

    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.theme),
      )
      .not.toBe(initialTheme);
  });

  test("language switch works", async ({ page }) => {
    await page.goto("/");

    const langBtn = page.locator('[data-testid="lang-button"]');
    await expect(langBtn).toBeVisible();

    // Read initial i18n language from localStorage
    const langBefore = await page.evaluate(
      () => localStorage.getItem("i18nextLng") ?? "en",
    );

    await langBtn.click();

    // i18n persists the new language in localStorage
    await expect
      .poll(
        () => page.evaluate(() => localStorage.getItem("i18nextLng")),
        { timeout: 5000 },
      )
      .not.toBe(langBefore);
  });

  test("projects section renders", async ({ page }) => {
    await page.goto("/");

    const projectSection = page.locator("#projects");
    await expect(projectSection).toBeVisible();

    // Wait for either project cards or skeleton loaders to appear
    await expect(
      projectSection
        .locator('[data-testid="projects-grid"] > *')
        .first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("contact form validates empty fields", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    const submitBtn = page.locator(
      '#contact button[type="submit"]',
    );
    await submitBtn.click();

    // Validation errors should appear (IDs: contact-name-error, etc.)
    await expect(
      page.locator("[id^='contact-'][id$='-error']").first(),
    ).toBeVisible();
  });

  test("contact form requires DSGVO consent", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Fill all fields except consent
    await page.fill("input[name='name']", "Test");
    await page.fill("input[name='email']", "test@example.com");
    await page.fill("input[name='subject']", "Test Subject");
    await page.fill(
      "textarea[name='message']",
      "This is a test message for the form.",
    );

    const submitBtn = page.locator(
      '#contact button[type="submit"]',
    );
    await submitBtn.click();

    // Consent error should appear
    await expect(
      page.locator("#contact .MuiFormHelperText-root").first(),
    ).toBeVisible();
  });

  test("legal notice page has required content", async ({ page }) => {
    await page.goto("/legal-notice");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("#main-content h1")).toBeVisible();
  });

  test("privacy policy page has required content", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("#main-content h1")).toBeVisible();
  });

  test("projects page loads with filter tabs", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.locator('[data-testid="filter-all"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="filter-projects"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="filter-templates"]'),
    ).toBeVisible();
  });

  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    // Hamburger menu should appear on mobile
    await page.waitForTimeout(500);
    await expect(
      page.locator('[data-testid="mobile-menu-btn"]'),
    ).toBeVisible();
  });

  test("navigation from subpage to main sections", async ({ page }) => {
    await page.goto("/projects");

    // Click the logo link (goes to homepage)
    const logo = page.locator("nav a").first();
    await logo.click();

    await expect(page).toHaveURL("/");
  });

  test("skip-to-content link is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    // Tab to first focusable element (should be skip-to-content)
    await page.keyboard.press("Tab");

    const skipLink = page.locator('[data-testid="skip-to-content"]');
    await expect(skipLink).toBeFocused();
  });
});
