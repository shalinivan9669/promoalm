<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
  items: string[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow || 'Для кого'"
        :title="title"
        :description="description"
      />
      <div class="mt-8 flex flex-wrap gap-3">
        <span
          v-for="item in items"
          :key="item"
          class="chip"
        >
          {{ item }}
        </span>
      </div>
    </Container>
  </section>
</template>
