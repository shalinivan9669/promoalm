<script setup lang="ts">
import { footerNavigation } from "../../data/navigation";
import { contactInfo } from "../../data/site";
import { normalizePathForMatch } from "../../utils/routes";

const route = useRoute();
const currentYear = new Date().getFullYear();
const currentPath = computed(() => normalizePathForMatch(route.path));
const whatsappChannel = contactInfo.channels.find((item) => item.type === "whatsapp");
const phoneChannel = contactInfo.channels.find((item) => item.type === "phone");
const emailChannel = contactInfo.channels.find((item) => item.type === "email");

function isCurrentPath(href: string) {
  return currentPath.value === normalizePathForMatch(href);
}

function footerLinkClass(href: string) {
  return isCurrentPath(href)
    ? "text-sm text-[color:var(--color-surface)] underline decoration-accent underline-offset-4"
    : "text-sm text-[color:rgba(244,241,232,0.72)] transition hover:text-[color:var(--color-surface)]";
}
</script>

<template>
  <footer
    class="section-divider mt-20 bg-[color:var(--color-surface-dark)] pb-28 pt-12 text-[color:var(--color-surface)] lg:pb-12"
    data-companion-footer-zone
  >
    <Container class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_repeat(4,minmax(0,1fr))]">
      <div class="max-w-sm">
        <p class="text-xl font-semibold text-[color:var(--color-surface)]">Neon Market</p>
        <p class="mt-4 text-sm leading-6 text-[color:rgba(244,241,232,0.72)]">
          Производитель световых и фасадных вывесок для бизнеса по Казахстану: макет, производство,
          доставка и монтаж.
        </p>
        <ul class="mt-6 space-y-2 text-sm text-[color:rgba(244,241,232,0.72)]">
          <li>{{ contactInfo.minOrder }}</li>
          <li>{{ contactInfo.leadTime }}</li>
          <li>{{ contactInfo.warranty }}</li>
        </ul>
        <p class="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-surface)]">Контакты</p>
        <ul class="mt-4 space-y-2 text-sm text-[color:rgba(244,241,232,0.72)]">
          <li v-if="whatsappChannel?.href">
            <a
              :href="whatsappChannel.href"
              class="transition hover:text-[color:var(--color-surface)]"
            >
              WhatsApp: {{ whatsappChannel.value }}
            </a>
          </li>
          <li v-if="phoneChannel?.href">
            <a
              :href="phoneChannel.href"
              class="transition hover:text-[color:var(--color-surface)]"
            >
              {{ phoneChannel.label }}: {{ phoneChannel.value }}
            </a>
          </li>
          <li v-if="emailChannel?.href">
            <a
              :href="emailChannel.href"
              class="transition hover:text-[color:var(--color-surface)]"
            >
              {{ emailChannel.label }}: {{ emailChannel.value }}
            </a>
          </li>
          <li v-if="contactInfo.address">
            Адрес: {{ contactInfo.address }}
          </li>
          <li v-if="contactInfo.workingHours">
            Часы работы: {{ contactInfo.workingHours }}
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-surface)]">Услуги</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.services"
            :key="item.href"
          >
            <a
              :href="item.href"
              :aria-current="isCurrentPath(item.href) ? 'page' : undefined"
              :class="footerLinkClass(item.href)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-surface)]">Условия</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.support"
            :key="item.href"
          >
            <a
              :href="item.href"
              :aria-current="isCurrentPath(item.href) ? 'page' : undefined"
              :class="footerLinkClass(item.href)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-surface)]">Города</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.cities"
            :key="item.href"
          >
            <a
              :href="item.href"
              :aria-current="isCurrentPath(item.href) ? 'page' : undefined"
              :class="footerLinkClass(item.href)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-surface)]">Компания</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.company"
            :key="item.href"
          >
            <a
              :href="item.href"
              :aria-current="isCurrentPath(item.href) ? 'page' : undefined"
              :class="footerLinkClass(item.href)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </Container>

    <Container class="mt-12 flex flex-col gap-4 border-t border-[color:rgba(244,241,232,0.12)] pt-6 text-xs text-[color:rgba(244,241,232,0.64)] sm:flex-row sm:items-center sm:justify-between">
      <p>© {{ currentYear }} Neon Market. {{ contactInfo.legalNote }}</p>
      <a
        href="/politika-konfidentsialnosti/"
        class="transition hover:text-[color:var(--color-surface)]"
      >
        Политика конфиденциальности
      </a>
    </Container>
  </footer>
</template>

