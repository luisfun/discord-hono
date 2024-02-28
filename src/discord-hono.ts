import type { APIBaseInteraction, InteractionType, APIInteractionResponsePong } from 'discord-api-types/v10'
import { CommandContext, ComponentContext, ModalContext, CronContext } from './context'
import type {
  Env,
  EnvDiscordKey,
  ExecutionContext,
  CronEvent,
  DiscordKeyHandler,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
  DiscordKey,
} from './types'
import { verify } from './verify'
import { ResponseJson } from './utils'

type Option = { verify: Verify }
type Verify = (
  body: string,
  signature: string | null,
  timestamp: string | null,
  publicKey: string,
) => Promise<boolean> | boolean
type CommandHandler<E extends Env = any> = (c: CommandContext<E>) => Promise<Response> | Response
type ComponentHandler<E extends Env = any> = (c: ComponentContext<E>) => Promise<Response> | Response
type ModalHandler<E extends Env = any> = (c: ModalContext<E>) => Promise<Response> | Response
type CronHandler<E extends Env = any> = (c: CronContext<E>) => Promise<unknown>
type Handler = CommandHandler | ComponentHandler | ModalHandler | CronHandler
type Handlers<H extends Handler> = [string, H][]

class DiscordHonoBase<E extends Env> {
  #verify: Verify = verify
  #commandHandlers: Handlers<CommandHandler<E>> = []
  #componentHandlers: Handlers<ComponentHandler<E>> = []
  #modalHandlers: Handlers<ModalHandler<E>> = []
  #cronHandlers: Handlers<CronHandler<E>> = []
  #discordKeyHandler: DiscordKeyHandler<E> | undefined = undefined
  constructor(option?: Option) {
    if (option?.verify) this.#verify = option?.verify
  }

  command = (command: string, handler: CommandHandler<E>) => {
    this.#commandHandlers.push([command, handler])
    return this
  }
  component = (componentId: string, handler: ComponentHandler<E>) => {
    this.#componentHandlers.push([componentId, handler])
    return this
  }
  modal = (modalId: string, handler: ModalHandler<E>) => {
    this.#modalHandlers.push([modalId, handler])
    return this
  }
  cron = (cronId: string, handler: CronHandler<E>) => {
    this.#cronHandlers.push([cronId, handler])
    return this
  }
  discordKey = (handler: DiscordKeyHandler<E>) => {
    this.#discordKeyHandler = handler
    return this
  }

  fetch = async (request: Request, env?: E['Bindings'] | EnvDiscordKey, executionCtx?: ExecutionContext) => {
    if (request.method === 'GET') {
      return new Response('powered by Discord Hono🔥')
    } else if (request.method === 'POST') {
      if (!env) throw new Error('There is no env.')
      const discord = this.#discordKeyHandler
        ? this.#discordKeyHandler(env)
        : ({
            APPLICATION_ID: env.DISCORD_APPLICATION_ID,
            TOKEN: env.DISCORD_TOKEN,
            PUBLIC_KEY: env.DISCORD_PUBLIC_KEY,
          } as DiscordKey)
      if (!discord.PUBLIC_KEY) throw new Error('There is no DISCORD_PUBLIC_KEY. Set by app.publicKey(env => env.KEY).')
      // verify
      const signature = request.headers.get('x-signature-ed25519')
      const timestamp = request.headers.get('x-signature-timestamp')
      const body = await request.text()
      const isValid = await this.#verify(body, signature, timestamp, discord.PUBLIC_KEY)
      if (!isValid) return new Response('Bad request signature.', { status: 401 })
      // verify end
      // ************ any 何とかしたい
      const data: APIBaseInteraction<InteractionType, any> = JSON.parse(body)
      // interaction type https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
      switch (data.type) {
        case 1: {
          return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
        }
        case 2: {
          const interaction = data as InteractionCommandData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const { handler } = getHandler<CommandHandler>(this.#commandHandlers, interaction.data.name.toLowerCase())
          return await handler(new CommandContext(request, env, executionCtx, discord, interaction))
        }
        case 3: {
          const { handler, interact } = getHandler<ComponentHandler>(
            this.#componentHandlers,
            data as InteractionComponentData,
          )
          return await handler(new ComponentContext(request, env, executionCtx, discord, interact))
        }
        case 5: {
          const { handler, interact } = getHandler<ModalHandler>(this.#modalHandlers, data as InteractionModalData)
          return await handler(new ModalContext(request, env, executionCtx, discord, interact))
        }
        case 4: {
          console.warn('interaction.type: ', data.type)
          console.warn('Not yet implemented. Please tell the developer of discord-hono how to get this reply.')
          return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
        }
        default: {
          console.warn('interaction.type: ', data.type)
          return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
        }
      }
    }
    return new Response('Not Found.', { status: 404 })
  }

  scheduled = async (event: CronEvent, env: E['Bindings'] | EnvDiscordKey, executionCtx?: ExecutionContext) => {
    const discord = this.#discordKeyHandler
      ? this.#discordKeyHandler(env)
      : ({
          APPLICATION_ID: env?.DISCORD_APPLICATION_ID,
          TOKEN: env?.DISCORD_TOKEN,
          PUBLIC_KEY: env?.DISCORD_PUBLIC_KEY,
        } as DiscordKey)
    const { handler } = getHandler<CronHandler>(this.#cronHandlers, event.cron)
    if (executionCtx?.waitUntil) executionCtx.waitUntil(handler(new CronContext(event, env, executionCtx, discord)))
    else {
      console.log(
        'The process does not apply waitUntil. it would be helpful if you could contact the developer of discord-hono.',
      )
      await handler(new CronContext(event, env, executionCtx, discord))
    }
  }
}

const getHandler = <
  H extends Handler,
  Hs extends Handlers<H> = any,
  I extends string | InteractionComponentData | InteractionModalData = any,
>(
  handlers: Hs,
  interact: I,
) => {
  if (!handlers[0]) throw new Error('Handlers is not set.')
  let str = ''
  if (typeof interact === 'string') str = interact
  else {
    if (!interact.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
    const id = interact.data.custom_id
    str = id.split(';')[0]
    interact.data.custom_id = id.slice(str.length + 1)
  }
  const index = handlers.findIndex(e => e[0] === str || e[0] === '')
  const handler = handlers[index][1]
  return { handler, interact }
}

/**
 * @sample
 * ```ts
 * const app = new DiscordHono()
 * app.commands(commands)
 * export default app
 * ```
 */
export class DiscordHono<E extends Env = Env> extends DiscordHonoBase<E> {
  constructor(option?: Option) {
    super(option)
  }
}
