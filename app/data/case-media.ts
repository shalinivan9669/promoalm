import type { CaseStudy } from "../../shared/types/content";

export type CaseMediaKey = "game" | "cofe" | "retail";

interface CaseMediaConfig {
  folder: CaseMediaKey;
  files: string[];
  alts: string[];
}

export const caseMediaBySlug: Partial<Record<CaseStudy["slug"], CaseMediaConfig>> = {
  "cyber-club-facade-rollout": {
    folder: "game",
    files: ["game.avif"],
    alts: ["Фасадная вывеска для сети компьютерных клубов"]
  },
  "coffee-lightbox-entry": {
    folder: "cofe",
    files: ["1.avif", "2.avif", "3.avif"],
    alts: [
      "Световой короб для точки общепита",
      "Лайтбокс у входа в точку общепита",
      "Световой короб на фасаде кофейни"
    ]
  },
  "roof-sign-retail": {
    folder: "retail",
    files: ["retail.avif", "retail2.avif"],
    alts: ["Крышная установка для retail-объекта", "Крышная вывеска для заметного retail-объекта"]
  }
};

export function getCaseMediaConfig(slug: CaseStudy["slug"]) {
  return caseMediaBySlug[slug] ?? null;
}

export function getCaseMediaAlt(slug: CaseStudy["slug"], index: number, fallbackTitle: string) {
  const config = getCaseMediaConfig(slug);
  const alt = config?.alts[index];

  if (alt) {
    return alt;
  }

  return fallbackTitle;
}
