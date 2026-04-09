import type { ExecutionContext, FetchEventLike } from '../types'

interface FetchModule {
  fetch(req: Request, env?: unknown, ctx?: ExecutionContext): Promise<Response>
}

/**
 * Registers a fetch event listener that delegates to the provided app's fetch method.
 * @param app An object with a fetch method that handles incoming requests.
 * @example
 * ```ts
 * import { DiscordHono, fire } from 'discord-hono'
 * const app = new DiscordHono().command('ping', (c) => c.res('pong'))
 * fire(app)
 * ```
 */
export const fire = (app: FetchModule): void => {
  // @ts-expect-error
  addEventListener('fetch', (event: FetchEventLike) => {
    event.respondWith(app.fetch(event.request, undefined, event))
  })
}
