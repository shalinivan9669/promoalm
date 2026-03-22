<script setup lang="ts">
import type { BreadcrumbItem } from "../../../shared/types/content";

defineProps<{
  items: BreadcrumbItem[];
  compact?: boolean;
}>();
</script>

<template>
  <nav
    aria-label="Хлебные крошки"
    :class="compact ? 'mb-4' : 'mb-8'"
  >
    <ol class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <li
        v-for="(item, index) in items"
        :key="item.href"
        class="flex items-center gap-2"
      >
        <a
          v-if="!item.current"
          :href="item.href"
          class="transition hover:text-[color:var(--color-accent)]"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          class="text-ink"
        >
          {{ item.label }}
        </span>
        <span v-if="index !== items.length - 1">/</span>
      </li>
    </ol>
  </nav>
</template>
