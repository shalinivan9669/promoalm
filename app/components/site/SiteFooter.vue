<script setup lang="ts">
import { footerNavigation } from "../../data/navigation";
import { contactInfo } from "../../data/site";
</script>

<template>
  <footer class="section-divider mt-20 pb-28 pt-12 lg:pb-12">
    <Container class="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
      <div class="max-w-sm">
        <p class="text-xl font-semibold text-white">Neon Market</p>
        <p class="mt-4 text-sm leading-6 text-muted">
          Производитель световых и фасадных вывесок для бизнеса по Казахстану: макет, производство, доставка и монтаж.
        </p>
        <ul class="mt-6 space-y-2 text-sm text-muted">
          <li>{{ contactInfo.minOrder }}</li>
          <li>{{ contactInfo.leadTime }}</li>
          <li>{{ contactInfo.warranty }}</li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-white">Услуги</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.services"
            :key="item.href"
          >
            <NuxtLink
              :to="item.href"
              class="text-sm text-muted transition hover:text-white"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-white">Условия</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.support"
            :key="item.href"
          >
            <NuxtLink
              :to="item.href"
              class="text-sm text-muted transition hover:text-white"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-white">Города</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in footerNavigation.cities"
            :key="item.href"
          >
            <NuxtLink
              :to="item.href"
              class="text-sm text-muted transition hover:text-white"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Container>

    <Container class="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>© {{ new Date().getFullYear() }} Neon Market. {{ contactInfo.legalNote }}</p>
      <NuxtLink
        to="/politika-konfidentsialnosti/"
        class="transition hover:text-white"
      >
        Политика конфиденциальности
      </NuxtLink>
    </Container>
  </footer>
</template>
