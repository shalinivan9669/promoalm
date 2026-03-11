import type { CitySlug, ServiceSlug, SupportPageSlug } from "../../shared/types/content";

export function withTrailingSlash(path: string) {
  if (path === "/") {
    return path;
  }

  return path.endsWith("/") ? path : `${path}/`;
}

export function servicePath(slug: ServiceSlug) {
  return withTrailingSlash(`/uslugi/${slug}`);
}

export function cityPath(slug: CitySlug) {
  return withTrailingSlash(`/goroda/${slug}`);
}

export function supportPagePath(slug: SupportPageSlug) {
  return withTrailingSlash(`/${slug}`);
}

export const staticPagePaths = {
  home: "/",
  about: "/o-kompanii/",
  contacts: "/kontakty/",
  faq: "/faq/",
  delivery: "/dostavka-po-kazahstanu/",
  payment: "/oplata-i-garantiya/",
  privacy: "/politika-konfidentsialnosti/",
  cases: "/cases/"
} as const;
