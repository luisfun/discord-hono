import type { APIInteraction, APIInteractionResponsePong } from 'discord-api-types/v10'
import { AutocompleteContext, CommandContext, ComponentContext, CronContext, ModalContext } from './context'
import type { CronEvent, DiscordEnv, Env, ExecutionContext, InitOptions, Verify } from './types'
import { RegexMap, ResponseJson, errorDev, errorSys } from './utils'
import { verify } from './verify'

type CommandHandler<E extends Env = any> = (c: CommandContext<E>) => Promise<Response> | Response
type ComponentHandler<E extends Env = any> = (c: ComponentContext<E>) => Promise<Response> | Response
type AutocompleteHandler<E extends Env = any> = (c: AutocompleteContext<E>) => Promise<Response> | Response
type ModalHandler<E extends Env = any> = (c: ModalContext<E>) => Promise<Response> | Response
type CronHandler<E extends Env = any> = (c: CronContext<E>) => Promise<unknown>
type DiscordEnvBindings = {
  DISCORD_TOKEN?: string
  DISCORD_PUBLIC_KEY?: string
  DISCORD_APPLICATION_ID?: string
}

abstract class DiscordHonoBase<E extends Env> {
  #verify: Verify = verify
  #discord: (env: DiscordEnvBindings | undefined) => DiscordEnv
  #commandMap = new RegexMap<string | RegExp, CommandHandler<E>>()
  #componentMap = new RegexMap<string | RegExp, ComponentHandler<E>>()
  #autocompleteMap = new RegexMap<string | RegExp, AutocompleteHandler<E>>()
  #modalMap = new RegexMap<string | RegExp, ModalHandler<E>>()
  #cronMap = new RegexMap<string | RegExp, CronHandler<E>>()
  /**
   * [Documentation](https://discord-hono.luis.fun/interactions/discord-hono/)
   * @param {InitOptions} options
   */
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

  /**
   * @param {string | RegExp} command Match the first argument of `Command`
   * @param handler
   * @returns {this}
   */
  command = (command: string | RegExp, handler: CommandHandler<E>) => {
    this.#commandMap.set(command, handler)
    return this
  }
  /**
   * @param {string | RegExp} component_id Match the first argument of `Button` or `Select`
   * @param handler
   * @returns {this}
   */
  component = (component_id: string | RegExp, handler: ComponentHandler<E>) => {
    this.#componentMap.set(component_id, handler)
    return this
  }
  /**
   * @param {string | RegExp} command Match the first argument of `Command`
   * @param handler
   * @returns {this}
   */
  autocomplete = (command: string | RegExp, handler: AutocompleteHandler<E>, commandHandler?: CommandHandler<E>) => {
    this.#autocompleteMap.set(command, handler)
    if (commandHandler) this.#commandMap.set(command, commandHandler)
    return this
  }
  /**
   * @param {string | RegExp} modal_id Match the first argument of `Modal`
   * @param handler
   * @returns {this}
   */
  modal = (modal_id: string | RegExp, handler: ModalHandler<E>) => {
    this.#modalMap.set(modal_id, handler)
    return this
  }
  /**
   * @param cron Match the crons in the toml file
   * @param handler
   * @returns {this}
   */
  cron = (cron: string | RegExp, handler: CronHandler<E>) => {
    this.#cronMap.set(cron, handler)
    return this
  }

  /**
   * @param {Request} request
   * @param {Record<string, unknown>} env
   * @param executionCtx
   * @returns {Promise<Response>}
   */
  fetch = async (request: Request, env?: E['Bindings'], executionCtx?: ExecutionContext) => {
    switch (request.method) {
      case 'GET':
        return new Response('powered by Discord Hono🔥')
      case 'POST': {
        const discord = this.#discord(env)
        if (!discord.PUBLIC_KEY) throw errorDev('DISCORD_PUBLIC_KEY')
        const body = await request.text()
        // verify
        if (
          !(await this.#verify(
            body,
            request.headers.get('x-signature-ed25519'),
            request.headers.get('x-signature-timestamp'),
            discord.PUBLIC_KEY,
          ))
        )
          return new Response('Bad Request', { status: 401 })
        // verify end
        const interaction: APIInteraction = JSON.parse(body)
        switch (interaction.type) {
          case 1: {
            return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
          }
          case 2: {
            const { handler, key } = getHandler(this.#commandMap, interaction)
            return await handler(new CommandContext(request, env, executionCtx, discord, interaction, key))
          }
          case 3: {
            const { handler, key } = getHandler(this.#componentMap, interaction)
            return await handler(new ComponentContext(request, env, executionCtx, discord, interaction, key))
          }
          case 4: {
            const { handler, key } = getHandler(this.#autocompleteMap, interaction)
            return await handler(new AutocompleteContext(request, env, executionCtx, discord, interaction, key))
          }
          case 5: {
            const { handler, key } = getHandler(this.#modalMap, interaction)
            return await handler(new ModalContext(request, env, executionCtx, discord, interaction, key))
          }
          default: {
            return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
          }
        }
      }
      default:
        return new Response('Not Found', { status: 404 })
    }
  }

  /**
   * Methods triggered by cloudflare workers' crons
   * @param event
   * @param {Record<string, unknown>} env
   * @param executionCtx
   */
  scheduled = async (event: CronEvent, env: E['Bindings'], executionCtx?: ExecutionContext) => {
    const discord = this.#discord(env)
    const { handler, key } = getHandler(this.#cronMap, event.cron)
    const c = new CronContext(event, env, executionCtx, discord, key)
    if (executionCtx?.waitUntil) executionCtx.waitUntil(handler(c))
    else {
      console.log('Not applying waitUntil')
      await handler(c)
    }
  }
}

const getHandler = <
  H extends CommandHandler | ComponentHandler | ModalHandler | AutocompleteHandler | CronHandler,
  I extends APIInteraction | string,
>(
  map: RegexMap<string | RegExp, H>,
  interaction: I,
) => {
  let key = ''
  if (typeof interaction !== 'string') {
    switch (interaction.type) {
      case 2:
      case 4:
        key = interaction.data.name
        break
      case 3:
      case 5: {
        const id = interaction.data.custom_id
        key = id.split(';')[0]
        interaction.data.custom_id = id.slice(key.length + 1)
        break
      }
      default:
        throw errorSys('getHandler-interaction.type')
    }
  } else key = interaction
  const handler = map.get(key) ?? map.get('')
  if (!handler) throw errorDev('Handler')
  return { handler, key }
}

export class DiscordHono<E extends Env = Env> extends DiscordHonoBase<E> {}
