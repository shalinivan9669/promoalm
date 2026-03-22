<script setup lang="ts">
import type { PrimaryNavigationGroup, PrimaryNavigationItem } from "../../data/navigation";
import { primaryNavigation } from "../../data/navigation";
import { normalizePathForMatch } from "../../utils/routes";

const route = useRoute();
const currentPath = computed(() => normalizePathForMatch(route.path));
const isHomeRoute = computed(() => currentPath.value === normalizePathForMatch("/"));
const HOME_HEADER_REVEAL_SHOW_THRESHOLD = 0.54;
const HOME_HEADER_REVEAL_HIDE_THRESHOLD = 0.42;
const heroProgress = ref(1);
const heroSection = ref<HTMLElement | null>(null);
const heroHeaderRevealed = ref(false);
const isHeroHeaderRevealed = computed(() => !isHomeRoute.value || heroHeaderRevealed.value);
const isHomeHeroMinimal = computed(() => isHomeRoute.value && !isHeroHeaderRevealed.value && !isMobileMenuOpen.value);
const isCondensed = computed(() => !isHomeRoute.value || isHeroHeaderRevealed.value);
const desktopNavRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);
const openDesktopGroup = ref<string | null>(null);
const isMobileMenuOpen = ref(false);
const openMobileGroup = ref<string | null>(null);

const brandName = "Neon Market";
const brandTagline = "\u0412\u044B\u0432\u0435\u0441\u043A\u0438 \u0434\u043B\u044F \u0431\u0438\u0437\u043D\u0435\u0441\u0430";
const desktopNavLabel = "\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F";
const mobileNavLabel = "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F";
const openMenuLabel = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E";
const closeMenuLabel = "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E";
const menuLabel = "\u041C\u0435\u043D\u044E";
const calculateLabel = "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C";
const calculateProjectLabel = "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442";
const heroActionLabel = "\u041F\u0440\u043E\u0435\u043A\u0442";

function isGroup(item: PrimaryNavigationItem): item is PrimaryNavigationGroup {
  return item.kind === "group";
}

function isLinkActive(href: string) {
  return currentPath.value === normalizePathForMatch(href);
}

function isGroupActive(item: PrimaryNavigationItem) {
  return isGroup(item) && item.items.some((link) => isLinkActive(link.href));
}

function isDesktopItemActive(item: PrimaryNavigationItem) {
  return isGroup(item)
    ? isGroupActive(item) || openDesktopGroup.value === item.label
    : isLinkActive(item.href);
}

function isDesktopPanelScrollable(item: PrimaryNavigationItem) {
  return isGroup(item) && item.items.length > 5;
}

function isMobileItemActive(item: PrimaryNavigationItem) {
  return isGroup(item) ? isMobileGroupOpen(item) : isLinkActive(item.href);
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveHeroSection() {
  if (!import.meta.client) {
    return;
  }

  heroSection.value = document.querySelector<HTMLElement>(".home-hero");
}

function updateScrollState() {
  if (!import.meta.client) {
    return;
  }

  if (!isHomeRoute.value) {
    heroProgress.value = 1;
    heroHeaderRevealed.value = true;
    return;
  }

  if (!heroSection.value || !document.body.contains(heroSection.value)) {
    resolveHeroSection();
  }

  if (!heroSection.value) {
    heroProgress.value = clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
    return;
  }

  const rect = heroSection.value.getBoundingClientRect();
  const referenceHeight = Math.max(rect.height, window.innerHeight);
  const progress = clamp(-rect.top / referenceHeight, 0, 1);

  heroProgress.value = progress;

  if (progress >= HOME_HEADER_REVEAL_SHOW_THRESHOLD) {
    heroHeaderRevealed.value = true;
  } else if (progress <= HOME_HEADER_REVEAL_HIDE_THRESHOLD) {
    heroHeaderRevealed.value = false;
  }
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
  async () => {
    closeAllMenus();

    if (import.meta.client) {
      await nextTick();
      requestAnimationFrame(() => {
        resolveHeroSection();
        updateScrollState();
      });
    }
  }
);

onMounted(() => {
  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("keydown", handleEscape);
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState, { passive: true });
  resolveHeroSection();
  updateScrollState();
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handlePointerDown);
  document.removeEventListener("keydown", handleEscape);
  window.removeEventListener("scroll", updateScrollState);
  window.removeEventListener("resize", updateScrollState);
});
</script>

