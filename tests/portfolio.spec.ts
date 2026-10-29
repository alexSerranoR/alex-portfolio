import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { diary } from "../src/data/diary";
import {
  education,
  experience,
  profile,
  projects,
} from "../src/data/portfolio";
import { dictionaries } from "../src/i18n/copy";
import { getProjects } from "../src/i18n/content";
import { locales, projectOrder } from "../src/i18n/routes";

async function accessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(".library-canvas")
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
}

async function noHorizontalScroll(page: Page) {
  // Lists what sticks out, so a failure says where to look. Polled, since a
  // resized viewport needs a frame before the layout settles.
  await expect
    .poll(() =>
      page.evaluate(() => {
        const width = window.innerWidth;
        if (document.documentElement.scrollWidth <= width) return [];
        return [...document.querySelectorAll("body *")]
          .filter((node) => node.getBoundingClientRect().right > width + 0.5)
          .slice(0, 5)
          .map((node) => `${node.tagName.toLowerCase()}.${node.className}`);
      }),
    )
    .toEqual([]);
}

test("facts, translations, downloads and legacy URLs hold", async ({
  request,
}) => {
  expect([...projectOrder].sort()).toEqual(projects.map((p) => p.slug).sort());
  for (const project of projects) {
    const legacy = await request.get(`/projects/${project.slug}`, {
      maxRedirects: 0,
    });
    expect(legacy.status()).toBe(308);
    expect(legacy.headers().location).toBe(`/en/projects/${project.slug}`);
    for (const locale of locales) {
      const translated = getProjects(locale).find(
        (p) => p.slug === project.slug,
      )!;
      expect(translated.repository).toBe(project.repository);
      expect(translated.technologies).toHaveLength(project.technologies.length);
      expect(translated.status).toBe(project.status);
      expect(translated.years).toEqual(project.years);
      expect(translated.metrics).toHaveLength(project.metrics.length);
      expect(translated.steps).toHaveLength(project.steps.length);
      expect(translated.event?.seals?.length).toBe(
        project.event?.seals?.length,
      );
      for (const metric of translated.metrics)
        expect(metric.label).toBeTruthy();
      if (locale === "en") expect(translated).toEqual(project);
    }
  }
  expect(education).toHaveLength(4);
  expect(experience).toHaveLength(2);
  for (const locale of locales) {
    const response = await request.get(profile.cv[locale]);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const hash = (bytes: Buffer) =>
      createHash("sha256").update(bytes).digest("hex");
    expect(hash(await response.body())).toBe(
      hash(
        readFileSync(`CV_Alejandro_Serrano_Ruibal_${locale.toUpperCase()}.pdf`),
      ),
    );
    const social = await request.get(`/${locale}/opengraph-image`);
    expect(social.status()).toBe(200);
    expect(social.headers()["content-type"]).toContain("image/png");
  }
});

test("the library entrance works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  const es = page.getByRole("link", { name: "Abrir el portfolio en español" });
  const en = page.getByRole("link", { name: "Open the portfolio in English" });
  await expect(es).toHaveAttribute("href", "/es");
  await expect(en).toHaveAttribute("href", "/en");
  await es.click();
  await expect(page).toHaveURL(/\/es$/);
  await context.close();
});

test("the library opens a book and lands in that edition", async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const en = page.locator(".book-links").getByRole("link", {
    name: "Open the portfolio in English",
  });
  await expect(en).toBeVisible({ timeout: 20_000 });
  await expect(page.locator(".skip-intro")).toHaveCount(0);
  await page.waitForTimeout(600);
  await page.screenshot({ path: "qa-artifacts/library-desktop.png" });
  await accessible(page);
  await en.click();
  await expect(page).toHaveURL(/\/en$/, { timeout: 10_000 });
  expect(errors).toEqual([]);
});

