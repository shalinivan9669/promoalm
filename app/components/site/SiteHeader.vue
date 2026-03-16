<script setup lang="ts">
import type { PrimaryNavigationGroup, PrimaryNavigationItem } from "../../data/navigation";
import { primaryNavigation } from "../../data/navigation";
import { normalizePathForMatch } from "../../utils/routes";

const route = useRoute();
const currentPath = computed(() => normalizePathForMatch(route.path));
const desktopNavRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);
const openDesktopGroup = ref<string | null>(null);
const isMobileMenuOpen = ref(false);
const openMobileGroup = ref<string | null>(null);

const brandTagline = "\u0412\u044b\u0432\u0435\u0441\u043a\u0438 \u0434\u043b\u044f \u0431\u0438\u0437\u043d\u0435\u0441\u0430";
const desktopNavLabel = "\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const mobileNavLabel = "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const openMenuLabel = "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e";
const calculateLabel = "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c";
const calculateProjectLabel = "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442";

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
    ? "rounded-full px-4 py-2 text-sm text-white ring-1 ring-accent/60 whitespace-nowrap"
    : "rounded-full px-4 py-2 text-sm text-muted transition hover:text-white whitespace-nowrap";
}

function groupSummaryClass(item: PrimaryNavigationItem) {
  return isGroupActive(item) || openDesktopGroup.value === item.label
    ? "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-white ring-1 ring-accent/60 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    : "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-muted transition hover:text-white whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
}

function panelLinkClass(href: string) {
  return isLinkActive(href)
    ? "block rounded-3xl border border-accent/60 bg-canvas-soft px-4 py-3 text-white transition"
    : "block rounded-3xl border border-transparent px-4 py-3 text-muted transition hover:border-line hover:bg-canvas-soft hover:text-white";
}

function desktopPanelClass(item: PrimaryNavigationItem) {
  return isGroup(item) && item.items.length > 5
    ? "desktop-dropdown-scroll max-h-[50vh] overflow-y-scroll pr-2"
    : "";
}

function mobileLinkClass(href: string) {
  return isLinkActive(href)
    ? "rounded-2xl border border-accent/60 bg-canvas-soft px-4 py-3 text-sm text-white"
    : "rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white transition hover:border-accent";
}

function isMobileGroupOpen(item: PrimaryNavigationItem) {
  return isGroup(item) && (openMobileGroup.value === item.label || isGroupActive(item));
}

function toggleDesktopGroup(label: string) {
  openDesktopGroup.value = openDesktopGroup.value === label ? null : label;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  if (!isMobileMenuOpen.value) {
    openMobileGroup.value = null;
  }
}

function toggleMobileGroup(label: string) {
  openMobileGroup.value = openMobileGroup.value === label ? null : label;
}

function closeAllMenus() {
  openDesktopGroup.value = null;
  isMobileMenuOpen.value = false;
  openMobileGroup.value = null;
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (desktopNavRef.value && !desktopNavRef.value.contains(target)) {
    openDesktopGroup.value = null;
  }

  if (mobileMenuRef.value && !mobileMenuRef.value.contains(target)) {
    isMobileMenuOpen.value = false;
    openMobileGroup.value = null;
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeAllMenus();
  }
}

watch(
  () => route.fullPath,
  () => {
    closeAllMenus();
  }
);