<template>
  <header
    class="site-header"
    :class="{
      'site-header--home': isHomeRoute,
      'site-header--home-minimal': isHomeHeroMinimal,
      'site-header--home-revealed': isHomeRoute && isHeroHeaderRevealed,
      'site-header--condensed': isCondensed,
      'site-header--menu-open': isMobileMenuOpen
    }"
  >
    <Transition name="site-header-scrim">
      <button
        v-if="isMobileMenuOpen"
        type="button"
        class="site-header__scrim"
        :aria-label="closeMenuLabel"
        @click="closeAllMenus"
      />
    </Transition>

    <Container class="site-header__container">
      <div class="site-header__shell">
        <div class="site-header__face">
          <a
            href="/"
            class="site-header__brand"
            @click="closeAllMenus"
          >
            <span class="site-header__brand-plaque">
              <span class="site-header__brand-monogram">N</span>
            </span>
            <span class="site-header__brand-copy">
              <span class="site-header__brand-name">{{ brandName }}</span>
              <span class="site-header__brand-tagline">{{ brandTagline }}</span>
            </span>
          </a>

          <div
            v-if="isHomeRoute"
            class="site-header__hero-action-wrap"
          >
            <a
              href="/kontakty/#lead-form"
              class="site-header__hero-action button-link"
              data-tracking-event="click_calculate"
              @click="closeAllMenus"
            >
              {{ heroActionLabel }}
            </a>
          </div>

          <nav
            ref="desktopNavRef"
            :aria-label="desktopNavLabel"
            class="site-header__nav site-header__nav--desktop"
          >
            <div class="site-header__rail">
              <template
                v-for="item in primaryNavigation"
                :key="item.label"
              >
                <div
                  v-if="isGroup(item)"
                  class="site-header__group"
                >
                  <button
                    type="button"
                    class="site-header__rail-button"
                    :class="{ 'is-active': isDesktopItemActive(item) }"
                    :aria-expanded="openDesktopGroup === item.label"
                    @click="toggleDesktopGroup(item.label)"
                  >
                    <span>{{ item.label }}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      class="site-header__chevron"
                      :class="{ 'is-rotated': openDesktopGroup === item.label }"
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

                  <Transition name="site-header-panel">
                    <div
                      v-if="openDesktopGroup === item.label"
                      class="site-header__panel"
                      :class="{ 'is-scrollable': isDesktopPanelScrollable(item) }"
                    >
                      <p class="site-header__panel-caption">
                        {{ item.description }}
                      </p>
                      <ul class="site-header__panel-list">
                        <li
                          v-for="link in item.items"
                          :key="link.href"
                        >
                          <a
                            :href="link.href"
                            :aria-current="isLinkActive(link.href) ? 'page' : undefined"
                            class="site-header__panel-link"
                            :class="{ 'is-active': isLinkActive(link.href) }"
                            @click="closeAllMenus"
                          >
                            <span class="site-header__panel-link-label">{{ link.label }}</span>
                            <span
                              v-if="link.description"
                              class="site-header__panel-link-description"
                            >
                              {{ link.description }}
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </Transition>
                </div>

                <a
                  v-else
                  :href="item.href"
                  :aria-current="isLinkActive(item.href) ? 'page' : undefined"
                  class="site-header__rail-button"
                  :class="{ 'is-active': isDesktopItemActive(item) }"
                  @click="closeAllMenus"
                >
                  {{ item.label }}
                </a>
              </template>
            </div>
          </nav>

          <div class="site-header__actions">
            <a
              href="/kontakty/#lead-form"
              class="site-header__cta button-link"
              data-tracking-event="click_calculate"
              @click="closeAllMenus"
            >
              {{ calculateLabel }}
            </a>
          </div>

          <div
            ref="mobileMenuRef"
            class="site-header__mobile"
          >
            <button
              type="button"
              class="site-header__menu-toggle"
              :aria-label="isMobileMenuOpen ? closeMenuLabel : openMenuLabel"
              :aria-expanded="isMobileMenuOpen"
              @click="toggleMobileMenu"
            >
              <span class="site-header__menu-toggle-text">{{ menuLabel }}</span>
              <span class="site-header__menu-toggle-icon">
                <svg
                  v-show="!isMobileMenuOpen"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  class="site-header__menu-icon"
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
                  class="site-header__menu-icon"
                >
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.8"
                  />
                </svg>
              </span>
            </button>

            <Transition name="site-header-drawer">
              <div
                v-if="isMobileMenuOpen"
                class="site-header__drawer"
              >
                <nav
                  :aria-label="mobileNavLabel"
                  class="site-header__mobile-nav"
                >
                  <template
                    v-for="item in primaryNavigation"
                    :key="item.label"
                  >
                    <div
                      v-if="isGroup(item)"
                      class="site-header__mobile-group"
                      :class="{ 'is-open': isMobileGroupOpen(item) }"
                    >
                      <button
                        type="button"
                        class="site-header__mobile-summary"
                        :class="{ 'is-active': isMobileItemActive(item) }"
                        :aria-expanded="isMobileGroupOpen(item)"
                        @click="toggleMobileGroup(item.label)"
                      >
                        <span>{{ item.label }}</span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          class="site-header__chevron"
                          :class="{ 'is-rotated': isMobileGroupOpen(item) }"
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

                      <Transition name="site-header-panel">
                        <ul
                          v-if="isMobileGroupOpen(item)"
                          class="site-header__mobile-group-list"
                        >
                          <li
                            v-for="link in item.items"
                            :key="link.href"
                          >
                            <a
                              :href="link.href"
                              :aria-current="isLinkActive(link.href) ? 'page' : undefined"
                              class="site-header__mobile-link"
                              :class="{ 'is-active': isLinkActive(link.href) }"
                              @click="closeAllMenus"
                            >
                              <span class="site-header__mobile-link-label">{{ link.label }}</span>
                              <span
                                v-if="link.description"
                                class="site-header__mobile-link-description"
                              >
                                {{ link.description }}
                              </span>
                            </a>
                          </li>
                        </ul>
                      </Transition>
                    </div>

                    <a
                      v-else
                      :href="item.href"
                      :aria-current="isLinkActive(item.href) ? 'page' : undefined"
                      class="site-header__mobile-link"
                      :class="{ 'is-active': isLinkActive(item.href) }"
                      @click="closeAllMenus"
                    >
                      {{ item.label }}
                    </a>
                  </template>

                  <a
                    href="/kontakty/#lead-form"
                    class="site-header__mobile-cta"
                    data-tracking-event="click_calculate"
                    @click="closeAllMenus"
                  >
                    {{ calculateProjectLabel }}
                  </a>
                </nav>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Container>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  padding: 0.58rem 0 0.72rem;
  transition:
    padding 980ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 980ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header--home {
  position: fixed;
  inset: 0 0 auto;
  padding-top: 0.95rem;
  padding-bottom: 0;
}

