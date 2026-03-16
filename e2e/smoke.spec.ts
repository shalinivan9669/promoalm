import { expect, test } from "@playwright/test";

test("internal page families keep single h1, breadcrumbs and lead band", async ({ page }) => {
  const routes = [
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
    await expect(main.locator("nav:has(ol)")).toBeVisible();
    await expect(main.locator(".page-lead__frame")).toBeVisible();
  }
});

test("desktop navigation exposes key published sections", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("banner");
  const main = page.getByRole("main");
  const footer = page.getByRole("contentinfo");
  const desktopNav = banner.locator("nav").first();
  const quickEntry = main.getByRole("navigation", { name: "Р‘С‹СЃС‚СЂС‹Рµ РІС…РѕРґС‹" });

  await expect(quickEntry).toBeVisible();
  await expect(quickEntry.getByRole("link", { name: "РђР»РјР°С‚С‹" })).toHaveAttribute("href", "/goroda/almaty/");
  await expect(quickEntry.getByRole("link", { name: "РђСЃС‚Р°РЅР°" })).toHaveAttribute("href", "/goroda/astana/");
  await expect(quickEntry.getByRole("link", { name: "РЁС‹РјРєРµРЅС‚" })).toHaveAttribute("href", "/goroda/shymkent/");
  await expect(quickEntry.getByRole("link", { name: "Р¤Р°СЃР°РґРЅС‹Рµ" })).toHaveAttribute("href", "/uslugi/fasadnye-vyveski/");

  const cityNav = main.getByRole("navigation", { name: /Р“РѕСЂРѕРґР° РѕР±СЃР»СѓР¶РёРІР°РЅРёСЏ/i });
  await expect(cityNav).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "РђР»РјР°С‚С‹" })).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "РђСЃС‚Р°РЅР°" })).toBeVisible();
  await expect(cityNav.getByRole("link", { name: "РЁС‹РјРєРµРЅС‚" })).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await desktopNav.getByText("РЈСЃР»СѓРіРё", { exact: true }).click();
  await expect(banner.getByRole("link", { name: "Р¤Р°СЃР°РґРЅС‹Рµ РІС‹РІРµСЃРєРё" })).toHaveAttribute("aria-current", "page");

  await desktopNav.getByText("Р“РѕСЂРѕРґР°", { exact: true }).click();
  await banner.getByRole("link", { name: "РђР»РјР°С‚С‹" }).click();
  await expect(page).toHaveURL(/\/goroda\/almaty\/$/);

  await desktopNav.getByText("РЈСЃР»РѕРІРёСЏ", { exact: true }).click();
  await banner.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/\/faq\/$/);

  await expect(footer.getByRole("link", { name: "Рћ РєРѕРјРїР°РЅРёРё" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "РљРµР№СЃС‹" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "РљРѕРЅС‚Р°РєС‚С‹" })).toBeVisible();
});

test("desktop dropdown closes outside and when another opens", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("banner");
  const desktopNav = banner.locator("nav").first();
  const servicesButton = desktopNav.getByText("РЈСЃР»СѓРіРё", { exact: true });
  const citiesButton = desktopNav.getByText("Р“РѕСЂРѕРґР°", { exact: true });
  const servicesLink = banner.getByRole("link", { name: "Р¤Р°СЃР°РґРЅС‹Рµ РІС‹РІРµСЃРєРё" });
  const cityLink = banner.getByRole("link", { name: "РђР»РјР°С‚С‹" });

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
  await banner.getByText("РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ", { exact: true }).click();
  const mobileNav = banner.locator("nav").last();
  await mobileNav.getByText("РЈСЃР»СѓРіРё", { exact: true }).click();
  await banner.getByRole("link", { name: "Р¤Р°СЃР°РґРЅС‹Рµ РІС‹РІРµСЃРєРё" }).click();
  await expect(page).toHaveURL(/\/uslugi\/fasadnye-vyveski\/$/);

  const quickActions = page.getByRole("navigation", { name: "Р‘С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏ" });
  await expect(quickActions.getByRole("link", { name: "РљРѕРЅС‚Р°РєС‚С‹" })).toHaveAttribute("href", "/kontakty/");
  await expect(quickActions.getByRole("link", { name: "РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ" })).toHaveAttribute("href", "/kontakty/#lead-form");
  await expect(quickActions.getByRole("link", { name: "РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃС‡С‘С‚" })).toHaveAttribute("href", "/kontakty/#lead-form");
});

