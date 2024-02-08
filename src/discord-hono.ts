import type { APIInteractionResponsePong } from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import type { ExecutionContext } from './context'
import { Context } from './context'
import type {
  Env,
  ScheduledEvent,
  Commands,
  SetCommandsHandler,
  ScheduledArray,
  SetScheduledHandler,
  Interaction,
} from './types'
import { ResponseJson } from './utils'

const defineClass = function(): {
  new <E extends Env = Env>(): {
    /**
     * @param commands Commands
     */
    setCommands: SetCommandsHandler<E>
  } & {
    /**
     * @param cron cron string - "": triggers all crons
     * @param scheduled ScheduledHandler
     */
    setScheduled: SetScheduledHandler<E>
  }
} {
  return class {} as never
}

export const DiscordHono = class<E extends Env = Env> extends defineClass()<E> {
  #commands: Commands | undefined = undefined
  #scheduled: ScheduledArray = []

  constructor() {
    super()
    this.setCommands = (commands) => {
      this.#commands = commands
      return this
    }
    this.setScheduled = (cron, scheduled) => {
      this.#scheduled.push([cron, scheduled])
      return this
    }
  }

  fetch = async (request: Request, env?: E['Bindings'] | {}, executionCtx?: ExecutionContext) => {
    if(request.method === 'GET') {
      return new Response('powered by Discord Hono🔥')
    }
    else if(request.method === 'POST') {
      if(!env) throw new Error('There is no env.')
      // verify
      const signature = request.headers.get('x-signature-ed25519')
      const timestamp = request.headers.get('x-signature-timestamp')
      const body = await request.text()
      const isValidRequest =
        signature &&
        timestamp &&
        // @ts-expect-error ************* どうにかしてエラーを消したい
        verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)
      if(!isValidRequest || !body) {
        return new Response('Bad request signature.', { status: 401 })
      }
      // verify end
      const interaction: Interaction = JSON.parse(body)
      // interaction type https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
      if(interaction.type === 1) { // verify
        return new ResponseJson({ type: 1 } as APIInteractionResponsePong)
      }
      if(interaction.type === 2) {
        if(!this.#commands) throw new Error('Commands is not set.')
        const commandName = interaction.data?.name.toLowerCase()
        const commandIndex = this.#commands.findIndex(command => command[0].name.toLowerCase() === commandName)
        const handler = this.#commands[commandIndex][1]
        return await handler(new Context(request, env, executionCtx, interaction))
      }
      return new ResponseJson({ error: 'Unknown Type' }, { status: 400 })
    }
    return new Response('Not Found.', { status: 404 })
  }

  scheduled = async (event: ScheduledEvent, env: E['Bindings'] | {}, executionCtx: ExecutionContext) => {
    //const c = new Context(new HonoRequest(request), { env, executionCtx, })
    //executionCtx.waitUntil()
  }
}