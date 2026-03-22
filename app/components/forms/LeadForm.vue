<script setup lang="ts">
import type { LeadApiError } from "~~/shared/types/lead";
import { contactInfo } from "../../data/site";
import { serviceCards } from "../../data/service-summaries";

const props = withDefaults(
  defineProps<{
    sourcePage: string;
    presetTaskType?: string;
    presetCity?: string;
    showLocations?: boolean;
    variant?: "default" | "contact";
  }>(),
  {
    presetTaskType: "",
    presetCity: "",
    showLocations: false,
    variant: "default"
  }
);

const route = useRoute();
const startedAt = Date.now();
const leadStatus = computed(() => (Array.isArray(route.query.leadStatus) ? route.query.leadStatus[0] : route.query.leadStatus));
const leadReason = computed(() => (Array.isArray(route.query.leadReason) ? route.query.leadReason[0] : route.query.leadReason));
const isSuccess = computed(() => leadStatus.value === "success");
const showTaskType = !props.presetTaskType;
const showLocationsCount = props.variant === "contact" ? true : props.showLocations || !props.presetTaskType;
const whatsappChannel = contactInfo.channels.find((item) => item.type === "whatsapp");
const whatsappHref = whatsappChannel?.href || "/kontakty/";

const taskOptions = [
  { label: "Общий запрос", value: "Общий запрос" },
  ...serviceCards
    .filter((item) => item.status === "published")
    .map((item) => ({
      label: item.title,
      value: item.title
    }))
];

const contactTaskOptions = [
  { label: "Общий запрос", value: "Общий запрос" },
  { label: "Световая вывеска", value: "Световая вывеска" },
  { label: "Лайтбокс / световой короб", value: "Лайтбокс / световой короб" },
  { label: "Объёмные буквы", value: "Объёмные буквы" },
  { label: "Неоновая вывеска", value: "Неоновая вывеска" },
  { label: "Фасадная вывеска", value: "Фасадная вывеска" },
  { label: "Входная группа", value: "Входная группа" },
  { label: "Вывески для сети", value: "Вывески для сети" },
  { label: "Нестандартная конструкция", value: "Нестандартная конструкция" }
];

const objectTypeOptions = [
  { label: "Не указывать", value: "" },
  { label: "Фасад / street retail", value: "Фасад / street retail" },
  { label: "Входная группа", value: "Входная группа" },
  { label: "Торговый зал / интерьер", value: "Торговый зал / интерьер" },
  { label: "Офис / шоурум", value: "Офис / шоурум" },
  { label: "Несколько точек", value: "Несколько точек" },
  { label: "Другое", value: "Другое" }
];

const deadlineOptions = [
  { label: "Срок пока не определён", value: "" },
  { label: "Срочно", value: "Срочно" },
  { label: "1–2 недели", value: "1–2 недели" },
  { label: "2–4 недели", value: "2–4 недели" },
  { label: "Планируем позже", value: "Планируем позже" }
];

const cityOptions = [
  { label: "Не указывать", value: "" },
  { label: "Алматы", value: "Алматы" },
  { label: "Астана", value: "Астана" },
  { label: "Шымкент", value: "Шымкент" },
  { label: "Другой город", value: "Другой город" }
];

