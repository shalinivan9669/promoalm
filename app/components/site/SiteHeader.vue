<script setup lang="ts">
import { primaryNavigation } from "../../data/navigation";

const menuOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/70 bg-canvas/88 backdrop-blur-xl">
    <Container class="flex items-center justify-between gap-6 py-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-panel text-lg font-semibold text-white">
          N
        </span>
        <span class="flex flex-col">
          <span class="text-sm font-semibold text-white">Neon Market</span>
          <span class="text-xs text-muted">Вывески для бизнеса</span>
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 lg:flex">
        <NuxtLink
          v-for="item in primaryNavigation"
          :key="item.href"
          :to="item.href"
          class="text-sm text-muted transition hover:text-white"
        >
          {{ item.label }}
        </NuxtLink>
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

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white lg:hidden"
        aria-label="Открыть меню"
        @click="menuOpen = !menuOpen"
      >
        <span class="font-mono text-sm">{{ menuOpen ? "×" : "≡" }}</span>
      </button>
    </Container>

    <div
      v-if="menuOpen"
      class="border-t border-line lg:hidden"
    >
      <Container class="flex flex-col gap-3 py-4">
        <NuxtLink
          v-for="item in primaryNavigation"
          :key="item.href"
          :to="item.href"
          class="rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-white"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <ButtonLink
          href="/kontakty/#lead-form"
          label="Рассчитать проект"
          intent="calculate"
          tracking-event="click_calculate"
          block
        />
      </Container>
    </div>
  </header>
</template>
