import type {
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseDeferredMessageUpdate,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIModalInteractionResponseCallbackData,
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
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
  CustomResponseData,
  ArgFileData,
} from './types'
import { ResponseJson, ephemeralData } from './utils'
import { followupMessage, followupDeleteMessage } from './api-wrapper/channel-message'
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
  get waitUntil(): ExecutionContext['waitUntil'] /*| FetchEventLike["waitUntil"]*/ {
    if (!this.#executionCtx?.waitUntil) throw new Error('This context has no waitUntil.')
    return this.#executionCtx.waitUntil.bind(this.#executionCtx)
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
}

// biome-ignore format: 三項演算子
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
    if ('data' in json && json.data) {
      if (typeof json.data === 'string') json.data = { content: json.data }
      else if ('components' in json.data) {
        const components = json.data.components
        json.data.components = components instanceof Components ? components.build() : components
      }
    }
    return new ResponseJson(json)
  }
  /**
   * Response to request.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @returns Response
   */
  res = (data: CustomResponseData) => this.resBase({ type: 4, data } as APIInteractionResponseChannelMessageWithSource)
  resEphemeral = (data: CustomResponseData) => this.res(ephemeralData(data))
  resDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) this.waitUntil(handler(this, ...args))
    return this.resBase({ type: 5 } as APIInteractionResponseDeferredChannelMessageWithSource)
  }
  /* not working
  resDeferEphemeral = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) this.waitUntil(handler(this, ...args))
    return this.resBase({ type: 5, flags: 1 << 6 } as APIInteractionResponseDeferredChannelMessageWithSource)
  }
  */
  /**
   * Used to send messages after resDefer.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   */
  followup = async (data?: CustomResponseData, file?: ArgFileData) =>
    await followupMessage(this.discord.APPLICATION_ID, this.#interaction.token, data, file)
  /* not working
  followupEphemeral = async (data?: CustomResponseData, file?: ArgFileData) =>
    await this.followup(ephemeralData(data), file)
  */
  followupDelete = async (applicationId?: string, interactionToken?: string, messageId?: string) => {
    const appId = applicationId || this.discord.APPLICATION_ID
    const token = interactionToken || this.#interaction.token
    const mId = messageId || this.#interaction.message?.id
    return await followupDeleteMessage(appId, token, mId)
  }
}

type CommandValues = Record<string, string | number | boolean | undefined>
type SubCommand = {
  group: string
  command: string
  string: string
}
export class CommandContext<E extends Env = any> extends RequestContext<E, InteractionData<2>> {
  #sub: SubCommand = { group: '', command: '', string: '' }
  #values: CommandValues = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<2>,
  ) {
    super(req, env, executionCtx, discord, interaction)
    if (interaction?.data && 'options' in interaction?.data) {
      let options = interaction.data.options
      if (options?.[0].type === 2) {
        this.#sub.group = options[0].name
        this.#sub.string = options[0].name + ' '
        options = options[0].options
      }
      if (options?.[0].type === 1) {
        this.#sub.command = options[0].name
        this.#sub.string += options[0].name
        options = options[0].options
      }
      if (options) {
        this.#values = options?.reduce((obj: CommandValues, e) => {
          if (e.type === 1 || e.type === 2) return obj // for ts-error
          obj[e.name] = e.value
          return obj
        }, {})
      }
    }
  }

  get sub(): SubCommand {
    return this.#sub
  }
  get values(): CommandValues {
    return this.#values
  }

  resModal = (e: Modal | APIModalInteractionResponseCallbackData) => {
    const data = e instanceof Modal ? e.build() : e
    return this.resBase({ type: 9, data } as APIModalInteractionResponse)
  }
}

type ComponentType = 'Button' | 'Select' | 'Other Select' | unknown
// biome-ignore format: 三項演算子
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
export class ComponentContext<E extends Env = any, T extends ComponentType = unknown> extends RequestContext<
  E,
  ComponentInteractionData<T>
> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<3>,
  ) {
    super(req, env, executionCtx, discord, interaction as ComponentInteractionData<T>)
  }

  resUpdate = (data: CustomResponseData) => {
    if (typeof data === 'string') data = { content: data }
    return this.resBase({ type: 7, data } as APIInteractionResponseUpdateMessage)
  }
  resUpdateDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) this.waitUntil(handler(this, ...args))
    return this.resBase({ type: 6 } as APIInteractionResponseDeferredMessageUpdate)
  }
  /**
   * Delete the previous message and post a new one.
   * If the argument is empty, only message deletion is performed.
   * Internally, it hits the API endpoint of followup.
   */
  resRepost = (data?: CustomResponseData) => {
    if (!data) return this.resUpdateDefer(async () => await this.followupDelete())
    this.waitUntil(this.followupDelete())
    return this.res(data)
  }
  resRepostEphemeral = (data: CustomResponseData) => this.resRepost(ephemeralData(data))
  resModal = (e: Modal | APIModalInteractionResponseCallbackData) => {
    const data = e instanceof Modal ? e.build() : e
    return this.resBase({ type: 9, data } as APIModalInteractionResponse)
  }
}

export class ModalContext<E extends Env = any> extends RequestContext<E, InteractionData<5>> {
  #values: Record<string, string | undefined> = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordKey,
    interaction: InteractionData<5>,
  ) {
    super(req, env, executionCtx, discord, interaction)
    const modalRows = interaction.data?.components
    if (modalRows) {
      for (const modalRow of modalRows) {
        for (const modal of modalRow.components) {
          this.#values[modal.custom_id] = modal.value
        }
      }
    }
  }

  get values() {
    return this.#values
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
