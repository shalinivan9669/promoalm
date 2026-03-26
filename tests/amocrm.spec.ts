import { describe, expect, it } from "vitest";

import type { NormalizedLeadPayload } from "../shared/types/lead";
import { normalizeAmoBaseUrl, buildAmoDisconnectSignature, isValidAmoDisconnectSignature } from "../server/utils/amocrm";
import { buildLeadName, buildLeadNote, buildLeadTags } from "../server/utils/lead-delivery";

const samplePayload: NormalizedLeadPayload = {
  name: "Тестовый клиент",
  contact: "+77011112233",
  city: "Алматы",
  objectType: "Фасад / street retail",
  message: "Нужна фасадная вывеска и монтаж.",
  preferredChannel: "whatsapp",
  deadline: "1-2 недели",
  budget: "до 300 000 ₸",
  address: "Алматы, Абая 10",
  referenceLink: "https://example.com/brief",
  locationsCount: 3,
  needsInstallation: true,
  hasFacadePhoto: true,
  hasDimensions: false,
  hasBrandbook: true,
  consent: true,
  taskType: "Фасадная вывеска",
  sourcePage: "/kontakty/",
  startedAt: 1_700_000_000_000
};

describe("amoCRM helpers", () => {
  it("normalizes base urls", () => {
    expect(normalizeAmoBaseUrl("togethertiktok.amocrm.ru")).toBe("https://togethertiktok.amocrm.ru");
    expect(normalizeAmoBaseUrl("https://togethertiktok.amocrm.ru/")).toBe("https://togethertiktok.amocrm.ru");
  });

  it("validates disconnect signatures", () => {
    const signature = buildAmoDisconnectSignature("client-id", 12345, "secret-key");

    expect(isValidAmoDisconnectSignature("client-id", 12345, "secret-key", signature)).toBe(true);
    expect(isValidAmoDisconnectSignature("client-id", 12345, "other-secret", signature)).toBe(false);
  });

  it("builds a lead name and tags", () => {
    expect(buildLeadName(samplePayload)).toContain("Фасадная вывеска");
    expect(buildLeadTags(samplePayload)).toEqual(
      expect.arrayContaining([{ name: "Neon Market" }, { name: "WhatsApp" }, { name: "Нужен монтаж" }])
    );
  });

  it("builds a note with all form fields and checkbox values", () => {
    const note = buildLeadNote(samplePayload);

    expect(note).toContain("Тестовый клиент");
    expect(note).toContain("+77011112233");
    expect(note).toContain("Алматы");
    expect(note).toContain("Фасад / street retail");
    expect(note).toContain("1-2 недели");
    expect(note).toContain("до 300 000 ₸");
    expect(note).toContain("Алматы, Абая 10");
    expect(note).toContain("https://example.com/brief");
    expect(note).toContain("Количество точек: 3");
    expect(note).toContain("Нужен монтаж: Да");
    expect(note).toContain("Есть фото фасада: Да");
    expect(note).toContain("Есть размеры: Нет");
    expect(note).toContain("Есть брендбук: Да");
    expect(note).toContain("Согласие на обработку данных: Да");
    expect(note).toContain("/kontakty/");
    expect(note).toContain("Нужна фасадная вывеска и монтаж.");
  });
});
