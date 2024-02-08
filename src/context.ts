import type {
  APIEmbed,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type { Env, FetchEventLike, ApplicationCommand, Interaction } from './types'
import type { FileData } from './utils'
import { apiUrl, ResponseJson, fetchMessage } from './utils'
import { postMessage } from './api-wrapper/channel-message'

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

type Command = ApplicationCommand & {
  values?: string[]
  valuesMap?: Record<string, string>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Context<E extends Env = any> {
  req: Request
  env: E['Bindings'] = {}

  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #interaction: Interaction | undefined
  #command: Command | undefined
  #var: E['Variables'] = {}

  constructor(
    req: Request,
    env?: E['Bindings'],
    executionCtx?: FetchEventLike | ExecutionContext | undefined,
    command?: ApplicationCommand,
    interaction?: Interaction,
  ) {
    this.req = req
    if(env) this.env = env
    if(executionCtx) this.#executionCtx = executionCtx
    if(command) this.#command = command
    if(interaction) this.#interaction = interaction
    if(interaction?.data?.options && this.#command) {
      this.#command.valuesMap = interaction.data.options.reduce((obj: Record<string, string>, e) => {
        // @ts-expect-error
        obj[e.name] = e.value
        return obj
      }, {})
      const optionsName = this.#command.options?.map(e => e.name)
      // @ts-expect-error
      if(this.#command.valuesMap) this.#command.values = optionsName?.map(e => this.#command.valuesMap[e])
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

  get command(): Command | undefined {
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

  /**
   * Used to send messages after resDefer.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @returns 
   */
  followup = async (data: APIInteractionResponseCallbackData, file?: FileData | FileData[]) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const post = await fetchMessage(`${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`, data, file)
    return new Response('Sent to Discord.', { status: post.status })
  }
  followupText = async (content: string) => await this.followup({ content })
  followupEmbed = async (embed: APIEmbed) => await this.followup({ embeds: [embed] })
  followupImage = async (image: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(image)) return await this.followup({}, { blob: new Blob([image]), name: 'image.png' })
    return await this.followup({}, image.map((e,i) => ({ blob: new Blob([e]), name: `image${i}.png` })))
  }

  /**
   * Used to send messages other than res*** and followup***.
   * @param channelId "" is request channel id.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @returns 
   */
  post = async (channelId: string, data: APIInteractionResponseCallbackData, file?: FileData | FileData[]) => {
    const id = channelId || this.#interaction?.channel?.id
    if (!id) throw new Error('channelId is not set.')
    return await postMessage(id, data, file)
  }
  postText = async (channelId: string, content: string) => await this.post(channelId, { content })
  postEmbed = async (channelId: string, embed: APIEmbed) => await this.post(channelId, { embeds: [embed] })
  postImage = async (channelId: string, image: ArrayBuffer | ArrayBuffer[]) => {
    if (!Array.isArray(image)) return await this.post(channelId, {}, { blob: new Blob([image]), name: 'image.png' })
    return await this.post(channelId, {}, image.map((e,i) => ({ blob: new Blob([e]), name: `image${i}.png` })))
  }
}
