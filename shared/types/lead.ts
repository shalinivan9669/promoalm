export interface LeadFormData {
  name: string;
  contact: string;
  city?: string;
  objectType?: string;
  message: string;
  preferredChannel?: "phone" | "whatsapp";
  deadline?: string;
  budget?: string;
  address?: string;
  referenceLink?: string;
  locationsCount?: number;
  needsInstallation?: boolean;
  hasFacadePhoto?: boolean;
  hasDimensions?: boolean;
  hasBrandbook?: boolean;
  consent: boolean;
  taskType: string;
  sourcePage: string;
  startedAt: number;
  hp?: string;
}

export interface NormalizedLeadPayload {
  name: string;
  contact: string;
  city?: string;
  objectType?: string;
  message: string;
  preferredChannel: "phone" | "whatsapp";
  deadline?: string;
  budget?: string;
  address?: string;
  referenceLink?: string;
  locationsCount?: number;
  needsInstallation: boolean;
  hasFacadePhoto: boolean;
  hasDimensions: boolean;
  hasBrandbook: boolean;
  consent: boolean;
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
