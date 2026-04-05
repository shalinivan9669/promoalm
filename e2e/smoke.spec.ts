import { expect, test, type Page } from "@playwright/test";

async function scrollToHomeStatement(page: Page) {
  await page.locator(".home-statement").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    window.scrollBy(0, -window.innerHeight * 0.08);
  });
}

function extractSecondMaskScale(maskSize: string) {
  const secondLayerSize = maskSize.split(",").at(-1)?.trim() ?? "";
  return Number.parseFloat(secondLayerSize);
}

function extractSecondMaskPosition(maskPosition: string) {
  const secondLayerPosition = maskPosition.split(",").at(-1)?.trim() ?? "";
  const [x = "", y = ""] = secondLayerPosition.split(/\s+/);
  return {
    x: Number.parseFloat(x),
    y: Number.parseFloat(y)
  };
}

function extractTranslateY(transform: string) {
  if (transform === "none") {
    return 0;
  }

  const match = transform.match(/matrix(3d)?\((.+)\)/);

  if (!match) {
    return 0;
  }

  const values = match[2]
    .split(",")
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value));

  return values.length === 16 ? values[13] ?? 0 : values[5] ?? 0;
}

async function readTransitionMaskState(page: Page) {
  return page.locator(".think-big__overlay").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      rawMaskSize: styles.webkitMaskSize || styles.maskSize,
      rawMaskPosition: styles.webkitMaskPosition || styles.maskPosition
    };
  });
}

async function scrollToTransitionOffset(page: Page, sceneTop: number, viewportHeights: number) {
  await page.evaluate(
    ({ top, offset }) => {
      window.scrollTo(0, top + window.innerHeight * offset);
    },
    { top: sceneTop, offset: viewportHeights }
  );
  await page.waitForTimeout(1400);
}

test("internal page families keep single h1, breadcrumbs and lead band", async ({ page }) => {
  const routes = [
    "/uslugi/",
    "/goroda/",
    "/uslugi/fasadnye-vyveski/",
    "/goroda/almaty/",
    "/faq/",
    "/cases/",
    "/o-kompanii/",
    "/kontakty/"
  ];

  for (const url of routes) {
    await page.goto(url);

    const main = page.getByRole("main");
    await expect(main.locator("h1")).toHaveCount(1);
    await expect(main.locator("h1")).toBeVisible();
    await expect(page.locator('nav[aria-label="Хлебные крошки"]')).toBeVisible();
  }
});

test("desktop navigation exposes key published sections", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("banner");
  const main = page.getByRole("main");
  const footer = page.getByRole("contentinfo");
  const desktopNav = banner.getByRole("navigation", { name: "Основная навигация" });
  const transitionScene = main.locator(".think-big");
  const sceneViewport = transitionScene.locator(".think-big__viewport");
  const stage = transitionScene.locator(".think-big__stage-media");
  const overlay = transitionScene.locator(".think-big__overlay");
  const quickEntry = main.getByRole("navigation", { name: "Быстрые входы" });
  const cityNav = main.getByRole("navigation", { name: /Города обслуживания/i });
  const serviceGridHeading = main.getByRole("heading", { level: 2, name: /Какие вывески делаем/i });

  await transitionScene.scrollIntoViewIfNeeded();
  await expect(transitionScene).toBeVisible();
  await expect(sceneViewport).toBeVisible();
  await expect(stage).toBeVisible();
  await expect(overlay).toBeVisible();
  await expect(main.locator(".home-statement")).toHaveCount(1);
  await expect(serviceGridHeading).toBeVisible();

  const stageBackgroundImage = await stage.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(stageBackgroundImage).toContain("/images/bg/bg.avif");

  const overlayMaskImage = await overlay.evaluate((element) => {
    const styles = getComputedStyle(element);
    return styles.webkitMaskImage || styles.maskImage;
  });
  expect(overlayMaskImage).not.toBe("none");

  const scenePrecedesServiceGrid = await transitionScene.evaluate((scene, heading) => {
    if (!(heading instanceof HTMLElement)) {
      return false;
    }

    return Boolean(scene.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, await serviceGridHeading.elementHandle());
  expect(scenePrecedesServiceGrid).toBe(true);

  await scrollToHomeStatement(page);
  await expect(quickEntry).toBeVisible();
  await expect(quickEntry.getByRole("link", { name: "Алматы" })).toHaveAttribute("href", "/goroda/almaty/");
  await expect(quickEntry.getByRole("link", { name: "Астана" })).toHaveAttribute("href", "/goroda/astana/");
  await expect(quickEntry.getByRole("link", { name: "Шымкент" })).toHaveAttribute("href", "/goroda/shymkent/");
  await expect(quickEntry.getByRole("link", { name: "Фасадные" })).toHaveAttribute("href", "/uslugi/fasadnye-vyveski/");

  await expect(cityNav).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "Алматы" })).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "Астана" })).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "Шымкент" })).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await desktopNav.getByText("Услуги", { exact: true }).click();
  await expect(banner.locator('a[href="/uslugi/"]')).toHaveAttribute("href", "/uslugi/");
  await expect(banner.locator('a[href="/uslugi/fasadnye-vyveski/"]')).toHaveAttribute("aria-current", "page");

  await desktopNav.getByText("Города", { exact: true }).click();
  await expect(banner.locator('a[href="/goroda/"]')).toHaveAttribute("href", "/goroda/");
  await banner.locator('a[href="/goroda/almaty/"]').click();
  await expect(page).toHaveURL(/\/goroda\/almaty\/$/);

  await desktopNav.getByText("Условия", { exact: true }).click();
  await banner.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/\/faq\/$/);

  await expect(footer.getByRole("link", { name: "О компании" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Кейсы" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Контакты" })).toBeVisible();
});

