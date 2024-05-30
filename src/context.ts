import type {
  APIBaseInteraction,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIMessageButtonInteractionData,
  APIMessageChannelSelectInteractionData,
  APIMessageMentionableSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  APIModalInteractionResponseCallbackData,
  InteractionType,
} from 'discord-api-types/v10'
import { Modal } from './builder/modal'
import type {
  CronEvent,
  CustomCallbackData,
  DiscordEnv,
  Env,
  ExecutionContext,
  FetchEventLike,
  FileData,
  InteractionCommandData,
  InteractionComponentData,
  InteractionModalData,
} from './types'
import { ResponseJson, apiUrl, errorDev, errorOther, errorSys, fetch429Retry, formData, prepareData } from './utils'

type ExecutionCtx = FetchEventLike | ExecutionContext | undefined

// biome-ignore lint: Same definition as Hono
type ContextVariableMap = {}
interface SetVar<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void
  <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void
}
interface GetVar<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key]
  <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key]
}
type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false

class ContextBase<E extends Env> {
  #env: E['Bindings'] = {}
  #executionCtx: ExecutionCtx
  protected discord: DiscordEnv
  #key: string
  #var: E['Variables'] = {}
  constructor(env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv, key: string) {
    this.#env = env
    this.#executionCtx = executionCtx
    this.discord = discord
    this.#key = key
  }

