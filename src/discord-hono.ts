import type { APIBaseInteraction, APIInteractionResponsePong, InteractionType } from 'discord-api-types/v10'
import { CommandContext, ComponentContext, CronContext, ModalContext } from './context'
import type {
  CronEvent,
  DiscordEnv,
  Env,
  ExecutionContext,
  InitOptions,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
  Verify,
} from './types'
import { RegexMap, ResponseJson, errorDev, errorSys } from './utils'
import { verify } from './verify'

type CommandHandler<E extends Env = any> = (c: CommandContext<E>) => Promise<Response> | Response
type ComponentHandler<E extends Env = any> = (c: ComponentContext<E>) => Promise<Response> | Response
type ModalHandler<E extends Env = any> = (c: ModalContext<E>) => Promise<Response> | Response
type CronHandler<E extends Env = any> = (c: CronContext<E>) => Promise<unknown>
type DiscordEnvBindings = {
  DISCORD_TOKEN?: string
  DISCORD_PUBLIC_KEY?: string
  DISCORD_APPLICATION_ID?: string
}

class DiscordHonoBase<E extends Env> {
  #verify: Verify = verify
  #discord: (env: DiscordEnvBindings | undefined) => DiscordEnv
  #commandHandlers = new RegexMap<string | RegExp, CommandHandler<E>>()
  #componentHandlers = new RegexMap<string | RegExp, ComponentHandler<E>>()
  #modalHandlers = new RegexMap<string | RegExp, ModalHandler<E>>()
  #cronHandlers = new RegexMap<string, CronHandler<E>>()
  #regexpFlag = {
    command: false,
    component: false,
    modal: false,
  }
  constructor(options?: InitOptions<E>) {
    if (options?.verify) this.#verify = options.verify
    this.#discord = env => {
      const discordEnv = options?.discordEnv ? options.discordEnv(env) : {}
      return {
        APPLICATION_ID: env?.DISCORD_APPLICATION_ID,
        TOKEN: env?.DISCORD_TOKEN,
        PUBLIC_KEY: env?.DISCORD_PUBLIC_KEY,
        ...discordEnv,
      }
    }
  }

  command = (command: string | RegExp, handler: CommandHandler<E>) => {
    this.#commandHandlers.set(command, handler)
    if (command instanceof RegExp) this.#regexpFlag.command = true
    return this
  }
  component = (componentId: string | RegExp, handler: ComponentHandler<E>) => {
    this.#componentHandlers.set(componentId, handler)
    if (componentId instanceof RegExp) this.#regexpFlag.component = true
    return this
  }
  modal = (modalId: string | RegExp, handler: ModalHandler<E>) => {
    this.#modalHandlers.set(modalId, handler)
    if (modalId instanceof RegExp) this.#regexpFlag.modal = true
    return this
  }
  cron = (cron: string, handler: CronHandler<E>) => {
    this.#cronHandlers.set(cron, handler)
    return this
  }

  fetch = async (request: Request, env?: E['Bindings'], executionCtx?: ExecutionContext) => {
    switch (request.method) {
      case 'GET':
        return new Response('powered by Discord Hono🔥')
      case 'POST': {
        const discord = this.#discord(env)
        if (!discord.PUBLIC_KEY) throw errorDev('DISCORD_PUBLIC_KEY')
        // verify
        const body = await request.text()
        const signature = request.headers.get('x-signature-ed25519')
        const timestamp = request.headers.get('x-signature-timestamp')
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
            const { handler, key } = getHandler<CommandHandler>(
              this.#commandHandlers,
              interaction.data?.name.toLowerCase(),
              this.#regexpFlag.command,
            )
            return await handler(new CommandContext(request, env, executionCtx, discord, interaction, key))
          }
          case 3: {
            const { handler, interaction, key } = getHandler<ComponentHandler>(
              this.#componentHandlers,
              data as InteractionComponentData,
              this.#regexpFlag.component,
            )
            return await handler(new ComponentContext(request, env, executionCtx, discord, interaction, key))
          }
          case 5: {
            const { handler, interaction, key } = getHandler<ModalHandler>(
              this.#modalHandlers,
              data as InteractionModalData,
              this.#regexpFlag.modal,
            )
            return await handler(new ModalContext(request, env, executionCtx, discord, interaction, key))
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

  scheduled = async (event: CronEvent, env: E['Bindings'], executionCtx?: ExecutionContext) => {
    const discord = this.#discord(env)
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
  Hs extends RegexMap<string | RegExp, H> = any,
  I extends string | undefined | InteractionComponentData | InteractionModalData = any,
>(
  handlers: Hs,
  interaction: I,
  regexp?: boolean,
) => {
  let key = ''
  if (typeof interaction === 'string') key = interaction
  else {
    if (!interaction?.data) throw errorSys('interaction.data')
    const id = interaction.data.custom_id
    key = id.split(';')[0]
    interaction.data.custom_id = id.slice(key.length + 1)
  }
  const handler = (regexp !== true ? handlers.get(key) : handlers.match(key)) || handlers.get('')
  if (!handler) throw errorDev('Handler')
  return { handler, interaction, key }
}

/**
 * @sample
 * ```ts
 * const app = new DiscordHono()
 *   .command('hello', c => c.res('world'))
 * export default app
 * ```
 */
export class DiscordHono<E extends Env = Env> extends DiscordHonoBase<E> {}
