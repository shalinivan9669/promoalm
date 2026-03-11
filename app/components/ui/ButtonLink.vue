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

const analytics = useAnalytics();
const isExternal = computed(() => props.external || /^(https?:\/\/|mailto:|tel:)/.test(props.href));

const classes = computed(() => {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const size = props.small ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm sm:text-[15px]";
  const width = props.block ? " w-full" : "";
  const intentMap = {
    primary: "bg-accent text-canvas hover:bg-accent-soft",
    calculate: "bg-accent text-canvas hover:bg-accent-soft",
    secondary: "border border-line text-white hover:border-accent hover:text-accent",
    ghost: "bg-white/5 text-white hover:bg-white/10",
    whatsapp: "bg-success text-canvas hover:opacity-90",
    call: "border border-line-strong text-white hover:border-accent hover:text-accent"
  };

  return `${base} ${size} ${intentMap[props.intent]}${width}`;
});

function handleClick() {
  if (props.trackingEvent) {
    analytics.track(props.trackingEvent as never, {
      href: props.href
    });
  }
}
</script>

<template>
  <a
    v-if="isExternal"
    :href="href"
    :class="classes"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </a>
  <NuxtLink
    v-else
    :to="href"
    :class="classes"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
