import { afterEach, describe, expect, it, vi } from 'vitest'
import { DiscordHono } from '../discord-hono'
import type { FetchEventLike } from '../types'
import { fire } from './fire'

describe('fire', () => {
  const originalAddEventListener = globalThis.addEventListener

  afterEach(() => {
    // restore global listener and reset mocks
    globalThis.addEventListener = originalAddEventListener
    vi.resetAllMocks()
  })

  it('registers a fetch listener', () => {
    let capturedType: any
    let capturedHandler: any
    globalThis.addEventListener = (type: string, handler: unknown): void => {
      capturedType = type
      capturedHandler = handler
    }

    const app = { fetch: vi.fn() }
    fire(app)

    expect(capturedType).toBe('fetch')
    expect(typeof capturedHandler).toBe('function')
  })

  it('calls app.fetch and uses event.respondWith', async () => {
    let handler: any
    globalThis.addEventListener = (_type: string, h: unknown): void => {
      handler = h
    }

    const resp = new Response('ok')
    const fetchPromise = Promise.resolve(resp)
    const app = { fetch: vi.fn().mockReturnValue(fetchPromise) }

    fire(app)

    const req = new Request('https://example/')
    const respondWith = vi.fn()
    const event = { request: req, respondWith }

    // invoke the registered handler as the worker runtime would
    handler(event)

    expect(app.fetch).toHaveBeenCalledWith(req, undefined, event)
    expect(respondWith).toHaveBeenCalledWith(fetchPromise)
  })

  it('DiscordHono Type Check', async () => {
    const app = new DiscordHono()
    let handler: any
    globalThis.addEventListener = (_type: string, h: unknown): void => {
      handler = h
    }
    fire(app)

    // Simulate a fetch event
    const req = new Request('https://example/')
    const respondWith = vi.fn()
    const event = { request: req, respondWith }
    handler(event)

    // Since the app.fetch is not mocked here, we just check if it was called with correct parameters
    expect(respondWith).toHaveBeenCalled()
  })

  it('passes env option object to app.fetch', async () => {
    let handler: any
    globalThis.addEventListener = (_type: string, h: unknown): void => {
      handler = h
    }

    const resp = new Response('ok')
    const fetchPromise = Promise.resolve(resp)
    const app = { fetch: vi.fn().mockReturnValue(fetchPromise) }

    const options = { env: { FOO: 'bar' } }
    fire(app, options)

    const req = new Request('https://example/')
    const respondWith = vi.fn()
    const event = { request: req, respondWith }

    handler(event)

    expect(app.fetch).toHaveBeenCalledWith(req, { FOO: 'bar' }, event)
    expect(respondWith).toHaveBeenCalledWith(fetchPromise)
  })

  it('calls env function with event and passes result', async () => {
    let handler: any
    globalThis.addEventListener = (_type: string, h: unknown): void => {
      handler = h
    }

    const resp = new Response('ok')
    const fetchPromise = Promise.resolve(resp)
    const app = { fetch: vi.fn().mockReturnValue(fetchPromise) }

    const options = { env: (_e: FetchEventLike) => ({ key: 'test-key' }) }
    fire(app, options)

    const req = new Request('https://example/abc')
    const respondWith = vi.fn()
    const event = { request: req, respondWith }

    handler(event)

    expect(app.fetch).toHaveBeenCalledWith(req, { key: 'test-key' }, event)
    expect(respondWith).toHaveBeenCalledWith(fetchPromise)
  })

  it('passes executionCtx object to app.fetch as ctx', async () => {
    let handler: any
    globalThis.addEventListener = (_type: string, h: unknown): void => {
      handler = h
    }

    const resp = new Response('ok')
    const fetchPromise = Promise.resolve(resp)
    const app = { fetch: vi.fn().mockReturnValue(fetchPromise) }

    const fakeCtx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() }
    const options = { executionCtx: fakeCtx }
    fire(app, options)

    const req = new Request('https://example/')
    const respondWith = vi.fn()
    const event = { request: req, respondWith }

    handler(event)

    expect(app.fetch).toHaveBeenCalledWith(req, undefined, fakeCtx)
    expect(respondWith).toHaveBeenCalledWith(fetchPromise)
  })
})
