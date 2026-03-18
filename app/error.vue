<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    message?: string;
  };
}>();

const errorLabel = "\u041e\u0448\u0438\u0431\u043a\u0430";
const errorTitle = "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043d\u0435 \u043e\u0442\u043a\u0440\u044b\u043b\u0430\u0441\u044c.";
const errorFallback =
  "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0438\u043b\u0438 \u0432\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e. \u0415\u0441\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0430 \u043f\u043e\u0432\u0442\u043e\u0440\u044f\u0435\u0442\u0441\u044f, \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443 \u0447\u0435\u0440\u0435\u0437 \u0444\u043e\u0440\u043c\u0443.";
const homeLabel = "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e";
const contactLabel = "\u041e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443";
</script>

<template>
  <main class="min-h-screen bg-canvas px-6 py-24 text-ink">
    <div class="mx-auto flex max-w-3xl flex-col gap-6 rounded-4xl border border-line bg-panel p-8 shadow-soft">
      <p class="eyebrow">
        {{ errorLabel }} {{ props.error.statusCode ?? 500 }}
      </p>
      <h1 class="max-w-2xl font-[var(--font-display)] text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl">
        {{ errorTitle }}
      </h1>
      <p class="max-w-2xl text-[1rem] font-medium leading-[1.72] text-muted">
        {{ props.error.message || errorFallback }}
      </p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-full bg-accent px-5 py-3 font-sans text-sm font-semibold tracking-[0.01em] text-canvas transition hover:bg-accent-soft"
        >
          {{ homeLabel }}
        </NuxtLink>
        <NuxtLink
          to="/kontakty/"
          class="inline-flex items-center rounded-full border border-line px-5 py-3 font-sans text-sm font-semibold tracking-[0.01em] text-white transition hover:border-accent hover:text-accent"
        >
          {{ contactLabel }}
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
