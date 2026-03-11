import type { SeoMetaInput } from "../../shared/types/content";

export function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/$/, "");
}

export function absoluteUrl(siteUrl: string, path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedBase = normalizeSiteUrl(siteUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function buildRobots(meta: SeoMetaInput) {
  return meta.noindex ? "noindex, nofollow" : "index, follow";
}
