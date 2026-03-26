import type { BreadcrumbItem, SeoMetaInput } from "../../shared/types/content";
import { buildRobots, absoluteUrl } from "../utils/seo";

interface PageSeoInput {
  meta: SeoMetaInput;
  breadcrumbs?: BreadcrumbItem[];
  schemas?: Record<string, unknown>[];
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl as string;
  const canonicalPath = input.meta.canonical || input.meta.path;
  const canonical = absoluteUrl(siteUrl, canonicalPath);
  const image = absoluteUrl(siteUrl, input.meta.image || (config.public.defaultOgImage as string));

  useSeoMeta({
    title: input.meta.title,
    description: input.meta.description,
    ogTitle: input.meta.title,
    ogDescription: input.meta.description,
    ogUrl: canonical,
    ogType: input.meta.ogType || "website",
    ogSiteName: config.public.siteName as string,
    ogImage: image,
    ogImageAlt: input.meta.title,
    twitterCard: "summary_large_image",
    twitterTitle: input.meta.title,
    twitterDescription: input.meta.description,
    twitterImage: image,
    twitterImageAlt: input.meta.title,
    robots: buildRobots(input.meta)
  });

  useHead({
    link: [{ rel: "canonical", href: canonical }],
    script: (input.schemas || []).map((schema, index) => ({
      key: `schema-${index}`,
      type: "application/ld+json",
      innerHTML: JSON.stringify(schema)
    }))
  });

  return {
    canonical,
    breadcrumbs: input.breadcrumbs || []
  };
}
