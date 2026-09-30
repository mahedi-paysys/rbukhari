import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/courses",
  "/faculty",
  "/about",
  "/admissions",
  "/verify",
];
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`all pages fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        !message.text().includes("Failed to load resource")
      )
        errors.push(message.text());
    });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('.reveal').first()).toBeAttached();
      for (const element of await page.locator('.reveal').all()) {
        await element.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await expect(element).toHaveClass(/is-visible/);
      }
      await expect(page.locator('.reveal:not(.is-visible)')).toHaveCount(0);
      for (const image of await page.locator('.bento-visual img').all()) {
        expect(await image.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(200);
      }
      const overflowing = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            const rect = el.getBoundingClientRect(),
              css = getComputedStyle(el);
            return (
              rect.width > 0 &&
              css.position !== "fixed" &&
              (rect.right > innerWidth + 1 || rect.left < -1)
            );
          })
          .map((el) => el.className),
      );
      expect(overflowing, `${route} overflow`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
test("course filters, accessible modal, and course handoff", async ({
  page,
}) => {
  await page.goto("/courses");
  await expect(page.locator(".catalog-grid .course-pill-card")).toHaveCount(9);
  await page
    .getByRole("button", { name: "Online Learning", exact: true })
    .click();
  await expect(page.locator(".catalog-grid .course-pill-card")).toHaveCount(5);
  await page.getByRole("button", { name: "View Outline" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close course outline" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "View Outline" }).first().click();
  await page.getByRole("link", { name: "Proceed to Registration" }).click();
  await expect(page.locator("#fCourse")).toHaveValue("Shopify Complete Course");
  await expect(
    page.getByRole("button", { name: "Online Cohort" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("admissions generates a WhatsApp draft and resets", async ({ page }) => {
  await page.goto("/admissions");
  await page.evaluate(() => {
    window.open = (url) => {
      window.__draft = url;
      return null;
    };
  });
  await page.locator("#fName").fill("Test Applicant");
  await page.locator("#fPhone").fill("03001234567");
  await page.locator("#fEmail").fill("applicant@example.com");
  await page.locator("#fCourse").selectOption("Graphic Designing Onsite");
  await page
    .locator("#fBatch")
    .selectOption({ label: "Weekend Special (Sat & Sun)" });
  await page
    .getByRole("button", { name: "Submit Application & Open WhatsApp" })
    .click();
  expect(
    decodeURIComponent(await page.evaluate(() => window.__draft)),
  ).toContain("*Applicant:* Test Applicant");
  await expect(
    page.getByRole("heading", { name: "Application Ready!" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Submit Another Application" })
    .click();
  await expect(page.locator("#fName")).toHaveValue("");
});
test("mobile navigation, legacy links, verification, and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/index.html");
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About Us" })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.goto("/verify.html?cert_id=UNKNOWN-ID");
  await expect(page.getByRole("status")).toContainText(
    "Contact the institute to verify",
  );
  await expect(page.getByRole("status")).toContainText("UNKNOWN-ID");
  expect(
    await page
      .locator(".page-transition")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
