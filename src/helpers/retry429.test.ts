import { retry429 } from './retry429'

describe('retry429', () => {
  it('returns response immediately on successful request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ status: 200 })
    const result = await retry429(mockFetch, 3)
    expect(result.status).toBe(200)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('retries according to Retry-After header on 429 error', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 429, headers: new Headers({ 'Retry-After': '1' }) })
      .mockResolvedValueOnce({ status: 200 })

    vi.useFakeTimers()
    const promise = retry429(mockFetch, 3)
    await vi.runAllTimersAsync()
    const result = await promise
    vi.useRealTimers()

    expect(result.status).toBe(200)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('applies additional delay', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 429, headers: new Headers({ 'Retry-After': '1' }) })
      .mockResolvedValueOnce({ status: 200 })

    vi.useFakeTimers()
    const promise = retry429(mockFetch, 3, 500)
    await vi.runAllTimersAsync()
    const result = await promise
    vi.useRealTimers()

    expect(result.status).toBe(200)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    //expect(vi.getTimerCount()).toBe(0) // Confirm all timers have been executed
  })

  it('returns last response when max retry count is reached', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ status: 429, headers: new Headers({ 'Retry-After': '1' }) })

    vi.useFakeTimers()
    const promise = retry429(mockFetch, 3)
    await vi.runAllTimersAsync()
    const result = await promise
    vi.useRealTimers()

    expect(result.status).toBe(429)
    expect(mockFetch).toHaveBeenCalledTimes(4) // Initial + 3 retries
  })

  it('does not retry when Retry-After header is missing', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ status: 429, headers: new Headers() })
    const result = await retry429(mockFetch, 3)
    expect(result.status).toBe(429)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
