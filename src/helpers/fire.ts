import type { ExecutionContext, FetchEventLike } from '../types'

interface FetchModule {
  fetch(req: Request, env?: unknown, ctx?: ExecutionContext): Promise<Response>
}

export const fire = (app: FetchModule): void => {
  // @ts-expect-error
  addEventListener('fetch', (event: FetchEventLike) => {
    event.respondWith(app.fetch(event.request, undefined, event))
  })
}
