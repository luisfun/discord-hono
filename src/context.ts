import type {
  APIEmbed,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseCallbackData,
  RESTPostAPIChannelMessageFormDataBody,
} from 'discord-api-types/v10'
import type { Env, FetchEventLike, Interaction } from './types'
import { apiUrl, ResponseJson, fetchMessage } from './utils'
import { postMessage } from './api-wrapper/channel-message'

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

/**
 * @deprecated
 */
export type ResObject = {
  content?: string
  embeds?: APIEmbed[]
}

/**
 * @deprecated
 */
export type SendObject = {
  content?: string
  embeds?: APIEmbed[]
  files?: (File | Blob)[]
}

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

  // api response
  resBase = (json: APIInteractionResponse) => new ResponseJson(json)
  /**
   * Response to request.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @returns Response
   */
  res = (data: APIInteractionResponseCallbackData) => this.resBase({ data, type: 4 } as APIInteractionResponseChannelMessageWithSource)
  resText = (content: string) => this.res({ content })
  resEmbed = (embed: APIEmbed) => this.res({ embeds: [embed] })
  resDefer = () => this.resBase({ type: 5 } as APIInteractionResponseDeferredChannelMessageWithSource)

  // followup is after resDefer
  /**
   * Used to send messages after resDefer.
   * @param json [json Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file Files, images, etc. to be attached to messages.
   * @returns 
   */
  followup = async (json: APIInteractionResponseCallbackData, file?: Blob | Blob[]) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const post = await fetchMessage(`${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`, json, file)
    return new Response('Sent to Discord.', { status: post.status })
  }
  followupText = async (content: string) => await this.followup({ content })
  followupEmbed = async (embed: APIEmbed) => await this.followup({ embeds: [embed] })
  followupImage = async (image: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(image)) return await this.followup({}, new Blob([image]))
    return await this.followup({}, image.map(e => new Blob([e])))
  }

  // api message wrapper
  /**
   * Used to send messages other than res*** and followup***.
   * @param channelId "" is request channel id.
   * @param json [data type](https://discord-api-types.dev/api/next/discord-api-types-v10#RESTPostAPIChannelMessageFormDataBody)
   * @returns 
   */
  post = async (channelId: string, json?: APIInteractionResponseCallbackData, file?: Blob | Blob[]) => {
    const id = channelId || this.#interaction?.channel?.id
    if (!id) throw new Error('channelId is not set.')
    return await postMessage(id, json, file)
  }
  postText = async (channelId: string, content: string) => await this.post(channelId, { content })
  postEmbed = async (channelId: string, embed: APIEmbed) => await this.post(channelId, { embeds: [embed] })
  postImage = async (channelId: string, image: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(image)) return await this.post(channelId, {}, new Blob([image]))
    return await this.post(channelId, {}, image.map(e => new Blob([e])))
  }

  /**
   * @deprecated
   */
  sendBody = async (body: BodyInit) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const res = await fetch(
      `${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`,
      { method: 'POST', body, },
    )
    return new Response('Sent to Discord', { status: res.status })
  }
  /**
   * @deprecated
   */
  sendJson = async (json: APIInteractionResponse) => {
    return await this.sendBody(JSON.stringify(json))
  }
  /**
   * @deprecated
   * @param obj content: string, embeds: embed[], files: (File | Blob)[]
   * @returns Promise<Response>
   */
  send = async (obj: SendObject) => {
    const body = new FormData()
    if (obj.content) body.append('content', obj.content)
    if (obj.embeds) body.append('embeds', JSON.stringify(obj.embeds)) // 未検証
    if (obj.files) {
      for(let i=0; i<obj.files.length; i++) {
        body.append(`files[${i}]`, obj.files[i], `image${i}.png`)
      }
    }
    return await this.sendBody(body)
  }
  /**
   * @deprecated
   */
  sendText = async (content: string) => await this.send({ content })
  /**
   * @deprecated
   */
  sendEmbed = async (embed: APIEmbed) => await this.send({ embeds: [embed] })
  /**
   * @deprecated
   */
  sendImageBuffer = async (imageBuffer: ArrayBuffer) => await this.send({ files: [new Blob([imageBuffer])] })
}
