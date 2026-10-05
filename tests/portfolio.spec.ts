import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  projects,
  profile,
  education,
  experience,
} from "../src/data/portfolio";
import { dictionaries } from "../src/i18n/copy";
import { getProjects, getToolkit } from "../src/i18n/content";
import { locales, projectOrder } from "../src/i18n/routes";

async function accessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
}

test("original facts, skills, downloads and legacy URLs are preserved", async ({
  request,
}) => {
  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(308);
  expect(root.headers().location).toBe("/en");
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
      expect(translated.technologies).toEqual(project.technologies);
      expect(translated.status).toBe(project.status);
      expect(
        translated.metrics.map((m) => m.value.replace("Millones", "Millions")),
      ).toEqual(project.metrics.map((m) => m.value));
      if (locale === "en") expect(translated).toEqual(project);
    }
  }
  expect(education).toHaveLength(4);
  expect(experience).toHaveLength(2);
  const originalSkills = new Set(
    (await import("../src/data/portfolio")).toolkit.flatMap((g) => g.items),
  );
  expect(new Set(getToolkit().flat())).toEqual(originalSkills);
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

for (const locale of locales) {
  const t = dictionaries[locale];
  test(`${locale}: homepage hierarchy, translations, equal project importance and navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    await expect(page).toHaveTitle(t.seo.title);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toContainText("ALEX");
    await expect(page.locator("h1")).toContainText("SERRANO");
    await expect(page.locator(".cover-role")).toHaveText(t.hero.role.join(" "));
    await expect(page.locator(".portfolio-cover p")).toHaveCount(1);
    await expect(page.locator(".brand")).toHaveAccessibleName("Alex Serrano");
    await expect(page.locator(".work-journey .project-story")).toHaveCount(6);
    expect(
      await page
        .locator(".project-story")
        .evaluateAll((nodes) => nodes.map((n) => n.id.replace("project-", ""))),
    ).toEqual([...projectOrder]);
    const sizes = await page
      .locator(".project-story")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect().height),
      );
    expect(Math.max(...sizes) / Math.min(...sizes)).toBeLessThan(1.35);
    await expect(page.locator(".toolkit-group")).toHaveCount(4);
    await expect(
      page.locator(".tags,.toolkit-items,.project-card,.earlier-work"),
    ).toHaveCount(0);
    await expect(page.locator(".education-item")).toHaveCount(2);
    await expect(page.locator(".school-item")).toHaveCount(2);
    expect(
      await page
        .locator("#education")
        .evaluate((node) => node.getBoundingClientRect().top),
    ).toBeLessThan(
      await page
        .locator(".experience-block")
        .evaluate((node) => node.getBoundingClientRect().top),
    );
    await page
      .locator(".cover-navigation")
      .getByRole("link", { name: t.nav.projects, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}#work$`));
    await expect(
      page.getByRole("heading", { name: t.work.title, exact: true }),
    ).toBeInViewport();
    for (const disclosure of await page.locator(".disclosure").all()) {
      await expect(disclosure).not.toHaveAttribute("open", "");
      await disclosure.locator("summary").click();
      await expect(disclosure).toHaveAttribute("open", "");
    }
    await expect(page.locator(".school-item").first()).toBeVisible();
    await expect(page.locator(".qualities")).toBeVisible();
    await expect(page.locator(".experience-list")).toBeVisible();
    await expect(page.locator(".personal-note")).toBeVisible();
    await accessible(page);
    expect(errors).toEqual([]);
  });

  test(`${locale}: all six engineering case studies are translated and accessible`, async ({
    page,
    request,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const project of getProjects(locale)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/${locale}/projects/${project.slug}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toContainText(project.name);
      await expect(page.locator(".case-summary")).toHaveText(project.summary);
      await expect(page.locator("#contribution > p")).toHaveText(
        project.contribution,
      );
      await expect(
        page.getByRole("link", { name: t.case.repository, exact: true }),
      ).toHaveAttribute("href", project.repository);
      await expect(
        page.getByRole("heading", { name: t.case.problem, exact: true }),
      ).toBeVisible();
      await expect(page.locator("meta[name=description]")).toHaveAttribute(
        "content",
        project.summary,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        locale === "es" ? "es_ES" : "en_US",
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
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await accessible(page);
      await page.screenshot({
        path: `qa-artifacts/${locale}-${project.slug}-mobile.png`,
        fullPage: true,
      });
    }
    const missing = await request.get(
      `/${locale}/projects/nonexistent-project`,
    );
    expect(missing.status()).toBe(404);
    await page.goto(`/${locale}/projects/nonexistent-project`);
    await expect(
      page.getByRole("heading", { name: t.error.title }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  });

  for (const width of [360, 390, 768, 1024, 1440]) {
    test(`${locale}: complete homepage at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await page.screenshot({
        path: `qa-artifacts/${locale}-hero-${width}.png`,
      });
      for (const id of [
        "work",
        ...projectOrder.map((slug) => `project-${slug}`),
        "toolkit",
        "education",
        "about",
        "contact",
      ]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          `${id} overflow at ${width}`,
        ).toBe(true);
      }
      const fonts = await page
        .locator(".story-description")
        .evaluateAll((nodes) =>
          nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)),
        );
      expect(Math.min(...fonts)).toBeGreaterThanOrEqual(17);
      await accessible(page);
      await page.screenshot({
        path: `qa-artifacts/${locale}-home-${width}.png`,
        fullPage: true,
      });
      if (width === 390 || width === 1440) {
        await page.locator("#project-la-abuelita").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `qa-artifacts/${locale}-story-${width}.png`,
        });
        await page.locator("#education").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `qa-artifacts/${locale}-education-${width}.png`,
        });
      }
    });
  }

  test(`${locale}: mobile controls, language switching and keyboard navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    const toggle = page.getByRole("button", { name: t.nav.open });
    await toggle.click();
    await expect(
      page.getByRole("button", { name: t.nav.close }),
    ).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await page
      .getByRole("navigation", { name: t.nav.label })
      .getByRole("link", { name: t.nav.contact, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}#contact$`));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    const other = locale === "en" ? "es" : "en";
    await page
      .getByRole("group", { name: t.nav.language })
      .getByRole("link", { name: new RegExp(`^${other.toUpperCase()} —`) })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${other}#contact$`));
    await expect(page.locator("html")).toHaveAttribute("lang", other);
    for (const slug of projectOrder) {
      await page.goto(`/${locale}/projects/${slug}#contribution`);
      await page
        .getByRole("group", { name: t.nav.language })
        .getByRole("link", { name: new RegExp(`^${other.toUpperCase()} —`) })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`/${other}/projects/${slug}#contribution$`),
      );
      await expect(page.locator("html")).toHaveAttribute("lang", other);
    }
    await page.goto(`/${locale}`);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: t.nav.skip })).toBeFocused();
    await page.keyboard.press("Enter");
    const how = page.locator(".about-disclosures .disclosure").first();
    await how.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(how).toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(how).not.toHaveAttribute("open", "");
    await expect(page.locator(".qualities")).not.toBeVisible();
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
  });
}

