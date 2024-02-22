type XRateLimit = {
  RetryAfter: string | null
  Limit: string | null
  Remaining: string | null
  Reset: string | null
  ResetAfter: string | null
  Bucket: string | null
  Scope: string | null
  Global: string | null
}

export class ApiRateLimitController {
  protected response: Response | undefined = undefined
  protected xRateLimit: XRateLimit | undefined = undefined
  set res(res: Response | undefined) {
    this.response = res
    if (res) this.xRateLimit = getXRateLimit(res)
  }
  get headers() {
    return this.xRateLimit
  }
  wait = async () => {
    if (!this.response || !this.xRateLimit) return null
    if (this.response.status === 429) {
      const ms = Number(this.xRateLimit.RetryAfter || 60) * 1000
      console.log('===== API Rate Limit =====\nsleep: ', ms, '\n', this.xRateLimit, '\n')
      await sleep(ms)
    } else {
      const ms = Math.max((3 - Number(this.xRateLimit.Remaining || 5)) * 500, 0)
      if (ms === 0) return null
      await sleep(ms)
    }
    return null
  }
}

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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, Math.max(ms, 0)))
