import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataStringOption,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10'
import type { Autocomplete, Modal } from './builder'
import { Rest, _webhooks_$_$, _webhooks_$_$_messages_$ } from './rest-api'
import type {
  CronEvent,
  CustomCallbackData,
  DiscordEnv,
  Env,
  ExecutionContext,
  FetchEventLike,
  FileData,
} from './types'
import { ResponseObject, errorDev, errorSys, formData, prepareData } from './utils'

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
  #var = new Map()
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
    if (!(this.#executionCtx && 'respondWith' in this.#executionCtx)) throw errorSys('FetchEvent')
    return this.#executionCtx
  }
  get executionCtx(): ExecutionContext {
    if (!this.#executionCtx) throw errorSys('ExecutionContext')
    return this.#executionCtx
  }
  get waitUntil(): ExecutionContext['waitUntil'] /*| FetchEventLike["waitUntil"]*/ {
    if (!this.#executionCtx?.waitUntil) throw errorSys('waitUntil')
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
  set: SetVar<E> = (key: string, value: unknown) => this.#var.set(key, value)
  /**
   * @param {string} key
   * @returns {unknown}
   */
  get: GetVar<E> = (key: string) => this.#var.get(key)
  /**
   * Variables object
   */
  get var(): Readonly<
    ContextVariableMap & (IsAny<E['Variables']> extends true ? Record<string, any> : E['Variables'])
  > {
    return Object.fromEntries(this.#var)
  }

  /**
   * `c.rest` = `new Rest(c.env.DISCORD_TOKEN)`
   */
  get rest(): Rest {
    if (!this.discord.TOKEN) throw errorDev('DISCORD_TOKEN')
    return new Rest(this.discord.TOKEN)
  }
}

// biome-ignore format: ternary operator
type APIInteraction<T extends 2 | 3 | 4 | 5> =
  T extends 2 ? APIApplicationCommandInteraction :
  T extends 3 ? APIMessageComponentInteraction :
  T extends 4 ? APIApplicationCommandAutocompleteInteraction :
  T extends 5 ? APIModalSubmitInteraction :
  APIApplicationCommandInteraction
abstract class Context2345<E extends Env, D extends APIInteraction<2 | 3 | 4 | 5>> extends ContextAll<E> {
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

type CallbackType = 1 | 4 | 5 | 6 | 7 | 9 | 10 | 12
// biome-ignore format: ternary operator
type CallbackData<T extends CallbackType> =
  T extends 4 | 7 ? CustomCallbackData<APIInteractionResponseCallbackData> :
  T extends 5 ? Pick<APIInteractionResponseCallbackData, "flags"> :
  T extends 9 ? Modal | APIModalInteractionResponseCallbackData :
  undefined // 1, 6, 10
type CallbackFile<T extends CallbackType> = T extends 4 | 7 ? FileData : undefined
abstract class Context235<E extends Env, D extends APIInteraction<2 | 3 | 5>> extends Context2345<E, D> {
  #flags: { flags?: number } = {}

  /**
   * Only visible to the user who invoked the Interaction
   * @param {boolean} [bool=true]
   * @example
   * ```ts
   * return c.ephemeral().res('Personalized Text')
   * ```
   */
  ephemeral = (bool = true) => {
    this.#flags = bool ? { flags: 1 << 6 } : {}
    return this
  }

  /**
   * @param {1 | 4 | 5 | 6 | 7 | 9 | 10 | 12} type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type)
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @returns {Response}
   */
  protected r = <T extends CallbackType>(type: T, data?: CallbackData<T>, file?: CallbackFile<T>) => {
    let body: APIInteractionResponse | FormData
    switch (type) {
      case 4:
      case 7:
        body = { data: { ...this.#flags, ...prepareData(data as CallbackData<4 | 7>) }, type }
        if (file) body = formData(body, file)
        break
      case 5:
        body = { data: { ...this.#flags, ...(data as CallbackData<5>) }, type }
        break
      case 9:
        body = { data: 'toJSON' in data! ? data.toJSON() : (data as APIModalInteractionResponseCallbackData), type }
        break
      default: // 1, 6, 10, 12
        body = { type }
    }
    return new ResponseObject(body)
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @param {1 | 4 | 5 | 6 | 7 | 9 | 10 | 12} type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) default: 4 (respond to an interaction with a message)
   * @returns {Response}
   */
  res = (data: CallbackData<4>, file?: CallbackFile<4>) => this.r(4, data, file)
  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   * @param {(c: this) => Promise<unknown>} handler
   * @returns {Response}
   * @example
   * ```ts
   * return c.resDefer(c => c.followup('Delayed Message'))
   * ```
   */
  resDefer = (handler?: (c: this) => Promise<unknown>) => {
    if (handler) this.waitUntil(handler(this))
    return this.r(5, {})
  }

  /**
   * Used to send messages after resDefer
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @example
   * ```ts
   * return c.resDefer(c => c.followup('Image file', { blob: Blob, name: 'image.png' }))
   * ```
   */
  followup = (data: CustomCallbackData<RESTPostAPIInteractionFollowupJSONBody> = {}, file?: FileData) => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    return this.rest.post(
      _webhooks_$_$,
      [this.discord.APPLICATION_ID, this.interaction.token],
      { ...this.#flags, ...prepareData(data) },
      file,
    )
  }
  /**
   * Delete the self message
   * @returns {Promise<Response>}
   * @example
   * ```ts
   * return c.resDeferUpdate(c.followupDelete)
   * ```
   */
  followupDelete = () => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    if (!this.interaction.message?.id) throw errorSys('Message Id')
    return this.rest.delete(_webhooks_$_$_messages_$, [
      this.discord.APPLICATION_ID,
      this.interaction.token,
      this.interaction.message.id,
    ])
  }
}

export class CommandContext<E extends Env = any> extends Context235<E, APIInteraction<2>> {
  #sub = { group: '', command: '', string: '' }
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: APIInteraction<2>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    const { sub, options } = getOptions(interaction)
    this.#sub = sub
    // @ts-expect-error
    if (options) for (const e of options) this.set(e.name, e.value)
  }

  /**
   * This object is useful when using subcommands
   * @example
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
   * @example
   * ```ts
   * return c.resModal(new Modal('unique-id', 'Title')
   *   .row(new TextInput('custom_id', 'Label'))
   * )
   * ```
   */
  resModal = (data: CallbackData<9>) => this.r(9, data)
}

type ComponentType = 'Button' | 'Select' | unknown
// biome-ignore format: ternary operator
type ComponentInteractionData<T extends ComponentType> =
  T extends 'Button' ? APIMessageComponentButtonInteraction :
  T extends 'Select' ? APIMessageComponentSelectMenuInteraction :
  APIMessageComponentInteraction
export class ComponentContext<E extends Env = any, T extends ComponentType = unknown> extends Context235<
  E & { Variables: { custom_id?: string } },
  ComponentInteractionData<T>
> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: APIInteraction<3>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction as ComponentInteractionData<T>, key)
    // @ts-expect-error
    this.set('custom_id', interaction.data?.custom_id)
  }

  /**
   * for components, edit the message the component was attached to
   * @param data
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @returns {Response}
   */
  resUpdate = (data: CallbackData<7>, file?: CallbackFile<7>) => this.r(7, data, file)
  /**
   * for components, ACK an interaction and edit the original message later; the user does not see a loading state
   * @param {((c: this) => Promise<unknown>)} handler
   * @returns {Response}
   */
  resDeferUpdate = (handler?: (c: this) => Promise<unknown>) => {
    if (handler) this.waitUntil(handler(this))
    return this.r(6)
  }
  /**
   * Response for modal window display
   * @param {Modal} data
   * @returns {Response}
   * @example
   * ```ts
   * return c.resModal(new Modal('unique-id', 'Title')
   *   .row(new TextInput('custom_id', 'Label'))
   * )
   * ```
   */
  resModal = (data: CallbackData<9>) => this.r(9, data)
}

export class ModalContext<E extends Env = any> extends Context235<
  E & { Variables: { custom_id?: string } },
  APIInteraction<5>
> {
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: APIInteraction<5>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    // @ts-expect-error
    this.set('custom_id', interaction.data?.custom_id)
    const modalRows = interaction.data?.components
    if (modalRows)
      // @ts-expect-error
      for (const modalRow of modalRows) for (const modal of modalRow.components) this.set(modal.custom_id, modal.value)
  }
}

type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption
export class AutocompleteContext<E extends Env = any> extends Context2345<E, APIInteraction<4>> {
  #sub = { group: '', command: '', string: '' }
  #focused: AutocompleteOption | undefined
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: APIInteraction<4>,
    key: string,
  ) {
    super(req, env, executionCtx, discord, interaction, key)
    const { sub, options } = getOptions(interaction)
    this.#sub = sub
    if (options)
      for (const e of options) {
        const { type } = e
        if ((type === 3 || type === 4 || type === 10) && e.focused) this.#focused = e
        // @ts-expect-error
        this.set(e.name, e.value)
      }
  }

  /**
   * This object is useful when using subcommands
   * @example
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
    new ResponseObject({ data: 'toJSON' in data ? data.toJSON() : data, type: 8 })
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

const getOptions = (interaction: APIInteraction<2 | 4>) => {
  const sub = { group: '', command: '', string: '' }
  let options: APIApplicationCommandInteractionDataOption[] | undefined = undefined
  if ('options' in interaction.data) {
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
