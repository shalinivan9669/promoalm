<script setup lang="ts">
import { contactInfo } from "../../data/site";

const route = useRoute();
const globalSuccess = useState<boolean>("lead-form-success", () => false);
const hasFocusedField = ref(false);

const whatsappChannel = computed(() => contactInfo.channels.find((item) => item.type === "whatsapp"));
const phoneChannel = computed(() => contactInfo.channels.find((item) => item.type === "phone"));

const whatsappHref = computed(() => whatsappChannel.value?.available && whatsappChannel.value.href ? whatsappChannel.value.href : "/kontakty/#lead-form");
const callHref = computed(() => phoneChannel.value?.available && phoneChannel.value.href ? phoneChannel.value.href : "/kontakty/#lead-form");

const hidden = computed(() => globalSuccess.value || hasFocusedField.value || route.path.startsWith("/politika-konfidentsialnosti"));

function updateFocusState(event: FocusEvent) {
  const target = event.target as HTMLElement | null;
  hasFocusedField.value = Boolean(target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) && window.innerHeight < 760);
}

function clearFocusState() {
  hasFocusedField.value = false;
}

onMounted(() => {
  window.addEventListener("focusin", updateFocusState);
  window.addEventListener("focusout", clearFocusState);
});

onBeforeUnmount(() => {
  window.removeEventListener("focusin", updateFocusState);
  window.removeEventListener("focusout", clearFocusState);
});
</script>

<template>
  <div
    v-if="!hidden"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-3 py-3 backdrop-blur-xl lg:hidden"
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
