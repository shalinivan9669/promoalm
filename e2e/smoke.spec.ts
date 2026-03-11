import { expect, test } from "@playwright/test";

test("home, service and form smoke flow", async ({ page }) => {
  const runId = Date.now().toString().slice(-6);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Световые и фасадные вывески/i })).toBeVisible();

  await page.goto("/uslugi/fasadnye-vyveski/");
  await expect(page.getByRole("heading", { level: 1, name: /Фасадная вывеска/i })).toBeVisible();

  await page.goto("/kontakty/");
  await page.getByLabel("Имя или компания").fill(`Тестовый клиент ${runId}`);
  await page.getByLabel("Телефон или WhatsApp").fill(`+7701${runId}`);
  await page.getByLabel("Коротко о задаче").fill(`Нужна фасадная вывеска для кафе в Алматы, нужен монтаж. Тест ${runId}.`);
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByRole("heading", { name: /Заявка принята/i })).toBeVisible();
});
