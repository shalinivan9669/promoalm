<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href: string;
    label?: string;
    intent?: "primary" | "secondary" | "ghost" | "whatsapp" | "call" | "calculate";
    trackingEvent?: string;
    external?: boolean;
    block?: boolean;
    small?: boolean;
  }>(),
  {
    intent: "primary",
    block: false,
    small: false
  }
);

const classes = computed(() => {
  const base =
    "button-link inline-flex items-center justify-center rounded-full border font-sans font-semibold tracking-[0.01em] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const size = props.small ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm sm:text-[15px]";
  const width = props.block ? " w-full" : "";
  const intentClass = ` button-link--intent-${props.intent}`;

  return `${base} ${size}${intentClass}${width}`;
});
</script>

<template>
  <a
    :href="href"
    :class="classes"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
  >
    <slot>{{ label }}</slot>
  </a>
</template>
