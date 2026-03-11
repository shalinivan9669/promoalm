<script setup lang="ts">
import { supportPages } from "../data/support-pages";
import { contactInfo } from "../data/site";
import { getSupportPage } from "../utils/links";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "../utils/schema";

const page = getSupportPage(supportPages, "politika-konfidentsialnosti");

if (!page || page.status !== "published") {
  throw createError({ statusCode: 404, statusMessage: "Privacy page not found." });
}

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "Политика конфиденциальности", href: page.meta.path, current: true }]);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs)
];

usePageSeo({
  meta: page.meta,
  breadcrumbs,
  schemas
});
</script>

<template>
  <SupportPageTemplate
    :page="page"
    :breadcrumbs="breadcrumbs"
  />
</template>