  get env(): E['Bindings'] {
    return this.#env
  }
  get event(): FetchEventLike {
    if (!(this.#executionCtx && 'respondWith' in this.#executionCtx)) throw errorOther('FetchEvent')
    return this.#executionCtx
  }
  get executionCtx(): ExecutionContext {
    if (!this.#executionCtx) throw errorOther('ExecutionContext')
    return this.#executionCtx
  }
  get waitUntil(): ExecutionContext['waitUntil'] /*| FetchEventLike["waitUntil"]*/ {
    if (!this.#executionCtx?.waitUntil) throw errorOther('waitUntil')
    return this.#executionCtx.waitUntil.bind(this.#executionCtx)
  }
  /**
   * Handler triggered string
   */
  get key(): string {
    return this.#key
  }
  // c.set, c.get, c.var.propName is Variables
  set: SetVar<E> = (key: string, value: unknown) => {
    this.#var ??= {}
    this.#var[key] = value
  }
  get: GetVar<E> = (key: string) => {
    return this.#var ? this.#var[key] : undefined
  }
  get var(): Readonly<
    ContextVariableMap & (IsAny<E['Variables']> extends true ? Record<string, any> : E['Variables'])
  > {
    return { ...this.#var } as never
  }
}

// biome-ignore format: ternary operator
type InteractionData<T extends 2 | 3 | 4 | 5> =
  T extends 2 ? InteractionCommandData :
  T extends 3 ? InteractionComponentData :
  T extends 5 ? InteractionModalData :
  InteractionCommandData
type InteractionCallbackType = 1 | 4 | 5 | 6 | 7 | 8 | 9 | 10
// biome-ignore format: ternary operator
type InteractionCallbackData<T extends InteractionCallbackType> =
  T extends 4 | 7 ? CustomCallbackData :
  T extends 5 ? Pick<APIInteractionResponseCallbackData, "flags"> :
  T extends 8 ? APICommandAutocompleteInteractionResponseCallbackData :
  T extends 9 ? Modal | APIModalInteractionResponseCallbackData :
  undefined // 1, 6, 10
class RequestContext<E extends Env, D extends InteractionData<2 | 3 | 4 | 5>> extends ContextBase<E> {
  #req: Request
  #interaction: D
  #flags: { flags?: number } = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: D,
    key: string,
  ) {
    super(env, executionCtx, discord, key)
    this.#req = req
    this.#interaction = interaction
  }

  /**
   * raw Request
   */
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
   * Only visible to the user who invoked the Interaction
   * @param bool default true
   * @sample
   * ```ts
   * return c.ephemeral().res('Personalized Text')
   * ```
   */
  ephemeral = (bool = true) => {
    this.#flags = bool ? { flags: 1 << 6 } : {}
    return this
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) default: 4 (respond to an interaction with a message)
   * @returns Response
   */
  res = <T extends InteractionCallbackType = 4>(data: InteractionCallbackData<T>, type: T = 4 as T) => {
    let json: APIInteractionResponse
    switch (type) {
      case 4:
      case 7: {
        json = { data: { ...this.#flags, ...prepareData(data as InteractionCallbackData<4 | 7>) }, type }
        break
      }
      case 5: {
        json = { data: { ...this.#flags, ...(data as InteractionCallbackData<5>) }, type }
        break
      }
      case 8: {
        json = { data: { ...(data as InteractionCallbackData<8>) }, type }
        break
      }
      case 9: {
        const d = data as InteractionCallbackData<9>
        if (d instanceof Modal) json = { data: d.build(), type }
        else json = { data: d, type }
        break
      }
      default: // 1, 6, 10
        json = { type }
    }
    return new ResponseJson(json)
  }
  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   * @sample
   * ```ts
   * return c.resDefer(c => c.followup('Delayed Message'))
   * ```
   */
  resDefer = (handler?: (c: this) => Promise<unknown>) => {
    if (handler) this.waitUntil(handler(this))
    return this.res({}, 5)
  }

  /**
   * Used to send messages after resDefer
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @param retry Number of retries at rate limit. default: 0
   * @sample
   * ```ts
   * return c.resDefer(c => c.followup('Image file', { blob: Blob, name: 'image.png' }))
   * ```
   */
  followup = (data: CustomCallbackData = {}, file?: FileData, retry = 0) => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.discord.APPLICATION_ID}/${this.#interaction.token}`,
      { method: 'POST', body: formData({ ...this.#flags, ...prepareData(data) }, file) },
      retry,
    )
  }
  /**
   * Delete the self message
   * @sample
   * ```ts
   * return c.resDeferUpdate(c.followupDelete)
   * ```
   */
  followupDelete = () => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    if (!this.#interaction.message?.id) throw errorSys('Message Id')
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.discord.APPLICATION_ID}/${this.#interaction.token}/messages/${this.#interaction.message?.id}`,
      { method: 'DELETE' },
    )
  }
}

type SubCommands = {
  group: string
  command: string
  string: string
}
export class CommandContext<E extends Env = any> extends RequestContext<E, InteractionData<2>> {
  #sub: SubCommands = { group: '', command: '', string: '' }
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<2>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    if (interaction?.data && 'options' in interaction.data) {
      let options = interaction.data.options
      if (options?.[0].type === 2) {
        this.#sub.group = options[0].name
        this.#sub.string = `${options[0].name} `
        options = options[0].options
      }
      if (options?.[0].type === 1) {
        this.#sub.command = options[0].name
        this.#sub.string += options[0].name
        options = options[0].options
      }
      if (options) {
        for (const e of options) {
          if (e.type === 1 || e.type === 2) return // ts-error
          // @ts-expect-error
          this.set(e.name, e.value)
        }
      }
    }
  }

  /**
   * This object is useful when using subcommands
   * @sample
   * ```ts
   * switch (c.sub.string) {
   *   case 'sub1':
   *     return c.res('sub1')
   *   case 'group sub2':
   *     return c.res('g-sub2')
   * }
   * ```
   */
  get sub(): SubCommands {
    return this.#sub
  }
  /**
   * @deprecated
   * You can get the value of the command option here
   * @sample
   * ```ts
   * const option = c.values.optionName
   * ```
   */
  get values() {
    return this.var
  }

  /**
   * Response for modal window display
   * @sample
   * ```ts
   * return c.resModal(new Modal('unique-id', 'Title')
   *   .row(new TextInput('custom_id', 'Label'))
   * )
   * ```
   */
  resModal = (data: Modal | APIModalInteractionResponseCallbackData) => this.res(data, 9)
}

type ComponentType = 'Button' | 'Select' | 'Other Select' | unknown
// biome-ignore format: ternary operator
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
    discord: DiscordEnv,
    interaction: InteractionData<3>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction as ComponentInteractionData<T>, key)
  }

  /**
   * for components, edit the message the component was attached to
   */
  resUpdate = (data: CustomCallbackData) => this.res(data, 7)
  /**
   * for components, ACK an interaction and edit the original message later; the user does not see a loading state
   */
  resDeferUpdate = (handler?: (c: this) => Promise<unknown>) => {
    if (handler) this.waitUntil(handler(this))
    return this.res(undefined, 6)
  }
  /**
   * Response for modal window display
   * @sample
   * ```ts
   * return c.resModal(new Modal('unique-id', 'Title')
   *   .row(new TextInput('custom_id', 'Label'))
   * )
   * ```
   */
  resModal = (data: Modal | APIModalInteractionResponseCallbackData) => this.res(data, 9)
}

export class ModalContext<E extends Env = any> extends RequestContext<E, InteractionData<5>> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<5>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    const modalRows = interaction.data?.components
    if (modalRows) {
      for (const modalRow of modalRows) {
        for (const modal of modalRow.components) {
          // @ts-expect-error
          this.set(modal.custom_id, modal.value)
        }
      }
    }
  }

  /**
   * @deprecated
   * You can get the value of the modal textinput here
   * @sample
   * ```ts
   * const text = c.values.textinputId
   * ```
   */
  get values() {
    return this.var
  }
}

export class CronContext<E extends Env = any> extends ContextBase<E> {
  #cronEvent: CronEvent
  constructor(event: CronEvent, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv, key: string) {
    super(env, executionCtx, discord, key)
    this.#cronEvent = event
  }

  get cronEvent(): CronEvent {
    return this.#cronEvent
  }
}
