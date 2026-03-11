<script setup lang="ts">
import { cases } from "../../data/cases";
import { cities } from "../../data/cities";
import { serviceCards } from "../../data/services";
import { getCasesByIds, getServiceCardsBySlugs } from "../../utils/links";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema, buildServiceSchema } from "../../utils/schema";
import { contactInfo } from "../../data/site";

const route = useRoute();
const analytics = useAnalytics();
const slug = route.params.slug as string;
const page = cities.find((item) => item.slug === slug && item.status === "published");

if (!page) {
  throw createError({ statusCode: 404, statusMessage: "City page not found." });
}

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const breadcrumbs = useBreadcrumbs([{ label: page.city, href: page.meta.path, current: true }]);
const relatedCases = getCasesByIds(cases.filter((item) => item.status === "published"), page.relatedCaseIds);
const relatedServiceCards = getServiceCardsBySlugs(serviceCards.filter((item) => item.status === "published"), page.relatedServiceSlugs);
const schemas = [
  buildOrganizationSchema(siteUrl, contactInfo),
  buildBreadcrumbSchema(siteUrl, breadcrumbs),
  buildServiceSchema(siteUrl, page),
  buildFaqSchema(page.faq)
].filter(Boolean) as Record<string, unknown>[];

usePageSeo({
  meta: page.meta,
  breadcrumbs,
  schemas
});

onMounted(() => {
  analytics.track("open_city_page", {
    slug: page.slug
  });
});
</script>

<template>
  <CityPageTemplate
    :page="page"
    :breadcrumbs="breadcrumbs"
    :case-studies="relatedCases"
    :related-service-cards="relatedServiceCards"
  />
</template>