.site-header--condensed {
  padding-top: 0.34rem;
  padding-bottom: 0.5rem;
}

.site-header__container {
  position: relative;
  z-index: 2;
  max-width: none;
  padding-inline: 0.8rem;
  pointer-events: none;
}

.site-header__shell {
  position: relative;
  isolation: isolate;
  max-width: 82rem;
  margin-inline: auto;
  transition: max-width 1100ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__shell::before {
  content: none;
}

.site-header__shell::after {
  content: "";
  position: absolute;
  left: 1.2rem;
  right: 1.2rem;
  bottom: -0.72rem;
  height: 0.82rem;
  background: radial-gradient(ellipse at center, var(--color-shell-shadow-plane) 0%, rgba(31, 45, 34, 0.08) 42%, rgba(31, 45, 34, 0) 82%);
  filter: blur(8px);
  opacity: 0.5;
  pointer-events: none;
  transition:
    opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__face {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.72rem;
  min-height: 4rem;
  padding: 0.46rem 0.54rem 0.5rem;
  border: 1px solid rgba(212, 208, 199, 0.72);
  border-radius: 1.4rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(244, 241, 232, 0.9)),
    var(--color-shell-face);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.42),
    0 18px 38px rgba(17, 22, 28, 0.1);
  backdrop-filter: blur(16px) saturate(1.08);
  isolation: isolate;
  transition:
    opacity 820ms cubic-bezier(0.22, 1, 0.36, 1),
    min-height 820ms cubic-bezier(0.22, 1, 0.36, 1),
    padding 820ms cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 820ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 940ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 820ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 820ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 820ms cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: auto;
}

