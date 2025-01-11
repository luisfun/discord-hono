import type { APIInteraction, APIInteractionResponsePong } from 'discord-api-types/v10'
import { AutocompleteContext, CommandContext, ComponentContext, CronContext, ModalContext } from './context'
import type { CronEvent, DiscordEnv, Env, ExecutionContext, InitOptions, Verify } from './types'
import { ResponseJson, errorDev } from './utils'
import { verify } from './verify'

type CommandHandler<E extends Env> = (c: CommandContext<E>) => Promise<Response> | Response
type ComponentHandler<E extends Env> = (c: ComponentContext<E>) => Promise<Response> | Response
type AutocompleteHandler<E extends Env> = (c: AutocompleteContext<E>) => Promise<Response> | Response
type ModalHandler<E extends Env> = (c: ModalContext<E>) => Promise<Response> | Response
type CronHandler<E extends Env> = (c: CronContext<E>) => Promise<unknown>
type DiscordEnvBindings = {
  DISCORD_TOKEN?: string
  DISCORD_PUBLIC_KEY?: string
  DISCORD_APPLICATION_ID?: string
}

class RegexMap<K, V> extends Map<K, V> {
  h(key: string): V {
    if (this.has(key as K)) return this.get(key as K)!
    for (const [k, v] of this) if (k instanceof RegExp && k.test(key)) return v
    if (this.has('' as K)) return this.get('' as K)!
    throw errorDev('Handler')
  }
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
        if (
          !(await this.#verify(
            body,
            request.headers.get('x-signature-ed25519'),
            request.headers.get('x-signature-timestamp'),
            discord.PUBLIC_KEY,
          ))
        )
          return new Response('Bad Request', { status: 401 })
        const interaction: APIInteraction = JSON.parse(body)
        const key = (() => {
          switch (interaction.type) {
            case 2:
            case 4:
              return interaction.data.name
            case 3:
            case 5: {
              const id = interaction.data.custom_id
              const key = id.split(';')[0]
              interaction.data.custom_id = id.slice(key.length + 1)
              return key
            }
            default:
              return ''
          }
        })()
        // biome-ignore format: text width
        switch (interaction.type) {
          case 1:
            return new ResponseJson({ type: 1 } satisfies APIInteractionResponsePong)
          case 2:
            return await this.#commandMap.h(key)(new CommandContext(request, env, executionCtx, discord, interaction, key))
          case 3:
            return await this.#componentMap.h(key)(new ComponentContext(request, env, executionCtx, discord, interaction, key))
          case 4:
            return await this.#autocompleteMap.h(key)(new AutocompleteContext(request, env, executionCtx, discord, interaction, key))
          case 5:
            return await this.#modalMap.h(key)(new ModalContext(request, env, executionCtx, discord, interaction, key))
          default:
            return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
        }
      }
      default:
        return new Response('Not Found', { status: 404 })
    }
  }

  /**
   * Method triggered by cloudflare workers' crons
   * @param event
   * @param {Record<string, unknown>} env
   * @param executionCtx
   */
  scheduled = async (event: CronEvent, env: E['Bindings'], executionCtx?: ExecutionContext) => {
    const discord = this.#discord(env)
    const handler = this.#cronMap.h(event.cron)
    const c = new CronContext(event, env, executionCtx, discord, event.cron)
    if (executionCtx?.waitUntil) executionCtx.waitUntil(handler(c))
    else await handler(c)
  }
}

export class DiscordHono<E extends Env = Env> extends DiscordHonoBase<E> {}
