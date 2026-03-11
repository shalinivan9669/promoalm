<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title?: string;
  description?: string;
  items: Array<{
    label: string;
    value: string;
    note?: string;
    description?: string;
  }>;
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        v-if="title"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />
      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          v-for="item in items"
          :key="item.label"
          :title="item.label"
          :value="item.value"
          :description="item.description || item.note || ''"
        />
      </div>
    </Container>
  </section>
</template>
