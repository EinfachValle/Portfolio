import { expect, test } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────

function getViewportWidth(page: { viewportSize(): { width: number } | null }) {
  return page.viewportSize()?.width ?? 1280;
}

// ── All viewports — core functionality ──────────────────────────────

test.describe("V2 Responsive — Core", () => {
  test("homepage loads and shows all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Valentin/);
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("navigation is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("theme toggle works", async ({ page }) => {
    await page.goto("/");
    const themeBtn = page.getByRole("button", {
      name: /toggle theme|Design wechseln/i,
    });
    await expect(themeBtn).toBeVisible();

    // Get initial theme
    const initialTheme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    await themeBtn.click();

    // Theme should change on the DOM
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.theme),
      )
      .not.toBe(initialTheme);
  });

  test("legal pages load", async ({ page }) => {
    await page.goto("/legal-notice");
    await expect(
      page.getByText("Impressum").or(page.getByText("Legal Notice")).first(),
    ).toBeVisible();

    await page.goto("/privacy-policy");
    await expect(
      page
        .getByText("Datenschutzerklärung")
        .or(page.getByText("Privacy Policy"))
        .first(),
    ).toBeVisible();
  });
});

// ── Mobile layout (< 600px) ─────────────────────────────────────────

test.describe("V2 Responsive — Mobile", () => {
  test.skip(({ page }) => getViewportWidth(page) >= 600, "Desktop/Tablet");

  test("hamburger menu visible, desktop nav hidden", async ({ page }) => {
    await page.goto("/");
    // Wait for device detection hydration
    await page.waitForTimeout(500);
    const menuBtn = page.getByRole("button", { name: /menu|Menü/i });
    await expect(menuBtn).toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    const menuBtn = page.getByRole("button", { name: /menu|Menü/i });
    await menuBtn.click();
    // Mobile overlay should appear with nav items
    await expect(
      page
        .getByRole("button", { name: /home|start/i })
        .or(page.getByText(/home|start/i).first()),
    ).toBeVisible();
    // Close
    const closeBtn = page.getByRole("button", { name: /close|Schließen/i });
    await closeBtn.click();
  });

  test("footer stacks vertically", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    // Wait for device detection hook hydration
    await expect
      .poll(
        () =>
          page
            .locator('[data-testid="footer-content"]')
            .evaluate((el) => getComputedStyle(el).flexDirection),
        { timeout: 5000 },
      )
      .toBe("column");
  });

  test("contact form fields stack vertically", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    // Wait for device detection hook hydration
    await expect
      .poll(
        () =>
          page
            .locator('[data-testid="contact-fields-row"]')
            .evaluate((el) => getComputedStyle(el).flexDirection),
        { timeout: 5000 },
      )
      .toBe("column");
  });

  test("projects grid shows 1 column", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const columns = await page
      .locator('[data-testid="projects-grid"]')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(1);
  });

  test("middle project card has no elevation", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    // Wait for cards or skeletons to render
    await page
      .locator('[data-testid="projects-grid"] > *')
      .first()
      .waitFor({ timeout: 10000 });
    const cards = page.locator('[data-testid="projects-grid"] > *');
    const count = await cards.count();
    if (count >= 2) {
      const transform = await cards
        .nth(1)
        .evaluate((el) => getComputedStyle(el).transform);
      // Should be "none" — no translateY(-12px)
      expect(transform === "none" || !transform.includes("-12")).toBeTruthy();
    }
  });

  test("hero has mobile padding", async ({ page }) => {
    await page.goto("/");
    // Check the section's inner content container padding
    const padding = await page.locator("#hero > div").first().evaluate((el) => {
      // Find the flex container inside hero
      const container = el.querySelector("div");
      return container
        ? parseInt(getComputedStyle(container).paddingLeft, 10)
        : null;
    });
    // Mobile padding should be <= 20px
    if (padding !== null) {
      expect(padding).toBeLessThanOrEqual(20);
    }
  });
});

// ── Tablet layout (600px–1024px) ────────────────────────────────────

