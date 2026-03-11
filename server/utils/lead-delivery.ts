import type { NormalizedLeadPayload } from "../../shared/types/lead";

export async function deliverLead(payload: NormalizedLeadPayload) {
  console.info("[lead:stub]", JSON.stringify(payload));

  return {
    delivered: true
  };
}
