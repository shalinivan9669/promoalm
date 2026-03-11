interface CounterRecord {
  count: number;
  resetAt: number;
}

const requestCounters = new Map<string, CounterRecord>();
const duplicateCounters = new Map<string, number>();

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = requestCounters.get(key);

  if (!existing || existing.resetAt < now) {
    requestCounters.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

export function assertDuplicateCooldown(key: string, windowMs: number) {
  const now = Date.now();
  const existing = duplicateCounters.get(key);

  if (existing && existing > now) {
    return false;
  }

  duplicateCounters.set(key, now + windowMs);
  return true;
}
