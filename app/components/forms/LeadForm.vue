<script setup lang="ts">
import type { LeadApiError } from "~~/shared/types/lead";
import { serviceCards } from "../../data/service-summaries";

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

const route = useRoute();
const startedAt = Date.now();
const leadStatus = computed(() => (Array.isArray(route.query.leadStatus) ? route.query.leadStatus[0] : route.query.leadStatus));
const leadReason = computed(() => (Array.isArray(route.query.leadReason) ? route.query.leadReason[0] : route.query.leadReason));
const isSuccess = computed(() => leadStatus.value === "success");
const showTaskType = !props.presetTaskType;
const showLocationsCount = props.showLocations || !props.presetTaskType;

const taskOptions = [
  { label: "Общий запрос", value: "Общий запрос" },
  ...serviceCards
    .filter((item) => item.status === "published")
    .map((item) => ({
      label: item.title,
      value: item.title
    }))
];

const cityOptions = [
  { label: "Не указывать", value: "" },
  { label: "Алматы", value: "Алматы" },
  { label: "Астана", value: "Астана" },
  { label: "Шымкент", value: "Шымкент" },
  { label: "Другой город", value: "Другой город" }
];

const errorMessages: Record<LeadApiError["reason"], string> = {
  validation: "Проверьте поля формы и попробуйте ещё раз.",
  honeypot: "Заявка отклонена. Попробуйте ещё раз без автозаполнения скрытых полей.",
  "too-fast": "Форма отправлена слишком быстро. Проверьте данные и попробуйте ещё раз.",
  "rate-limit": "Слишком много заявок с одного адреса. Попробуйте позже.",
  duplicate: "Похожая заявка уже была отправлена недавно. Если задача изменилась, отправьте обновлённые данные.",
  origin: "Не удалось подтвердить источник заявки. Попробуйте отправить форму заново.",
  agent: "Автоматические запросы отключены. Отправьте заявку вручную."
};

const errorMessage = computed(() => {
  if (leadStatus.value === "error" && leadReason.value && leadReason.value in errorMessages) {
    return errorMessages[leadReason.value as LeadApiError["reason"]];
  }

  if (leadStatus.value === "error") {
    return errorMessages.validation;
  }

  return "";
});
</script>

<template>
  <div
    id="lead-form"
    class="surface p-6 sm:p-8"
  >
    <div
      v-if="isSuccess"
      class="flex flex-col gap-4"
    >
      <p class="eyebrow">Заявка принята</p>
      <h3 class="text-2xl font-semibold text-white">
        Заявка принята. Следующий шаг: уточнение проекта и расчёт.
      </h3>
      <p class="text-sm leading-6 text-muted">
        Если прямой номер для WhatsApp и телефона ещё не подключён, ответ придёт по рабочему каналу,
        который владелец добавит перед запуском. Для боевого запуска замените placeholder-контакты в
        `app/data/site.ts`.
      </p>
      <div class="flex flex-wrap gap-3">
        <ButtonLink
          href="/cases/"
          label="Смотреть кейсы"
          intent="secondary"
        />
        <ButtonLink
          href="/kontakty/#lead-form"
          label="Отправить ещё одну заявку"
          intent="primary"
        />
      </div>
    </div>

    <form
      v-else
      action="/api/lead"
      method="post"
      class="grid gap-5"
    >
      <input
        type="hidden"
        name="sourcePage"
        :value="sourcePage"
      >
      <input
        type="hidden"
        name="startedAt"
        :value="startedAt"
      >

      <div class="grid gap-5 md:grid-cols-2">
        <FormField
          label="Имя или компания"
          required
        >
          <InputField
            name="name"
            autocomplete="name"
            placeholder="Например, Арман / Coffee Point"
            required
            minlength="2"
            maxlength="120"
          />
        </FormField>

        <FormField
          label="Телефон или WhatsApp"
          required
        >
          <InputField
            name="contact"
            autocomplete="tel"
            inputmode="tel"
            placeholder="+7 7XX XXX XX XX"
            required
            minlength="6"
            maxlength="40"
          />
        </FormField>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <FormField
          label="Город"
          hint="Можно не указывать, если вы уже на странице города."
        >
          <SelectField
            name="city"
            :options="cityOptions"
            :model-value="presetCity"
          />
        </FormField>

        <FormField label="Предпочтительный канал">
          <SelectField
            name="preferredChannel"
            model-value="whatsapp"
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
      >
        <SelectField
          name="taskType"
          model-value="Общий запрос"
          :options="taskOptions"
        />
      </FormField>
      <input
        v-else
        type="hidden"
        name="taskType"
        :value="presetTaskType"
      >

      <FormField
        label="Коротко о задаче"
        required
      >
        <TextareaField
          name="message"
          placeholder="Что нужно сделать, для какого объекта, какой город и нужен ли монтаж."
          required
          minlength="12"
          maxlength="2000"
        />
      </FormField>

      <FormField
        v-if="showLocationsCount"
        label="Количество точек"
        hint="Заполните, только если проект сетевой или адресов несколько."
      >
        <InputField
          name="locationsCount"
          type="number"
          inputmode="numeric"
          placeholder="Например, 5"
          min="2"
          max="500"
        />
      </FormField>

      <label class="flex items-start gap-3 rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-white">
        <input
          type="checkbox"
          name="needsInstallation"
          class="mt-1 h-4 w-4 rounded border-line bg-canvas-soft"
        >
        <span>Нужен монтаж или установка по объекту</span>
      </label>

      <input
        type="text"
        name="hp"
        tabindex="-1"
        autocomplete="off"
        class="hidden"
        aria-hidden="true"
      >

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-accent-soft"
        >
          Отправить заявку
        </button>
        <p class="text-xs leading-5 text-muted">
          Отправляя заявку, вы соглашаетесь с
          <a
            href="/politika-konfidentsialnosti/"
            class="text-white underline decoration-line underline-offset-4"
          >
            политикой обработки данных
          </a>.
        </p>
      </div>

      <p
        v-if="errorMessage"
        class="text-sm text-danger"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>
