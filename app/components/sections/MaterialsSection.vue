<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  materials: string[];
}>();
</script>

<template>
  <section class="section-divider section-space">
    <Container>
      <SectionHeader
        eyebrow="Материалы"
        :title="title"
        :description="description"
      />
      <div class="mt-8 flex flex-wrap gap-3">
        <span
          v-for="material in materials"
          :key="material"
          class="chip"
        >
          {{ material }}
        </span>
      </div>
    </Container>
  </section>
</template>
