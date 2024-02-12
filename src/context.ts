import type {
  APIEmbed,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type {
  Env,
  ExecutionContext,
  FetchEventLike,
  CronEvent,
  ApplicationCommand,
  Interaction,
  FileData,
} from './types'
import { apiUrl, ResponseJson, fetchMessage } from './utils'
import { postMessage } from './api-wrapper/channel-message'

type Command = ApplicationCommand & {
  values: string[]
  valuesMap: Record<string, string>
}

interface ContextVariableMap {}

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
  env: E['Bindings'] = {}

  #req: Request | undefined
  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #interaction: Interaction | undefined
  #command: Command | undefined
  #cronEvent: CronEvent | undefined
  #var: E['Variables'] = {}

  constructor(
    req: Request | CronEvent,
    env?: E['Bindings'],
    executionCtx?: FetchEventLike | ExecutionContext | undefined,
    command?: ApplicationCommand,
    interaction?: Interaction,
  ) {
    if (req instanceof Request) this.#req = req
    else this.#cronEvent = req
    if (env) this.env = env
    if (executionCtx) this.#executionCtx = executionCtx
    if (command) this.#command = { ...command, values: [], valuesMap: {} }
    if (interaction) this.#interaction = interaction
    if (interaction?.data?.options && this.#command) {
      this.#command.valuesMap = interaction.data.options.reduce((obj: Record<string, string>, e) => {
        // @ts-expect-error
        obj[e.name] = e.value
        return obj
      }, {})
      const optionsName = this.#command.options?.map(e => e.name)
      // @ts-expect-error
      if (this.#command.valuesMap) this.#command.values = optionsName?.map(e => this.#command.valuesMap[e])
    }
  }

  get req(): Request {
    if (!this.#req) throw new Error('This context has no Request.')
    return this.#req
  }

  get event(): FetchEventLike {
    if (!(this.#executionCtx && 'respondWith' in this.#executionCtx)) throw new Error('This context has no FetchEvent.')
    return this.#executionCtx
  }

  get executionCtx(): ExecutionContext {
    if (!this.#executionCtx) throw new Error('This context has no ExecutionContext.')
    return this.#executionCtx
  }

  get interaction(): Interaction {
    if (!this.#interaction) throw new Error('This context has no Interaction.')
    return this.#interaction
  }

  get command(): Command {
    if (!this.#command) throw new Error('This context has no Command.')
    return this.#command
  }

  get cronEvent(): CronEvent {
    if (!this.#cronEvent) throw new Error('This context has no ScheduledEvent.')
    return this.#cronEvent
  }

  // c.set, c.get, c.var.propName is Variables
  set: Set<E> = (key: string, value: unknown) => {
    this.#var ??= {}
    this.#var[key as string] = value
  }
  get: Get<E> = (key: string) => {
    return this.#var ? this.#var[key] : undefined
  }
  get var(): Readonly<E['Variables'] & ContextVariableMap> {
    return { ...this.#var } as never
  }

  resBase = (json: APIInteractionResponse) => new ResponseJson(json)
  /**
   * Response to request.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @returns Response
   */
  res = (data: APIInteractionResponseCallbackData) =>
    this.resBase({ data, type: 4 } as APIInteractionResponseChannelMessageWithSource)
  resText = (content: string) => this.res({ content })
  resEmbeds = (...embeds: APIEmbed[]) => this.res({ embeds })
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
    const post = await fetchMessage(
      `${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`,
      data,
      file,
    )
    return new Response('Sent to Discord.', { status: post.status })
  }
  followupText = async (content: string) => await this.followup({ content })
  followupEmbeds = async (...embeds: APIEmbed[]) => await this.followup({ embeds })
  followupImages = async (...images: ArrayBuffer[]) =>
    await this.followup(
      {},
      images.map((e, i) => ({ blob: new Blob([e]), name: `image${i}.png` })),
    )

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
  postEmbeds = async (channelId: string, ...embeds: APIEmbed[]) => await this.post(channelId, { embeds })
  postImages = async (channelId: string, ...images: ArrayBuffer[]) =>
    await this.post(
      channelId,
      {},
      images.map((e, i) => ({ blob: new Blob([e]), name: `image${i}.png` })),
    )
}