.site-header__face::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: calc(1.4rem - 1px);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.14) 22%, rgba(142, 218, 228, 0.03) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    inset 0 0 0 1px rgba(244, 241, 232, 0.18),
    inset 0 -1px 0 rgba(199, 193, 182, 0.1);
  pointer-events: none;
  transition:
    opacity 820ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 820ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__face::after {
  content: none;
}

.site-header--home .site-header__face {
  min-height: 4.25rem;
  padding: 0.34rem 0.4rem;
}

.site-header--condensed .site-header__face {
  min-height: 3.86rem;
  padding: 0.28rem 0.34rem;
  border-radius: 1.2rem;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.34),
    0 14px 28px rgba(17, 22, 28, 0.08);
}

.site-header--condensed .site-header__face::before {
  border-radius: calc(1.2rem - 1px);
}

.site-header--condensed .site-header__brand {
  gap: 0.58rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}

.site-header--condensed .site-header__brand-copy {
  gap: 0;
}

.site-header--condensed .site-header__brand-name {
  font-size: 0.82rem;
  line-height: 1;
}

.site-header--condensed .site-header__brand-tagline {
  display: none;
}

.site-header--condensed .site-header__shell::after {
  bottom: -0.54rem;
  height: 0.68rem;
}

.site-header__brand,
.site-header__hero-action,
.site-header__rail-button,
.site-header__cta,
.site-header__menu-toggle,
.site-header__panel-link,
.site-header__mobile-summary,
.site-header__mobile-link,
.site-header__mobile-cta {
  transition:
    opacity 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    color 180ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__brand:focus-visible,
.site-header__rail-button:focus-visible,
.site-header__cta:focus-visible,
.site-header__menu-toggle:focus-visible,
.site-header__panel-link:focus-visible,
.site-header__mobile-summary:focus-visible,
.site-header__mobile-link:focus-visible,
.site-header__mobile-cta:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px rgba(142, 218, 228, 0.48),
    0 0 0 4px rgba(142, 218, 228, 0.18);
}

.site-header__brand {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.68rem;
  padding: 0.18rem 0.22rem 0.18rem 0.18rem;
  color: var(--color-shell-ink);
  text-decoration: none;
  transition:
    opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
    color 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__brand:hover {
  transform: translateY(-1px);
}

.site-header__brand-plaque {
  position: relative;
  display: grid;
  width: 2.8rem;
  height: 2.8rem;
  place-items: center;
  border: 1px solid var(--color-shell-edge);
  border-radius: 0.42rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(251, 250, 247, 0.94) 56%, rgba(244, 241, 232, 0.98)),
    var(--color-shell-face-strong);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    inset 0 -1px 0 rgba(199, 193, 182, 0.12),
    inset 1px 0 0 rgba(212, 208, 199, 0.12),
    inset -1px 0 0 rgba(212, 208, 199, 0.12),
    0 8px 16px rgba(17, 22, 28, 0.08);
  overflow: hidden;
}

.site-header__brand-plaque::after {
  content: "";
  position: absolute;
  inset: 0.16rem;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 0.24rem;
  pointer-events: none;
}

.site-header__brand-monogram {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-header__brand-copy {
  display: grid;
  min-width: 0;
  gap: 0.12rem;
  transition:
    opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__brand-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.site-header__brand-tagline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-shell-muted);
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.site-header__nav--desktop,
.site-header__actions {
  display: none;
}

.site-header__hero-action-wrap {
  display: none;
}

.site-header--home .site-header__brand {
  transform: translateY(-1px);
}

.site-header--home .site-header__brand-copy {
  opacity: 0.94;
}

.site-header--home-minimal .site-header__shell {
  max-width: 100%;
}

.site-header--home-minimal .site-header__shell::after {
  opacity: 0;
  transform: translateY(-0.2rem);
}

.site-header--home-minimal .site-header__face {
  min-height: 0;
  padding: 0;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  transform: translateY(0);
}

.site-header--home-minimal .site-header__face::before {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.site-header--home-minimal .site-header__brand {
  padding: 0.12rem 0.22rem 0.12rem 0.12rem;
}

.site-header--home-minimal .site-header__brand-plaque {
  width: 2.42rem;
  height: 2.42rem;
  border-radius: 0.88rem;
  border-color: rgba(244, 241, 232, 0.3);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(244, 241, 232, 0.08)),
    rgba(19, 24, 29, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.26),
    0 8px 22px rgba(8, 11, 16, 0.18);
  backdrop-filter: blur(8px) saturate(1.04);
}

.site-header--home-minimal .site-header__brand-plaque::after {
  border-color: rgba(255, 255, 255, 0.22);
}

.site-header--home-minimal .site-header__brand-monogram,
.site-header--home-minimal .site-header__brand-name,
.site-header--home-minimal .site-header__brand-tagline {
  color: rgba(251, 250, 247, 0.95);
}

.site-header--home-minimal .site-header__brand-tagline {
  opacity: 0.76;
}

.site-header--home-minimal .site-header__nav--desktop,
.site-header--home-minimal .site-header__actions {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-0.75rem);
  width: 0;
  min-width: 0;
  margin: 0;
  overflow: hidden;
}