onMounted(() => {
  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handlePointerDown);
  document.removeEventListener("keydown", handleEscape);
});
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
          <span class="text-xs text-muted">{{ brandTagline }}</span>
        </span>
      </a>

      <nav
        ref="desktopNavRef"
        :aria-label="desktopNavLabel"
        class="hidden items-center gap-2 lg:flex"
      >
        <template
          v-for="item in primaryNavigation"
          :key="item.label"
        >
          <div
            v-if="isGroup(item)"
            class="relative shrink-0"
          >
            <button
              type="button"
              :class="groupSummaryClass(item)"
              :aria-expanded="openDesktopGroup === item.label"
              @click="toggleDesktopGroup(item.label)"
            >
              <span>{{ item.label }}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                class="h-3 w-3 shrink-0 transition"
                :class="{ 'rotate-180': openDesktopGroup === item.label }"
              >
                <path
                  d="M3 4.5 6 7.5l3-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.4"
                />
              </svg>
            </button>
            <div
              v-show="openDesktopGroup === item.label"
              class="absolute left-0 top-full mt-3 min-w-72 max-w-sm rounded-4xl border border-line bg-panel p-4 shadow-soft"
              :class="desktopPanelClass(item)"
            >
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
                    @click="closeAllMenus"
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
          </div>
          <a
            v-else
            :href="item.href"
            :aria-current="isLinkActive(item.href) ? 'page' : undefined"
            :class="directLinkClass(item.href)"
            @click="closeAllMenus"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>

      <div class="hidden lg:block">
        <ButtonLink
          href="/kontakty/#lead-form"
          :label="calculateLabel"
          intent="calculate"
          tracking-event="click_calculate"
          small
        />
      </div>

      <div
        ref="mobileMenuRef"
        class="relative lg:hidden"
      >
        <button
          type="button"
          class="flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-white"
          :aria-label="openMenuLabel"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <svg
            v-show="!isMobileMenuOpen"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="h-4 w-4"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.8"
            />
          </svg>
          <svg
            v-show="isMobileMenuOpen"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="h-4 w-4"
          >
            <path
              d="m6 6 12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.8"
            />
          </svg>
        </button>
        <div
          v-show="isMobileMenuOpen"
          class="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2.5rem))] rounded-4xl border border-line bg-panel p-4 shadow-soft"
        >
          <nav
            :aria-label="mobileNavLabel"
            class="flex flex-col gap-3"
          >
            <template
              v-for="item in primaryNavigation"
              :key="item.label"
            >
              <div
                v-if="isGroup(item)"
                class="rounded-3xl border border-line bg-canvas-soft"
              >
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  :aria-expanded="isMobileGroupOpen(item)"
                  @click="toggleMobileGroup(item.label)"
                >
                  <span>{{ item.label }}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    class="h-3 w-3 shrink-0 transition"
                    :class="{ 'rotate-180': isMobileGroupOpen(item) }"
                  >
                    <path
                      d="M3 4.5 6 7.5l3-3"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.4"
                    />
                  </svg>
                </button>
                <ul
                  v-show="isMobileGroupOpen(item)"
                  class="grid gap-2 border-t border-line/70 p-3"
                >
                  <li
                    v-for="link in item.items"
                    :key="link.href"
                  >
                    <a
                      :href="link.href"
                      :aria-current="isLinkActive(link.href) ? 'page' : undefined"
                      :class="mobileLinkClass(link.href)"
                      @click="closeAllMenus"
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
              </div>
              <a
                v-else
                :href="item.href"
                :aria-current="isLinkActive(item.href) ? 'page' : undefined"
                :class="mobileLinkClass(item.href)"
                @click="closeAllMenus"
              >
                {{ item.label }}
              </a>
            </template>
            <ButtonLink
              href="/kontakty/#lead-form"
              :label="calculateProjectLabel"
              intent="calculate"
              tracking-event="click_calculate"
              block
            />
          </nav>
        </div>
      </div>
    </Container>
  </header>
</template>

<style scoped>
.desktop-dropdown-scroll {
  scrollbar-color: rgba(125, 191, 255, 0.85) rgba(255, 255, 255, 0.08);
  scrollbar-width: auto;
}

.desktop-dropdown-scroll::-webkit-scrollbar {
  width: 12px;
}

.desktop-dropdown-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
}

.desktop-dropdown-scroll::-webkit-scrollbar-thumb {
  background: rgba(125, 191, 255, 0.85);
  border: 2px solid rgba(12, 16, 24, 0.9);
  border-radius: 9999px;
}

.desktop-dropdown-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(158, 210, 255, 0.95);
}
</style>
