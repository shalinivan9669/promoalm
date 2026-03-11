import { readBody, getHeader } from "h3";

import type { LeadApiError, LeadApiSuccess, LeadFormData } from "../../shared/types/lead";
import { normalizeLeadPayload, leadFormSchema } from "../../shared/validation/lead";
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

export default defineEventHandler(async (event): Promise<LeadApiSuccess | LeadApiError> => {
  const config = useRuntimeConfig(event);
  const body = await readBody<LeadFormData>(event);
  const userAgent = getHeader(event, "user-agent") || "";
  const ip = getClientIp(event);

  if (!isAllowedOrigin(event, config.public.siteUrl)) {
    logReject("origin", { ip });
    return reject("origin", "Запрос пришёл не с разрешённого источника.");
  }

  if (isSuspiciousUserAgent(userAgent)) {
    logReject("agent", { ip, userAgent });
    return reject("agent", "Автоматические запросы отключены.");
  }

  const parsed = leadFormSchema.safeParse(body);

  if (!parsed.success) {
    logReject("validation", { ip, issues: parsed.error.issues.map((issue) => issue.path.join(".")) });
    return reject("validation", "Проверьте поля формы.");
  }

  if (parsed.data.hp) {
    logReject("honeypot", { ip });
    return reject("honeypot", "Заявка отклонена.");
  }

  if (Date.now() - parsed.data.startedAt < 3_000) {
    logReject("too-fast", { ip });
    return reject("too-fast", "Форма отправлена слишком быстро. Попробуйте ещё раз.");
  }

  if (!assertRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    logReject("rate-limit", { ip });
    return reject("rate-limit", "Слишком много заявок с одного адреса. Попробуйте позже.");
  }

  const normalized = normalizeLeadPayload(parsed.data);
  const fingerprint = hashPayload(JSON.stringify(normalized), config.leadSalt);

  if (!assertDuplicateCooldown(fingerprint, 2 * 60 * 1000)) {
    logReject("duplicate", { ip });
    return reject("duplicate", "Похожая заявка уже отправлена недавно. Если нужно, дождитесь ответа или отправьте обновлённые данные.");
  }

  await deliverLead(normalized);

  return {
    ok: true,
    status: "accepted",
    message: "Заявка принята. Следующий шаг — уточнение проекта и расчёт."
  };
});
