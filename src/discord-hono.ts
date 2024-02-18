import type { APIBaseInteraction, InteractionType, APIInteractionResponsePong } from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { CommandContext, ComponentContext, ModalContext, CronContext } from './context'
import type {
  Env,
  EnvDiscordKey,
  ExecutionContext,
  CronEvent,
  ApplicationCommand,
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
import { Command } from './builder/command'
import { CommandHandlers, ComponentHandlers, ModalHandlers, CronHandlers } from './builder/handler'

class DiscordHonoBase<E extends Env = Env> {
  #commands: ApplicationCommand[] | undefined = undefined
  #commandHandlers: Handlers<TypeCommandHandler<E>> | undefined = undefined
  #componentHandlers: Handlers<TypeComponentHandler<E>> | undefined = undefined
  #modalHandlers: Handlers<TypeModalHandler<E>> | undefined = undefined
  #cronHandlers: Handlers<TypeCronHandler<E>> | undefined = undefined
  #discordKeyHandler: DiscordKeyHandler<E> | undefined = undefined

  commands = (e: (Command | ApplicationCommand)[]) => {
    const commands = e.map(cmd => {
      if (cmd instanceof Command) return cmd.build()
      return cmd
    })
    this.#commands = commands
    return this
  }

  handlers = (
    handlers:
      | CommandHandlers
      | ComponentHandlers
      | ModalHandlers
      | CronHandlers
      | Handlers<TypeCommandHandler>
      | Handlers<TypeComponentHandler>
      | Handlers<TypeModalHandler>
      | Handlers<TypeCronHandler>,
    type?: 'command' | 'component' | 'modal' | 'cron',
  ) => {
    if (handlers instanceof CommandHandlers) this.#commandHandlers = handlers.build()
    if (handlers instanceof ComponentHandlers) this.#componentHandlers = handlers.build()
    if (handlers instanceof ModalHandlers) this.#modalHandlers = handlers.build()
    if (handlers instanceof CronHandlers) this.#cronHandlers = handlers.build()
    if (type === 'command') this.#commandHandlers = handlers as Handlers<TypeCommandHandler<E>>
    if (type === 'component') this.#componentHandlers = handlers as Handlers<TypeComponentHandler<E>>
    if (type === 'modal') this.#modalHandlers = handlers as Handlers<TypeModalHandler<E>>
    if (type === 'cron') this.#cronHandlers = handlers as Handlers<TypeCronHandler<E>>
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
          if (!this.#commands) throw new Error('Commands is not set. Set by app.commands')
          if (!this.#commandHandlers) throw new Error('Handlers is not set. Set by app.commandHandlers')
          const interaction = data as InteractionCommandData
          if (!interaction.data) throw new Error('No interaction.data, please contact the developer of discord-hono.')
          const name = interaction.data.name.toLowerCase()
          const index = this.#commandHandlers.findIndex(e => e[0].toLowerCase() === name)
          const handler = this.#commandHandlers[index][1]
          const commandIndex = this.#commands.findIndex(e => e.name.toLowerCase() === name)
          const command = this.#commands[commandIndex]
          return await handler(new CommandContext(request, env, executionCtx, discord, interaction, command))
        }
        case 3: {
          if (!this.#componentHandlers) throw new Error('Handlers is not set. Set by app.componentHandlers')
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
          if (!this.#modalHandlers) throw new Error('Handlers is not set. Set by app.modalHandlers')
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

  scheduled = async (event: CronEvent, env: E['Bindings'] | EnvDiscordKey, executionCtx: ExecutionContext) => {
    if (!this.#cronHandlers) throw new Error('Handlers is not set. Set by app.cronHandlers')
    const discord = this.#discordKeyHandler
      ? this.#discordKeyHandler(env)
      : ({
          APPLICATION_ID: env?.DISCORD_APPLICATION_ID,
          TOKEN: env?.DISCORD_TOKEN,
          PUBLIC_KEY: env?.DISCORD_PUBLIC_KEY,
        } as DiscordKey)
    const index = this.#cronHandlers.findIndex(e => e[0] === event.cron || e[0] === '')
    const handler = this.#cronHandlers[index][1]
    await handler(new CronContext(event, env, executionCtx, discord))
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
