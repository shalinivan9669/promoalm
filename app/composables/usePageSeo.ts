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
  const canonical = absoluteUrl(siteUrl, input.meta.path);
  const image = absoluteUrl(siteUrl, input.meta.image || (config.public.defaultOgImage as string));

  useSeoMeta({
    title: input.meta.title,
    description: input.meta.description,
    ogTitle: input.meta.title,
    ogDescription: input.meta.description,
    ogType: input.meta.ogType || "website",
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: input.meta.title,
    twitterDescription: input.meta.description,
    twitterImage: image,
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