test("desktop home mask reveal holds before entering the late reveal", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/");

  const transitionScene = page.locator(".think-big");
  const sceneViewport = transitionScene.locator(".think-big__viewport");
  const stage = transitionScene.locator(".think-big__stage-media");
  await expect(transitionScene).toHaveCount(1);
  await expect(sceneViewport).toBeVisible();
  await expect(stage).toBeVisible();

  const viewportSize = page.viewportSize();
  const sceneHeight = await transitionScene.evaluate((element) => (element instanceof HTMLElement ? element.offsetHeight : 0));
  const pinnedViewportHeight = await sceneViewport.evaluate((element) => (element instanceof HTMLElement ? element.offsetHeight : 0));
  const stageHeight = await stage.evaluate((element) =>
    element instanceof HTMLElement ? element.getBoundingClientRect().height : 0
  );
  expect(sceneHeight).toBeGreaterThanOrEqual((viewportSize?.height ?? 0) * 3);
  expect(pinnedViewportHeight).toBeGreaterThanOrEqual((viewportSize?.height ?? 0) - 16);
  expect(pinnedViewportHeight).toBeLessThanOrEqual((viewportSize?.height ?? 0) + 16);
  expect(stageHeight).toBeGreaterThan((viewportSize?.height ?? 0) * 0.9);

  const stageBackgroundImage = await stage.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(stageBackgroundImage).toContain("/images/bg/bg.avif");

  const sceneTop = await transitionScene.evaluate((element) => (element instanceof HTMLElement ? element.offsetTop : 0));

  await page.evaluate(
    ({ top, viewportHeight }) => {
      window.scrollTo(0, Math.max(top - viewportHeight * 0.45, 0));
    },
    {
      top: sceneTop,
      viewportHeight: viewportSize?.height ?? 0
    }
  );
  await page.waitForTimeout(900);
  const prePinStageTransform = await stage.evaluate((element) => getComputedStyle(element).transform);
  const prePinStageY = extractTranslateY(prePinStageTransform);
  expect(prePinStageY).toBeLessThanOrEqual(-10);

  await scrollToTransitionOffset(page, sceneTop, 0);
  const pinStageTransform = await stage.evaluate((element) => getComputedStyle(element).transform);
  const pinStageY = extractTranslateY(pinStageTransform);
  const entryState = await readTransitionMaskState(page);
  const entryScale = extractSecondMaskScale(entryState.rawMaskSize);
  const entryPosition = extractSecondMaskPosition(entryState.rawMaskPosition);
  expect(Math.abs(pinStageY)).toBeLessThanOrEqual(12);
  expect(entryScale).toBeGreaterThanOrEqual(100);
  expect(entryScale).toBeLessThan(170);
  expect(entryPosition.x).toBeGreaterThanOrEqual(48.5);
  expect(entryPosition.x).toBeLessThanOrEqual(51);

  await scrollToTransitionOffset(page, sceneTop, 0.9);
  const holdState = await readTransitionMaskState(page);
  const holdScale = extractSecondMaskScale(holdState.rawMaskSize);
  const holdPosition = extractSecondMaskPosition(holdState.rawMaskPosition);
  expect(holdScale).toBeGreaterThanOrEqual(100);
  expect(holdScale).toBeLessThan(260);
  expect(holdPosition.x).toBeGreaterThanOrEqual(48.5);
  expect(holdPosition.x).toBeLessThanOrEqual(51);

  await scrollToTransitionOffset(page, sceneTop, 2.35);

  const revealState = await readTransitionMaskState(page);
  const revealStageTransform = await stage.evaluate((element) => getComputedStyle(element).transform);
  const revealStageY = extractTranslateY(revealStageTransform);
  const revealScale = extractSecondMaskScale(revealState.rawMaskSize);
  const revealPosition = extractSecondMaskPosition(revealState.rawMaskPosition);
  expect(Math.abs(revealStageY)).toBeLessThanOrEqual(12);
  expect(revealScale).toBeGreaterThan(250);
  expect(revealScale).toBeGreaterThan(holdScale);
  expect(revealPosition.x).toBeGreaterThanOrEqual(48.5);
  expect(revealPosition.x).toBeLessThanOrEqual(51);
  expect(Math.abs(revealPosition.y - holdPosition.y)).toBeGreaterThan(1);
});

