import type {
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseDeferredMessageUpdate,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIModalInteractionResponseCallbackData,
  APIEmbed,
  APIBaseInteraction,
  InteractionType,
  APIMessageButtonInteractionData,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageMentionableSelectInteractionData,
  APIMessageChannelSelectInteractionData,
} from 'discord-api-types/v10'
import type {
  Env,
  DiscordKey,
  ExecutionContext,
  FetchEventLike,
  CronEvent,
  ApplicationCommand,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
  CustomResponseCallbackData,
  FileData,
} from './types'
import { ResponseJson } from './utils'
import { postMessage, deleteMessage, followupMessage } from './api-wrapper/channel-message'
import { Modal } from './builder/modal'
import { Components } from './builder/components'

type ExecutionCtx = FetchEventLike | ExecutionContext | undefined

interface ContextVariableMap {}
interface Get<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key]
  <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key]
}
interface Set<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void
  <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void
}

class ContextBase<E extends Env> {
  #env: E['Bindings'] = {}
  #executionCtx: ExecutionCtx
  protected discord: DiscordKey
  #var: E['Variables'] = {}
  constructor(env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordKey) {
    this.#env = env
    this.#executionCtx = executionCtx
    this.discord = discord
  }

  get env(): E['Bindings'] {
    return this.#env
  }
  get event(): FetchEventLike {
    if (!(this.#executionCtx && 'respondWith' in this.#executionCtx)) throw new Error('This context has no FetchEvent.')
    return this.#executionCtx
  }
  get executionCtx(): ExecutionContext {
    if (!this.#executionCtx) throw new Error('This context has no ExecutionContext.')
    return this.#executionCtx
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

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param files FileData: { blob: Blob, name: string }
   */
  post = async (channelId: string, data: CustomResponseCallbackData, ...files: FileData[]) =>
    await postMessage(this.discord.TOKEN, channelId, data, ...files)
  postText = async (channelId: string, content: string) => await this.post(channelId, { content })
  postEmbeds = async (channelId: string, ...embeds: APIEmbed[]) => await this.post(channelId, { embeds })

  delete = async (channelId: string, messageId: string) => await deleteMessage(this.discord.TOKEN, channelId, messageId)
}

// prettier-ignore
type InteractionData<T extends 2 | 3 | 4 | 5> =
  T extends 2 ? InteractionCommandData :
  T extends 3 ? InteractionComponentData :
  T extends 5 ? InteractionModalData :
  InteractionCommandData
class RequestContext<E extends Env, D extends InteractionData<2 | 3 | 4 | 5>> extends ContextBase<E> {
  #req: Request
  #interaction: D
  constructor(req: Request, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordKey, interaction: D) {
    super(env, executionCtx, discord)
    this.#req = req
    this.#interaction = interaction
  }

  get req(): Request {
    return this.#req
  }
  /**
   * [Interaction Object](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)
   */
  get interaction(): D {
    return this.#interaction
  }

  /**
   * [Check Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type)
   */
  resBase = (json: APIInteractionResponse) => {
    if ('data' in json && json.data && 'components' in json.data) {
      const components = json.data.components
      json.data.components = components instanceof Components ? components.build() : components
    }
    return new ResponseJson(json)
  }
  /**
   * Response to request.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @returns Response
   */
  res = (data: CustomResponseCallbackData) =>
    this.resBase({ type: 4, data } as APIInteractionResponseChannelMessageWithSource)
  resEphemeral = (data: CustomResponseCallbackData) => this.res({ flags: 1 << 6, ...data })
  resText = (content: string) => this.res({ content })
  resEmbeds = (...embeds: APIEmbed[]) => this.res({ embeds })
  resDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) {
      if (!this.executionCtx.waitUntil && !this.event.waitUntil)
        throw new Error('This command handler context has no waitUntil.')
      if (this.executionCtx.waitUntil) this.executionCtx.waitUntil(handler(this, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else this.event.waitUntil(handler(this, ...args))
    }
    return this.resBase({ type: 5 } as APIInteractionResponseDeferredChannelMessageWithSource)
  }
  /**
   * Used to send messages after resDefer.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   */
  followup = async (data: CustomResponseCallbackData, ...files: FileData[]) =>
    await followupMessage(this.discord.APPLICATION_ID, this.interaction.token, data, ...files)
  followupEphemeral = async (data: CustomResponseCallbackData, ...files: FileData[]) =>
    await this.followup({ flags: 1 << 6, ...data }, ...files)
  followupText = async (content: string) => await this.followup({ content })
  followupEmbeds = async (...embeds: APIEmbed[]) => await this.followup({ embeds })

  /**
   * Used to send messages other than res*** and followup***.
   * @param channelId "" is request channel id.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @returns
   */
  post = async (channelId: string, data: CustomResponseCallbackData, ...files: FileData[]) => {
    const id = channelId || this.#interaction?.channel?.id
    if (!id) throw new Error('channelId is not set.')
    return await postMessage(this.discord.TOKEN, id, data, ...files)
  }

  delete = async (channelId?: string, messageId?: string) => {
    const cId = channelId || this.#interaction?.channel?.id
    const mId = messageId || this.#interaction?.message?.id
    if (!cId) throw new Error('channelId is not set.')
    if (!mId) throw new Error('messageId is not set.')
    return await deleteMessage(this.discord.TOKEN, cId, mId)
  }
}

type CommandValue = string | number | boolean
type CommandValuesMap = Record<string, CommandValue>
export class CommandContext<E extends Env = any> extends RequestContext<E, InteractionData<2>> {
  #command: ApplicationCommand
  #values: CommandValue[] = []
  #valuesMap: CommandValuesMap = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<2>,
    command: ApplicationCommand,
  ) {
    super(req, env, executionCtx, discord, interaction)
    this.#command = command
    if (interaction?.data && 'options' in interaction?.data && interaction.data.options && this.#command) {
      this.#valuesMap = interaction.data.options.reduce((obj: CommandValuesMap, e) => {
        if (e.type === 1 || e.type === 2) return obj // sub command
        obj[e.name] = e.value
        return obj
      }, {})
      const names = this.#command.options?.map(e => e.name)
      if (this.#valuesMap && names) this.#values = names.map(e => this.#valuesMap[e])
    }
  }

  get command(): ApplicationCommand {
    return this.#command
  }
  get values(): CommandValue[] {
    return this.#values
  }
  get valuesMap(): CommandValuesMap {
    return this.#valuesMap
  }

  resModal = (e: Modal | APIModalInteractionResponseCallbackData) => {
    const data = e instanceof Modal ? e.build() : e
    return this.resBase({ type: 9, data } as APIModalInteractionResponse)
  }
}

type ComponentType = 'Button' | 'Select' | 'Other Select'
// prettier-ignore
type ComponentInteractionData<T extends ComponentType> =
  T extends 'Button' ? APIBaseInteraction<InteractionType.MessageComponent, APIMessageButtonInteractionData> :
  T extends 'Select' ? APIBaseInteraction<InteractionType.MessageComponent, APIMessageStringSelectInteractionData> :
  APIBaseInteraction<
    InteractionType.MessageComponent,
    | APIMessageUserSelectInteractionData
    | APIMessageRoleSelectInteractionData
    | APIMessageMentionableSelectInteractionData
    | APIMessageChannelSelectInteractionData
  >
export class ComponentContext<E extends Env = any, T extends ComponentType = 'Other Select'> extends RequestContext<
  E,
  InteractionData<3>
> {
  #interaction: InteractionData<3>
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<3>,
  ) {
    super(req, env, executionCtx, discord, interaction)
    this.#interaction = interaction
  }

  get interaction() {
    return this.#interaction as ComponentInteractionData<T>
  }

  resUpdate = (data: CustomResponseCallbackData) =>
    this.resBase({ type: 7, data } as APIInteractionResponseUpdateMessage)
  resUpdateText = (content: string) => this.resUpdate({ content })
  resUpdateEmbeds = (...embeds: APIEmbed[]) => this.resUpdate({ embeds })
  resUpdateDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) {
      if (!this.executionCtx.waitUntil && !this.event.waitUntil)
        throw new Error('This command handler context has no waitUntil. You can use .handler(command_handler).')
      if (this.executionCtx.waitUntil) this.executionCtx.waitUntil(handler(this, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else this.event.waitUntil(handler(this, ...args))
    }
    return this.resBase({ type: 6 } as APIInteractionResponseDeferredMessageUpdate)
  }
  resUpdateDelete = () => this.resUpdateDefer(async () => await this.delete())
  resModal = (e: Modal | APIModalInteractionResponseCallbackData) => {
    const data = e instanceof Modal ? e.build() : e
    return this.resBase({ type: 9, data } as APIModalInteractionResponse)
  }
}

export class ModalContext<E extends Env = any> extends RequestContext<E, InteractionData<5>> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<5>,
  ) {
    super(req, env, executionCtx, discord, interaction)
  }
}

export class CronContext<E extends Env = any> extends ContextBase<E> {
  #cronEvent: CronEvent
  constructor(event: CronEvent, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordKey) {
    super(env, executionCtx, discord)
    this.#cronEvent = event
  }

  get cronEvent(): CronEvent {
    return this.#cronEvent
  }
}
