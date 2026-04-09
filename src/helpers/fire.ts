import type { ExecutionContext, FetchEventLike } from '../types'

interface FetchModule {
  fetch(req: Request, env?: unknown, ctx?: ExecutionContext): Response | Promise<Response>
}

interface FireOptions {
  env?: unknown | ((event: FetchEventLike) => unknown)
  executionCtx?: ExecutionContext | ((event: FetchEventLike) => ExecutionContext)
}

/**
 * Registers a fetch event listener that delegates to the provided app's fetch method.
 * @param app An object with a fetch method that handles incoming requests.
 * @beta
 * @example
 * ```ts
 * import { DiscordHono, fire } from 'discord-hono'
 * const app = new DiscordHono().command('ping', (c) => c.res('pong'))
 * fire(app)
 * ```
 */
export const fire = (app: FetchModule, options?: FireOptions): void => {
  // @ts-expect-error
  addEventListener('fetch', (event: FetchEventLike) => {
    const env = typeof options?.env === 'function' ? options.env(event) : options?.env
    const ctx = !options?.executionCtx
      ? event
      : typeof options?.executionCtx === 'function'
        ? options.executionCtx(event)
        : options?.executionCtx
    event.respondWith(app.fetch(event.request, env, ctx))
  })
}