test("scroll progress explains the scenes and reduced motion restores complete diagrams", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const scene = page.locator("#project-aws-cloud-devops-lab .scroll-scene");
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveClass(/scene-motion/);
  await scene.evaluate((node) =>
    window.scrollTo(
      0,
      window.scrollY +
        node.getBoundingClientRect().top -
        window.innerHeight * 0.75,
    ),
  );
  const early = await scene.evaluate((node) =>
    parseFloat(node.style.getPropertyValue("--scene-progress")),
  );
  await scene.evaluate((node) =>
    window.scrollTo(0, window.scrollY + node.getBoundingClientRect().top + 100),
  );
  await expect
    .poll(() =>
      scene.evaluate((node) =>
        parseFloat(node.style.getPropertyValue("--scene-progress")),
      ),
    )
    .toBeGreaterThan(early);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene).not.toHaveClass(/scene-motion/);
  expect(
    await scene.evaluate((node) =>
      getComputedStyle(node).getPropertyValue("--scene-progress").trim(),
    ),
  ).toBe("1");
  expect(
    await scene
      .locator(".flow-step>div")
      .first()
      .evaluate((node) => getComputedStyle(node).opacity),
  ).toBe("1");
});

test("cover transition and disclosures animate, reverse and respect reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const identity = page.locator(".cover-identity");
  const initial = await identity.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect
    .poll(() => identity.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(identity).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const disclosure = page.locator(".about-disclosures .disclosure").first();
  const summary = disclosure.locator("summary");
  await summary.scrollIntoViewIfNeeded();
  const height = await disclosure.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  await summary.click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect
    .poll(() => disclosure.evaluate((node) => node.getAnimations().length))
    .toBe(0);
  expect(
    await disclosure.evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThan(height + 150);
  await summary.click();
  await expect(disclosure).not.toHaveAttribute("open", "");
  // A reversal during the height transition must not leave a clipped panel.
  await summary.click();
  await summary.click();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() => disclosure.evaluate((node) => node.getAnimations().length))
    .toBe(0);
  await expect(disclosure.locator(".qualities")).toBeVisible();
  // Audit the complete, settled diagram state rather than offscreen scroll fades.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await accessible(page);
});

test("both languages work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const locale of locales) {
    await page.goto(`http://localhost:3000/${locale}`);
    await expect(
      page.getByRole("heading", {
        name: dictionaries[locale].work.title,
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".project-story")).toHaveCount(6);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.locator(".earlier-education summary").click();
    await expect(page.locator(".school-item").first()).toBeVisible();
    await page.locator(".about-disclosures summary").first().click();
    await expect(page.locator(".qualities")).toBeVisible();
    await page
      .getByRole("group", { name: dictionaries[locale].nav.language })
      .getByRole("link", {
        name: new RegExp(`^${locale === "en" ? "ES" : "EN"} —`),
      })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      locale === "en" ? "es" : "en",
    );
  }
  await context.close();
});
