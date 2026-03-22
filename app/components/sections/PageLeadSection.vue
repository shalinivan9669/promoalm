<script setup lang="ts">
interface LeadStat {
  label: string;
  value?: string;
  note?: string;
}

const props = withDefaults(
  defineProps<{
    intro?: string;
    stats?: LeadStat[];
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    intro: "",
    stats: () => [],
    variant: "default"
  }
);

const hasRail = computed(() => props.stats.length > 0);
const slots = useSlots();
const hasIntro = computed(() => Boolean(props.intro) || Boolean(slots.default));
</script>

<template>
  <section
    class="page-lead"
    :class="`page-lead--${props.variant}`"
  >
    <Container>
      <div
        class="page-lead__frame"
        :class="{ 'page-lead__frame--single': !hasRail }"
      >
        <div class="page-lead__copy">
          <p
            v-if="intro"
            class="page-lead__intro"
          >
            {{ intro }}
          </p>
          <div
            v-else-if="hasIntro"
            class="page-lead__intro"
          >
            <slot />
          </div>
        </div>

        <div
          v-if="hasRail"
          class="page-lead__rail"
        >
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="page-lead__stat"
          >
            <p class="page-lead__stat-label">
              {{ stat.label }}
            </p>
            <p
              v-if="stat.value"
              class="page-lead__stat-value"
            >
              {{ stat.value }}
            </p>
            <p
              v-if="stat.note"
              class="page-lead__stat-note"
            >
              {{ stat.note }}
            </p>
          </article>
        </div>
      </div>
    </Container>
  </section>
</template>
