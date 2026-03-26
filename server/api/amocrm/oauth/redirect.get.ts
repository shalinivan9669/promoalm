import { getQuery, setHeader, setResponseStatus } from "h3";

import { getAmoCrmConfig, normalizeAmoBaseUrl } from "../../../utils/amocrm";

interface AmoCrmTokenExchangeResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderOauthPage(payload: { ok: boolean; message: string; data?: Record<string, unknown> }) {
  const serializedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>amoCRM OAuth</title>
  </head>
  <body>
    <script>
      const payload = ${serializedPayload};
      if (window.opener) {
        window.opener.postMessage(payload, "*");
        window.close();
      }
    </script>
    <main>
      <h1>${payload.ok ? "Авторизация amoCRM подтверждена" : "Ошибка авторизации amoCRM"}</h1>
      <p>${escapeHtml(payload.message)}</p>
    </main>
  </body>
</html>`;
}

export default defineEventHandler(async (event) => {
  const config = getAmoCrmConfig();
  const query = getQuery(event);
  const code = firstQueryValue(query.code as string | string[] | undefined);
  const referer = firstQueryValue(query.referer as string | string[] | undefined);
  const state = firstQueryValue(query.state as string | string[] | undefined);
  const platform = firstQueryValue(query.platform as string | string[] | undefined);
  const error = firstQueryValue(query.error as string | string[] | undefined);

  setHeader(event, "content-type", "text/html; charset=utf-8");

  if (error) {
    setResponseStatus(event, 400);

    return renderOauthPage({
      ok: false,
      message: `amoCRM returned an authorization error: ${error}.`,
      data: { error, state, platform }
    });
  }

  if (!code || !referer) {
    setResponseStatus(event, 400);

    return renderOauthPage({
      ok: false,
      message: "Missing code or account referer in amoCRM redirect.",
      data: { state, platform }
    });
  }

  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    setResponseStatus(event, 503);

    return renderOauthPage({
      ok: false,
      message: "amoCRM OAuth credentials are not fully configured on the server.",
      data: { state, platform, referer }
    });
  }

  const oauthUrl = `${normalizeAmoBaseUrl(referer)}/oauth2/access_token`;

  try {
    const tokenResponse = await $fetch<AmoCrmTokenExchangeResponse>(oauthUrl, {
      method: "POST",
      body: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri
      }
    });

    console.info(
      "[amocrm:oauth:redirect]",
      JSON.stringify({
        referer: normalizeAmoBaseUrl(referer),
        state,
        platform,
        hasAccessToken: Boolean(tokenResponse.access_token),
        hasRefreshToken: Boolean(tokenResponse.refresh_token)
      })
    );

    return renderOauthPage({
      ok: true,
      message: "amoCRM sent a valid authorization code and the server exchanged it successfully.",
      data: {
        referer: normalizeAmoBaseUrl(referer),
        state,
        platform,
        expiresIn: tokenResponse.expires_in,
        hasRefreshToken: Boolean(tokenResponse.refresh_token)
      }
    });
  } catch (error) {
    console.error("[amocrm:oauth:redirect:error]", error);
    setResponseStatus(event, 502);

    return renderOauthPage({
      ok: false,
      message: "The server could not exchange the amoCRM authorization code for tokens.",
      data: { referer: normalizeAmoBaseUrl(referer), state, platform }
    });
  }
});
