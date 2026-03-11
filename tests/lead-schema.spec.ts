import { describe, expect, it } from "vitest";

import { leadFormSchema, normalizeContactValue, normalizeLeadPayload } from "../shared/validation/lead";

describe("lead schema", () => {
  it("accepts a valid payload", () => {
    const result = leadFormSchema.safeParse({
      name: "Арман",
      contact: "+7 (701) 111-22-33",
      city: "Алматы",
      message: "Нужна фасадная вывеска для кафе, монтаж нужен.",
      preferredChannel: "whatsapp",
      taskType: "Фасадные вывески",
      sourcePage: "/uslugi/fasadnye-vyveski/",
      startedAt: Date.now() - 10_000,
      hp: ""
    });

    expect(result.success).toBe(true);
  });

  it("rejects too short payloads", () => {
    const result = leadFormSchema.safeParse({
      name: "A",
      contact: "123",
      message: "коротко",
      taskType: "",
      sourcePage: "",
      startedAt: 1
    });

    expect(result.success).toBe(false);
  });

  it("normalizes phone-like contacts", () => {
    expect(normalizeContactValue("8 (701) 111-22-33")).toBe("+77011112233");
    expect(normalizeContactValue("7011112233")).toBe("+7011112233");
  });

  it("returns normalized payload", () => {
    const payload = normalizeLeadPayload({
      name: " Арман ",
      contact: "8 (701) 111-22-33",
      city: "",
      message: " Нужны объёмные буквы и монтаж. ",
      preferredChannel: undefined,
      taskType: "Объёмные буквы",
      sourcePage: "/kontakty/",
      startedAt: 123,
      hp: ""
    });

    expect(payload.name).toBe("Арман");
    expect(payload.contact).toBe("+77011112233");
    expect(payload.city).toBeUndefined();
    expect(payload.preferredChannel).toBe("whatsapp");
  });
});
