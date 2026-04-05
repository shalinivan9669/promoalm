<script setup lang="ts">
import { cases } from "../../data/cases";
import { services } from "../../data/services";
import { contactInfo } from "../../data/site";
import { getCasesByIds } from "../../utils/links";
import { staticPagePaths } from "../../utils/routes";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema, buildServiceSchema, buildWebPageSchema } from "../../utils/schema";

const route = useRoute();
const slug = route.params.slug as string;
const page = services.find((item) => item.slug === slug && item.status === "published");

if (!page) {
  throw createError({ statusCode: 404, statusMessage: "Service page not found." });
}

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([
  { label: "Услуги", href: staticPagePaths.uslugi },
  { label: page.name, href: page.meta.path, current: true }
]);
const relatedCases = getCasesByIds(cases.filter((item) => item.status === "published"), page.caseIds);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildWebPageSchema(siteUrl, page.h1, page.meta.description, page.meta.path),
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