.site-header--home-revealed .site-header__shell,
.site-header--home.site-header--menu-open .site-header__shell {
  max-width: 76rem;
}

.site-header--home.site-header--menu-open .site-header__face {
  min-height: 4rem;
  padding: 0.4rem 0.46rem;
  border-color: rgba(212, 208, 199, 0.72);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(244, 241, 232, 0.9)),
    var(--color-shell-face);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.42),
    0 18px 38px rgba(17, 22, 28, 0.1);
  backdrop-filter: blur(16px) saturate(1.08);
}

.site-header--home-revealed .site-header__face,
.site-header--home.site-header--menu-open .site-header__face {
  transform: translateY(0);
}

.site-header--home-revealed .site-header__face::before,
.site-header--home.site-header--menu-open .site-header__face::before {
  opacity: 1;
  transform: translateY(0);
}

.site-header--home-revealed .site-header__brand {
  transition-delay: 70ms;
}

.site-header--home.site-header--menu-open .site-header__brand-monogram,
.site-header--home.site-header--menu-open .site-header__brand-name {
  color: var(--color-shell-ink);
}

.site-header--home.site-header--menu-open .site-header__brand-tagline {
  color: var(--color-shell-muted);
  opacity: 1;
}

.site-header--home-revealed .site-header__brand-copy {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 90ms;
}

.site-header__mobile {
  position: relative;
  z-index: 3;
  margin-left: auto;
  transition:
    opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__hero-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.7rem;
  padding: 0 0.92rem;
  border: 1px solid rgba(244, 241, 232, 0.26);
  border-radius: 999px;
  --button-link-base-color: rgba(19, 24, 29, 0.18);
  --button-link-base-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(244, 241, 232, 0.06));
  --button-link-hover-image: linear-gradient(120deg, rgba(216, 95, 59, 0.9), rgba(8, 11, 16, 0.7));
  --button-link-text: rgba(251, 250, 247, 0.94);
  --button-link-hover-text: rgba(251, 250, 247, 0.98);
  --button-link-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 10px 24px rgba(8, 11, 16, 0.16);
  --button-link-hover-border: rgba(216, 95, 59, 0.58);
  --button-link-hover-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 14px 28px rgba(8, 11, 16, 0.2);
  font-size: 0.64rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.18em;
  text-decoration: none;
  text-transform: uppercase;
  backdrop-filter: blur(10px) saturate(1.02);
}

.site-header__menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.95rem;
  padding: 0 0.76rem 0 0.84rem;
  border: 1px solid var(--color-shell-edge);
  border-radius: 0.4rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(244, 241, 232, 0.9) 60%, rgba(242, 240, 234, 0.96)),
    var(--color-shell-face);
  color: var(--color-shell-ink);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    inset 1px 0 0 rgba(212, 208, 199, 0.12),
    inset -1px 0 0 rgba(212, 208, 199, 0.12),
    0 8px 16px rgba(17, 22, 28, 0.08);
}

.site-header--home-minimal .site-header__menu-toggle {
  border-color: rgba(244, 241, 232, 0.22);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(244, 241, 232, 0.04)),
    rgba(19, 24, 29, 0.18);
  color: rgba(251, 250, 247, 0.94);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 10px 24px rgba(8, 11, 16, 0.16);
  backdrop-filter: blur(10px) saturate(1.02);
}

.site-header--home-minimal .site-header__menu-toggle-icon {
  background: rgba(216, 95, 59, 0.16);
}

.site-header__menu-toggle:hover,
.site-header__menu-toggle[aria-expanded="true"] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(251, 250, 247, 0.98), rgba(244, 241, 232, 0.94)),
    var(--color-shell-face-strong);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 14px 24px rgba(17, 22, 28, 0.12);
}

