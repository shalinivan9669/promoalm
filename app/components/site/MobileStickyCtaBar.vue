<script setup lang="ts">
import { contactInfo } from "../../data/site";
import type { CTAIntent } from "../../../shared/types/content";

const route = useRoute();
const whatsappChannel = contactInfo.channels.find((item) => item.type === "whatsapp");
const phoneChannel = contactInfo.channels.find((item) => item.type === "phone");
const hidden = route.path.startsWith("/politika-konfidentsialnosti");

function buildQuickAction(config: {
  available?: boolean;
  href?: string;
  label: string;
  intent: CTAIntent;
  fallbackHref: string;
  fallbackLabel: string;
  fallbackIntent: CTAIntent;
  trackingEvent: string;
  fallbackTrackingEvent: string;
}) {
  if (config.available && config.href) {
    return {
      href: config.href,
      label: config.label,
      intent: config.intent,
      trackingEvent: config.trackingEvent
    };
  }

  return {
    href: config.fallbackHref,
    label: config.fallbackLabel,
    intent: config.fallbackIntent,
    trackingEvent: config.fallbackTrackingEvent
  };
}

const quickContacts = buildQuickAction({
  available: whatsappChannel?.available,
  href: whatsappChannel?.href,
  label: "WhatsApp",
  intent: "whatsapp",
  fallbackHref: "/kontakty/",
  fallbackLabel: "Контакты",
  fallbackIntent: "secondary",
  trackingEvent: "click_whatsapp",
  fallbackTrackingEvent: "open_contacts"
});

const quickRequest = buildQuickAction({
  available: phoneChannel?.available,
  href: phoneChannel?.href,
  label: "Позвонить",
  intent: "call",
  fallbackHref: "/kontakty/#lead-form",
  fallbackLabel: "Оставить заявку",
  fallbackIntent: "calculate",
  trackingEvent: "click_call",
  fallbackTrackingEvent: "click_calculate"
});
</script>

<template>
  <div
    v-if="!hidden"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas px-3 py-3 lg:hidden"
  >
    <nav
      aria-label="Быстрые действия"
      class="mx-auto grid max-w-xl grid-cols-3 gap-2"
    >
      <ButtonLink
        :href="quickContacts.href"
        :label="quickContacts.label"
        :intent="quickContacts.intent"
        :tracking-event="quickContacts.trackingEvent"
        block
      />
      <ButtonLink
        :href="quickRequest.href"
        :label="quickRequest.label"
        :intent="quickRequest.intent"
        :tracking-event="quickRequest.trackingEvent"
        block
      />
      <ButtonLink
        href="/kontakty/#lead-form"
        label="Получить расчёт"
        intent="calculate"
        tracking-event="click_calculate"
        block
      />
    </nav>
  </div>
</template>
