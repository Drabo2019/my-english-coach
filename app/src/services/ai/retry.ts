const TRANSIENT = /HTTP (429|500|502|503|504)/;

/**
 * Cloud models are sometimes overloaded for a few seconds ("high demand", HTTP 503) or rate limited (429).
 * Retry those twice with a short pause before giving up; any other error is thrown at once.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
  attempts = 3,
): Promise<T> {
  for (let k = 0; ; k += 1) {
    try {
      return await fn();
    } catch (e) {
      if (!TRANSIENT.test(String(e)) || k >= attempts - 1) throw e;
      await sleep(1500 * (k + 1));
    }
  }
}

export const isBusyError = (e: string | null | undefined) => !!e && TRANSIENT.test(e);
