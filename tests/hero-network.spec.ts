import { expect, test } from "@playwright/test";

test("hero nodes repel locally, settle, fade and stop outside the hero", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const network = page.locator(".cover-network");
  const group = network.locator("g").first();
  const edge = network.locator(".network-edge").first();
  await expect(group).toHaveAttribute("transform", /translate/);
  await expect(page.locator(".brand-mark")).toHaveText("as");
  await expect(page.locator(".brand-mark span,.brand svg")).toHaveCount(0);
  await expect(page.locator(".cover-socials a svg")).toHaveCount(2);
  await expect(network).toHaveCSS("pointer-events", "none");

  const origin = await network.locator("svg").evaluate((svg) => {
    const point = new DOMPoint(100, 88).matrixTransform(
      (svg as SVGSVGElement).getScreenCTM()!,
    );
    return { x: point.x, y: point.y };
  });
  const displacement = () =>
    group.evaluate((node) => {
      const matrix = (node as SVGGElement).transform.baseVal.consolidate()!
        .matrix;
      return { x: matrix.e, distance: Math.hypot(matrix.e, matrix.f) };
    });
  await page.mouse.move(origin.x - 25, origin.y);
  await expect.poll(async () => (await displacement()).x).toBeGreaterThan(3);
  expect((await displacement()).distance).toBeLessThan(8);
  await expect
    .poll(() => edge.evaluate((node) => Number(node.style.strokeOpacity)))
    .toBeGreaterThan(0.4);
  await page.screenshot({ path: "qa-artifacts/network-desktop-active.png" });

  await page.mouse.move(10, 10);
  await expect
    .poll(async () => (await displacement()).distance)
    .toBeLessThan(1);
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(() =>
      network.evaluate((node) => Number(getComputedStyle(node).opacity)),
    )
    .toBeLessThan(0.4);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(network).toHaveCSS("opacity", "0");
  const stopped = await group.getAttribute("transform");
  // Sample across several animation frames to catch a loop still running offscreen.
  await page.waitForTimeout(250);
  expect(await group.getAttribute("transform")).toBe(stopped);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => group.getAttribute("transform")).not.toBe(stopped);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(group).not.toHaveAttribute("transform");
  await page.mouse.move(origin.x - 25, origin.y);
  await page.waitForTimeout(250);
  await expect(group).not.toHaveAttribute("transform");
  await expect(edge).toHaveAttribute("d", "M100 88 L250 195");
  await page.locator(".cover-navigation a").first().click();
  await expect(page).toHaveURL(/#work$/);
});

test("touch devices and narrow viewports retain the static hero network", async ({
  browser,
}) => {
  // A large touch screen must also avoid starting the mouse animation.
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1024, height: 900 },
  ]) {
    const context = await browser.newContext({ hasTouch: true, viewport });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/es");
    const groups = page.locator(".cover-network g");
    await expect(page.locator(".portfolio-cover")).toHaveCSS(
      "--cover-progress",
      "0.000",
    );
    await page.mouse.move(300, 300);
    await page.waitForTimeout(250);
    expect(
      await groups.evaluateAll((nodes) =>
        nodes.every((node) => !node.hasAttribute("transform")),
      ),
    ).toBe(true);
    await page.screenshot({
      path: `qa-artifacts/network-touch-${viewport.width}.png`,
    });
    await context.close();
  }
});
