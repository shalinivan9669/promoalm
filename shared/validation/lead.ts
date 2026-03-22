import { z } from "zod";

import type { LeadFormData, NormalizedLeadPayload } from "../types/lead";

function normalizeOptionalString(value: string | undefined | null) {
  const trimmed = typeof value === "string" ? value.trim() : "";

  return trimmed.length > 0 ? trimmed : undefined;
}

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя или название компании.").max(120),
  contact: z.string().trim().min(6, "Укажите телефон или WhatsApp.").max(40),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  objectType: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(12, "Коротко опишите задачу.").max(2000),
  preferredChannel: z.enum(["phone", "whatsapp"]).optional(),
  deadline: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  address: z.string().trim().max(180).optional().or(z.literal("")),
  referenceLink: z.string().trim().max(500).optional().or(z.literal("")),
  locationsCount: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.coerce.number().int().min(2).max(500).optional()
  ),
  needsInstallation: z.coerce.boolean().optional(),
  hasFacadePhoto: z.coerce.boolean().optional(),
  hasDimensions: z.coerce.boolean().optional(),
  hasBrandbook: z.coerce.boolean().optional(),
  consent: z.coerce.boolean().refine(Boolean, "Подтвердите согласие на обработку данных."),
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
    objectType: normalizeOptionalString(payload.objectType),
    message: payload.message.trim(),
    preferredChannel: payload.preferredChannel ?? "whatsapp",
    deadline: normalizeOptionalString(payload.deadline),
    budget: normalizeOptionalString(payload.budget),
    address: normalizeOptionalString(payload.address),
    referenceLink: normalizeOptionalString(payload.referenceLink),
    locationsCount: payload.locationsCount,
    needsInstallation: Boolean(payload.needsInstallation),
    hasFacadePhoto: Boolean(payload.hasFacadePhoto),
    hasDimensions: Boolean(payload.hasDimensions),
    hasBrandbook: Boolean(payload.hasBrandbook),
    consent: Boolean(payload.consent),
    taskType: payload.taskType.trim(),
    sourcePage: payload.sourcePage.trim(),
    startedAt: payload.startedAt
  };
}
