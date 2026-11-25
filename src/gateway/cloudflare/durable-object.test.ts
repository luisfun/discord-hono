import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('cloudflare:workers', () => ({
  DurableObject: class {
    ctx: unknown
    env: unknown
    constructor(ctx: unknown, env: unknown) {
      this.ctx = ctx
      this.env = env
    }
  },
}))

import { GatewayDO, type GatewayContext, type GatewayEnv } from './durable-object'

class MockSocket extends EventTarget {
  sent: { op: number; d: unknown }[] = []
  accept = vi.fn()
  close = vi.fn()
  send = vi.fn((data: string) => this.sent.push(JSON.parse(data)))

  message(payload: object): void {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(payload) }))
  }

  closed(code: number): void {
    const event = new Event('close')
    Object.defineProperty(event, 'code', { value: code })
    this.dispatchEvent(event)
  }
}

class TestGateway extends GatewayDO {
  events: GatewayContext[] = []
  override on(c: GatewayContext): Promise<void> {
    this.events.push(c)
    return Promise.resolve()
  }
}

const setup = (initial?: string) => {
  let stored = initial
  let alarm: number | null = null
  const pending: Promise<unknown>[] = []
  const ctx = {
    storage: {
      sql: {
        exec: (sql: string, value?: string) => {
          if (sql.startsWith('INSERT')) stored = value
          return { toArray: () => (sql.startsWith('SELECT') && stored ? [{ data: stored }] : []) }
        },
      },
      getAlarm: () => Promise.resolve(alarm),
      setAlarm: (time: number) => {
        alarm = time
        return Promise.resolve()
      },
      deleteAlarm: () => {
        alarm = null
        return Promise.resolve()
      },
    },
    waitUntil: (promise: Promise<unknown>) => pending.push(promise),
  }
  const env: GatewayEnv = { DISCORD_TOKEN: 'test-token', DISCORD_GATEWAY_INTENTS: 513 }
  const bot = new TestGateway(ctx as unknown as DurableObjectState, env)
  const flush = async (): Promise<void> => {
    if (pending.length > 0) {
      await Promise.all(pending.splice(0))
      await flush()
    }
  }
  return { bot, env, ctx, flush, getStored: () => stored, getAlarm: () => alarm }
}

const discovery = (remaining = 10, resetAfter = 60_000): Response =>
  Response.json({
    url: 'wss://gateway.discord.gg',
    session_start_limit: { remaining, reset_after: resetAfter },
  })

const upgrade = (socket: MockSocket): Response => ({ status: 101, webSocket: socket }) as unknown as Response

