<script setup lang="ts">
import { primaryNavigation } from "../../data/navigation";
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

      <nav class="hidden items-center gap-6 lg:flex">
        <a
          v-for="item in primaryNavigation"
          :key="item.href"
          :href="item.href"
          class="text-sm text-muted transition hover:text-white"
        >
          {{ item.label }}
        </a>
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
          <nav class="flex flex-col gap-3">
            <a
              v-for="item in primaryNavigation"
              :key="item.href"
              :href="item.href"
              class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white"
            >
              {{ item.label }}
            </a>
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
