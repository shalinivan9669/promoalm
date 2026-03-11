<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    message?: string;
  };
}>();
</script>

<template>
  <main class="min-h-screen bg-canvas px-6 py-24 text-ink">
    <div class="mx-auto flex max-w-3xl flex-col gap-6 rounded-4xl border border-line bg-panel p-8 shadow-soft">
      <p class="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        Ошибка {{ props.error.statusCode ?? 500 }}
      </p>
      <h1 class="max-w-2xl text-4xl font-semibold text-white sm:text-5xl">
        Страница не открылась.
      </h1>
      <p class="max-w-2xl text-base leading-7 text-muted">
        {{ props.error.message || "Проверьте адрес или вернитесь на главную. Если ошибка повторяется, отправьте заявку через форму." }}
      </p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-accent-soft"
        >
          На главную
        </NuxtLink>
        <NuxtLink
          to="/kontakty/"
          class="inline-flex items-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
        >
          Оставить заявку
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
