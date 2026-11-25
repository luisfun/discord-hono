// Reference
// https://github.com/dcartertwo/discord-gateway-cloudflare-do
// https://zenn.dev/chikina/articles/079141c0303df9
// https://github.com/chikina-dev/discord-pdf-preview

import { DurableObject } from 'cloudflare:workers'
import type { GatewayDispatchPayload } from 'discord-api-types/v10'

import { createRest } from '../rest/rest'

/** Bindings required by the single-shard Gateway. */
export interface GatewayEnv {
  DISCORD_TOKEN: string
  DISCORD_GATEWAY_INTENTS: number | string
}

/** Context passed to a Gateway dispatch handler. */
export interface GatewayContext<E extends GatewayEnv = GatewayEnv> {
  gateway: GatewayDispatchPayload
  env: E
  rest: ReturnType<typeof createRest>
}

interface Session {
  id: string
  url: string
  sequence: number
}

interface Stored {
  active: boolean
  session: Session | null
  identifyAfter: number
  reconnectAt: number
  fatal: boolean
  fingerprint: string
}

interface Payload {
  op: number
  d: unknown
  s?: number | null | undefined
  t?: string | null | undefined
}

const random = (): number => new DataView(crypto.getRandomValues(new Uint8Array(4)).buffer).getUint32(0) / 2 ** 32
const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const gatewayUrl = (address: string): string => {
  const url = new URL(address)
  if (
    url.protocol !== 'wss:' ||
    url.username ||
    url.password ||
    url.port ||
    !(url.hostname === 'gateway.discord.gg' || url.hostname.endsWith('.discord.gg'))
  )
    throw new Error('Invalid Discord Gateway URL')
  url.protocol = 'https:'
  url.search = '?v=10&encoding=json'
  return url.href
}

const parsePayload = (raw: string): Payload => {
  const value: unknown = JSON.parse(raw)
  if (!isRecord(value)) throw new Error('Invalid Discord Gateway payload')
  const { op, d, s, t } = value
  if (
    typeof op !== 'number' ||
    (s !== undefined && s !== null && (typeof s !== 'number' || !Number.isSafeInteger(s))) ||
    (t !== undefined && t !== null && typeof t !== 'string')
  )
    throw new Error('Invalid Discord Gateway payload')
  return { op, d, s, t }
}

/**
 * A single-shard Discord Gateway client running in a Cloudflare Durable Object.
 * Call `ensureConnected()` on its stub to start it.
 */
export abstract class GatewayDO<E extends GatewayEnv = GatewayEnv> extends DurableObject<E> {
  #socket: WebSocket | null = null
  #connecting: Promise<void> | null = null
  #generation = 0
  #failures = 0
  #heartbeatTimer: ReturnType<typeof setTimeout> | undefined
  #helloTimer: ReturnType<typeof setTimeout> | undefined
  #stored: Stored

  constructor(ctx: DurableObjectState, env: E) {
    super(ctx, env)
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS gateway_state (id INTEGER PRIMARY KEY, data TEXT NOT NULL)')
    const [row] = ctx.storage.sql.exec<{ data: string }>('SELECT data FROM gateway_state WHERE id = 1').toArray()
    this.#stored = row
      ? JSON.parse(row.data)
      : { active: false, session: null, identifyAfter: 0, reconnectAt: 0, fatal: false, fingerprint: '' }
  }

  /** Handle a Discord Gateway dispatch event. */
  abstract on(c: GatewayContext<E>): Promise<void>

  #save(): void {
    this.ctx.storage.sql.exec(
      'INSERT INTO gateway_state (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
      JSON.stringify(this.#stored),
    )
  }

