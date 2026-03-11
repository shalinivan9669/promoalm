import { getHeader, readBody, sendRedirect } from "h3";
import type { H3Event } from "h3";

import type { LeadApiError, LeadApiSuccess, LeadFormData } from "../../shared/types/lead";
import { leadFormSchema, normalizeLeadPayload } from "../../shared/validation/lead";
import { deliverLead } from "../utils/lead-delivery";
import { assertDuplicateCooldown, assertRateLimit } from "../utils/rate-limit";
import { getClientIp, hashPayload, isAllowedOrigin, isSuspiciousUserAgent } from "../utils/request-guards";

function reject(reason: LeadApiError["reason"], message: string): LeadApiError {
  return {
    ok: false,
    status: "rejected",
    reason,
    message
  };
}

function logReject(reason: LeadApiError["reason"], payload: Record<string, unknown>) {
  console.warn("[lead:reject]", JSON.stringify({ reason, ...payload }));
}

function wantsHtmlResponse(event: H3Event) {
  const accept = getHeader(event, "accept") || "";
  return accept.includes("text/html");
}

function redirectToLeadForm(
  event: H3Event,
  siteUrl: string,
  status: "success" | "error",
  reason?: LeadApiError["reason"]
) {
  const redirectUrl = new URL("/kontakty/", siteUrl);
  redirectUrl.searchParams.set("leadStatus", status);

  if (reason) {
    redirectUrl.searchParams.set("leadReason", reason);
  }

  redirectUrl.hash = "lead-form";

  return sendRedirect(event, `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`, 303);
}

export default defineEventHandler(async (event): Promise<LeadApiSuccess | LeadApiError | void> => {
  const config = useRuntimeConfig(event);
  const siteUrl = config.public.siteUrl as string;
  const htmlRequest = wantsHtmlResponse(event);
  const body = await readBody<LeadFormData>(event);
  const userAgent = getHeader(event, "user-agent") || "";
  const ip = getClientIp(event);

  if (!isAllowedOrigin(event, siteUrl)) {
    logReject("origin", { ip });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "origin");
    }
    return reject("origin", "Запрос пришёл не с разрешённого источника.");
  }

  if (isSuspiciousUserAgent(userAgent)) {
    logReject("agent", { ip, userAgent });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "agent");
    }
    return reject("agent", "Автоматические запросы отключены.");
  }

  const parsed = leadFormSchema.safeParse(body);

  if (!parsed.success) {
    logReject("validation", { ip, issues: parsed.error.issues.map((issue) => issue.path.join(".")) });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "validation");
    }
    return reject("validation", "Проверьте поля формы.");
  }

  if (parsed.data.hp) {
    logReject("honeypot", { ip });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "honeypot");
    }
    return reject("honeypot", "Заявка отклонена.");
  }

  if (Date.now() - parsed.data.startedAt < 3_000) {
    logReject("too-fast", { ip });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "too-fast");
    }
    return reject("too-fast", "Форма отправлена слишком быстро. Попробуйте ещё раз.");
  }

  if (!assertRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    logReject("rate-limit", { ip });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "rate-limit");
    }
    return reject("rate-limit", "Слишком много заявок с одного адреса. Попробуйте позже.");
  }

  const normalized = normalizeLeadPayload(parsed.data);
  const fingerprint = hashPayload(JSON.stringify(normalized), config.leadSalt);

  if (!assertDuplicateCooldown(fingerprint, 2 * 60 * 1000)) {
    logReject("duplicate", { ip });
    if (htmlRequest) {
      return redirectToLeadForm(event, siteUrl, "error", "duplicate");
    }
    return reject("duplicate", "Похожая заявка уже была отправлена недавно.");
  }

  await deliverLead(normalized);

  if (htmlRequest) {
    return redirectToLeadForm(event, siteUrl, "success");
  }

  return {
    ok: true,
    status: "accepted",
    message: "Заявка принята. Следующий шаг — уточнение проекта и расчёт."
  };
});
