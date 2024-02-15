import type {
  APIInteractionResponseCallbackData,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseUpdateMessage,
  APIInteractionResponseDeferredMessageUpdate,
  APIModalInteractionResponse,
  APIModalInteractionResponseCallbackData,
  APIEmbed,
} from 'discord-api-types/v10'
import type {
  Env,
  ExecutionContext,
  FetchEventLike,
  CronEvent,
  ApplicationCommand,
  InteractionData,
  FileData,
} from './types'
import { apiUrl, ResponseJson, fetchMessage } from './utils'
import { postMessage } from './api-wrapper/channel-message'
import { Modal } from './builder/modal'

type CommandValue = string | number | boolean
type CommandValuesMap = Record<string, CommandValue>
type Command = ApplicationCommand & {
  values: CommandValue[]
  valuesMap: CommandValuesMap
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
export class Context<E extends Env = any, D extends InteractionData = InteractionData> {
  env: E['Bindings'] = {}

  #req: Request | undefined
  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #interaction: D | undefined
  #command: Command | undefined
  #component: D['data'] | undefined
  #cronEvent: CronEvent | undefined
  #var: E['Variables'] = {}

  constructor(
    req: Request | CronEvent,
    env?: E['Bindings'],
    executionCtx?: FetchEventLike | ExecutionContext | undefined,
    interaction?: D,
    command?: ApplicationCommand,
  ) {
    if (req instanceof Request) this.#req = req
    else this.#cronEvent = req
    if (env) this.env = env
    if (executionCtx) this.#executionCtx = executionCtx
    if (interaction) this.#interaction = interaction
    if (command) {
      this.#command = { ...command, values: [], valuesMap: {} }
    } else {
      if (interaction) this.#component = interaction.data
    }
    if (interaction?.data && 'options' in interaction?.data && interaction.data.options && this.#command) {
      this.#command.valuesMap = interaction.data.options.reduce((obj: CommandValuesMap, e) => {
        if (e.type === 1 || e.type === 2) return obj
        obj[e.name] = e.value
        return obj
      }, {})
      const names = this.#command.options?.map(e => e.name)
      // @ts-expect-error
      if (this.#command.valuesMap && names) this.#command.values = names.map(e => this.#command.valuesMap[e])
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

  get interaction(): D {
    if (!this.#interaction) throw new Error('This context has no Interaction.')
    return this.#interaction
  }

  get command(): Command {
    if (!this.#command) throw new Error('This context has no Command.')
    return this.#command
  }

  get component(): D['data'] {
    if (!this.#component) throw new Error('This context has no Component.')
    return this.#component
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
  res = (data: APIInteractionResponseCallbackData) => {
    if (this.#command) return this.resBase({ type: 4, data } as APIInteractionResponseChannelMessageWithSource)
    else return this.resBase({ type: 7, data } as APIInteractionResponseUpdateMessage)
  }
  resText = (content: string) => this.res({ content })
  resEmbeds = (...embeds: APIEmbed[]) => this.res({ embeds })
  resDefer = () => {
    if (this.#command) return this.resBase({ type: 5 } as APIInteractionResponseDeferredChannelMessageWithSource)
    else return this.resBase({ type: 6 } as APIInteractionResponseDeferredMessageUpdate)
  }
  resModal = (e: Modal | APIModalInteractionResponseCallbackData) => {
    const data = e instanceof Modal ? e.build() : e
    return this.resBase({ type: 9, data } as APIModalInteractionResponse)
  }
  //resDeferComponents = () => this.resBase({ type: 6 } as APIInteractionResponseDeferredMessageUpdate)

  /**
   * Used to send messages after resDefer.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @returns
   */
  followup = async (data: APIInteractionResponseCallbackData, ...files: FileData[]) => {
    if (!this.env?.DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not set.')
    if (!this.#interaction?.token) throw new Error('interaction is not set.')
    const post = await fetchMessage(
      `${apiUrl}/webhooks/${this.env.DISCORD_APPLICATION_ID}/${this.#interaction.token}`,
      data,
      files,
    )
    return new Response('Sent to Discord.', { status: post.status })
  }
  followupText = async (content: string) => await this.followup({ content })
  followupEmbeds = async (...embeds: APIEmbed[]) => await this.followup({ embeds })
  followupImages = async (...images: ArrayBuffer[]) =>
    await this.followup({}, ...images.map((e, i) => ({ blob: new Blob([e]), name: `image${i}.png` })))

  /**
   * Used to send messages other than res*** and followup***.
   * @param channelId "" is request channel id.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @returns
   */
  post = async (channelId: string, data: APIInteractionResponseCallbackData, ...files: FileData[]) => {
    const id = channelId || this.#interaction?.channel?.id
    if (!id) throw new Error('channelId is not set.')
    return await postMessage(id, data, ...files)
  }
  postText = async (channelId: string, content: string) => await this.post(channelId, { content })
  postEmbeds = async (channelId: string, ...embeds: APIEmbed[]) => await this.post(channelId, { embeds })
  postImages = async (channelId: string, ...images: ArrayBuffer[]) =>
    await this.post(channelId, {}, ...images.map((e, i) => ({ blob: new Blob([e]), name: `image${i}.png` })))
}
