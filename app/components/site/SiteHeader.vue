<script setup lang="ts">
import type { PrimaryNavigationGroup, PrimaryNavigationItem } from "../../data/navigation";
import { primaryNavigation } from "../../data/navigation";
import { normalizePathForMatch } from "../../utils/routes";

const route = useRoute();
const currentPath = computed(() => normalizePathForMatch(route.path));

function isGroup(item: PrimaryNavigationItem): item is PrimaryNavigationGroup {
  return item.kind === "group";
}

function isLinkActive(href: string) {
  return currentPath.value === normalizePathForMatch(href);
}

function isGroupActive(item: PrimaryNavigationItem) {
  return isGroup(item) && item.items.some((link) => isLinkActive(link.href));
}

function directLinkClass(href: string) {
  return isLinkActive(href)
    ? "rounded-full px-4 py-2 text-sm text-white ring-1 ring-accent/60"
    : "rounded-full px-4 py-2 text-sm text-muted transition hover:text-white";
}

function groupSummaryClass(item: PrimaryNavigationItem) {
  return isGroupActive(item)
    ? "flex cursor-pointer list-none items-center gap-2 rounded-full px-4 py-2 text-sm text-white ring-1 ring-accent/60 marker:hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    : "flex cursor-pointer list-none items-center gap-2 rounded-full px-4 py-2 text-sm text-muted transition hover:text-white marker:hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
}

function panelLinkClass(href: string) {
  return isLinkActive(href)
    ? "block rounded-3xl border border-accent/60 bg-canvas-soft px-4 py-3 text-white transition"
    : "block rounded-3xl border border-transparent px-4 py-3 text-muted transition hover:border-line hover:bg-canvas-soft hover:text-white";
}

function mobileLinkClass(href: string) {
  return isLinkActive(href)
    ? "rounded-2xl border border-accent/60 bg-canvas-soft px-4 py-3 text-sm text-white"
    : "rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white transition hover:border-accent";
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/70 bg-canvas/96">
    <Container class="relative flex items-center justify-between gap-6 py-4">
      <a
        href="/"
        class="flex items-center gap-3"
      >
        <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-panel text-lg font-semibold text-white">
          N
        </span>
        <span class="flex flex-col">
          <span class="text-sm font-semibold text-white">Neon Market</span>
          <span class="text-xs text-muted">Вывески для бизнеса</span>
        </span>
      </a>

      <nav
        aria-label="Основная навигация"
        class="hidden items-center gap-2 lg:flex"
      >
        <template
          v-for="item in primaryNavigation"
          :key="item.label"
        >
          <details
            v-if="isGroup(item)"
            class="group relative"
          >
            <summary :class="groupSummaryClass(item)">
              <span>{{ item.label }}</span>
              <span
                aria-hidden="true"
                class="text-xs transition group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div class="absolute left-0 top-full mt-3 hidden min-w-72 max-w-sm rounded-4xl border border-line bg-panel p-4 shadow-soft group-open:block">
              <p class="px-4 text-xs uppercase tracking-[0.18em] text-muted">
                {{ item.description }}
              </p>
              <ul class="mt-3 grid gap-2">
                <li
                  v-for="link in item.items"
                  :key="link.href"
                >
                  <a
                    :href="link.href"
                    :aria-current="isLinkActive(link.href) ? 'page' : undefined"
                    :class="panelLinkClass(link.href)"
                  >
                    <span class="block text-sm font-semibold text-white">{{ link.label }}</span>
                    <span
                      v-if="link.description"
                      class="mt-1 block text-xs leading-5 text-muted"
                    >
                      {{ link.description }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </details>
          <a
            v-else
            :href="item.href"
            :aria-current="isLinkActive(item.href) ? 'page' : undefined"
            :class="directLinkClass(item.href)"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>

      <div class="hidden lg:block">
        <ButtonLink
          href="/kontakty/#lead-form"
          label="Рассчитать"
          intent="calculate"
          tracking-event="click_calculate"
          small
        />
      </div>

      <details class="group lg:hidden">
        <summary
          class="flex h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border border-line px-3 text-white marker:hidden"
          aria-label="Открыть меню"
        >
          <span class="font-mono text-sm group-open:hidden">≡</span>
          <span class="hidden font-mono text-sm group-open:block">×</span>
        </summary>
        <div class="absolute right-5 top-full mt-3 w-[min(22rem,calc(100vw-2.5rem))] rounded-4xl border border-line bg-panel p-4 shadow-soft">
          <nav
            aria-label="Мобильная навигация"
            class="flex flex-col gap-3"
          >
            <template
              v-for="item in primaryNavigation"
              :key="item.label"
            >
              <details
                v-if="isGroup(item)"
                :open="isGroupActive(item)"
                class="group rounded-3xl border border-line bg-canvas-soft"
              >
                <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-white marker:hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
                  <span>{{ item.label }}</span>
                  <span
                    aria-hidden="true"
                    class="text-xs transition group-open:rotate-180"
                  >
                    ▾
                  </span>
                </summary>
                <ul class="grid gap-2 border-t border-line/70 p-3">
                  <li
                    v-for="link in item.items"
                    :key="link.href"
                  >
                    <a
                      :href="link.href"
                      :aria-current="isLinkActive(link.href) ? 'page' : undefined"
                      :class="mobileLinkClass(link.href)"
                    >
                      <span class="block font-semibold">{{ link.label }}</span>
                      <span
                        v-if="link.description"
                        class="mt-1 block text-xs leading-5 text-muted"
                      >
                        {{ link.description }}
                      </span>
                    </a>
                  </li>
                </ul>
              </details>
              <a
                v-else
                :href="item.href"
                :aria-current="isLinkActive(item.href) ? 'page' : undefined"
                :class="mobileLinkClass(item.href)"
              >
                {{ item.label }}
              </a>
            </template>
            <ButtonLink
              href="/kontakty/#lead-form"
              label="Рассчитать проект"
              intent="calculate"
              tracking-event="click_calculate"
              block
            />
          </nav>
        </div>
      </details>
    </Container>
  </header>
</template>
