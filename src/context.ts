import type {
  APIEmbed,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  RESTPostAPIInteractionFollowupFormDataBody,
  RESTPostAPIChannelMessageFormDataBody,
} from 'discord-api-types/v10'
import type { Env, FetchEventLike, Interaction } from './types'
import { apiUrl, ResponseJson, fetchFormData } from './utils'
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
  res = (data: APIInteractionResponseChannelMessageWithSource['data']) => this.resBase({ data, type: 4 } as APIInteractionResponseChannelMessageWithSource)
  resText = (content: string) => this.res({ content })
  resEmbed = (embed: APIEmbed) => this.res({ embeds: [embed] })
  resDefer = () => this.resBase({ type: 5 } as APIInteractionResponseDeferredChannelMessageWithSource)

  // followup is after resDefer
  /**
   * Used to send messages after resDefer.
   * @param json [data type](https://discord-api-types.dev/api/next/discord-api-types-v10#RESTPostAPIInteractionFollowupFormDataBody)
   * @returns 
   */
  followup = async (json: RESTPostAPIInteractionFollowupFormDataBody) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const post = await fetchFormData(
      `${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`,
      { method: 'POST', body: JSON.stringify(json) },
    )
    return new Response('Sent to Discord.', { status: post.status })
  }
  followupText = async (content: string) => await this.followup({ content })
  followupEmbed = async (embed: APIEmbed) => await this.followup({ embeds: [embed] })
  followupImage = async (imageBuffer: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(imageBuffer)) return await this.followup({ 'files[0]': [new Blob([imageBuffer])] })
    const json = {} as RESTPostAPIInteractionFollowupFormDataBody
    for (let i=0, len=imageBuffer.length; i<len; i++) {
      json[`files[${i}]` as keyof RESTPostAPIInteractionFollowupFormDataBody] = [new Blob([imageBuffer[i]])]
    }
    return await this.followup(json)
  }

  // api message wrapper
  /**
   * Used to send messages other than res*** and followup***.
   * @param json [data type](https://discord-api-types.dev/api/next/discord-api-types-v10#RESTPostAPIChannelMessageFormDataBody)
   * @param channelId If omitted, it is sent to the channel of the request.
   * @returns 
   */
  post = async (json: RESTPostAPIChannelMessageFormDataBody, channelId?: string) => {
    const id = channelId || this.#interaction?.channel?.id
    if (!id) throw new Error('channelId is not set.')
    return await postMessage(json, id)
  }
  postText = async (content: string) => await this.post({ content })
  postEmbed = async (embed: APIEmbed) => await this.post({ embeds: [embed] })
  postImage = async (imageBuffer: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(imageBuffer)) return await this.post({ 'files[0]': [new Blob([imageBuffer])] })
    const json = {} as RESTPostAPIChannelMessageFormDataBody
    for (let i=0, len=imageBuffer.length; i<len; i++) {
      json[`files[${i}]` as keyof RESTPostAPIChannelMessageFormDataBody] = [new Blob([imageBuffer[i]])]
    }
    return await this.post(json)
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
