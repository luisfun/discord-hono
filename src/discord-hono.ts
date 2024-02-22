import type { APIBaseInteraction, InteractionType, APIInteractionResponsePong } from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { CommandContext, ComponentContext, ModalContext, CronContext } from './context'
import type {
  Env,
  EnvDiscordKey,
  ExecutionContext,
  CronEvent,
  TypeCommandHandler,
  TypeComponentHandler,
  TypeModalHandler,
  TypeCronHandler,
  Handlers,
  DiscordKeyHandler,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
  DiscordKey,
} from './types'
import { ResponseJson } from './utils'

class DiscordHonoBase<E extends Env> {
  #commandHandlers: Handlers<TypeCommandHandler<E>> = []
  #componentHandlers: Handlers<TypeComponentHandler<E>> = []
  #modalHandlers: Handlers<TypeModalHandler<E>> = []
  #cronHandlers: Handlers<TypeCronHandler<E>> = []
  #discordKeyHandler: DiscordKeyHandler<E> | undefined = undefined

  command = (command: string, handler: TypeCommandHandler<E>) => {
    this.#commandHandlers.push([command, handler])
    return this
  }
  component = (componentId: string, handler: TypeComponentHandler<E>) => {
    this.#componentHandlers.push([componentId, handler])
    return this
  }
  modal = (modalId: string, handler: TypeModalHandler<E>) => {
    this.#modalHandlers.push([modalId, handler])
    return this
  }
  cron = (cronId: string, handler: TypeCronHandler<E>) => {
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
      const isValidRequest = signature && timestamp && verifyKey(body, signature, timestamp, discord.PUBLIC_KEY)
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
          if (!this.#commandHandlers[0]) throw new Error('Handler is not set. Set by .command()')
          const interaction = data as InteractionCommandData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const name = interaction.data.name.toLowerCase()
          const index = this.#commandHandlers.findIndex(e => e[0].toLowerCase() === name)
          const handler = this.#commandHandlers[index][1]
          return await handler(new CommandContext(request, env, executionCtx, discord, interaction))
        }
        case 3: {
          if (!this.#componentHandlers[0]) throw new Error('Handler is not set. Set by .component()')
          const interaction = data as InteractionComponentData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const customId = interaction.data.custom_id
          const uniqueId = customId.split(';')[0]
          const index = this.#componentHandlers.findIndex(e => e[0] === uniqueId || e[0] === '')
          const handler = this.#componentHandlers[index][1]
          interaction.data.custom_id = customId.slice(uniqueId.length + 1)
          return await handler(new ComponentContext(request, env, executionCtx, discord, interaction))
        }
        case 5: {
          if (!this.#modalHandlers[0]) throw new Error('Handler is not set. Set by .modal()')
          const interaction = data as InteractionModalData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const customId = interaction.data.custom_id
          const uniqueId = customId.split(';')[0]
          const index = this.#modalHandlers.findIndex(e => e[0] === uniqueId || e[0] === '')
          const handler = this.#modalHandlers[index][1]
          interaction.data.custom_id = customId.slice(uniqueId.length + 1)
          return await handler(new ModalContext(request, env, executionCtx, discord, interaction))
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
    if (!this.#cronHandlers[0]) throw new Error('Handler is not set. Set by .cron()')
    const discord = this.#discordKeyHandler
      ? this.#discordKeyHandler(env)
      : ({
          APPLICATION_ID: env?.DISCORD_APPLICATION_ID,
          TOKEN: env?.DISCORD_TOKEN,
          PUBLIC_KEY: env?.DISCORD_PUBLIC_KEY,
        } as DiscordKey)
    const index = this.#cronHandlers.findIndex(e => e[0] === event.cron || e[0] === '')
    const handler = this.#cronHandlers[index][1]
    if (executionCtx?.waitUntil) executionCtx.waitUntil(handler(new CronContext(event, env, executionCtx, discord)))
    else {
      console.log(
        'The process does not apply waitUntil. it would be helpful if you could contact the developer of discord-hono.',
      )
      await handler(new CronContext(event, env, executionCtx, discord))
    }
  }
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
