import type { ExecutionContext, FetchEventLike } from '../types'

type AppWithFetch = {
  fetch: (req: Request, env?: object, ctx?: ExecutionContext) => Promise<Response>
}

export const fire = (app: AppWithFetch): void => {
  // @ts-expect-error
  addEventListener('fetch', (event: FetchEventLike) => {
    event.respondWith(app.fetch(event.request, undefined, event))
  })
}
