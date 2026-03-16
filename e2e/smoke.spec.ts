import { expect, test } from "@playwright/test";

test("desktop navigation exposes key published sections", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("banner");
  const main = page.getByRole("main");
  const footer = page.getByRole("contentinfo");
  const desktopNav = banner.getByRole("navigation", { name: "Основная навигация" });

  await expect(main.getByRole("navigation", { name: /Города обслуживания/i })).toBeVisible();
  await expect(main.getByRole("link", { name: "Алматы" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Астана" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Шымкент" })).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await desktopNav.locator("summary").filter({ hasText: "Услуги" }).click();
  await expect(banner.getByRole("link", { name: "Фасадные вывески" })).toHaveAttribute("aria-current", "page");

  await desktopNav.locator("summary").filter({ hasText: "Города" }).click();
  await banner.getByRole("link", { name: "Алматы" }).click();
  await expect(page).toHaveURL(/\/goroda\/almaty\/$/);

  await desktopNav.locator("summary").filter({ hasText: "Условия" }).click();
  await banner.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/\/faq\/$/);

  await expect(footer.getByRole("link", { name: "О компании" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Кейсы" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Контакты" })).toBeVisible();
});

test("mobile navigation and sticky cta stay honest", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/faq/");

  const banner = page.getByRole("banner");
  await banner.locator('summary[aria-label="Открыть меню"]').click();
  const mobileNav = banner.getByRole("navigation", { name: "Мобильная навигация" });
  await mobileNav.locator("summary").filter({ hasText: "Услуги" }).click();
  await banner.getByRole("link", { name: "Фасадные вывески" }).click();
  await expect(page).toHaveURL(/\/uslugi\/fasadnye-vyveski\/$/);

  const quickActions = page.getByRole("navigation", { name: "Быстрые действия" });
  await expect(quickActions.getByRole("link", { name: "Контакты" })).toHaveAttribute("href", "/kontakty/");
  await expect(quickActions.getByRole("link", { name: "Оставить заявку" })).toHaveAttribute(
    "href",
    "/kontakty/#lead-form"
  );
  await expect(quickActions.getByRole("link", { name: "Получить расчёт" })).toHaveAttribute(
    "href",
    "/kontakty/#lead-form"
  );
});

test("home, cases anchors and form smoke flow", async ({ page }) => {
  const runId = Date.now().toString().slice(-6);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Световые и фасадные вывески/i })).toBeVisible();
  await page.getByRole("link", { name: "Смотреть кейсы" }).click();
  await expect(page).toHaveURL(/\/cases\/$/);
  await expect(page.getByRole("link", { name: "Открыть на странице кейсов" }).first()).toHaveAttribute(
    "href",
    /\/cases\/#/
  );

  await page.goto("/uslugi/fasadnye-vyveski/");
  await expect(page.getByRole("heading", { level: 1, name: /Фасадная вывеска/i })).toBeVisible();

  await page.goto("/kontakty/");
  await page.getByLabel("Имя или компания").fill(`Тестовый клиент ${runId}`);
  await page.getByLabel("Телефон или WhatsApp").fill(`+7701${runId}`);
  await page.getByLabel("Коротко о задаче").fill(`Нужна фасадная вывеска для кафе в Алматы, нужен монтаж. Тест ${runId}.`);
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page).toHaveURL(/leadStatus=success/);
  await expect(page.getByRole("link", { name: "Отправить ещё одну заявку" })).toBeVisible();
});
