import { getQuery, setResponseStatus } from "h3";

import { getAmoCrmConfig, isValidAmoDisconnectSignature } from "../../../utils/amocrm";

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default defineEventHandler((event) => {
  const config = getAmoCrmConfig();
  const query = getQuery(event);
  const clientId = firstQueryValue((query.client_uuid || query.client_id) as string | string[] | undefined);
  const signature = firstQueryValue(query.signature as string | string[] | undefined);
  const accountIdValue = firstQueryValue(query.account_id as string | string[] | undefined);
  const accountId = Number.parseInt(accountIdValue || "", 10);

  if (!config.clientId || !config.clientSecret) {
    setResponseStatus(event, 503);

    return {
      ok: false,
      message: "amoCRM disconnect hook is not configured."
    };
  }

  if (!clientId || !signature || !Number.isInteger(accountId) || accountId <= 0) {
    setResponseStatus(event, 400);

    return {
      ok: false,
      message: "Invalid amoCRM disconnect hook payload."
    };
  }

  if (clientId !== config.clientId || !isValidAmoDisconnectSignature(config.clientId, accountId, config.clientSecret, signature)) {
    setResponseStatus(event, 401);

    return {
      ok: false,
      message: "Invalid amoCRM disconnect hook signature."
    };
  }

  console.info("[amocrm:disconnect]", JSON.stringify({ accountId, clientId }));

  return {
    ok: true,
    disconnected: true,
    accountId
  };
});
