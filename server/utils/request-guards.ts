import { createHash } from "node:crypto";

import type { H3Event } from "h3";
import { getHeader, getRequestHost, getRequestProtocol } from "h3";
import { isAllowedOriginValue } from "../../shared/utils/origin";

export function getClientIp(event: H3Event) {
  const forwarded = getHeader(event, "x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }

  return event.node.req.socket.remoteAddress || "unknown";
}

export function getRequestOrigin(event: H3Event) {
  const origin = getHeader(event, "origin");

  if (origin) {
    return origin;
  }

  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  const host = getRequestHost(event, { xForwardedHost: true });

  return `${protocol}://${host}`;
}

export function isAllowedOrigin(event: H3Event, allowedSiteUrl: string) {
  const requestOrigin = getRequestOrigin(event);
  return isAllowedOriginValue(requestOrigin, allowedSiteUrl);
}

export function isSuspiciousUserAgent(userAgent: string | undefined) {
  if (!userAgent) {
    return true;
  }

  return /(python|curl|wget|scrapy|httpclient|bot)/i.test(userAgent);
}

export function hashPayload(value: string, salt: string) {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}
