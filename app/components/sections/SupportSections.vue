<script setup lang="ts">
import type { SupportSection } from "../../../shared/types/content";

const props = defineProps<{
  sections: SupportSection[];
}>();

const eyebrowByKind: Record<SupportSection["kind"], string> = {
  rich: "Коротко",
  steps: "Процесс",
  geo: "География",
  risk: "Ограничения",
  b2b: "Для сетей",
  legal: "Условия"
};

function cardClass(kind: SupportSection["kind"], index: number) {
  if (kind === "legal") {
    return "page-card page-card--quiet";
  }

  return index === 0 ? "page-card page-card--feature" : "page-card";
}
</script>

<template>
  <section
    v-for="(section, index) in props.sections"
    :id="section.id"
    :key="section.id"
    class="section-divider section-space page-section page-section--support scroll-mt-32"
  >
    <Container>
      <SectionHeader
        :eyebrow="eyebrowByKind[section.kind]"
        :title="section.title"
        :description="section.description"
        variant="support"
      />

      <article
        v-if="section.kind === 'rich'"
        :class="['mt-8', cardClass(section.kind, index)]"
      >
        <p class="text-sm leading-7 text-muted sm:text-base">
          {{ section.body }}
        </p>
        <ul
          v-if="section.bullets?.length"
          class="mt-5 grid gap-3 sm:grid-cols-2"
        >
          <li
            v-for="bullet in section.bullets"
            :key="bullet"
            class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
          >
            {{ bullet }}
          </li>
        </ul>
        <div
          v-if="section.note"
          class="mt-5 rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
        >
          {{ section.note }}
        </div>
        <div
          v-if="section.relatedLinks?.length"
          class="mt-5 flex flex-wrap gap-3"
        >
          <ButtonLink
            v-for="link in section.relatedLinks"
            :key="link.href"
            :href="link.href"
            :label="link.label"
            intent="secondary"
            small
          />
        </div>
      </article>

      <div
        v-else-if="section.kind === 'steps'"
        class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <article
          v-for="(step, stepIndex) in section.steps"
          :key="step.title"
          class="page-card page-card--quiet"
        >
          <div class="flex items-center justify-between gap-4">
            <p class="page-lead__stat-label text-xs uppercase tracking-[0.18em]">
              Шаг
            </p>
            <p class="page-card__value text-2xl">
              {{ String(stepIndex + 1).padStart(2, "0") }}
            </p>
          </div>
          <h3 class="mt-1 text-lg font-semibold text-ink">
            {{ step.title }}
          </h3>
          <p class="text-sm leading-6 text-muted">
            {{ step.description }}
          </p>
          <p
            v-if="step.note"
            class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
          >
            {{ step.note }}
          </p>
        </article>
        <div
          v-if="section.note"
          class="md:col-span-2 xl:col-span-4"
        >
          <div class="rounded-3xl border border-line bg-canvas-soft px-5 py-4 text-sm leading-6 text-muted">
            {{ section.note }}
          </div>
        </div>
      </div>

      <article
        v-else-if="section.kind === 'geo'"
        :class="['mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]', cardClass(section.kind, index)]"
      >
        <div>
          <p class="text-sm leading-7 text-muted sm:text-base">
            {{ section.description }}
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <span class="page-chip">
              База: {{ section.primaryCity }}
            </span>
            <span class="page-chip">
              Зона: {{ section.areaServed }}
            </span>
            <span
              v-if="section.serviceModel"
              class="page-chip"
            >
              {{ section.serviceModel }}
            </span>
          </div>
        </div>
        <div class="space-y-3">
          <article
            v-for="note in section.notes"
            :key="note"
            class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
          >
            {{ note }}
          </article>
        </div>
      </article>

      <article
        v-else-if="section.kind === 'risk'"
        :class="['mt-8', cardClass(section.kind, index)]"
      >
        <ul class="space-y-3">
          <li
            v-for="risk in section.risks"
            :key="risk"
            class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
          >
            {{ risk }}
          </li>
        </ul>
        <p
          v-if="section.note"
          class="mt-5 rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
        >
          {{ section.note }}
        </p>
      </article>

      <article
        v-else-if="section.kind === 'b2b'"
        :class="['mt-8', cardClass(section.kind, index)]"
      >
        <div class="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <ul class="space-y-3">
            <li
              v-for="bullet in section.bullets"
              :key="bullet"
              class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
            >
              {{ bullet }}
            </li>
          </ul>
          <div class="space-y-4">
            <p
              v-if="section.note"
              class="rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
            >
              {{ section.note }}
            </p>
            <div
              v-if="section.relatedLinks?.length"
              class="flex flex-wrap gap-3"
            >
              <ButtonLink
                v-for="link in section.relatedLinks"
                :key="link.href"
                :href="link.href"
                :label="link.label"
                intent="secondary"
                small
              />
            </div>
          </div>
        </div>
      </article>

      <article
        v-else-if="section.kind === 'legal'"
        :class="['mt-8', cardClass(section.kind, index)]"
      >
        <dl class="space-y-4">
          <div
            v-for="item in section.items"
            :key="item.label"
            class="rounded-2xl border border-line bg-canvas-soft px-4 py-3"
          >
            <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {{ item.label }}
            </dt>
            <dd class="mt-1 text-sm leading-6 text-ink">
              {{ item.value }}
            </dd>
            <p
              v-if="item.note"
              class="mt-2 text-sm leading-6 text-muted"
            >
              {{ item.note }}
            </p>
          </div>
        </dl>
        <p
          v-if="section.note"
          class="mt-5 rounded-2xl border border-line bg-canvas-soft px-4 py-3 text-sm leading-6 text-muted"
        >
          {{ section.note }}
        </p>
      </article>
    </Container>
  </section>
</template>
