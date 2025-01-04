import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataStringOption,
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
import type { Autocomplete, Modal } from './builder'
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

abstract class ContextAll<E extends Env> {
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

  /**
   * Environment Variables
   */
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
  /**
   * @param {string} key
   * @param {unknown} value
   */
  set: SetVar<E> = (key: string, value: unknown) => {
    this.#var ??= {}
    this.#var[key] = value
  }
  /**
   * @param {string} key
   * @returns {unknown}
   */
  get: GetVar<E> = (key: string) => {
    return this.#var ? this.#var[key] : undefined
  }
  /**
   * Variables object
   */
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
  T extends 4 ? APIApplicationCommandAutocompleteInteraction :
  T extends 5 ? InteractionModalData :
  InteractionCommandData
abstract class Context2345<E extends Env, D extends InteractionData<2 | 3 | 4 | 5>> extends ContextAll<E> {
  #req: Request
  #interaction: D
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
}

type InteractionCallbackType = 1 | 4 | 5 | 6 | 7 | 9 | 10
// biome-ignore format: ternary operator
type InteractionCallbackData<T extends InteractionCallbackType> =
  T extends 4 | 7 ? CustomCallbackData :
  T extends 5 ? Pick<APIInteractionResponseCallbackData, "flags"> :
  T extends 9 ? Modal | APIModalInteractionResponseCallbackData :
  undefined // 1, 6, 10
abstract class Context235<E extends Env, D extends InteractionData<2 | 3 | 5>> extends Context2345<E, D> {
  #interactionToken: string
  #interactionMessageId: string | undefined
  #DISCORD_APPLICATION_ID: string | undefined
  #flags: { flags?: number } = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: D,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    this.#interactionToken = interaction.token
    this.#interactionMessageId = interaction.message?.id
    this.#DISCORD_APPLICATION_ID = discord.APPLICATION_ID
  }

  /**
   * Only visible to the user who invoked the Interaction
   * @param {boolean} [bool=true]
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
   * @param {1 | 4 | 5 | 6 | 7 | 9 | 10} type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) default: 4 (respond to an interaction with a message)
   * @returns {Response}
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
      case 9: {
        const d = data as InteractionCallbackData<9>
        json = 'toJSON' in d ? { data: d.toJSON(), type } : { data: d, type }
        break
      }
      default: // 1, 6, 10
        json = { type }
    }
    return new ResponseJson(json)
  }
  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   * @param {(c: this) => Promise<unknown>} handler
   * @returns {Response}
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
   * @param {number} [retry=0] Number of retries at rate limit
   * @sample
   * ```ts
   * return c.resDefer(c => c.followup('Image file', { blob: Blob, name: 'image.png' }))
   * ```
   */
  followup = (data: CustomCallbackData = {}, file?: FileData, retry = 0) => {
    if (!this.#DISCORD_APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.#DISCORD_APPLICATION_ID}/${this.#interactionToken}`,
      { method: 'POST', body: formData({ ...this.#flags, ...prepareData(data) }, file) },
      retry,
    )
  }
  /**
   * Delete the self message
   * @returns {Promise<Response>}
   * @sample
   * ```ts
   * return c.resDeferUpdate(c.followupDelete)
   * ```
   */
  followupDelete = () => {
    if (!this.#DISCORD_APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    if (!this.#interactionMessageId) throw errorSys('Message Id')
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.#DISCORD_APPLICATION_ID}/${this.#interactionToken}/messages/${this.#interactionMessageId}`,
      { method: 'DELETE' },
    )
  }
}

export class CommandContext<E extends Env = any> extends Context235<E, InteractionData<2>> {
  #sub = { group: '', command: '', string: '' }
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<2>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    const { sub, options } = getOptions(interaction)
    this.#sub = sub
    if (options) {
      for (const e of options) {
        // @ts-expect-error
        this.set(e.name, e.value)
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
  get sub() {
    return this.#sub
  }

  /**
   * Response for modal window display
   * @param {Modal} data
   * @returns {Response}
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
export class ComponentContext<E extends Env = any, T extends ComponentType = unknown> extends Context235<
  E & { Variables: { custom_id?: string } },
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
    // @ts-expect-error
    this.set('custom_id', interaction.data?.custom_id)
  }

  /**
   * for components, edit the message the component was attached to
   * @param data
   * @returns {Response}
   */
  resUpdate = (data: CustomCallbackData) => this.res(data, 7)
  /**
   * for components, ACK an interaction and edit the original message later; the user does not see a loading state
   * @param {((c: this) => Promise<unknown>)} handler
   * @returns {Response}
   */
  resDeferUpdate = (handler?: (c: this) => Promise<unknown>) => {
    if (handler) this.waitUntil(handler(this))
    return this.res(undefined, 6)
  }
  /**
   * Response for modal window display
   * @param {Modal} data
   * @returns {Response}
   * @sample
   * ```ts
   * return c.resModal(new Modal('unique-id', 'Title')
   *   .row(new TextInput('custom_id', 'Label'))
   * )
   * ```
   */
  resModal = (data: Modal | APIModalInteractionResponseCallbackData) => this.res(data, 9)
}

export class ModalContext<E extends Env = any> extends Context235<
  E & { Variables: { custom_id?: string } },
  InteractionData<5>
> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<5>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    // @ts-expect-error
    this.set('custom_id', interaction.data?.custom_id)
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
}

type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption
export class AutocompleteContext<E extends Env = any> extends Context2345<E, InteractionData<4>> {
  #sub = { group: '', command: '', string: '' }
  #focused: AutocompleteOption | undefined
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<4>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    const { sub, options } = getOptions(interaction)
    this.#sub = sub
    if (options) {
      for (const e of options) {
        const type = e.type
        if ((type === 3 || type === 4 || type === 10) && e.focused) this.#focused = e
        // @ts-expect-error
        this.set(e.name, e.value)
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
  get sub() {
    return this.#sub
  }

  /**
   * Focused Option
   *
   * [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data)
   */
  get focused() {
    return this.#focused
  }

  /**
   * @param {Autocomplete | APICommandAutocompleteInteractionResponseCallbackData} data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
   * @returns {Response}
   */
  resAutocomplete = (data: Autocomplete | APICommandAutocompleteInteractionResponseCallbackData) =>
    new ResponseJson({ data: 'toJSON' in data ? data.toJSON() : data, type: 8 })
}

export class CronContext<E extends Env = any> extends ContextAll<E> {
  #cronEvent: CronEvent
  constructor(event: CronEvent, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv, key: string) {
    super(env, executionCtx, discord, key)
    this.#cronEvent = event
  }

  /**
   * Cron Event
   */
  get cronEvent(): CronEvent {
    return this.#cronEvent
  }
}

const getOptions = (interaction: InteractionData<2 | 4>) => {
  const sub = { group: '', command: '', string: '' }
  let options: APIApplicationCommandInteractionDataOption[] | undefined = undefined
  if (interaction?.data && 'options' in interaction.data) {
    options = interaction.data.options
    if (options?.[0].type === 2) {
      sub.group = options[0].name
      sub.string = `${options[0].name} `
      options = options[0].options
    }
    if (options?.[0].type === 1) {
      sub.command = options[0].name
      sub.string += options[0].name
      options = options[0].options
    }
  }
  return { sub, options }
}
