<script setup lang="ts">
import type { BreadcrumbItem } from "../../../shared/types/content";

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav
    aria-label="Хлебные крошки"
    class="mb-8"
  >
    <ol class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <li
        v-for="(item, index) in items"
        :key="item.href"
        class="flex items-center gap-2"
      >
        <NuxtLink
          v-if="!item.current"
          :to="item.href"
          class="transition hover:text-white"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="text-white"
        >
          {{ item.label }}
        </span>
        <span v-if="index !== items.length - 1">/</span>
      </li>
    </ol>
  </nav>
</template>
