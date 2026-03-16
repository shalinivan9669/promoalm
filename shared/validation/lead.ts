import { z } from "zod";

import type { LeadFormData, NormalizedLeadPayload } from "../types/lead";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя или название компании.").max(120),
  contact: z.string().trim().min(6, "Укажите телефон или WhatsApp.").max(40),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(12, "Коротко опишите задачу.").max(2000),
  preferredChannel: z.enum(["phone", "whatsapp"]).optional(),
  locationsCount: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.coerce.number().int().min(2).max(500).optional()
  ),
  needsInstallation: z.coerce.boolean().optional(),
  taskType: z.string().trim().min(2).max(120),
  sourcePage: z.string().trim().min(1).max(240),
  startedAt: z.coerce.number().int().positive(),
  hp: z.string().max(0).optional().or(z.literal(""))
}) satisfies z.ZodType<LeadFormData>;

export function normalizeContactValue(contact: string) {
  const trimmed = contact.trim();
  const digits = trimmed.replace(/[^\d+]/g, "");

  if (digits.startsWith("8") && digits.length === 11) {
    return `+7${digits.slice(1)}`;
  }

  if (!digits.startsWith("+") && /^\d{10,15}$/.test(digits)) {
    return `+${digits}`;
  }

  return digits || trimmed;
}

export function normalizeLeadPayload(payload: LeadFormData): NormalizedLeadPayload {
  return {
    name: payload.name.trim(),
    contact: normalizeContactValue(payload.contact),
    city: payload.city?.trim() || undefined,
    message: payload.message.trim(),
    preferredChannel: payload.preferredChannel ?? "whatsapp",
    locationsCount: payload.locationsCount,
    needsInstallation: Boolean(payload.needsInstallation),
    taskType: payload.taskType.trim(),
    sourcePage: payload.sourcePage.trim(),
    startedAt: payload.startedAt
  };
}
