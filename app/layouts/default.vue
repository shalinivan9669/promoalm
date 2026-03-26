<script setup lang="ts">
import { contactInfo } from "../data/site";

const whatsappChannel = contactInfo.channels.find((item) => item.type === "whatsapp");
const projectCompanionHref = whatsappChannel?.href ?? "/kontakty/";
</script>

<template>
  <div class="min-h-screen bg-canvas text-ink">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-canvas"
    >
      Перейти к содержимому
    </a>
    <SiteHeader />
    <main id="main-content">
      <slot />
    </main>
    <SiteProjectCompanion :href="projectCompanionHref" />
    <SiteFooter />
    <MobileStickyCtaBar />
  </div>
</template>
