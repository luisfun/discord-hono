import type {
  APIEmbed,
  APIInteractionResponseChannelMessageWithSource,
} from 'discord-api-types/v10'
import { InteractionResponseType } from 'discord-interactions'
import type { Env, FetchEventLike, Interaction } from './types'
import { JsonResponse } from './utils/jsonResponse'

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

type Command = {
  options: Record<string, string>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WaitUntilHandler<E extends Env = any> = (c: Context<E>) => Promise<unknown>

export interface ContextVariableMap {}

interface Get<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key]
  <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key]
}

interface Set<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void
  <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void
}

export type ResObject = {
  content?: string
  embeds?: APIEmbed[]
}

export type SendObject = {
  content?: string
  embeds?: APIEmbed[]
  files?: (File | Blob)[]
}

//export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Context<E extends Env = any> {
  req: Request
  env: E['Bindings'] = {}

  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #interaction: Interaction | undefined
  #command: Command = { options: {} }
  #var: E['Variables'] = {}

  constructor(
    req: Request,
    env?: E['Bindings'],
    executionCtx?: FetchEventLike | ExecutionContext | undefined,
    interaction?: Interaction,
  ) {
    this.req = req
    if(env) this.env = env
    if(executionCtx) this.#executionCtx = executionCtx
    if(interaction) this.#interaction = interaction
    if(interaction?.data?.options) {
      this.#command.options = interaction.data.options.reduce((obj: Record<string, string>, e) => {
        // @ts-expect-error
        obj[e.name] = e.value
        return obj
      }, {})
    }
  }

  get event(): FetchEventLike {
    if (this.#executionCtx && 'respondWith' in this.#executionCtx) {
      return this.#executionCtx
    } else {
      throw Error('This context has no FetchEvent')
    }
  }

  get executionCtx(): ExecutionContext {
    if (this.#executionCtx) {
      return this.#executionCtx as ExecutionContext
    } else {
      throw Error('This context has no ExecutionContext')
    }
  }

  get interaction(): Interaction {
    if (this.#interaction) {
      return this.#interaction as Interaction
    } else {
      throw Error('This context has no Interaction')
    }
  }

  get command(): Command {
    return this.#command
  }

  set: Set<E> = (key: string, value: unknown) => {
    this.#var ??= {}
    this.#var[key as string] = value
  }

  get: Get<E> = (key: string) => {
    return this.#var ? this.#var[key] : undefined
  }

  // c.var.propName is a read-only
  get var(): Readonly<E['Variables'] & ContextVariableMap> {
    return { ...this.#var } as never
  }

  resJson = (json: APIInteractionResponseChannelMessageWithSource) => new JsonResponse(json)
  /**
   * @param obj content: string, embeds: APIEmbed[]
   * @returns Response
   */
  res = (obj: ResObject) => {
    const data = {
      content: obj.content,
      embeds: obj.embeds,
    }
    return this.resJson({ data, type: 4 }) // InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE = 4
  }
  resText = (content: string) => this.res({ content })
  resEmbed = (embed: APIEmbed) => this.res({ embeds: [embed] })

  resDefer = () => new JsonResponse({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE })

  sendBody = async (body: BodyInit) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const url = `https://discord.com/api/v10/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`
    const res = await fetch(url, { method: 'POST', body, })
    return new Response('Sent to Discord', { status: res.status })
  }
  sendJson = async (json: APIInteractionResponseChannelMessageWithSource) => {
    return await this.sendBody(JSON.stringify(json))
  }
  /**
   * @param obj content: string, embeds: embed[], files: (File | Blob)[]
   * @returns Promise<Response>
   */
  send = async (obj: SendObject) => {
    const body = new FormData()
    if (obj.content) body.append('content', obj.content)
    if (obj.embeds) body.append('embeds', JSON.stringify(obj.embeds)) // 未検証
    if (obj.files) {
      for(let i=0; i<obj.files.length; i++) {
        body.append(`files${i}`, obj.files[i], `image${i}.png`)
      }
    }
    return await this.sendBody(body)
  }
  sendText = async (content: string) => await this.send({ content })
  sendEmbed = async (embed: APIEmbed) => await this.send({ embeds: [embed] })
  sendImageBuffer = async (imageBuffer: ArrayBuffer) => await this.send({ files: [new Blob([imageBuffer])] })
}
