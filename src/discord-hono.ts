import type { APIInteractionResponsePong } from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { Context } from './context'
import type { Env, ExecutionContext, CronEvent, Commands, CronHandler, Interaction } from './types'
import { ResponseJson } from './utils'

const defineClass = function (): {
  new <E extends Env = Env>(): {
    /**
     * @param commands type Commands
     */
    commands: (commands: Commands<E>) => void
  } & {
    /**
     * Just setting up cron here does not execute it. Please set up a cron trigger in wrangler.toml.
     * @param schedule cron schedule - '': trigger all crons
     * @param handler type CronHandler
     * @sample
     * ```ts
     * app.cron('0 0 * * *', daily_handler)
     * app.cron('', all_other_schedule_handler)
     * ```
     */
    cron: (schedule: string, handler: CronHandler<E>) => void
  } & {
    /**
     * Used when DISCORD_PUBLIC_KEY error occurs.
     */
    discordPublicKey: (key: string) => void
  }
} {
  return class {} as never
}

export const DiscordHono = class<E extends Env = Env> extends defineClass()<E> {
  #commands: Commands | undefined = undefined
  #cronjobs: [string, CronHandler<E>][] = []
  #DISCORD_PUBLIC_KEY: string | undefined = undefined

  /**
   * @sample
   * ```ts
   * const app = new DiscordHono()
   * app.commands(commands)
   * export default app
   * ```
   */
  constructor() {
    super()
    this.commands = commands => {
      this.#commands = commands
      return this
    }
    this.cron = (cron, handler) => {
      this.#cronjobs.push([cron, handler])
      return this
    }
    this.discordPublicKey = key => {
      this.#DISCORD_PUBLIC_KEY = key
      return this
    }
  }

  fetch = async (
    request: Request,
    env?: E['Bindings'] | { DISCORD_PUBLIC_KEY?: string },
    executionCtx?: ExecutionContext,
  ) => {
    if (request.method === 'GET') {
      return new Response('powered by Discord Hono🔥')
    } else if (request.method === 'POST') {
      if (!env) throw new Error('There is no env.')
      const DISCORD_PUBLIC_KEY = this.#DISCORD_PUBLIC_KEY || (env.DISCORD_PUBLIC_KEY as string | undefined)
      if (!DISCORD_PUBLIC_KEY)
        throw new Error('There is no DISCORD_PUBLIC_KEY. You can set the key in app.discordPublicKey(KEY).')
      // verify
      const signature = request.headers.get('x-signature-ed25519')
      const timestamp = request.headers.get('x-signature-timestamp')
      const body = await request.text()
      const isValidRequest = signature && timestamp && verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY)
      if (!isValidRequest || !body) {
        return new Response('Bad request signature.', { status: 401 })
      }
      // verify end
      const interaction: Interaction = JSON.parse(body)
      // interaction type https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
      if (interaction.type === 1) {
        // verify
        return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
      }
      if (interaction.type === 2) {
        if (!this.#commands) throw new Error('Commands is not set.')
        const commandName = interaction.data?.name.toLowerCase()
        const commandIndex = this.#commands.findIndex(command => command[0].name.toLowerCase() === commandName)
        const command = this.#commands[commandIndex][0]
        const handler = this.#commands[commandIndex][1]
        return await handler(new Context(request, env, executionCtx, command, interaction))
      }
      return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
    }
    return new Response('Not Found.', { status: 404 })
  }

  scheduled = async (event: CronEvent, env: E['Bindings'] | {}, executionCtx: ExecutionContext) => {
    const cronIndex = this.#cronjobs.findIndex(e => e[0] === event.cron || e[0] === '')
    const handler = this.#cronjobs[cronIndex][1]
    await handler(new Context(event, env, executionCtx))
  }
}