  #background(promise: Promise<unknown>, operation: string): void {
    this.ctx.waitUntil(
      promise.catch(() => {
        console.error(`GatewayDO: ${operation} failed`)
      }),
    )
  }

  /** Start or resume the Gateway; repeated calls are safe. */
  async ensureConnected(): Promise<void> {
    if (this.#connecting) {
      await this.#connecting
      if (this.#stored.active) return
      return this.ensureConnected()
    }
    const attempt = this.#ensureConnected()
    this.#connecting = attempt
    try {
      await attempt
    } finally {
      this.#connecting = null
    }
  }

  async #ensureConnected(): Promise<void> {
    const generation = this.#generation
    try {
      const { DISCORD_TOKEN: token, DISCORD_GATEWAY_INTENTS: rawIntents } = this.env
      const intents = typeof rawIntents === 'string' && rawIntents.trim() === '' ? Number.NaN : Number(rawIntents)
      if (!token || !Number.isSafeInteger(intents) || intents < 0) {
        this.#stored.reconnectAt = Date.now() + 60_000
        this.#save()
        throw new Error('Invalid Gateway token or intents')
      }
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${token}:${intents}`))
      if (generation !== this.#generation) return
      const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
      if (this.#stored.fingerprint !== fingerprint) {
        this.#disconnect()
        this.#stored = {
          ...this.#stored,
          session: null,
          reconnectAt: 0,
          fatal: false,
          fingerprint,
        }
      }
      this.#stored.active = true
      this.#save()
      if (this.#socket || this.#stored.fatal) return
      const due = Math.max(this.#stored.reconnectAt, this.#stored.session ? 0 : this.#stored.identifyAfter)
      if (Date.now() < due) return
      const connectionGeneration = this.#generation
      await this.ctx.storage.setAlarm(Date.now() + 60_000)
      if (connectionGeneration !== this.#generation) return
      await this.#connectGateway(token, intents, connectionGeneration)
    } finally {
      await this.#planAlarm()
    }
  }

  /** Stop reconnecting and close the active connection. */
  async stop(): Promise<void> {
    this.#disconnect()
    this.#stored.active = false
    this.#save()
    await this.ctx.storage.deleteAlarm()
  }

  async #discoverGateway(token: string, generation: number): Promise<string | undefined> {
    const response = await fetch('https://discord.com/api/v10/gateway/bot', {
      headers: { Authorization: `Bot ${token}` },
      signal: AbortSignal.timeout(15_000),
    })
    if (generation !== this.#generation) {
      await response.body?.cancel()
      return
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) this.#stored.fatal = true
      const retry = Number(response.headers.get('retry-after') ?? 60)
      this.#stored.identifyAfter = Date.now() + (Number.isFinite(retry) ? Math.max(1, retry) : 60) * 1000
      this.#save()
      await response.body?.cancel()
      throw new Error(`Gateway discovery failed: ${response.status}`)
    }
    const info: unknown = await response.json()
    if (generation !== this.#generation) return
    if (
      !isRecord(info) ||
      typeof info['url'] !== 'string' ||
      !isRecord(info['session_start_limit']) ||
      typeof info['session_start_limit']['remaining'] !== 'number' ||
      !Number.isSafeInteger(info['session_start_limit']['remaining']) ||
      typeof info['session_start_limit']['reset_after'] !== 'number' ||
      !Number.isFinite(info['session_start_limit']['reset_after']) ||
      info['session_start_limit']['reset_after'] < 0
    )
      throw new Error('Invalid Gateway discovery response')
    const { remaining, reset_after: resetAfter } = info['session_start_limit']
    this.#stored.identifyAfter = Date.now() + (remaining <= 1 ? resetAfter : 5000)
    this.#save()
    if (remaining > 0) return info['url']
    return undefined
  }

  async #connectGateway(token: string, intents: number, generation: number): Promise<void> {
    try {
      const address = this.#stored.session?.url ?? (await this.#discoverGateway(token, generation))
      if (!address || generation !== this.#generation) return
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15_000)
      const response = await fetch(gatewayUrl(address), {
        headers: { Upgrade: 'websocket' },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout))
      if (generation !== this.#generation) {
        response.webSocket?.close(4000)
        return
      }
      if (response.status !== 101 || !response.webSocket) {
        await response.body?.cancel()
        throw new Error(`Gateway upgrade failed: ${response.status}`)
      }
      const socket = response.webSocket
      this.#socket = socket
      const heartbeat = { acknowledged: true, helloReceived: false }
      socket.accept()
      this.#helloTimer = setTimeout(() => this.#background(this.#reconnect(generation), 'Hello timeout'), 15_000)
      socket.addEventListener('message', event => {
        if (generation !== this.#generation) return
        try {
          if (typeof event.data !== 'string') throw new Error('Unexpected Gateway frame')
          const payload = parsePayload(event.data)
          switch (payload.op) {
            case 10: {
              const interval = isRecord(payload.d) ? payload.d['heartbeat_interval'] : undefined
              if (
                heartbeat.helloReceived ||
                typeof interval !== 'number' ||
                !Number.isFinite(interval) ||
                interval < 1000
              )
                throw new Error('Invalid Gateway Hello')
              heartbeat.helloReceived = true
              clearTimeout(this.#helloTimer)
              const { session } = this.#stored
              if (!session) {
                this.#stored.identifyAfter = Math.max(this.#stored.identifyAfter, Date.now() + 5000)
                this.#save()
              }
              socket.send(
                JSON.stringify(
                  session
                    ? { op: 6, d: { token, session_id: session.id, seq: session.sequence } }
                    : {
                        op: 2,
                        d: {
                          token,
                          intents,
                          properties: { os: 'linux', browser: 'discord-hono', device: 'discord-hono' },
                          shard: [0, 1],
                        },
                      },
                ),
              )
              this.#scheduleHeartbeat(socket, heartbeat, interval, generation, true)
              break
            }
            case 11:
              heartbeat.acknowledged = true
              break
            case 1:
              heartbeat.acknowledged = false
              socket.send(JSON.stringify({ op: 1, d: this.#stored.session?.sequence ?? null }))
              break
            case 7:
              this.#background(this.#reconnect(generation), 'reconnect')
              break
            case 9:
              this.#background(this.#reconnect(generation, payload.d !== true, 1000 + random() * 4000), 'reconnect')
              break
            case 0:
              this.#dispatch(payload)
              break
          }
        } catch {
          console.error('GatewayDO: invalid Gateway message')
          this.#background(this.#reconnect(generation), 'reconnect')
        }
      })
      socket.addEventListener('close', event => {
        if (generation !== this.#generation) return
        console.info(`GatewayDO: connection closed (${event.code})`)
        if ([4004, 4010, 4011, 4012, 4013, 4014].includes(event.code)) {
          this.#stored.fatal = true
          this.#save()
          console.error(`GatewayDO: fatal Gateway close (${event.code})`)
        }
        this.#background(this.#reconnect(generation, [1000, 1001, 4007, 4009].includes(event.code)), 'reconnect')
      })
      socket.addEventListener('error', () => this.#background(this.#reconnect(generation), 'reconnect'))
    } catch (error) {
      console.error('GatewayDO: connection failed', error instanceof Error ? error.message : 'unknown error')
      await this.#reconnect(generation)
    }
  }

  #scheduleHeartbeat(
    socket: WebSocket,
    heartbeat: { acknowledged: boolean },
    interval: number,
    generation: number,
    first = false,
  ): void {
    clearTimeout(this.#heartbeatTimer)
    this.#heartbeatTimer = setTimeout(
      () => {
        if (generation !== this.#generation) return
        try {
          if (!heartbeat.acknowledged) {
            console.error('GatewayDO: heartbeat acknowledgement missing')
            this.#background(this.#reconnect(generation), 'reconnect')
            return
          }
          heartbeat.acknowledged = false
          socket.send(JSON.stringify({ op: 1, d: this.#stored.session?.sequence ?? null }))
          this.#scheduleHeartbeat(socket, heartbeat, interval, generation)
        } catch {
          this.#background(this.#reconnect(generation), 'reconnect')
        }
      },
      first ? Math.floor(random() * interval) : interval,
    )
  }

  #dispatch(payload: Payload): void {
    if (typeof payload.t !== 'string' || typeof payload.s !== 'number') throw new Error('Invalid Gateway dispatch')
    if (payload.t === 'READY') {
      if (
        !isRecord(payload.d) ||
        typeof payload.d['session_id'] !== 'string' ||
        typeof payload.d['resume_gateway_url'] !== 'string'
      )
        throw new Error('Invalid Gateway Ready')
      gatewayUrl(payload.d['resume_gateway_url'])
      this.#stored.session = {
        id: payload.d['session_id'],
        url: payload.d['resume_gateway_url'],
        sequence: payload.s,
      }
    }
    if (this.#stored.session) this.#stored.session.sequence = payload.s
    this.#save()
    if (payload.t === 'READY' || payload.t === 'RESUMED') this.#failures = 0
    this.#background(
      Promise.resolve().then(() =>
        this.on({
          gateway: payload as GatewayDispatchPayload,
          env: this.env,
          rest: createRest(this.env.DISCORD_TOKEN),
        }),
      ),
      'dispatch handler',
    )
  }

  #disconnect(): void {
    this.#generation++
    clearTimeout(this.#heartbeatTimer)
    clearTimeout(this.#helloTimer)
    const socket = this.#socket
    this.#socket = null
    try {
      socket?.close(4000, 'reconnecting')
    } catch {
      console.warn('GatewayDO: socket was already closed')
    }
  }

  async #reconnect(generation: number, invalidate = false, delay?: number): Promise<void> {
    if (generation !== this.#generation) return
    this.#disconnect()
    if (invalidate) this.#stored.session = null
    this.#failures++
    this.#stored.reconnectAt =
      Date.now() + (delay ?? Math.min(30_000, 1000 * 2 ** Math.min(this.#failures, 5))) + Math.floor(random() * 500)
    this.#save()
    await this.#planAlarm()
  }

  async #planAlarm(): Promise<void> {
    if (!this.#stored.active || this.#stored.fatal) {
      await this.ctx.storage.deleteAlarm()
      return
    }
    const due = this.#socket
      ? Date.now() + 60_000
      : Math.max(Date.now() + 1000, this.#stored.reconnectAt, this.#stored.session ? 0 : this.#stored.identifyAfter)
    const current = await this.ctx.storage.getAlarm()
    if (current === null || due < current || current <= Date.now()) await this.ctx.storage.setAlarm(due)
  }

  /** Restore the connection after a disconnect or Durable Object restart. */
  override async alarm(): Promise<void> {
    if (this.#stored.active) await this.ensureConnected()
  }
}
