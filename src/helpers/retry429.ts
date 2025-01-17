/**
 * [Reference](https://discord.com/developers/docs/topics/rate-limits)
 * @param {() => ReturnType<typeof fetch>} fetchFunc
 * @param {number} retryCount
 * @param {number} [addDelay=0] Additional delay milliseconds
 * @returns {ReturnType<typeof fetch>}
 */
export const retry429 = (fetchFunc: () => ReturnType<typeof fetch>, retryCount: number, addDelay = 0) => {
  const retryFetch = async (count: number) => {
    const res = await fetchFunc()
    if (res.status !== 429 || count < 1) return res
    const retryAfter = res.headers.get('Retry-After')
    if (!retryAfter) return res
    const delay = Number(retryAfter) * 1e3 + addDelay
    await new Promise(resolve => setTimeout(resolve, Math.max(delay, 0)))
    return retryFetch(count - 1)
  }
  return retryFetch(retryCount)
}

/*
const getXRateLimit = (res: Response) => ({
  RetryAfter: res.headers.get('Retry-After'),
  Limit: res.headers.get('X-RateLimit-Limit'),
  Remaining: res.headers.get('X-RateLimit-Limit'),
  Reset: res.headers.get('X-RateLimit-Reset'),
  ResetAfter: res.headers.get('X-RateLimit-Reset-After'),
  Bucket: res.headers.get('X-RateLimit-Bucket'),
  Scope: res.headers.get('X-RateLimit-Scope'),
  Global: res.headers.get('X-RateLimit-Global'),
})
*/
