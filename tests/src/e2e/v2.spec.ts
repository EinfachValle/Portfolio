import { expect, test } from "@playwright/test";

test.describe("V2 Portfolio", () => {
  test("homepage loads and shows all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Valentin/);
    // Check all 4 sections exist
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("theme toggle works and persists", async ({ page }) => {
    // Set a known initial theme via localStorage before navigating
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });
    await page.reload();

    const themeBtn = page.getByRole("button", {
      name: /toggle theme|Design wechseln/i,
    });
    await expect(themeBtn).toBeVisible();

    // Click toggle — should switch from dark to light
    await themeBtn.click();

    // Verify theme changed in localStorage
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("light");
  });

  test("language switch works without scroll reset", async ({ page }) => {
    await page.goto("/");

    const langButton = page.getByRole("button", {
      name: /switch language|Sprache wechseln/i,
    });
    await expect(langButton).toBeVisible();

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Switch language
    await langButton.click();

    // Verify scroll position preserved (within 50px tolerance)
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(50);
  });

  test("projects section renders", async ({ page }) => {
    await page.goto("/");

    // The projects section should render — either cards, error message, or loading skeletons
    const projectSection = page.locator("#projects");
    await expect(projectSection).toBeVisible();

    // Section label should be visible
    await expect(
      projectSection.getByText(/PROJECTS|PROJEKTE/).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("contact form validates empty fields", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Try to submit empty form
    const submitBtn = page.getByRole("button", {
      name: /Send Message|Nachricht senden/i,
    });
    await submitBtn.click();

    // Should show validation errors
    await expect(
      page.getByText(/required|erforderlich/i).first(),
    ).toBeVisible();
  });

  test("contact form requires DSGVO consent", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Fill in all fields but don't check consent
    await page.fill("input[name='name']", "Test");
    await page.fill("input[name='email']", "test@example.com");
    await page.fill("input[name='subject']", "Test Subject");
    await page.fill(
      "textarea[name='message']",
      "This is a test message for the form.",
    );

    const submitBtn = page.getByRole("button", {
      name: /Send Message|Nachricht senden/i,
    });
    await submitBtn.click();

    // Should show consent error
    await expect(
      page.getByText(/privacy policy|Datenschutzerklärung/i).first(),
    ).toBeVisible();
  });

  test("legal notice page has required content", async ({ page }) => {
    await page.goto("/legal-notice");
    await expect(
      page.getByText("Impressum").or(page.getByText("Legal Notice")).first(),
    ).toBeVisible();
    await expect(page.getByText(/§5 DDG/).first()).toBeVisible();
  });

  test("privacy policy page has required content", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(
      page
        .getByText("Datenschutzerklärung")
        .or(page.getByText("Privacy Policy"))
        .first(),
    ).toBeVisible();
    await expect(page.getByText(/DSGVO|GDPR/).first()).toBeVisible();
  });

  test("projects page loads with filter tabs", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("button", { name: /All|Alle/ }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Projects|Projekte/ }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Templates|Vorlagen/ }).first(),
    ).toBeVisible();
  });

  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    // Check hamburger menu exists on mobile
    const menuBtn = page.getByRole("button", { name: /menu|Menü/i });
    await expect(menuBtn).toBeVisible();
  });

  test("navigation from subpage to main sections", async ({ page }) => {
    await page.goto("/projects");

    // Click the VR logo link
    const logo = page.getByRole("link", { name: /Homepage/i }).first();
    await logo.click();

    await expect(page).toHaveURL("/");
  });

  test("skip-to-content link is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    // Tab to first focusable element (should be skip-to-content)
    await page.keyboard.press("Tab");

    const skipLink = page.getByText(/Skip to content|Zum Inhalt springen/i);
    await expect(skipLink).toBeFocused();
  });
});
