let lastCallTime = 0;
const MIN_INTERVAL_MS = 4500; // ~13 calls/min, safely under the 15/min free-tier limit

async function throttle() {
  const now = Date.now();
  const wait = lastCallTime + MIN_INTERVAL_MS - now;
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallTime = Date.now();
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 4): Promise<T> {
  await throttle();
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.status ?? err?.error?.code;
    const isRateLimitOrServerError = status === 429 || status === 503;
    const isNetworkError = err?.message?.includes("fetch failed") || err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
    const isRetryable = isRateLimitOrServerError || isNetworkError; // CHANGED

    if (isRetryable && retries > 0) {
      const retryDelay = err?.error?.details?.find((d: any) => d["@type"]?.includes("RetryInfo"))?.retryDelay;
      const waitSeconds = retryDelay ? parseFloat(retryDelay) : (isNetworkError ? 5 : 15);
      console.log(`Retrying after error (${status ?? err?.message}), waiting ${waitSeconds}s...`);
      await new Promise((r) => setTimeout(r, (waitSeconds + 1) * 1000));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
}