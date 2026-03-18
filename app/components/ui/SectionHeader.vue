<script setup lang="ts">
interface DescriptionHighlightConfig {
  text: string;
  tone?: "warm" | "gas" | "berry";
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    descriptionHighlight?: string;
    descriptionHighlightTone?: "warm" | "gas" | "berry";
    descriptionHighlights?: DescriptionHighlightConfig[];
    eyebrowStyle?: "signage" | "plain";
    variant?: "default" | "page" | "support";
  }>(),
  {
    variant: "default",
    eyebrowStyle: "signage",
    descriptionHighlightTone: "warm"
  }
);

const rootClass = computed(() => {
  if (props.variant === "page") {
    return "page-section-header";
  }

  if (props.variant === "support") {
    return "page-section-header page-section-header--support";
  }

  return "max-w-3xl";
});

const titleClass = computed(() =>
  props.variant === "default"
    ? "section-header__title"
    : "page-section-header__title"
);

const descriptionClass = computed(() =>
  props.variant === "default"
    ? "section-header__description"
    : "page-section-header__description"
);

const normalizedDescriptionHighlights = computed<DescriptionHighlightConfig[]>(() => {
  if (props.descriptionHighlights?.length) {
    return props.descriptionHighlights
      .map((item) => ({
        text: item.text.trim(),
        tone: item.tone ?? "warm"
      }))
      .filter((item) => item.text.length > 0);
  }

  if (props.descriptionHighlight?.trim()) {
    return [
      {
        text: props.descriptionHighlight.trim(),
        tone: props.descriptionHighlightTone
      }
    ];
  }

  return [];
});

const highlightedDescriptionParts = computed(() => {
  const description = props.description ?? "";

  if (!description || normalizedDescriptionHighlights.value.length === 0) {
    return null;
  }

  const matches = normalizedDescriptionHighlights.value
    .map((item) => {
      const start = description.indexOf(item.text);

      return start === -1
        ? null
        : {
            start,
            end: start + item.text.length,
            text: item.text,
            tone: item.tone ?? "warm"
          };
    })
    .filter((item): item is { start: number; end: number; text: string; tone: "warm" | "gas" | "berry" } => Boolean(item))
    .sort((a, b) => a.start - b.start);

  if (matches.length === 0) {
    return null;
  }

  const segments: Array<{ text: string; tone?: "warm" | "gas" | "berry"; highlighted: boolean }> = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) {
      continue;
    }

    if (match.start > cursor) {
      segments.push({
        text: description.slice(cursor, match.start),
        highlighted: false
      });
    }

    segments.push({
      text: match.text,
      tone: match.tone,
      highlighted: true
    });
    cursor = match.end;
  }

  if (cursor < description.length) {
    segments.push({
      text: description.slice(cursor),
      highlighted: false
    });
  }

  return segments;
});
</script>

<template>
  <div :class="props.variant === 'default' ? `section-header ${props.eyebrowStyle === 'signage' ? 'section-header--signage' : ''} ${rootClass}` : `${props.eyebrowStyle === 'signage' ? 'section-header--signage' : ''} ${rootClass}`">
    <p
      v-if="props.eyebrow"
      :class="props.eyebrowStyle === 'signage' ? 'eyebrow section-signage-eyebrow' : 'eyebrow'"
    >
      {{ props.eyebrow }}
    </p>
    <h2 :class="titleClass">
      {{ props.title }}
    </h2>
    <p
      v-if="props.description"
      :class="descriptionClass"
    >
      <template v-if="highlightedDescriptionParts">
        <template
          v-for="(part, index) in highlightedDescriptionParts"
          :key="`${part.text}-${index}`"
        >
          <span
            v-if="part.highlighted"
            class="neon-inline-highlight"
            :class="`neon-inline-highlight--${part.tone || 'warm'}`"
          >
            {{ part.text }}
          </span>
          <template v-else>
            {{ part.text }}
          </template>
        </template>
      </template>
      <template v-else>
        {{ props.description }}
      </template>
    </p>
  </div>
</template>
