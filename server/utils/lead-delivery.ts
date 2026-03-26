import type { NormalizedLeadPayload } from "../../shared/types/lead";
import { amoFetch, getAmoCrmConfig } from "./amocrm";

interface AmoCrmLeadCreateResult {
  id: number;
  contact_id?: number | null;
  company_id?: number | null;
  merged?: boolean;
  request_id?: string[];
}

interface AmoCrmLeadNoteCreateResult {
  id: number;
  entity_id: number;
}

function formatBoolean(value: boolean) {
  return value ? "Да" : "Нет";
}

function formatOptionalValue(value: number | string | undefined) {
  if (value === undefined || value === "") {
    return "Не указано";
  }

  return String(value);
}

function pushLine(lines: string[], label: string, value: number | string | undefined) {
  lines.push(`${label}: ${formatOptionalValue(value)}`);
}

export function buildLeadName(payload: NormalizedLeadPayload) {
  return `${payload.taskType} - ${payload.name}`.slice(0, 255);
}

export function buildLeadTags(payload: NormalizedLeadPayload) {
  const rawTags = [
    "Neon Market",
    payload.taskType,
    payload.city,
    payload.preferredChannel === "whatsapp" ? "WhatsApp" : "Телефон",
    payload.needsInstallation ? "Нужен монтаж" : undefined
  ];

  return Array.from(new Set(rawTags.filter((tag): tag is string => Boolean(tag && tag.trim())))).map((name) => ({ name }));
}

export function buildLeadNote(payload: NormalizedLeadPayload) {
  const lines: string[] = ["Новая заявка с сайта Neon Market", ""];

  lines.push("Контакт");
  pushLine(lines, "Имя или компания", payload.name);
  pushLine(lines, "Телефон / WhatsApp", payload.contact);
  pushLine(lines, "Предпочтительный канал", payload.preferredChannel === "whatsapp" ? "WhatsApp" : "Телефон");
  pushLine(lines, "Город", payload.city);
  lines.push("");

  lines.push("Проект");
  pushLine(lines, "Тип задачи", payload.taskType);
  pushLine(lines, "Тип объекта", payload.objectType);
  pushLine(lines, "Срок", payload.deadline);
  pushLine(lines, "Бюджет", payload.budget);
  pushLine(lines, "Адрес точки", payload.address);
  pushLine(lines, "Количество точек", payload.locationsCount);
  pushLine(lines, "Ссылка на материалы", payload.referenceLink);
  pushLine(lines, "Нужен монтаж", formatBoolean(payload.needsInstallation));
  pushLine(lines, "Есть фото фасада", formatBoolean(payload.hasFacadePhoto));
  pushLine(lines, "Есть размеры", formatBoolean(payload.hasDimensions));
  pushLine(lines, "Есть брендбук", formatBoolean(payload.hasBrandbook));
  pushLine(lines, "Согласие на обработку данных", formatBoolean(payload.consent));
  pushLine(lines, "Страница-источник", payload.sourcePage);
  pushLine(lines, "Форма открыта", new Date(payload.startedAt).toISOString());
  pushLine(lines, "Отправлено в CRM", new Date().toISOString());
  lines.push("");

  lines.push("Сообщение");
  lines.push(payload.message);

  return lines.join("\n");
}

function isNonProductionEnvironment() {
  return process.env.NODE_ENV !== "production";
}

export async function deliverLead(payload: NormalizedLeadPayload) {
  const config = getAmoCrmConfig();

  if (!config.longLivedToken) {
    if (isNonProductionEnvironment()) {
      console.info("[lead:stub:no-amocrm-config]", JSON.stringify(payload));

      return {
        delivered: false,
        mode: "stub"
      };
    }

    throw new Error("amoCRM is not configured.");
  }

  const createdLeads = await amoFetch<AmoCrmLeadCreateResult[]>(config, "/api/v4/leads/complex", {
    method: "POST",
    body: [
      {
        name: buildLeadName(payload),
        pipeline_id: config.pipelineId,
        status_id: config.statusId,
        tags_to_add: buildLeadTags(payload),
        _embedded: {
          contacts: [
            {
              name: payload.name,
              custom_fields_values: [
                {
                  field_code: "PHONE",
                  values: [
                    {
                      enum_code: "WORK",
                      value: payload.contact
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  });

  const lead = createdLeads[0];

  if (!lead?.id) {
    throw new Error("amoCRM did not return a lead ID.");
  }

  await amoFetch<AmoCrmLeadNoteCreateResult[]>(config, "/api/v4/leads/notes", {
    method: "POST",
    body: [
      {
        entity_id: lead.id,
        note_type: "common",
        params: {
          text: buildLeadNote(payload)
        }
      }
    ]
  });

  return {
    delivered: true,
    leadId: lead.id,
    contactId: lead.contact_id ?? null
  };
}
