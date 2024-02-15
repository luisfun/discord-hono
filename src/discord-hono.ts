import type {
  APIBaseInteraction,
  InteractionType,
  APIInteraction,
  APIApplicationCommandInteractionData,
  APIInteractionResponsePong,
} from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { Context } from './context'
import type {
  Env,
  ExecutionContext,
  CronEvent,
  Commands,
  Handler,
  PublicKeyHandler,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
} from './types'
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
      if (!DISCORD_PUBLIC_KEY) throw new Error('There is no DISCORD_PUBLIC_KEY. Set by app.publicKey(env => env.KEY).')
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
      const data: APIBaseInteraction<InteractionType, any> = JSON.parse(body)
      // interaction type https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
      switch (data.type) {
        case 1: {
          return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
        }
        case 2: {
          if (!this.#commands) throw new Error('Commands is not set. Set by app.commands(Commands).')
          const interaction = data as InteractionCommandData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const name = interaction.data.name.toLowerCase()
          const index = this.#commands.findIndex(command => command[0].name.toLowerCase() === name)
          const command = this.#commands[index][0]
          const handler = this.#commands[index][1]
          return await handler(new Context(request, env, executionCtx, interaction, command))
        }
        case 3: {
          if (!this.#components[0]) throw new Error('Component Handler is not set. Set by app.component(id, Handler).')
          const interaction = data as InteractionComponentData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const customId = interaction.data.custom_id
          const uniqueId = customId.split(';')[0]
          const custom_id = customId.slice(uniqueId.length + 1, customId.length)
          const index = this.#components.findIndex(e => e[0] === uniqueId || e[0] === '')
          const handler = this.#components[index][1]
          interaction.data.custom_id = custom_id
          return await handler(new Context(request, env, executionCtx, interaction))
        }
        case 5: {
          if (!this.#components[0]) throw new Error('Component Handler is not set. Set by app.component(id, Handler).')
          const interaction = data as InteractionModalData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const modalId = interaction.data.custom_id
          //const customId = interaction.data.components[0].components[0].custom_id
          const uniqueId = modalId.split(';')[0]
          //const custom_id = customId.slice(uniqueId.length + 1, customId.length)
          const index = this.#components.findIndex(e => e[0] === uniqueId || e[0] === '')
          const handler = this.#components[index][1]
          return await handler(new Context(request, env, executionCtx, interaction))
        }
        default: {
          console.warn('interaction.type: ', data.type)
          return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
        }
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
