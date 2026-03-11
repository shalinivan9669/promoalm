<script setup lang="ts">
import { cases } from "../../data/cases";
import { services } from "../../data/services";
import { getCasesByIds } from "../../utils/links";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/schema";

const route = useRoute();
const slug = route.params.slug as string;
const page = services.find((item) => item.slug === slug && item.status === "published");

if (!page) {
  throw createError({ statusCode: 404, statusMessage: "Service page not found." });
}

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: page.name, href: page.meta.path, current: true }]);
const relatedCases = getCasesByIds(cases.filter((item) => item.status === "published"), page.caseIds);
const schemas = [
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildServiceSchema(siteUrl, page),
  buildFaqSchema(page.faq)
].filter(Boolean) as Record<string, unknown>[];

usePageSeo({
  meta: page.meta,
  breadcrumbs,
  schemas
});
</script>

<template>
  <ServicePageTemplate
    :page="page"
    :breadcrumbs="breadcrumbs"
    :case-studies="relatedCases"
  />
</template>
