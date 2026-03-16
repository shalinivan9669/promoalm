<script setup lang="ts">
import type { BreadcrumbItem } from "../../../shared/types/content";

interface LeadStat {
  label: string;
  value?: string;
  note?: string;
}

const props = withDefaults(
  defineProps<{
    breadcrumbs: BreadcrumbItem[];
    intro?: string;
    chips?: string[];
    stats?: LeadStat[];
    variant?: "default" | "service" | "city" | "support" | "about" | "cases" | "contact";
  }>(),
  {
    intro: "",
    chips: () => [],
    stats: () => [],
    variant: "default"
  }
);

const hasRail = computed(() => props.chips.length > 0 || props.stats.length > 0);
const slots = useSlots();
const hasIntro = computed(() => Boolean(props.intro) || Boolean(slots.default));
</script>

<template>
  <section
    class="page-lead"
    :class="`page-lead--${props.variant}`"
  >
    <Container>
      <div class="page-lead__frame">
        <div class="page-lead__copy">
          <Breadcrumbs
            :items="breadcrumbs"
            compact
          />
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

          <div
            v-if="chips.length"
            class="page-lead__chips"
          >
            <span
              v-for="chip in chips"
              :key="chip"
              class="page-chip"
            >
              {{ chip }}
            </span>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
