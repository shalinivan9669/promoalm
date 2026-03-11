type AnalyticsEventName =
  | "click_whatsapp"
  | "click_call"
  | "click_calculate"
  | "submit_lead_form"
  | "open_case"
  | "open_city_page"
  | "open_service_page";

export function useAnalytics() {
  const config = useRuntimeConfig();

  function track(event: AnalyticsEventName, payload: Record<string, unknown> = {}) {
    if (!import.meta.client) {
      return;
    }

    const data = { event, ...payload };
    const win = window as Window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push(data);
    window.dispatchEvent(new CustomEvent("analytics:track", { detail: data }));

    if (config.public.analyticsDebug) {
      console.info("[analytics]", data);
    }
  }

  return { track };
}
