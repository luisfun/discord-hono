import type { APIBaseInteraction, InteractionType, APIInteractionResponsePong } from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { Context } from './context'
import type { Env, ExecutionContext, CronEvent, Commands, Handler, PublicKeyHandler } from './types'
import { ResponseJson } from './utils'

const defineClass = function (): {
  new <E extends Env = Env>(): {
    /**
     * @param commands type Commands
     */
    commands: (commands: Commands<E>) => void
  } & {
    /**
     * @param uniqueId uniqueId set in Component builder
     * @param handler type Handler
     */
    component: (uniqueId: string, handler: Handler<E>) => void
  } & {
    /**
     * Just setting up cron here does not execute it. Please set up a cron trigger in wrangler.toml.
     * @param schedule cron schedule - '': trigger all crons
     * @param handler type Handler
     * @sample
     * ```ts
     * app.cron('0 0 * * *', daily_handler)
     * app.cron('', all_other_schedule_handler)
     * ```
     */
    cron: (schedule: string, handler: Handler<E>) => void
  } & {
    /**
     * Used when DISCORD_PUBLIC_KEY error occurs.
     */
    publicKey: (handler: PublicKeyHandler<E>) => void //(key: string) => void
  }
} {
  return class {} as never
}

/**
 * @sample
 * ```ts
 * const app = new DiscordHono()
 * app.commands(commands)
 * export default app
 * ```
 */
export const DiscordHono = class<E extends Env = Env> extends defineClass()<E> {
  #commands: Commands | undefined = undefined
  #components: [string, Handler<E>][] = []
  #cronjobs: [string, Handler<E>][] = []
  #publicKey: PublicKeyHandler<E> | undefined = undefined

  constructor() {
    super()
    this.commands = commands => {
      this.#commands = commands
      return this
    }
    this.component = (uniqueId, handler) => {
      this.#components.push([uniqueId, handler])
      return this
    }
    this.cron = (cron, handler) => {
      this.#cronjobs.push([cron, handler])
      return this
    }
    this.publicKey = handler => {
      this.#publicKey = handler
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
      const DISCORD_PUBLIC_KEY = this.#publicKey ? this.#publicKey(env) : (env.DISCORD_PUBLIC_KEY as string | undefined)
      if (!DISCORD_PUBLIC_KEY)
        throw new Error('There is no DISCORD_PUBLIC_KEY. You can set the key in app.publicKey(env => env.KEY).')
      // verify
      const signature = request.headers.get('x-signature-ed25519')
      const timestamp = request.headers.get('x-signature-timestamp')
      const body = await request.text()
      const isValidRequest = signature && timestamp && verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY)
      if (!isValidRequest || !body) {
        return new Response('Bad request signature.', { status: 401 })
      }
      // verify end
      // ************ any 何とかしたい
      const interaction: APIBaseInteraction<InteractionType, any> = JSON.parse(body)
      // interaction type https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
      switch (interaction.type) {
        case 1:
          return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
        case 2:
          if (!this.#commands) throw new Error('Commands is not set.')
          const commandName = interaction.data?.name.toLowerCase()
          const commandIndex = this.#commands.findIndex(command => command[0].name.toLowerCase() === commandName)
          const command = this.#commands[commandIndex][0]
          const commandHandler = this.#commands[commandIndex][1]
          const commandInteraction = interaction as APIBaseInteraction<2, any>
          return await commandHandler(new Context(request, env, executionCtx, commandInteraction, command))
        case 3:
          if (!this.#components[0])
            throw new Error('Component is not set. You can set the Component Handler in app.component(id, handler).')
          const reqCustomId = interaction.data?.custom_id as string
          const uniqueId = reqCustomId.split(';')[0]
          const custom_id = reqCustomId.slice(uniqueId.length + 1, reqCustomId.length)
          const componentIndex = this.#components.findIndex(e => e[0] === uniqueId || e[0] === '')
          const componentHandler = this.#components[componentIndex][1]
          const componentInteraction = interaction as APIBaseInteraction<3, any>
          componentInteraction.data.custom_id = custom_id
          return await componentHandler(new Context(request, env, executionCtx, componentInteraction))
        default:
          return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
      }
    }
    return new Response('Not Found.', { status: 404 })
  }

  scheduled = async (event: CronEvent, env: E['Bindings'] | {}, executionCtx: ExecutionContext) => {
    const cronIndex = this.#cronjobs.findIndex(e => e[0] === event.cron || e[0] === '')
    const handler = this.#cronjobs[cronIndex][1]
    await handler(new Context(event, env, executionCtx))
  }
}
