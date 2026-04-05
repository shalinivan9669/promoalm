import { cities } from "../../app/data/cities";
import { services } from "../../app/data/services";
import { supportPages } from "../../app/data/support-pages";
import { absoluteUrl } from "../../app/utils/seo";
import { staticPagePaths } from "../../app/utils/routes";

export function getSitemapPaths() {
  const supportPaths = supportPages
    .filter((page) => page.status === "published" && !page.meta.noindex)
    .map((page) => page.meta.path);
  const servicePaths = services
    .filter((service) => service.status === "published" && !service.meta.noindex)
    .map((service) => service.meta.path);
  const cityPaths = cities
    .filter((city) => city.status === "published" && !city.meta.noindex)
    .map((city) => city.meta.path);

  return [...new Set([
    staticPagePaths.home,
    staticPagePaths.uslugi,
    staticPagePaths.goroda,
    staticPagePaths.about,
    staticPagePaths.contacts,
    staticPagePaths.cases,
    ...supportPaths,
    ...servicePaths,
    ...cityPaths
  ])];
}

export function buildSitemapXml(siteUrl: string) {
  const now = new Date().toISOString();
  const urls = getSitemapPaths()
    .map((path) => {
      const loc = absoluteUrl(siteUrl, path);
      return `<url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
