<script setup lang="ts">
import { contactInfo } from "../../data/site";

const route = useRoute();
const whatsappChannel = contactInfo.channels.find((item) => item.type === "whatsapp");
const phoneChannel = contactInfo.channels.find((item) => item.type === "phone");
const whatsappHref = whatsappChannel?.available && whatsappChannel.href ? whatsappChannel.href : "/kontakty/#lead-form";
const callHref = phoneChannel?.available && phoneChannel.href ? phoneChannel.href : "/kontakty/#lead-form";
const hidden = route.path.startsWith("/politika-konfidentsialnosti");
</script>

<template>
  <div
    v-if="!hidden"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas px-3 py-3 lg:hidden"
  >
    <div class="mx-auto grid max-w-xl grid-cols-3 gap-2">
      <ButtonLink
        :href="whatsappHref"
        label="WhatsApp"
        intent="whatsapp"
        tracking-event="click_whatsapp"
        block
      />
      <ButtonLink
        :href="callHref"
        label="Позвонить"
        intent="call"
        tracking-event="click_call"
        block
      />
      <ButtonLink
        href="/kontakty/#lead-form"
        label="Рассчитать"
        intent="calculate"
        tracking-event="click_calculate"
        block
      />
    </div>
  </div>
</template>
