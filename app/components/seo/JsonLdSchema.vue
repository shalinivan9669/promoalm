<script setup lang="ts">
const props = defineProps<{
  schemas: Record<string, unknown>[];
}>();

useHead({
  script: props.schemas.map((schema, index) => ({
    key: `json-ld-${index}`,
    type: "application/ld+json",
    innerHTML: JSON.stringify(schema)
  }))
});
</script>

<template>
  <span class="hidden" />
</template>
