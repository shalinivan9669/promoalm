function tryParseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function isLoopbackHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

export function isAllowedOriginValue(requestOrigin: string, allowedSiteUrl: string, nodeEnv = process.env.NODE_ENV) {
  const requestUrl = tryParseUrl(requestOrigin);
  const allowedUrl = tryParseUrl(allowedSiteUrl);

  if (!requestUrl || !allowedUrl) {
    return requestOrigin === allowedSiteUrl;
  }

  if (requestUrl.origin === allowedUrl.origin) {
    return true;
  }

  if (nodeEnv !== "production" && isLoopbackHostname(requestUrl.hostname)) {
    return true;
  }

  return false;
}
