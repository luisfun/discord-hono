import type {
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataStringOption,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIModalInteractionResponseCallbackData,
  RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10'
import type { Autocomplete, Modal } from './builders'
import { Rest, _webhooks_$_$, _webhooks_$_$_messages_$ } from './rest'
import type {
  CronEvent,
  CustomCallbackData,
  DiscordEnv,
  Env,
  ExecutionContext,
  FetchEventLike,
  FileData,
} from './types'
import { ResponseObject, errorDev, errorSys, formData, prepareData, toJSON } from './utils'

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
  #rest: Rest | undefined = undefined
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
    this.#rest ??= new Rest(this.discord.TOKEN)
    return this.#rest
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
type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption

export class InteractionContext<E extends Env> extends ContextAll<E> {
  #req: Request
  #interaction: APIInteraction
  #flags: { flags?: number } = {} // 235
  #sub = { group: '', command: '', string: '' } // 24
  #focused: AutocompleteOption | undefined // 4
  #throwIfNotAllowType = (allowType: APIInteraction['type'][]) => {
    if (!allowType.includes(this.#interaction.type)) throw new Error('dev: Invalid method')
  }
  #res47 = (type: 4 | 7, data: CustomCallbackData<APIInteractionResponseCallbackData>, file: FileData | undefined) => {
    let body: APIInteractionResponse | FormData = { data: { ...this.#flags, ...prepareData(data) }, type }
    if (file) body = formData(body, file)
    return new ResponseObject(body)
  }
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: APIInteraction,
    key: string,
  ) {
    super(env, executionCtx, discord, key)
    this.#req = req
    this.#interaction = interaction
    switch (interaction.type) {
      case 2:
      case 4: {
        let options: APIApplicationCommandInteractionDataOption[] | undefined = undefined
        if ('options' in interaction.data) {
          options = interaction.data.options
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
        }
        if (options)
          for (const e of options) {
            const { type } = e
            if ((type === 3 || type === 4 || type === 10) && e.focused) this.#focused = e
            // @ts-expect-error
            this.set(e.name, e.value)
          }
        break
      }
      case 3:
      case 5: {
        // @ts-expect-error
        this.set('custom_id', interaction.data?.custom_id)
        if (interaction.type === 3) break
        // case 5:
        const modalRows = interaction.data?.components
        if (modalRows)
          // @ts-expect-error
          for (const row of modalRows) for (const modal of row.components) this.set(modal.custom_id, modal.value)
      }
    }
  }

  /**
   * raw Request
   */
  get req() {
    return this.#req
  }
  /**
   * [Interaction Object](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)
   */
  get interaction() {
    return this.#interaction
  }

  /**
   * Only visible to the user who invoked the Interaction
   * @param {boolean} [bool=true]
   * @example
   * ```ts
   * return c.ephemeral().res('Personalized Text')
   * ```
   */
  ephemeral = (bool = true) => {
    this.#throwIfNotAllowType([2, 3, 5])
    this.#flags = bool ? { flags: 1 << 6 } : {}
    return this
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @param {1 | 4 | 5 | 6 | 7 | 9 | 10 | 12} type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) default: 4 (respond to an interaction with a message)
   * @returns {Response}
   */
  res = (data: CallbackData<4>, file?: CallbackFile<4>) => {
    this.#throwIfNotAllowType([2, 3, 5])
    return this.#res47(4, data, file)
  }
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
    this.#throwIfNotAllowType([2, 3, 5])
    if (handler) this.waitUntil(handler(this))
    return new ResponseObject({ type: 5, data: this.#flags })
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
    this.#throwIfNotAllowType([2, 3, 5])
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
    this.#throwIfNotAllowType([2, 3, 5])
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    if (!this.interaction.message?.id) throw errorSys('Message Id')
    return this.rest.delete(_webhooks_$_$_messages_$, [
      this.discord.APPLICATION_ID,
      this.interaction.token,
      this.interaction.message.id,
    ])
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
    this.#throwIfNotAllowType([2, 4])
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
  resModal = (data: CallbackData<9>) => {
    this.#throwIfNotAllowType([2, 3])
    return new ResponseObject({ type: 9, data: toJSON(data) })
  }

  /**
   * for components, edit the message the component was attached to
   * @param data
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @returns {Response}
   */
  resUpdate = (data: CallbackData<7>, file?: CallbackFile<7>) => {
    this.#throwIfNotAllowType([3])
    return this.#res47(7, data, file)
  }
  /**
   * for components, ACK an interaction and edit the original message later; the user does not see a loading state
   * @param {((c: this) => Promise<unknown>)} handler
   * @returns {Response}
   */
  resDeferUpdate = (handler?: (c: this) => Promise<unknown>) => {
    this.#throwIfNotAllowType([3])
    if (handler) this.waitUntil(handler(this))
    return new ResponseObject({ type: 6 })
  }

  /**
   * Focused Option
   *
   * [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data)
   */
  get focused() {
    this.#throwIfNotAllowType([4])
    return this.#focused
  }

  /**
   * @param {Autocomplete | APICommandAutocompleteInteractionResponseCallbackData} data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
   * @returns {Response}
   */
  resAutocomplete = (data: Autocomplete | APICommandAutocompleteInteractionResponseCallbackData) => {
    this.#throwIfNotAllowType([4])
    return new ResponseObject({ data: toJSON(data), type: 8 })
  }
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
