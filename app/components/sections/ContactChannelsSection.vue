<script setup lang="ts">
import type { ContactChannel } from "../../../shared/types/content";

defineProps<{
  channels: ContactChannel[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Контакты"
        title="Каналы связи и форма расчёта"
        description="До подключения боевых номеров все лиды можно забирать через форму. Placeholder-каналы отмечены честно и не выданы за реальные."
      />
      <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="channel in channels"
          :key="channel.label"
          class="surface flex h-full flex-col gap-3 p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-lg font-semibold text-white">
              {{ channel.label }}
            </h3>
            <span class="chip">
              {{ channel.available ? "Активно" : "Placeholder" }}
            </span>
          </div>
          <p class="text-sm text-white">
            {{ channel.value }}
          </p>
          <p class="text-sm leading-6 text-muted">
            {{ channel.note }}
          </p>
          <div class="mt-auto">
            <ButtonLink
              v-if="channel.href"
              :href="channel.href"
              label="Открыть"
              intent="secondary"
              block
            />
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>
