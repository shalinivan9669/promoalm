import { buildSitemapXml } from "../utils/sitemap";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);

  setHeader(event, "content-type", "application/xml; charset=utf-8");

  return buildSitemapXml(config.public.siteUrl);
});
