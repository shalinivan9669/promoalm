import { describe, expect, it } from "vitest";

import { cities } from "../app/data/cities";
import { services } from "../app/data/services";
import { staticPageMeta } from "../app/data/site";
import { supportPages as supportData } from "../app/data/support-pages";

describe("seo uniqueness", () => {
  const publishedServices = services.filter((item) => item.status === "published");
  const publishedCities = cities.filter((item) => item.status === "published");
  const publishedSupport = supportData.filter((item) => item.status === "published");
  const staticMetas = Object.values(staticPageMeta);
  const staticH1s = [
    "Световые и фасадные вывески для бизнеса без хаоса в подрядчике",
    "Neon Market ведёт проект от макета до монтажа, а не продаёт случайные изделия",
    "Самый короткий путь к расчёту — прислать фото объекта и задачу",
    "Пока здесь типовые сценарии вместо вымышленных кейсов с чужими логотипами"
  ];

  it("keeps titles unique", () => {
    const titles = [
      ...publishedServices.map((item) => item.meta.title),
      ...publishedCities.map((item) => item.meta.title),
      ...publishedSupport.map((item) => item.meta.title),
      ...staticMetas.map((item) => item.title)
    ];

    expect(new Set(titles).size).toBe(titles.length);
  });

  it("keeps descriptions unique", () => {
    const descriptions = [
      ...publishedServices.map((item) => item.meta.description),
      ...publishedCities.map((item) => item.meta.description),
      ...publishedSupport.map((item) => item.meta.description),
      ...staticMetas.map((item) => item.description)
    ];

    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps h1 values unique", () => {
    const h1s = [
      ...publishedServices.map((item) => item.h1),
      ...publishedCities.map((item) => item.h1),
      ...publishedSupport.map((item) => item.h1),
      ...staticH1s
    ];

    expect(new Set(h1s).size).toBe(h1s.length);
  });

  it("keeps canonical paths unique", () => {
    const paths = [
      ...publishedServices.map((item) => item.meta.path),
      ...publishedCities.map((item) => item.meta.path),
      ...publishedSupport.map((item) => item.meta.path),
      ...staticMetas.map((item) => item.path)
    ];

    expect(new Set(paths).size).toBe(paths.length);
  });
});
