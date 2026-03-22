<script setup lang="ts">
const props = defineProps<{
  anchorId?: string;
  title: string;
  description: string;
  items: Array<{
    label: string;
    href: string;
  }>;
}>();
</script>

<template>
  <section
    :id="props.anchorId"
    class="section-divider section-space page-section page-section--support scroll-mt-32"
  >
    <Container>
      <div class="surface p-5 sm:p-6">
        <SectionHeader
          eyebrow="Навигация"
          :title="props.title"
          :description="props.description"
          variant="support"
        />
        <nav class="mt-6 flex flex-wrap gap-3">
          <a
            v-for="item in props.items"
            :key="item.href"
            :href="item.href"
            class="page-chip"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </Container>
  </section>
</template>
