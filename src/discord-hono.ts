import type { APIBaseInteraction, APIInteractionResponsePong, InteractionType } from 'discord-api-types/v10'
import { CommandContext, ComponentContext, CronContext, ModalContext } from './context'
import type {
  CronEvent,
  DiscordKey,
  DiscordKeyHandler,
  Env,
  EnvDiscordKey,
  ExecutionContext,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
} from './types'
import { ResponseJson, errorDev, errorSys } from './utils'
import { verify } from './verify'

type Options = { verify: Verify }
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

class DiscordHonoBase<E extends Env> {
  #verify: Verify = verify
  #commandHandlers = new Map<string, CommandHandler<E>>()
  #componentHandlers = new Map<string, ComponentHandler<E>>()
  #modalHandlers = new Map<string, ModalHandler<E>>()
  #cronHandlers = new Map<string, CronHandler<E>>()
  #discordKeyHandler: DiscordKeyHandler<E> | undefined = undefined
  constructor(options?: Options) {
    if (options?.verify) this.#verify = options.verify
  }

  command = (command: string, handler: CommandHandler<E>) => {
    this.#commandHandlers.set(command, handler)
    return this
  }
  component = (componentId: string, handler: ComponentHandler<E>) => {
    this.#componentHandlers.set(componentId, handler)
    return this
  }
  modal = (modalId: string, handler: ModalHandler<E>) => {
    this.#modalHandlers.set(modalId, handler)
    return this
  }
  cron = (cronId: string, handler: CronHandler<E>) => {
    this.#cronHandlers.set(cronId, handler)
    return this
  }
  discordKey = (handler: DiscordKeyHandler<E>) => {
    this.#discordKeyHandler = handler
    return this
  }

  fetch = async (request: Request, env?: E['Bindings'] & EnvDiscordKey, executionCtx?: ExecutionContext) => {
    switch (request.method) {
      case 'GET':
        return new Response('powered by Discord Hono🔥')
      case 'POST': {
        const discord = this.#discordKeyHandler
          ? this.#discordKeyHandler(env)
          : {
              APPLICATION_ID: env?.DISCORD_APPLICATION_ID,
              TOKEN: env?.DISCORD_TOKEN,
              PUBLIC_KEY: env?.DISCORD_PUBLIC_KEY,
            }
        if (!discord.PUBLIC_KEY) throw errorDev("DISCORD_PUBLIC_KEY")
        // verify
        const signature = request.headers.get('x-signature-ed25519')
        const timestamp = request.headers.get('x-signature-timestamp')
        const body = await request.text()
        const isValid = await this.#verify(body, signature, timestamp, discord.PUBLIC_KEY)
        if (!isValid) return new Response('Bad request signature.', { status: 401 })
        // verify end
        // ************ any 何とかしたい
        const data: APIBaseInteraction<InteractionType, any> = JSON.parse(body)
        switch (data.type) {
          case 1: {
            return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
          }
          case 2: {
            const interaction = data as InteractionCommandData
            const { handler } = getHandler<CommandHandler>(this.#commandHandlers, interaction.data?.name.toLowerCase())
            return await handler(new CommandContext(request, env, executionCtx, discord, interaction))
          }
          case 3: {
            const { handler, interaction } = getHandler<ComponentHandler>(
              this.#componentHandlers,
              data as InteractionComponentData,
            )
            return await handler(new ComponentContext(request, env, executionCtx, discord, interaction))
          }
          case 5: {
            const { handler, interaction } = getHandler<ModalHandler>(this.#modalHandlers, data as InteractionModalData)
            return await handler(new ModalContext(request, env, executionCtx, discord, interaction))
          }
          default: {
            console.error(`interaction.type: ${data.type}\nNot yet implemented`)
            return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
          }
        }
      }
      default:
        return new Response('Not Found.', { status: 404 })
    }
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
      console.log('The process does not apply waitUntil')
      await handler(new CronContext(event, env, executionCtx, discord))
    }
  }
}

const getHandler = <
  H extends CommandHandler | ComponentHandler | ModalHandler | CronHandler,
  Hs extends Map<string, H> = any,
  I extends string | undefined | InteractionComponentData | InteractionModalData = any,
>(
  handlers: Hs,
  interaction: I,
) => {
  let str = ''
  if (typeof interaction === 'string') str = interaction
  else {
    if (!interaction?.data) throw errorSys("interaction.data")
    const id = interaction.data.custom_id
    str = id.split(';')[0]
    interaction.data.custom_id = id.slice(str.length + 1)
  }
  const handler = handlers.get(str) || handlers.get('')
  if (!handler) throw errorDev("Handler")
  return { handler, interaction }
}

/**
 * @sample
 * ```ts
 * const app = new DiscordHono()
 * app.commands(commands)
 * export default app
 * ```
 */
export class DiscordHono<E extends Env = Env> extends DiscordHonoBase<E> {}
