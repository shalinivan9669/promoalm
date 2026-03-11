import type { LeadFormData, LeadApiError, LeadApiSuccess } from "~~/shared/types/lead";
import { leadFormSchema } from "~~/shared/validation/lead";
import { useAnalytics } from "./useAnalytics";

type LeadFormStatus = "idle" | "loading" | "success" | "error";

interface UseLeadFormOptions {
  sourcePage: string;
  presetTaskType?: string;
  presetCity?: string;
}

export function useLeadForm(options: UseLeadFormOptions) {
  const analytics = useAnalytics();
  const globalSuccess = useState<boolean>("lead-form-success", () => false);
  const form = reactive<LeadFormData>({
    name: "",
    contact: "",
    city: options.presetCity || "",
    message: "",
    preferredChannel: "whatsapp",
    locationsCount: undefined,
    needsInstallation: false,
    taskType: options.presetTaskType || "Общий запрос",
    sourcePage: options.sourcePage,
    startedAt: Date.now(),
    hp: ""
  });
  const errors = reactive<Record<string, string>>({});
  const status = ref<LeadFormStatus>("idle");
  const errorMessage = ref("");
  const successMessage = ref("");

  function resetErrors() {
    for (const key of Object.keys(errors)) {
      delete errors[key];
    }
  }

  function resetForm() {
    form.name = "";
    form.contact = "";
    form.city = options.presetCity || "";
    form.message = "";
    form.preferredChannel = "whatsapp";
    form.locationsCount = undefined;
    form.needsInstallation = false;
    form.taskType = options.presetTaskType || "Общий запрос";
    form.sourcePage = options.sourcePage;
    form.startedAt = Date.now();
    form.hp = "";
    status.value = "idle";
    errorMessage.value = "";
    successMessage.value = "";
    globalSuccess.value = false;
    resetErrors();
  }

  async function submit() {
    status.value = "loading";
    errorMessage.value = "";
    successMessage.value = "";
    resetErrors();

    const parsed = leadFormSchema.safeParse(form);

    if (!parsed.success) {
      status.value = "error";

      for (const issue of parsed.error.issues) {
        const path = issue.path[0];

        if (typeof path === "string") {
          errors[path] = issue.message;
        }
      }

      errorMessage.value = "Проверьте поля формы и попробуйте ещё раз.";
      return;
    }

    try {
      const response = await $fetch<LeadApiSuccess | LeadApiError>("/api/lead", {
        method: "POST",
        body: parsed.data
      });

      if (!response.ok) {
        status.value = "error";
        errorMessage.value = response.message;
        return;
      }

      status.value = "success";
      successMessage.value = response.message;
      globalSuccess.value = true;
      analytics.track("submit_lead_form", {
        sourcePage: options.sourcePage,
        taskType: form.taskType
      });
    } catch {
      status.value = "error";
      errorMessage.value = "Не удалось отправить заявку. Попробуйте ещё раз или откройте контакты.";
    }
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    successMessage,
    submit,
    resetForm,
    globalSuccess
  };
}