.site-header__menu-toggle-text {
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.site-header__menu-toggle-icon {
  display: grid;
  width: 1.72rem;
  height: 1.72rem;
  place-items: center;
  border-radius: 0.34rem;
  background: rgba(216, 95, 59, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    inset 1px 0 0 rgba(255, 255, 255, 0.12),
    inset -1px 0 0 rgba(199, 193, 182, 0.12);
}

.site-header__menu-icon {
  width: 1rem;
  height: 1rem;
}

.site-header__drawer {
  position: absolute;
  top: calc(100% + 0.9rem);
  right: 0;
  width: min(24rem, calc(100vw - 1.5rem));
  padding: 0.78rem;
  border: 1px solid rgba(212, 208, 199, 0.68);
  border-radius: 0.56rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(251, 250, 247, 0.98) 46%, rgba(244, 241, 232, 0.98)),
    var(--color-shell-face);
  box-shadow:
    0 18px 36px rgba(17, 22, 28, 0.12),
    0 8px 16px rgba(17, 22, 28, 0.06);
  isolation: isolate;
}

.site-header__drawer::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: calc(0.56rem - 1px);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.12) 20%, rgba(142, 218, 228, 0.03) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(199, 193, 182, 0.08);
  pointer-events: none;
}

.site-header__drawer::after { content: none; }

.site-header__mobile-nav {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.55rem;
}

.site-header__mobile-group {
  display: grid;
  gap: 0.45rem;
  padding: 0.25rem;
  border: 1px solid rgba(212, 208, 199, 0.44);
  border-radius: 0.38rem;
  background: rgba(244, 241, 232, 0.54);
}

.site-header__mobile-group.is-open {
  background: rgba(251, 250, 247, 0.76);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.52);
}

.site-header__mobile-summary,
.site-header__mobile-link {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.95rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.34rem;
  color: var(--color-shell-ink);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
}

.site-header__mobile-summary:hover,
.site-header__mobile-link:hover,
.site-header__mobile-summary.is-active,
.site-header__mobile-link.is-active {
  border-color: rgba(216, 95, 59, 0.2);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(244, 241, 232, 0.34));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 10px 18px rgba(17, 22, 28, 0.06);
}

.site-header__mobile-group-list {
  display: grid;
  gap: 0.45rem;
}

.site-header__mobile-link {
  justify-content: flex-start;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 0.9rem;
}

.site-header__mobile-link-label {
  font-weight: 700;
}

.site-header__mobile-link-description {
  display: block;
  margin-top: 0.22rem;
  color: var(--color-shell-muted);
  font-size: 0.74rem;
  line-height: 1.45;
}

.site-header__mobile-cta {
  display: inline-flex;
  min-height: 3.6rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
  padding: 0 1.2rem;
  border: 1px solid rgba(216, 95, 59, 0.34);
  border-radius: 0.4rem;
  background:
    linear-gradient(180deg, rgba(216, 95, 59, 0.96), rgba(198, 90, 58, 0.98) 56%, rgba(198, 90, 58, 0.98)),
    var(--color-shell-face-strong);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    inset 1px 0 0 rgba(212, 208, 199, 0.12),
    inset -1px 0 0 rgba(212, 208, 199, 0.12),
    0 16px 28px rgba(198, 90, 58, 0.18);
}

.site-header__mobile-cta:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 18px 30px rgba(198, 90, 58, 0.22);
}

.site-header__scrim {
  position: fixed;
  inset: 0;
  z-index: 1;
  border: 0;
  background: rgba(8, 10, 14, 0.42);
}

