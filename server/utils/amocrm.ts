import { createHmac, timingSafeEqual } from "node:crypto";

interface AmoCrmTokenDomainResponse {
  domain: string;
}

export interface AmoCrmConfig {
  clientId?: string;
  clientSecret?: string;
  longLivedToken?: string;
  baseUrl?: string;
  redirectUri?: string;
  pipelineId?: number;
  statusId?: number;
}

interface AmoCrmRequestOptions {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
}

type RuntimeConfigShape = {
  amocrm?: {
    clientId?: string;
    clientSecret?: string;
    longLivedToken?: string;
    baseUrl?: string;
    redirectUri?: string;
    pipelineId?: string;
    statusId?: string;
  };
};

const amoBaseUrlCache = new Map<string, string>();

function normalizeOptionalString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parsePositiveInteger(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function normalizeAmoBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");

  if (!trimmed) {
    throw new Error("amoCRM base URL is empty.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function getAmoCrmConfig() {
  const runtimeConfig = useRuntimeConfig() as RuntimeConfigShape;
  const config = runtimeConfig.amocrm || {};

  return {
    clientId: normalizeOptionalString(config.clientId),
    clientSecret: normalizeOptionalString(config.clientSecret),
    longLivedToken: normalizeOptionalString(config.longLivedToken),
    baseUrl: normalizeOptionalString(config.baseUrl),
    redirectUri: normalizeOptionalString(config.redirectUri),
    pipelineId: parsePositiveInteger(config.pipelineId),
    statusId: parsePositiveInteger(config.statusId)
  } satisfies AmoCrmConfig;
}

export class AmoCrmApiError extends Error {
  statusCode?: number;
  data?: unknown;

  constructor(message: string, options?: { statusCode?: number; data?: unknown }) {
    super(message);
    this.name = "AmoCrmApiError";
    this.statusCode = options?.statusCode;
    this.data = options?.data;
  }
}

function extractErrorStatusCode(error: unknown) {
  if (typeof error === "object" && error && "statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if (typeof error === "object" && error && "response" in error) {
    const response = error.response as { status?: number } | undefined;
    return response?.status;
  }

  return undefined;
}

function extractErrorData(error: unknown) {
  if (typeof error === "object" && error && "data" in error) {
    return error.data;
  }

  return undefined;
}

export async function resolveAmoBaseUrl(config: AmoCrmConfig) {
  if (config.baseUrl) {
    return normalizeAmoBaseUrl(config.baseUrl);
  }

  if (!config.longLivedToken) {
    throw new Error("amoCRM long-lived token is not configured.");
  }

  const cachedBaseUrl = amoBaseUrlCache.get(config.longLivedToken);

  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  const response = await $fetch<AmoCrmTokenDomainResponse>("https://www.amocrm.ru/oauth2/account/subdomain", {
    headers: {
      Authorization: `Bearer ${config.longLivedToken}`
    }
  });

  const baseUrl = normalizeAmoBaseUrl(response.domain);
  amoBaseUrlCache.set(config.longLivedToken, baseUrl);

  return baseUrl;
}

export async function amoFetch<T>(config: AmoCrmConfig, path: string, options: AmoCrmRequestOptions = {}) {
  if (!config.longLivedToken) {
    throw new Error("amoCRM long-lived token is not configured.");
  }

  const baseUrl = await resolveAmoBaseUrl(config);
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    return await $fetch<T>(url, {
      method: options.method || "GET",
      body: options.body as Record<string, unknown> | undefined,
      headers: {
        Authorization: `Bearer ${config.longLivedToken}`
      }
    });
  } catch (error) {
    throw new AmoCrmApiError(`amoCRM request failed: ${options.method || "GET"} ${url}`, {
      statusCode: extractErrorStatusCode(error),
      data: extractErrorData(error)
    });
  }
}

export function buildAmoDisconnectSignature(clientId: string, accountId: number, clientSecret: string) {
  return createHmac("sha256", clientSecret).update(`${clientId}|${accountId}`).digest("hex");
}

export function isValidAmoDisconnectSignature(clientId: string, accountId: number, clientSecret: string, signature: string) {
  const expectedSignature = buildAmoDisconnectSignature(clientId, accountId, clientSecret);

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}
