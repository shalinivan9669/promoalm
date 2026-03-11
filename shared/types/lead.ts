export interface LeadFormData {
  name: string;
  contact: string;
  city?: string;
  message: string;
  preferredChannel?: "phone" | "whatsapp";
  locationsCount?: number;
  needsInstallation?: boolean;
  taskType: string;
  sourcePage: string;
  startedAt: number;
  hp?: string;
}

export interface NormalizedLeadPayload {
  name: string;
  contact: string;
  city?: string;
  message: string;
  preferredChannel: "phone" | "whatsapp";
  locationsCount?: number;
  needsInstallation: boolean;
  taskType: string;
  sourcePage: string;
  startedAt: number;
}

export interface LeadApiSuccess {
  ok: true;
  status: "accepted";
  message: string;
}

export interface LeadApiError {
  ok: false;
  status: "rejected";
  reason:
    | "validation"
    | "honeypot"
    | "too-fast"
    | "rate-limit"
    | "duplicate"
    | "origin"
    | "agent";
  message: string;
}