for (const locale of locales) {
  const t = dictionaries[locale];

  test(`${locale}: title page, prologue and contents with filters`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    await expect(page).toHaveTitle(t.seo.title);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toHaveText("Alex Serrano");
    await expect(
      page.getByRole("heading", { name: t.prologue.heading }),
    ).toBeVisible();
    const entries = page.locator(".toc-entry");
    await expect(entries).toHaveCount(projectOrder.length);
    const localized = getProjects(locale);
    for (const [index, project] of localized.entries())
      await expect(entries.nth(index)).toContainText(project.name);

    const filters = page.getByRole("group", { name: t.index.filters });
    await filters
      .getByRole("button", { name: new RegExp(`^${t.index.kinds.awarded}`) })
      .click();
    await expect(page.locator(".toc-entry:visible")).toHaveCount(
      localized.filter((p) => p.event?.seals?.length).length,
    );
    await filters
      .getByRole("button", { name: new RegExp(`^${t.index.kinds.hackathon}`) })
      .click();
    await expect(page.locator(".toc-entry:visible")).toHaveCount(
      localized.filter((p) => p.kind === "hackathon").length,
    );
    await filters.getByRole("button", { name: "2024", exact: true }).click();
    await expect(page.locator(".toc-entry:visible")).toHaveCount(0);
    await page.getByRole("button", { name: t.index.reset }).click();
    await expect(page.locator(".toc-entry:visible")).toHaveCount(
      projectOrder.length,
    );
    await accessible(page);
    await page.screenshot({
      path: `qa-artifacts/${locale}-home-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await noHorizontalScroll(page);
    await page.getByRole("button", { name: t.nav.open }).click();
    await expect(
      page
        .getByRole("navigation", { name: t.nav.label })
        .getByRole("link", { name: t.nav.diary }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page.screenshot({
      path: `qa-artifacts/${locale}-home-mobile.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

  test(`${locale}: every chapter is complete, translated and accessible`, async ({
    page,
    request,
  }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const project of getProjects(locale)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/${locale}/projects/${project.slug}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toHaveAccessibleName(project.name);
      await expect(page.locator(".chapter-summary")).toHaveText(
        project.summary,
      );
      await expect(page.locator("#contribution > p")).toHaveText(
        project.contribution,
      );
      await expect(page.locator(".plate").first()).toBeVisible();
      if (project.repository)
        await expect(
          page.getByRole("link", { name: t.chapter.repository, exact: true }),
        ).toHaveAttribute("href", project.repository);
      for (const seal of project.event?.seals ?? [])
        await expect(page.locator(".seals")).toContainText(seal.title);
      await expect(page.locator("meta[name=description]")).toHaveAttribute(
        "content",
        project.summary,
      );
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
        "href",
        new RegExp(`/es/projects/${project.slug}$`),
      );
      await accessible(page);
      await page.screenshot({
        path: `qa-artifacts/${locale}-${project.slug}-desktop.png`,
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await noHorizontalScroll(page);
      await page.screenshot({
        path: `qa-artifacts/${locale}-${project.slug}-mobile.png`,
        fullPage: true,
      });
    }
    const missing = await request.get(`/${locale}/projects/nonexistent`);
    expect(missing.status()).toBe(404);
  });

  test(`${locale}: diary, about and contact pages`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/diary/${diary[0].slug}`);
      await expect(page.locator("h1")).toHaveText(diary[0].title[locale]);
      await expect(page.locator(".entry-body p").first()).toHaveText(
        diary[0].body[locale][0],
      );
      await expect(page.locator(".photo img")).toHaveCount(2);
      await noHorizontalScroll(page);
      await accessible(page);
      await page.screenshot({
        path: `qa-artifacts/${locale}-diary-${width}.png`,
        fullPage: true,
      });
      for (const path of ["/diary", "/about", "/contact"]) {
        await page.goto(`/${locale}${path}`);
        await noHorizontalScroll(page);
        await accessible(page);
        await page.screenshot({
          path: `qa-artifacts/${locale}${path.replace("/", "-")}-${width}.png`,
          fullPage: true,
        });
      }
    }
    await expect(
      page.getByRole("link", { name: profile.email, exact: true }),
    ).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  test(`${locale}: language switch keeps the current page`, async ({
    page,
  }) => {
    const other = locale === "en" ? "es" : "en";
    await page.goto(`/${locale}/projects/phonendo`);
    await page.locator(`.lang-switch a[hreflang="${other}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${other}/projects/phonendo$`));
  });
}