describe('GatewayDO', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000_000)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('identifies, dispatches typed events, and resumes with the latest sequence', async () => {
    const socket = new MockSocket()
    const fetch = vi.fn().mockResolvedValueOnce(discovery()).mockResolvedValueOnce(upgrade(socket))
    vi.stubGlobal('fetch', fetch)
    const first = setup()
    await first.bot.ensureConnected()
    expect(first.getAlarm()).not.toBeNull()
    socket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    expect(socket.sent[0]).toMatchObject({ op: 2, d: { token: 'test-token', intents: 513, shard: [0, 1] } })
    socket.message({
      op: 0,
      t: 'READY',
      s: 1,
      d: { session_id: 'session', resume_gateway_url: 'wss://gateway.discord.gg' },
    })
    socket.message({ op: 0, t: 'MESSAGE_CREATE', s: 2, d: { content: 'hello' } })
    await first.flush()
    expect(first.bot.events[1]?.gateway).toMatchObject({ t: 'MESSAGE_CREATE', d: { content: 'hello' } })
    expect(first.bot.events[1]?.rest).toBeTypeOf('function')

    socket.closed(4000)
    await first.flush()
    const stored = first.getStored()
    const second = setup(stored)
    const resumedSocket = new MockSocket()
    fetch.mockResolvedValueOnce(upgrade(resumedSocket))
    vi.advanceTimersByTime(35_000)
    await second.bot.ensureConnected()
    resumedSocket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    expect(resumedSocket.sent[0]).toEqual({ op: 6, d: { token: 'test-token', session_id: 'session', seq: 2 } })
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('backs off when the session start limit is exhausted', async () => {
    const fetch = vi.fn().mockResolvedValue(discovery(0, 60_000))
    vi.stubGlobal('fetch', fetch)
    const { bot, getAlarm } = setup()
    await bot.ensureConnected()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(getAlarm()).toBe(1_060_000)
    await bot.ensureConnected()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('uses the bot token for REST calls from a dispatch context', async () => {
    const socket = new MockSocket()
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(socket))
      .mockResolvedValueOnce(Response.json({ id: '123' }))
    vi.stubGlobal('fetch', fetch)
    const { bot, flush } = setup()
    await bot.ensureConnected()
    socket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    socket.message({ op: 0, t: 'MESSAGE_CREATE', s: 1, d: { channel_id: '123' } })
    await flush()
    const [event] = bot.events
    if (!event) throw new Error('Expected a Gateway event')
    await event.rest('POST', '/channels/{channel.id}/messages', ['123'], { content: 'hello' })
    expect(fetch).toHaveBeenLastCalledWith(
      'https://discord.com/api/v10/channels/123/messages',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bot test-token' }) }),
    )
  })

  it('invalidates the session on an invalid sequence and identifies again', async () => {
    const socket = new MockSocket()
    const next = new MockSocket()
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(socket))
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(next))
    vi.stubGlobal('fetch', fetch)
    const { bot, flush } = setup()
    await bot.ensureConnected()
    socket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    socket.message({
      op: 0,
      t: 'READY',
      s: 1,
      d: { session_id: 'session', resume_gateway_url: 'wss://gateway.discord.gg' },
    })
    socket.closed(4007)
    await flush()
    vi.advanceTimersByTime(10_000)
    await bot.ensureConnected()
    next.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    expect(next.sent[0]?.op).toBe(2)
    expect(fetch).toHaveBeenCalledTimes(4)
  })

  it('stops reconnecting on fatal close and restores it when credentials change', async () => {
    const socket = new MockSocket()
    const next = new MockSocket()
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(socket))
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(next))
    vi.stubGlobal('fetch', fetch)
    const { bot, env, flush, getAlarm } = setup()
    await bot.ensureConnected()
    socket.closed(4004)
    await flush()
    expect(getAlarm()).toBeNull()
    await bot.ensureConnected()
    expect(fetch).toHaveBeenCalledTimes(2)
    env.DISCORD_TOKEN = 'replacement-token'
    vi.advanceTimersByTime(5000)
    await bot.ensureConnected()
    expect(fetch).toHaveBeenCalledTimes(4)
  })

  it('stops and does not reconnect on a later alarm', async () => {
    const socket = new MockSocket()
    const fetch = vi.fn().mockResolvedValueOnce(discovery()).mockResolvedValueOnce(upgrade(socket))
    vi.stubGlobal('fetch', fetch)
    const { bot, getAlarm } = setup()
    await bot.ensureConnected()
    await bot.stop()
    expect(socket.close).toHaveBeenCalledWith(4000, 'reconnecting')
    expect(getAlarm()).toBeNull()
    await bot.alarm()
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('reconnects if a heartbeat is not acknowledged', async () => {
    const socket = new MockSocket()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(discovery()).mockResolvedValueOnce(upgrade(socket)))
    const { bot, flush, getAlarm } = setup()
    await bot.ensureConnected()
    socket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    vi.advanceTimersByTime(60_000)
    await flush()
    expect(socket.sent.some(frame => frame.op === 1)).toBe(true)
    expect(socket.close).toHaveBeenCalledWith(4000, 'reconnecting')
    expect(getAlarm()).not.toBeNull()
  })

  it('starts again if stopped while discovery is still in progress', async () => {
    const socket = new MockSocket()
    let finishDiscovery: ((value: Response) => void) | undefined
    const fetch = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<Response>(resolve => {
            finishDiscovery = resolve
          }),
      )
      .mockResolvedValueOnce(discovery())
      .mockResolvedValueOnce(upgrade(socket))
    vi.stubGlobal('fetch', fetch)
    const { bot } = setup()
    const first = bot.ensureConnected()
    await vi.waitFor(() => expect(finishDiscovery).toBeDefined())
    await bot.stop()
    const second = bot.ensureConnected()
    finishDiscovery?.(discovery())
    await Promise.all([first, second])
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(socket.accept).toHaveBeenCalledOnce()
  })

  it('does not connect if stopped while scheduling the watchdog', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { bot, ctx } = setup()
    let finishAlarm: (() => void) | undefined
    vi.spyOn(ctx.storage, 'setAlarm').mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finishAlarm = resolve
        }),
    )
    const connecting = bot.ensureConnected()
    await vi.waitFor(() => expect(finishAlarm).toBeDefined())
    await bot.stop()
    finishAlarm?.()
    await connecting
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a resume URL outside Discord', async () => {
    const socket = new MockSocket()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(discovery()).mockResolvedValueOnce(upgrade(socket)))
    const { bot, flush } = setup()
    await bot.ensureConnected()
    socket.message({ op: 10, d: { heartbeat_interval: 30_000 } })
    socket.message({ op: 0, t: 'READY', s: 1, d: { session_id: 'session', resume_gateway_url: 'wss://evil.test' } })
    await flush()
    expect(socket.close).toHaveBeenCalledWith(4000, 'reconnecting')
  })
})