test("home, faq keyboard path, cases and form smoke flow", async ({ page }) => {
  const runId = Date.now().toString().slice(-6);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /РЎРІРµС‚РѕРІС‹Рµ Рё С„Р°СЃР°РґРЅС‹Рµ РІС‹РІРµСЃРєРё/i })).toBeVisible();
  const quickEntry = page.getByRole("navigation", { name: "Р‘С‹СЃС‚СЂС‹Рµ РІС…РѕРґС‹" });
  await expect(quickEntry.getByRole("link", { name: "РњРѕРЅС‚Р°Р¶" })).toHaveAttribute("href", "/uslugi/montazh-vyvesok/");
  await page.getByRole("link", { name: "РЎРјРѕС‚СЂРµС‚СЊ РєРµР№СЃС‹" }).click();
  await expect(page).toHaveURL(/\/cases\/$/);
  await expect(page.getByRole("link", { name: "РћС‚РєСЂС‹С‚СЊ РЅР° СЃС‚СЂР°РЅРёС†Рµ РєРµР№СЃРѕРІ" }).first()).toHaveAttribute("href", /\/cases\/#/);

  await page.goto("/");
  const faqSection = page.locator("section").filter({
    has: page.getByRole("heading", { level: 2, name: "Р§Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹ РїРѕ СЃС‚Р°СЂС‚Сѓ РїСЂРѕРµРєС‚Р°" })
  });
  const faqSummary = faqSection.locator("details summary").first();
  await faqSummary.focus();
  await page.keyboard.press("Enter");
  await expect(faqSection.getByText("Р¦РµРЅР° СЃС‡РёС‚Р°РµС‚СЃСЏ РїРѕ Р·Р°РґР°С‡Рµ")).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await expect(page.getByRole("heading", { level: 1, name: /Р¤Р°СЃР°РґРЅР°СЏ РІС‹РІРµСЃРєР°/i })).toBeVisible();

  await page.goto("/kontakty/");
  await expect(page.locator('input[name="sourcePage"]')).toHaveCount(1);
  await expect(page.locator('input[name="startedAt"]')).toHaveCount(1);
  await expect(page.locator('input[name="hp"]')).toHaveCount(1);
  await expect(page.locator('input[name="locationsCount"]')).toHaveCount(1);
  await expect(page.locator("#lead-form .contact-intake-suggestion").first()).toBeVisible();
  await page.getByLabel("РРјСЏ РёР»Рё РєРѕРјРїР°РЅРёСЏ").fill(`РўРµСЃС‚РѕРІС‹Р№ РєР»РёРµРЅС‚ ${runId}`);
  await page.getByLabel("РўРµР»РµС„РѕРЅ РёР»Рё WhatsApp").fill(`+7701${runId}`);
  await page.getByLabel("РљРѕСЂРѕС‚РєРѕ Рѕ Р·Р°РґР°С‡Рµ").fill(
    `РќСѓР¶РЅР° С„Р°СЃР°РґРЅР°СЏ РІС‹РІРµСЃРєР° РґР»СЏ РєР°С„Рµ РІ РђР»РјР°С‚С‹, РЅСѓР¶РµРЅ РјРѕРЅС‚Р°Р¶. РўРµСЃС‚ ${runId}.`
  );
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃС‡С‘С‚" }).click();
  await expect(page).toHaveURL(/leadStatus=success/);
  await expect(page.getByRole("link", { name: "РћС‚РїСЂР°РІРёС‚СЊ РµС‰С‘ РѕРґРЅСѓ Р·Р°СЏРІРєСѓ" })).toBeVisible();
});
