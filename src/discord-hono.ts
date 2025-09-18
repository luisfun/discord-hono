import type { APIInteraction, APIInteractionResponsePong } from 'discord-api-types/v10'
import { Context } from './context'
import type {
  AutocompleteHandler,
  CommandHandler,
  ComponentHandler,
  ComponentType,
  CronContext,
  CronEvent,
  CronHandler,
  DiscordEnv,
  Env,
  ExecutionContext,
  InitOptions,
  ModalHandler,
  Verify,
} from './types'
import { CUSTOM_ID_SEPARATOR, newError } from './utils'
import { verify } from './verify'

type DiscordEnvBindings = {
  DISCORD_TOKEN?: string
  DISCORD_PUBLIC_KEY?: string
  DISCORD_APPLICATION_ID?: string
}

type HandlerNumber = 0 | 2 | 3 | 4 | 5
// biome-ignore format: ternary operator
type AnyHandler<E extends Env, N extends HandlerNumber> =
  N extends 0 ? CronHandler<E> :
  N extends 2 ? CommandHandler<E> :
  N extends 3 ? ComponentHandler<E, any> :
  N extends 4 ? AutocompleteHandler<E> :
  N extends 5 ? ModalHandler<E> :
  never

export class DiscordHono<E extends Env = Env> {
  #verify: Verify
  #discord: (env: DiscordEnvBindings | undefined) => DiscordEnv
  #map = new Map<string, AnyHandler<E, HandlerNumber>>()
  #set<N extends HandlerNumber>(num: N, key: string, value: AnyHandler<E, N>): this {
    this.#map.set(`${num}${key}`, value)
    return this
  }
  #get<N extends HandlerNumber>(num: N, key: string): AnyHandler<E, N> {
    const handler = this.#map.get(`${num}${key}`) ?? this.#map.get(`${num}`)
    if (handler) return handler as AnyHandler<E, N>
    throw newError('DiscordHono', 'handler')
  }
  /**
   * [Documentation](https://discord-hono.luis.fun/interactions/discord-hono/)
   * @param {InitOptions} options
   */
  constructor(options?: InitOptions<E>) {
    this.#verify = options?.verify ?? verify
    this.#discord = (env: DiscordEnvBindings | undefined): DiscordEnv => {
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
  command(command: string, handler: CommandHandler<E>): this {
    return this.#set(2, command, handler)
  }
  /**
   * @param {string | RegExp} component_id Match the first argument of `Button` or `Select`
   * @param handler
   * @returns {this}
   */
  component<T extends ComponentType>(component_id: string, handler: ComponentHandler<E, T>): this {
    return this.#set(3, component_id, handler)
  }
  /**
   * @param {string | RegExp} command Match the first argument of `Command`
   * @param autocomplete
   * @param handler
   * @returns {this}
   */
  autocomplete(command: string, autocomplete: AutocompleteHandler<E>, handler?: CommandHandler<E>): this {
    return (handler ? this.#set(2, command, handler) : this).#set(4, command, autocomplete)
  }
  /**
   * @param {string | RegExp} modal_id Match the first argument of `Modal`
   * @param handler
   * @returns {this}
   */
  modal(modal_id: string, handler: ModalHandler<E>): this {
    return this.#set(5, modal_id, handler)
  }
  /**
   * @param cron Match the crons in the toml file
   * @param handler
   * @returns {this}
   */
  cron(cron: string, handler: CronHandler<E>): this {
    return this.#set(0, cron, handler)
  }

  /**
   * @param {Request} request
   * @param {Record<string, unknown>} env
   * @param executionCtx
   * @returns {Promise<Response>}
   */
  async fetch(request: Request, env?: E['Bindings'], executionCtx?: ExecutionContext): Promise<Response> {
    switch (request.method) {
      case 'GET':
        return new Response('Operational🔥')
      case 'POST': {
        const discord = this.#discord(env)
        if (!discord.PUBLIC_KEY) throw newError('DiscordHono', 'DISCORD_PUBLIC_KEY')
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
              const key = id.split(CUSTOM_ID_SEPARATOR)[0]
              interaction.data.custom_id = id.slice(key.length + 1)
              return key
            }
          }
          return ''
        })()
        switch (interaction.type) {
          case 1:
            return Response.json({ type: 1 } satisfies APIInteractionResponsePong)
          case 2:
          case 3:
          case 4:
          case 5:
            return await this.#get(
              interaction.type,
              key,
              // @ts-expect-error
            )(new Context(env, executionCtx, discord, key, interaction))
        }
        return Response.json({ error: 'Unknown Type' }, { status: 400 })
      }
    }
    return new Response('Not Found', { status: 404 })
  }

  /**
   * Method triggered by cloudflare workers' crons
   * @param event
   * @param {Record<string, unknown>} env
   * @param executionCtx
   */
  async scheduled(event: CronEvent, env: E['Bindings'], executionCtx?: ExecutionContext): Promise<void> {
    const handler = this.#get(0, event.cron)
    const c = new Context(env, executionCtx, this.#discord(env), event.cron, event) as CronContext
    if (executionCtx?.waitUntil) executionCtx.waitUntil(handler(c))
    else await handler(c)
  }
}
