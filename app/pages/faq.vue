<script setup lang="ts">
import { supportPages } from "../data/support-pages";
import { contactInfo } from "../data/site";
import { getSupportPage } from "../utils/links";
import { buildSupportPageSchemas } from "../utils/schema";

const page = getSupportPage(supportPages, "faq");

if (!page || page.status !== "published") {
  throw createError({ statusCode: 404, statusMessage: "FAQ page not found." });
}

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: "FAQ", href: page.meta.path, current: true }]);
const schemas = buildSupportPageSchemas(siteUrl, page, breadcrumbs, contactInfo);

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