test("desktop dropdown closes outside and when another opens", async ({ page }) => {
  await page.goto("/uslugi/fasadnye-vyveski/");

  const banner = page.getByRole("banner");
  const desktopNav = banner.getByRole("navigation", { name: "Основная навигация" });
  const servicesButton = desktopNav.getByRole("button", { name: "Услуги" });
  const citiesButton = desktopNav.getByRole("button", { name: "Города" });
  const servicesLink = banner.locator('a[href="/uslugi/fasadnye-vyveski/"]');
  const cityLink = banner.locator('a[href="/goroda/almaty/"]');

  await servicesButton.click();
  await expect(servicesLink).toBeVisible();

  await page.getByRole("main").click({ position: { x: 20, y: 20 } });
  await expect(servicesLink).toBeHidden();

  await servicesButton.click();
  await expect(servicesLink).toBeVisible();
  await citiesButton.click();
  await expect(cityLink).toBeVisible();
  await expect(servicesLink).toBeHidden();
});

test("mobile navigation and sticky cta stay honest", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/faq/");

  const banner = page.getByRole("banner");
  await banner.getByRole("button", { name: /Открыть меню|Закрыть меню/i }).click();

  const mobileNav = banner.getByRole("navigation", { name: "Мобильная навигация" });
  await mobileNav.getByText("Услуги", { exact: true }).click();
  await banner.locator('a[href="/uslugi/fasadnye-vyveski/"]').click();
  await expect(page).toHaveURL(/\/uslugi\/fasadnye-vyveski\/$/);

  const quickActions = page.getByRole("navigation", { name: "Быстрые действия" });
  await expect(quickActions.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/77784155511");
  await expect(quickActions.getByRole("link", { name: "Позвонить" })).toHaveAttribute("href", "tel:+77784155511");
  await expect(quickActions.getByRole("link", { name: /Получить расч[её]т/i })).toHaveAttribute("href", "/kontakty/#lead-form");
});

test("home, faq keyboard path, cases and form smoke flow", async ({ page }) => {
  const runId = Date.now().toString().slice(-6);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".think-big")).toHaveCount(1);

  const quickEntry = page.getByRole("navigation", { name: "Быстрые входы" });
  await scrollToHomeStatement(page);
  await expect(quickEntry.getByRole("link", { name: "Монтаж" })).toHaveAttribute("href", "/uslugi/montazh-vyvesok/");
  await page.getByRole("link", { name: "Смотреть кейсы" }).click();
  await expect(page).toHaveURL(/\/cases\/$/);
  await expect(page.locator('a[href^="/cases/#"]').first()).toHaveAttribute("href", /\/cases\/#/);

  await page.goto("/uslugi/");
  await expect(page.getByRole("heading", { level: 1, name: /Услуги по вывескам/i })).toBeVisible();

  await page.goto("/goroda/");
  await expect(page.getByRole("heading", { level: 1, name: /Вывески по городам/i })).toBeVisible();

  await page.goto("/");
  const faqSection = page.locator("section").filter({
    has: page.getByRole("heading", { level: 2, name: /Частые вопросы/i })
  });
  const faqSummary = faqSection.locator("details summary").first();
  await faqSummary.focus();
  await page.keyboard.press("Enter");
  await expect(faqSection.getByText(/Стоимость считаем по задаче/i)).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await expect(page.getByRole("heading", { level: 1, name: /Фасадные вывески/i })).toBeVisible();

  await page.goto("/kontakty/");
  await expect(page.locator('input[name="sourcePage"]')).toHaveCount(1);
  await expect(page.locator('input[name="startedAt"]')).toHaveCount(1);
  await expect(page.locator('input[name="hp"]')).toHaveCount(1);
  await expect(page.locator('input[name="locationsCount"]')).toHaveCount(1);
  await expect(page.locator("#lead-form .contact-intake-suggestion").first()).toBeVisible();

  await page.locator('#lead-form [name="name"]').fill(`Тестовый клиент ${runId}`);
  await page.locator('#lead-form [name="contact"]').fill(`+7701${runId}`);
  await page
    .locator('#lead-form [name="message"]')
    .fill(`Нужна фасадная вывеска для кафе в Алматы, нужен монтаж. Тест ${runId}.`);
  await page.locator('#lead-form [name="consent"]').check();

  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: /Получить расчёт/i }).click();
  await expect(page).toHaveURL(/leadStatus=success/);
});