.site-header__chevron {
  width: 0.8rem;
  height: 0.8rem;
  flex-shrink: 0;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__chevron.is-rotated {
  transform: rotate(180deg);
}

.site-header-panel-enter-active,
.site-header-panel-leave-active,
.site-header-drawer-enter-active,
.site-header-drawer-leave-active,
.site-header-scrim-enter-active,
.site-header-scrim-leave-active {
  transition:
    opacity 180ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header-panel-enter-from,
.site-header-panel-leave-to,
.site-header-drawer-enter-from,
.site-header-drawer-leave-to,
.site-header-scrim-enter-from,
.site-header-scrim-leave-to {
  opacity: 0;
}

.site-header-panel-enter-from,
.site-header-panel-leave-to,
.site-header-drawer-enter-from,
.site-header-drawer-leave-to {
  transform: translateY(-0.45rem);
}

@media (min-width: 1024px) {
  .site-header__face {
    display: flex;
    align-items: center;
    width: fit-content;
    max-width: min(100%, 76rem);
    margin-inline: auto;
    gap: 0.72rem;
    justify-content: start;
    flex-wrap: nowrap;
  }

  .site-header__brand {
    flex: 0 0 auto;
  }

  .site-header__nav--desktop,
  .site-header__actions {
    display: block;
    transition:
      max-width 960ms cubic-bezier(0.22, 1, 0.36, 1),
      margin-left 820ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
    overflow: visible;
  }

  .site-header__nav--desktop {
    flex: 0 0 auto;
    margin-left: 0.95rem;
    max-width: 56rem;
  }

  .site-header__actions,
  .site-header__hero-action-wrap {
    flex: 0 0 auto;
  }

  .site-header__mobile {
    display: none;
  }

  .site-header__hero-action-wrap {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    transition:
      max-width 860ms cubic-bezier(0.22, 1, 0.36, 1),
      margin-left 760ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 680ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
    max-width: 10rem;
    overflow: visible;
  }

  .site-header__actions {
    margin-left: 0.95rem;
    max-width: 12rem;
  }

  .site-header--home-minimal .site-header__face {
    width: 100%;
    max-width: none;
    margin-inline: 0;
    justify-content: space-between;
  }

  .site-header--home-minimal .site-header__nav--desktop,
  .site-header--home-minimal .site-header__actions {
    max-width: 0;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-0.7rem);
    margin-left: 0;
    overflow: hidden;
  }

  .site-header--home-minimal .site-header__hero-action-wrap {
    max-width: 10rem;
    opacity: 1;
    margin-left: auto;
    justify-content: flex-end;
    pointer-events: auto;
    transform: translateY(0);
  }

  .site-header--home-revealed .site-header__hero-action-wrap {
    max-width: 0;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-0.6rem);
    margin-left: 0;
    overflow: hidden;
  }

  .site-header--home-revealed .site-header__nav--desktop {
    max-width: 56rem;
    opacity: 1;
    transform: translateY(0);
    overflow: visible;
    transition-delay: 360ms;
  }

  .site-header--home-revealed .site-header__actions {
    max-width: 12rem;
    opacity: 1;
    transform: translateY(0);
    overflow: visible;
    transition-delay: 520ms;
  }

  .site-header__rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    align-items: center;
    gap: 0.28rem;
    min-height: 3.3rem;
    padding: 0.2rem;
    border: 1px solid rgba(212, 208, 199, 0.46);
    border-radius: 0.46rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.06)),
      rgba(244, 241, 232, 0.68);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(199, 193, 182, 0.08);
  }

  .site-header--condensed .site-header__rail {
    min-height: 3rem;
  }

  .site-header__group {
    position: relative;
  }

  .site-header__rail-button {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    min-height: 2.72rem;
    padding: 0 0.86rem;
    border: 1px solid transparent;
    border-radius: 0.32rem;
    background: transparent;
    color: var(--color-shell-muted);
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.16em;
    text-decoration: none;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .site-header--condensed .site-header__rail-button {
    min-height: 2.46rem;
    padding-inline: 0.74rem;
  }

  .site-header__rail-button:hover,
  .site-header__rail-button.is-active {
    border-color: rgba(216, 95, 59, 0.24);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.62), rgba(244, 241, 232, 0.3));
    color: var(--color-shell-ink);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      0 10px 16px rgba(17, 22, 28, 0.06);
  }

  .site-header__panel {
    position: absolute;
    left: 0;
    top: calc(100% + 0.68rem);
    z-index: 5;
    width: min(24rem, calc(100vw - 4rem));
    padding: 0.7rem;
    border: 1px solid rgba(212, 208, 199, 0.62);
    border-radius: 0.56rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(251, 250, 247, 0.98) 48%, rgba(244, 241, 232, 0.98)),
      var(--color-shell-face);
    box-shadow:
      0 18px 32px rgba(17, 22, 28, 0.12),
      0 8px 14px rgba(17, 22, 28, 0.06);
  }

  .site-header__panel::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: calc(0.56rem - 1px);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.1) 20%, rgba(142, 218, 228, 0.03) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.88),
      inset 0 -1px 0 rgba(199, 193, 182, 0.08);
    pointer-events: none;
  }

  .site-header__panel.is-scrollable {
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 0.45rem;
    scrollbar-color: rgba(199, 193, 182, 0.88) rgba(19, 24, 29, 0.06);
    scrollbar-width: thin;
  }

  .site-header__panel.is-scrollable::-webkit-scrollbar {
    width: 12px;
  }

  .site-header__panel.is-scrollable::-webkit-scrollbar-track {
    background: rgba(19, 24, 29, 0.06);
    border-radius: 9999px;
  }

  .site-header__panel.is-scrollable::-webkit-scrollbar-thumb {
    background: rgba(199, 193, 182, 0.88);
    border: 2px solid rgba(251, 250, 247, 0.95);
    border-radius: 9999px;
  }

  .site-header__panel-caption,
  .site-header__panel-list {
    position: relative;
    z-index: 1;
  }

  .site-header__panel-caption {
    padding: 0.66rem 0.82rem 0.78rem;
    border-bottom: 1px solid rgba(199, 193, 182, 0.24);
    color: rgba(75, 83, 92, 0.74);
    font-size: 0.64rem;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .site-header__panel-list {
    display: grid;
    gap: 0.42rem;
    padding-top: 0.52rem;
  }

  .site-header__panel-link {
    display: block;
    padding: 0.9rem 0.96rem;
    border: 1px solid transparent;
    border-radius: 0.36rem;
    color: var(--color-shell-ink);
    text-decoration: none;
  }

  .site-header__panel-link:hover,
  .site-header__panel-link.is-active {
    border-color: rgba(216, 95, 59, 0.24);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(244, 241, 232, 0.28));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }

  .site-header__panel-link-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .site-header__panel-link-description {
    display: block;
    margin-top: 0.35rem;
    color: var(--color-shell-muted);
    font-size: 0.76rem;
    line-height: 1.48;
  }

  .site-header__cta {
    display: inline-flex;
    min-height: 3.3rem;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    border: 1px solid rgba(216, 95, 59, 0.34);
    border-radius: 0.42rem;
    --button-link-base-color: var(--color-shell-face-strong);
    --button-link-base-image: linear-gradient(180deg, rgba(216, 95, 59, 0.96), rgba(198, 90, 58, 0.98) 56%, rgba(198, 90, 58, 0.98));
    --button-link-hover-image: linear-gradient(120deg, rgba(17, 22, 28, 0.94), rgba(216, 95, 59, 0.88));
    --button-link-text: #ffffff;
    --button-link-hover-text: #ffffff;
    --button-link-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(198, 90, 58, 0.12),
      0 18px 30px rgba(198, 90, 58, 0.22);
    --button-link-hover-border: rgba(17, 22, 28, 0.44);
    --button-link-hover-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(198, 90, 58, 0.12),
      0 22px 34px rgba(17, 22, 28, 0.18);
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: 0.16em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .site-header--condensed .site-header__cta {
    min-height: 2.92rem;
    padding-inline: 0.9rem;
  }
}

