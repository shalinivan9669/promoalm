<script setup lang="ts">
import type { ContactChannel } from "../../../shared/types/content";

const props = withDefaults(
  defineProps<{
    channels: ContactChannel[];
    variant?: "default" | "contact";
  }>(),
  {
    variant: "default"
  }
);

const featuredChannel = computed(() => props.channels.find((channel) => channel.available) ?? props.channels[0] ?? null);
const remainingChannels = computed(() => props.channels.filter((channel) => channel.label !== featuredChannel.value?.label));
const isContact = computed(() => props.variant === "contact");
const orderedChannels = computed(() =>
  isContact.value && featuredChannel.value ? [featuredChannel.value, ...remainingChannels.value] : props.channels
);
</script>

<template>
  <section :class="props.variant === 'default' ? 'section-divider section-space' : 'section-divider section-space page-section page-section--contact'">
    <Container>
      <SectionHeader
        eyebrow="Контакты"
        title="Каналы связи и форма расчёта"
        description="До подключения боевых номеров все лиды можно забирать через форму. Placeholder-каналы отмечены честно и не выданы за реальные."
        :variant="isContact ? 'page' : 'default'"
      />
      <div :class="isContact ? 'page-contact-grid mt-8' : 'mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'">
        <article
          v-for="(channel, index) in orderedChannels"
          :key="channel.label"
          :class="
            isContact
              ? index === 0
                ? 'page-card page-card--feature'
                : 'page-card'
              : 'surface flex h-full flex-col gap-3 p-6'
          "
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-lg font-semibold text-ink">
              {{ channel.label }}
            </h3>
            <span :class="isContact ? 'page-chip' : 'chip'">
              {{ channel.available ? "Активно" : "Placeholder" }}
            </span>
          </div>
          <p :class="isContact && index === 0 ? 'mt-5 text-2xl font-semibold text-ink' : 'text-sm text-ink'">
            {{ channel.value }}
          </p>
          <p
            v-if="channel.note"
            :class="isContact && index === 0 ? 'mt-3 max-w-2xl text-sm leading-7 text-muted' : 'text-sm leading-6 text-muted'"
          >
            {{ channel.note }}
          </p>
          <div :class="isContact ? 'mt-6' : 'mt-auto'">
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
