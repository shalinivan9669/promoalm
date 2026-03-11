<script setup lang="ts">
import type { RelatedLink } from "../../../shared/types/content";

defineProps<{
  title: string;
  description: string;
  links: RelatedLink[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Связанные разделы"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article
          v-for="link in links"
          :key="link.href"
          class="surface flex h-full flex-col gap-4 p-6"
        >
          <h3 class="text-lg font-semibold text-white">
            {{ link.label }}
          </h3>
          <p class="text-sm leading-6 text-muted">
            {{ link.description }}
          </p>
          <div class="mt-auto">
            <ButtonLink
              :href="link.href"
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