@media (max-width: 767px) {
  .site-header__container {
    padding-inline: 0.55rem;
  }

  .site-header {
    padding-bottom: 0.72rem;
  }

  .site-header__face {
    min-height: 4.1rem;
    padding: 0.38rem 0.42rem 0.46rem;
    border-radius: 0.58rem;
  }

  .site-header__face::before {
    border-radius: calc(0.58rem - 1px);
  }

  .site-header__shell::after {
    left: 0.7rem;
    right: 0.6rem;
    bottom: -1.12rem;
    height: 1.18rem;
  }

  .site-header--home .site-header__face {
    min-height: 4.45rem;
  }

  .site-header__brand {
    gap: 0.58rem;
    padding-right: 0;
  }

  .site-header__brand-plaque {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.36rem;
  }

  .site-header__brand-plaque::after {
    border-radius: 0.2rem;
  }

  .site-header__brand-name {
    font-size: 0.78rem;
  }

  .site-header__brand-tagline {
    max-width: 10.5rem;
    font-size: 0.58rem;
  }

  .site-header__menu-toggle {
    min-height: 2.68rem;
    padding-inline: 0.62rem;
  }

  .site-header__menu-toggle-text {
    display: none;
  }
}

@media (min-width: 768px) {
  .site-header__container {
    padding-inline: 0.72rem;
  }
}

@media (min-width: 1280px) {
  .site-header__container {
    padding-inline: 0.86rem;
  }
}
</style>