test.describe("V2 Responsive — Tablet", () => {
  test.skip(
    ({ page }) => {
      const w = getViewportWidth(page);
      return w < 600 || w > 1024;
    },
    "Not tablet viewport",
  );

  test("projects grid shows 2 columns", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    // Wait for grid to render
    await page
      .locator('[data-testid="projects-grid"] > *')
      .first()
      .waitFor({ timeout: 10000 });
    const columns = await page
      .locator('[data-testid="projects-grid"]')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(2);
  });

  test("middle project card has no elevation", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page
      .locator('[data-testid="projects-grid"] > *')
      .first()
      .waitFor({ timeout: 10000 });
    const cards = page.locator('[data-testid="projects-grid"] > *');
    const count = await cards.count();
    if (count >= 2) {
      const transform = await cards
        .nth(1)
        .evaluate((el) => getComputedStyle(el).transform);
      expect(transform === "none" || !transform.includes("-12")).toBeTruthy();
    }
  });

  test("footer is horizontal", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          page
            .locator('[data-testid="footer-content"]')
            .evaluate((el) => getComputedStyle(el).flexDirection),
        { timeout: 5000 },
      )
      .toBe("row");
  });

  test("contact form fields are side by side", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          page
            .locator('[data-testid="contact-fields-row"]')
            .evaluate((el) => getComputedStyle(el).flexDirection),
        { timeout: 5000 },
      )
      .toBe("row");
  });
});

// ── Desktop layout (> 1024px) ───────────────────────────────────────

test.describe("V2 Responsive — Desktop", () => {
  test.skip(({ page }) => getViewportWidth(page) <= 1024, "Not desktop");

  test("desktop nav visible, no hamburger", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    const menuBtn = page.getByRole("button", { name: /menu|Menü/i });
    await expect(menuBtn).toBeHidden();
  });

  test("projects grid shows 3 columns", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page
      .locator('[data-testid="projects-grid"] > *')
      .first()
      .waitFor({ timeout: 10000 });
    const columns = await page
      .locator('[data-testid="projects-grid"]')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(3);
  });

  test("footer is horizontal", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    const direction = await page
      .locator('[data-testid="footer-content"]')
      .evaluate((el) => getComputedStyle(el).flexDirection);
    expect(direction).toBe("row");
  });

  test("contact form fields are side by side", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const direction = await page
      .locator('[data-testid="contact-fields-row"]')
      .evaluate((el) => getComputedStyle(el).flexDirection);
    expect(direction).toBe("row");
  });
});

// ── Subpages responsive ─────────────────────────────────────────────

test.describe("V2 Responsive — Subpages", () => {
  test("projects page grid is responsive", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "networkidle" });
    const grid = page.locator('[data-testid="projects-page-grid"]');
    await expect(grid).toBeVisible({ timeout: 10000 });
    const width = getViewportWidth(page);
    const columns = await grid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
    );
    if (width < 600) {
      expect(columns).toBe(1);
    } else if (width < 1400) {
      // At 1280px, scrollbars can reduce effective viewport below lg (1280px)
      expect(columns).toBeGreaterThanOrEqual(2);
      expect(columns).toBeLessThanOrEqual(3);
    } else {
      expect(columns).toBe(3);
    }
  });

  test("legal notice page has responsive padding", async ({ page }) => {
    await page.goto("/legal-notice", { waitUntil: "networkidle" });
    const width = getViewportWidth(page);
    // Find the content container — it has the page heading inside
    const heading = page
      .getByText("Impressum")
      .or(page.getByText("Legal Notice"))
      .first();
    await expect(heading).toBeVisible();
    // Get padding from the content container (parent of heading ancestors)
    const paddingLeft = await heading.evaluate((el) => {
      // Walk up to find an element with padding
      let current: HTMLElement | null = el.parentElement;
      while (current && current.tagName !== "MAIN") {
        const pl = parseFloat(getComputedStyle(current).paddingLeft);
        if (pl > 10) return pl;
        current = current.parentElement;
      }
      return 0;
    });
    if (width < 600) {
      expect(paddingLeft).toBeLessThanOrEqual(20);
    } else {
      expect(paddingLeft).toBeGreaterThanOrEqual(24);
    }
  });

  test("privacy policy page has responsive padding", async ({ page }) => {
    await page.goto("/privacy-policy", { waitUntil: "networkidle" });
    const width = getViewportWidth(page);
    const heading = page
      .getByText("Datenschutzerklärung")
      .or(page.getByText("Privacy Policy"))
      .first();
    await expect(heading).toBeVisible();
    const paddingLeft = await heading.evaluate((el) => {
      let current: HTMLElement | null = el.parentElement;
      while (current && current.tagName !== "MAIN") {
        const pl = parseFloat(getComputedStyle(current).paddingLeft);
        if (pl > 10) return pl;
        current = current.parentElement;
      }
      return 0;
    });
    if (width < 600) {
      expect(paddingLeft).toBeLessThanOrEqual(20);
    } else {
      expect(paddingLeft).toBeGreaterThanOrEqual(24);
    }
  });
});
