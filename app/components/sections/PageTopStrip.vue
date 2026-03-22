<script setup lang="ts">
import type { BreadcrumbItem } from "../../../shared/types/content";

defineProps<{
  breadcrumbs: BreadcrumbItem[];
  chips?: string[];
}>();
</script>

<template>
  <Container>
    <div class="pt-4 sm:pt-6">
      <Breadcrumbs
        :items="breadcrumbs"
        compact
      />
      <div
        v-if="chips?.length"
        class="mt-4 flex flex-wrap gap-3"
      >
        <span
          v-for="chip in chips"
          :key="chip"
          class="page-chip"
        >
          {{ chip }}
        </span>
      </div>
    </div>
  </Container>
</template>
