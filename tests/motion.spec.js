import { test, expect } from "@playwright/test";

test("opening sequence, scroll entrance, and hover actually animate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const heading = page.locator(".hero-editorial-title");
  await heading.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      heading.evaluate((el) =>
        el
          .getAnimations()
          .some((a) => a.effect.getKeyframes().some((k) => k.translate)),
      ),
    )
    .toBe(true);
  await heading.evaluate((el) =>
    Promise.all(el.getAnimations().map((a) => a.finished)),
  );
  await expect(heading).toHaveCSS("opacity", "1");
  const card = page.locator(".bento-card").first();
  await card.evaluate((el) =>
    el.scrollIntoView({ behavior: "instant", block: "center" }),
  );
  await expect(card).toHaveClass(/is-visible/);
  await expect
    .poll(() =>
      card.evaluate((el) =>
        el
          .getAnimations()
          .some((a) => a.effect.getKeyframes().some((k) => k.scale)),
      ),
    )
    .toBe(true);
  await card.evaluate((el) =>
    Promise.all(el.getAnimations().map((a) => a.finished)),
  );
  await card.hover();
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).transform))
    .toBe("matrix(1, 0, 0, 1, 0, -9)");
  await page.mouse.move(0, 0);
  await expect(card).toHaveCSS("transform", "none");
});
