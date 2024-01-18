import type { APIEmbed } from 'discord-api-types/v10'
import { InteractionResponseType } from 'discord-interactions'
import type { Env, FetchEventLike, Interaction } from './types'
import { JsonResponse } from './utils/jsonResponse'

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
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

export type ContentObject = {
  text?: string
  imageBuffer?: ArrayBuffer
  embeds?: APIEmbed[]
}

export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Context<E extends Env = any> {
  req: Request
  env: E['Bindings'] = {}

  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #interaction: Interaction | undefined
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

  waitUntil = (handler: WaitUntilHandler<E>): void => {
    if (this.#executionCtx) {
      const ctxWaitUntil = this.#executionCtx.waitUntil as ExecutionContext['waitUntil']
      return ctxWaitUntil(handler(this))
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

  buildBody = (content: ContentObject) => {
    const body = new FormData()
    if(content.text || content.embeds) body.append('payload_json', JSON.stringify({ content: content.text, embeds: content.embeds }))
    //if(content.embeds) body.append('embeds', content.embeds)
    if(content.imageBuffer) body.append('file', new Blob([content.imageBuffer]), 'image.png')
    return body
  }
  
  /**
   * @param content text: string, embeds: APIEmbed[], imageBuffer: ArrayBuffer
   * @returns Response
   */
  res = (content: ContentObject) => new Response(this.buildBody(content))
  resText = (text: string) => this.res({ text })
  resEmbed = (embed: APIEmbed) => this.res({ embeds: [embed] })
  resEmbeds = (embeds: APIEmbed[]) => this.res({ embeds })
  resImageBuffer = (imageBuffer: ArrayBuffer) => this.res({ imageBuffer })

  resDefer = () => new JsonResponse({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE })

  editBody = async (body: BodyInit) => {
    if(!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if(!this.#interaction?.token) throw new Error('interaction is not set.')
    const url = `https://discord.com/api/v10/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`
    await fetch(url, { method: 'POST', body, })
  }
  /**
   * @param content text: string, embeds: embed[], imageBuffer: ArrayBuffer
   * @returns Promise<void>
   */
  edit = async (content: ContentObject) => await this.editBody(this.buildBody(content))
  editText = async (text: string) => await this.edit({ text })
  editEmbed = async (embed: APIEmbed) => await this.edit({ embeds: [embed] })
  editEmbeds = async (embeds: APIEmbed[]) => await this.edit({ embeds })
  editImageBuffer = async (imageBuffer: ArrayBuffer) => await this.edit({ imageBuffer })
}
