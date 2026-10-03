import type { Context, ExecutionContext } from 'hono'

// https://github.com/honojs/hono/blob/main/src/hono-base.ts#L91
type MountOptionHandler = (c: Context) => unknown
type MountReplaceRequest = (originalRequest: Request) => Request
type MountOptions =
  | MountOptionHandler
  | {
      optionHandler?: MountOptionHandler
      replaceRequest?: MountReplaceRequest | false
    }

/**
 * @example
 * const discord = new DiscordHono<Env>()
 * const app = new Hono<Env>()
 * hono.mount('/interactions', discord.fetch, honoMountOptions)
 */
export const honoMountOptions = {
  optionHandler: c => {
    let executionContext: ExecutionContext | undefined = undefined
    try {
      executionContext = c.executionCtx
    } catch {} // oxlint-disable-line no-empty : Do nothing
    const option = {
      var: { ...c.var },
    }
    return [c.env, executionContext, option]
  },
} as const satisfies MountOptions