const messageSuggestions = [
  "Фото фасада",
  "Адрес объекта",
  "Размеры или ориентир",
  "Ссылка на референс",
  "Брендбук",
  "Несколько точек"
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

const wrapperClass = computed(() =>
  props.variant === "contact" ? "page-form page-form--contact contact-intake-form" : "surface p-6 sm:p-8"
);
</script>

<template>
  <div
    id="lead-form"
    :class="wrapperClass"
  >
    <div
      v-if="isSuccess"
      :class="props.variant === 'contact' ? 'contact-intake-state' : 'flex flex-col gap-4'"
    >
      <p class="eyebrow">Заявка принята</p>
      <h3 :class="props.variant === 'contact' ? 'contact-intake-state__title' : 'text-2xl font-semibold text-ink'">
        Заявка принята. Следующий шаг: уточнение проекта и расчёт.
      </h3>
      <p :class="props.variant === 'contact' ? 'contact-intake-state__description' : 'text-sm leading-6 text-muted'">
        Мы вернёмся в выбранный канал и уточним следующий шаг по проекту.
      </p>
      <div :class="props.variant === 'contact' ? 'contact-intake-state__actions' : 'flex flex-wrap gap-3 pt-2'">
        <template v-if="props.variant === 'contact'">
          <ButtonLink
            :href="whatsappHref"
            label="Написать в WhatsApp"
            intent="whatsapp"
            external
          />
          <ButtonLink
            href="/cases/"
            label="Смотреть кейсы"
            intent="secondary"
          />
        </template>
        <template v-else>
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
        </template>
      </div>
    </div>

    <form
      v-else
      action="/api/lead"
      method="post"
      :class="props.variant === 'contact' ? 'contact-intake-form__grid' : 'grid gap-5'"
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

      <template v-if="props.variant === 'contact'">
        <fieldset class="contact-intake-group">
          <legend class="contact-intake-group__legend">
            Контакт
          </legend>
          <div class="contact-intake-group__grid contact-intake-group__grid--two">
            <FormField
              label="Имя или компания"
              required
            >
              <InputField
                name="name"
                autocomplete="name"
                placeholder="Имя, компания или бренд"
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
            <FormField
              label="Город"
              hint="Можно оставить Алматы или выбрать свой город."
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
        </fieldset>

        <fieldset class="contact-intake-group">
          <legend class="contact-intake-group__legend">
            Проект
          </legend>

          <div class="contact-intake-group__grid contact-intake-group__grid--two">
            <FormField
              label="Тип объекта"
              hint="Помогает сразу понять формат фасада или помещения."
            >
              <SelectField
                name="objectType"
                :options="objectTypeOptions"
              />
            </FormField>

            <FormField
              label="Срок"
              hint="Можно оставить пустым, если пока без дедлайна."
            >
              <SelectField
                name="deadline"
                :options="deadlineOptions"
              />
            </FormField>
          </div>

          <div class="contact-intake-group__grid contact-intake-group__grid--two">
            <FormField
              v-if="showTaskType"
              label="Что нужно изготовить"
              required
            >
              <SelectField
                name="taskType"
                model-value="Общий запрос"
                :options="contactTaskOptions"
              />
            </FormField>
            <input
              v-else
              type="hidden"
              name="taskType"
              :value="presetTaskType"
            >

            <FormField
              label="Ориентир бюджета"
              hint="Можно указать диапазон, если он уже есть."
            >
              <InputField
                name="budget"
                placeholder="Например, до 300 000 ₸"
                maxlength="80"
              />
            </FormField>
          </div>
        </fieldset>

        <fieldset class="contact-intake-group contact-intake-group--brief">
          <legend class="contact-intake-group__legend">
            Материалы
          </legend>

          <div class="contact-intake-group__grid contact-intake-group__grid--two">
            <FormField
              label="Адрес точки"
              hint="Город, улица, ТРЦ, БЦ или любой понятный ориентир."
            >
              <InputField
                name="address"
                placeholder="Например, Алматы, пр. Абая, 10"
                maxlength="180"
              />
            </FormField>

            <FormField
              label="Ссылка на материалы"
              hint="Фото, папка, референс или брендбук."
            >
              <InputField
                name="referenceLink"
                placeholder="Ссылка на Drive, файл или референс"
                maxlength="500"
              />
            </FormField>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <label class="contact-intake-installation">
              <input
                type="checkbox"
                name="hasFacadePhoto"
                class="contact-intake-installation__control"
              >
              <span>Есть фото фасада</span>
            </label>

            <label class="contact-intake-installation">
              <input
                type="checkbox"
                name="hasDimensions"
                class="contact-intake-installation__control"
              >
              <span>Есть размеры</span>
            </label>

            <label class="contact-intake-installation">
              <input
                type="checkbox"
                name="hasBrandbook"
                class="contact-intake-installation__control"
              >
              <span>Есть брендбук</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="contact-intake-group contact-intake-group--brief">
          <legend class="contact-intake-group__legend">
            Суть запроса
          </legend>

          <div class="contact-intake-brief">
            <FormField
              label="Коротко о задаче"
              hint="Опишите, что нужно сделать, для какого объекта и нужен ли монтаж. Этого уже хватает для следующего шага."
              required
            >
              <div class="contact-intake-suggestions">
                <p class="contact-intake-suggestions__label">
                  Что можно указать
                </p>
                <div class="contact-intake-suggestions__list">
                  <span
                    v-for="suggestion in messageSuggestions"
                    :key="suggestion"
                    class="contact-intake-suggestion"
                  >
                    {{ suggestion }}
                  </span>
                </div>
              </div>
              <TextareaField
                name="message"
                placeholder="Что нужно изготовить, для какого объекта, какой город, нужен ли монтаж и есть ли несколько адресов."
                required
                minlength="12"
                maxlength="2000"
                :rows="7"
              />
            </FormField>

            <div class="contact-intake-brief__meta">
              <FormField
                v-if="showLocationsCount"
                label="Количество точек"
                hint="Укажите, если проект сетевой или адресов несколько."
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

              <label class="contact-intake-installation">
                <input
                  type="checkbox"
                  name="needsInstallation"
                  class="contact-intake-installation__control"
                >
                <span>Нужен монтаж или установка по объекту</span>
              </label>
            </div>
          </div>

          <label class="contact-intake-installation mt-1">
            <input
              type="checkbox"
              name="consent"
              required
              class="contact-intake-installation__control"
            >
            <span>
              Соглашаюсь с
              <a
                href="/politika-konfidentsialnosti/"
                class="underline decoration-line underline-offset-4 transition hover:text-[color:var(--color-accent)]"
              >
                политикой обработки данных
              </a>
            </span>
          </label>
        </fieldset>
      </template>

      <template v-else>
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

        <label class="flex items-start gap-3 rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-ink">
          <input
            type="checkbox"
            name="needsInstallation"
            class="mt-1 h-4 w-4 rounded border-line bg-canvas-soft"
          >
          <span>Нужен монтаж или установка по объекту</span>
        </label>

        <label class="flex items-start gap-3 rounded-3xl border border-line bg-canvas-soft px-4 py-3 text-sm text-ink">
          <input
            type="checkbox"
            name="consent"
            required
            class="mt-1 h-4 w-4 rounded border-line bg-canvas-soft"
          >
          <span>
            Соглашаюсь с
            <a
              href="/politika-konfidentsialnosti/"
              class="text-ink underline decoration-line underline-offset-4 transition hover:text-[color:var(--color-accent)]"
            >
              политикой обработки данных
            </a>
          </span>
        </label>
      </template>

      <input
        type="text"
        name="hp"
        tabindex="-1"
        autocomplete="off"
        class="hidden"
        aria-hidden="true"
      >

      <div :class="props.variant === 'contact' ? 'contact-intake-cta' : 'page-form__actions'">
        <div
          v-if="props.variant === 'contact'"
          class="contact-intake-cta__copy"
        >
          <p class="contact-intake-cta__title">
            Достаточно фото и краткого описания.
          </p>
          <p class="contact-intake-cta__note">
            Ответим в выбранный канал и предложим следующий шаг по проекту.
          </p>
          <p class="contact-intake-cta__policy">
            Фото фасада, адрес точки и ссылка на материалы ускоряют расчёт.
          </p>
        </div>

        <button
          type="submit"
          :class="
            props.variant === 'contact'
              ? 'button-link contact-intake-cta__button'
              : 'button-link button-link--intent-primary inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-sans font-semibold tracking-[0.01em] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-[15px]'
          "
        >
          Получить расчёт
        </button>

        <p
          v-if="props.variant !== 'contact'"
          class="text-xs leading-5 text-muted"
        >
          Отправляя заявку, вы соглашаетесь с
          <a
            href="/politika-konfidentsialnosti/"
            class="text-ink underline decoration-line underline-offset-4 transition hover:text-[color:var(--color-accent)]"
          >
            политикой обработки данных
          </a>.
        </p>
      </div>

      <p
        v-if="errorMessage"
        :class="props.variant === 'contact' ? 'contact-intake-error' : 'text-sm text-danger'"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>
