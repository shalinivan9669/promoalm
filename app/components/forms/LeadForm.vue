<script setup lang="ts">
import { serviceCards } from "../../data/services";

const props = withDefaults(
  defineProps<{
    sourcePage: string;
    presetTaskType?: string;
    presetCity?: string;
    showLocations?: boolean;
  }>(),
  {
    presetTaskType: "",
    presetCity: "",
    showLocations: false
  }
);

const taskOptions = computed(() => [
  { label: "Общий запрос", value: "Общий запрос" },
  ...serviceCards
    .filter((item) => item.status === "published")
    .map((item) => ({
      label: item.title,
      value: item.title
    }))
]);

const cityOptions = [
  { label: "Не указывать", value: "" },
  { label: "Алматы", value: "Алматы" },
  { label: "Астана", value: "Астана" },
  { label: "Шымкент", value: "Шымкент" },
  { label: "Другой город", value: "Другой город" }
];

const { form, errors, status, errorMessage, successMessage, submit, resetForm } = useLeadForm({
  sourcePage: props.sourcePage,
  presetTaskType: props.presetTaskType || undefined,
  presetCity: props.presetCity || undefined
});

const showTaskType = computed(() => !props.presetTaskType);
const showLocationsCount = computed(() => props.showLocations || /сети|сеть/i.test(form.taskType));

async function handleSubmit() {
  await submit();
}
</script>

<template>
  <div
    id="lead-form"
    class="surface p-6 sm:p-8"
  >
    <div
      v-if="status === 'success'"
      class="flex flex-col gap-4"
    >
      <p class="eyebrow">Заявка принята</p>
      <h3 class="text-2xl font-semibold text-white">
        {{ successMessage }}
      </h3>
      <p class="text-sm leading-6 text-muted">
        Если номер для WhatsApp и телефона ещё не подключён, ответ пойдёт по каналу, который владелец добавит перед запуском. Для боевого запуска замените placeholder-контакты в `app/data/site.ts`.
      </p>
      <div class="flex flex-wrap gap-3">
        <ButtonLink
          href="/cases/"
          label="Смотреть кейсы"
          intent="secondary"
        />
        <button
          type="button"
          class="inline-flex items-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
          @click="resetForm"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    </div>

    <form
      v-else
      class="grid gap-5"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-5 md:grid-cols-2">
        <FormField
          label="Имя или компания"
          :error="errors.name"
          required
        >
          <InputField
            v-model="form.name"
            autocomplete="name"
            placeholder="Например, Арман / Coffee Point"
          />
        </FormField>

        <FormField
          label="Телефон или WhatsApp"
          :error="errors.contact"
          required
        >
          <InputField
            v-model="form.contact"
            autocomplete="tel"
            placeholder="+7 7XX XXX XX XX"
          />
        </FormField>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <FormField
          label="Город"
          hint="Можно не указывать, если вы уже на странице города."
          :error="errors.city"
        >
          <SelectField
            v-model="form.city"
            :options="cityOptions"
          />
        </FormField>

        <FormField
          label="Предпочтительный канал"
          :error="errors.preferredChannel"
        >
          <SelectField
            v-model="form.preferredChannel"
            :options="[
              { label: 'WhatsApp', value: 'whatsapp' },
              { label: 'Телефон', value: 'phone' }
            ]"
          />
        </FormField>
      </div>

      <FormField
        v-if="showTaskType"
        label="Тип задачи"
        :error="errors.taskType"
      >
        <SelectField
          v-model="form.taskType"
          :options="taskOptions"
        />
      </FormField>

      <FormField
        label="Коротко о задаче"
        :error="errors.message"
        required
      >
        <TextareaField
          v-model="form.message"
          placeholder="Что нужно сделать, для какого объекта, какой город и нужен ли монтаж."
        />
      </FormField>

      <FormField
        v-if="showLocationsCount"
        label="Количество точек"
        hint="Показываем это поле только для сетевых сценариев."
        :error="errors.locationsCount"
      >
        <InputField
          v-model="form.locationsCount as unknown as string"
          type="number"
          placeholder="Например, 5"
        />
      </FormField>

      <CheckboxField v-model="form.needsInstallation">
        Нужен монтаж или установка по объекту
      </CheckboxField>

      <input
        v-model="form.hp"
        type="text"
        tabindex="-1"
        autocomplete="off"
        class="hidden"
        aria-hidden="true"
      >

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="status === 'loading'"
        >
          {{ status === "loading" ? "Отправляем..." : "Отправить заявку" }}
        </button>
        <p class="text-xs leading-5 text-muted">
          Отправляя заявку, вы соглашаетесь с
          <NuxtLink
            to="/politika-konfidentsialnosti/"
            class="text-white underline decoration-line underline-offset-4"
          >
            политикой обработки данных
          </NuxtLink>.
        </p>
      </div>

      <p
        v-if="status === 'error'"
        class="text-sm text-danger"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>
