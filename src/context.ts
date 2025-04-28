import type {
  APIApplicationCommandAutocompleteResponse,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataStringOption,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseDeferredMessageUpdate,
  APIInteractionResponseLaunchActivity,
  APIModalInteractionResponse,
  APIModalInteractionResponseCallbackData,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
} from 'discord-api-types/v10'
import type { Autocomplete, Modal } from './builders'
import { _webhooks_$_$_messages_original, createRest } from './rest'
import type {
  AutocompleteContext,
  CommandContext,
  ComponentContext,
  CronEvent,
  CustomCallbackData,
  DiscordEnv,
  Env,
  ExecutionContext,
  FetchEventLike,
  FileData,
  ModalContext,
} from './types'
import { ResponseObject, formData, newError, prepareData, toJSON } from './utils'

type ExecutionCtx = FetchEventLike | ExecutionContext | undefined

type CoreConstructor<E extends Env> = [E['Bindings'], ExecutionCtx, DiscordEnv, string]

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
  #discordToken: string | undefined
  #key: string
  #var = new Map()
  #rest: ReturnType<typeof createRest> | undefined = undefined
  constructor([env, executionCtx, discord, key]: CoreConstructor<E>) {
    this.#env = env
    this.#executionCtx = executionCtx
    this.#discordToken = discord.TOKEN
    this.#key = key
  }

  /**
   * Environment Variables
   */
  get env(): E['Bindings'] {
    return this.#env
  }
  get event(): FetchEventLike {
    if (!(this.#executionCtx && 'respondWith' in this.#executionCtx)) throw newError('c.event', 'not found')
    return this.#executionCtx
  }
  get executionCtx(): ExecutionContext {
    if (!this.#executionCtx) throw newError('c.executionCtx', 'not found')
    return this.#executionCtx
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
   * `c.rest` = `createRest(c.env.DISCORD_TOKEN)`
   */
  get rest(): ReturnType<typeof createRest> {
    this.#rest ??= createRest(this.#discordToken)
    return this.#rest
  }
}

type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption

export class InteractionContext<
  E extends Env,
  This extends CommandContext | ComponentContext | AutocompleteContext | ModalContext,
> extends ContextAll<E> {
  #discordApplicationId: string | undefined
  #interaction: APIInteraction
  #flags: { flags?: number } = {} // 235
  #sub = { group: '', command: '', string: '' } // 24
  #update = false // 3
  #focused: AutocompleteOption | undefined // 4
  #throwIfNotAllowType = (allowType: APIInteraction['type'][]) => {
    if (!allowType.includes(this.#interaction.type)) throw newError('c.***', 'Invalid method')
  }
  #throwIfNonApplicationId = () => {
    if (!this.#discordApplicationId) throw newError('c.followup***', 'DISCORD_APPLICATION_ID')
  }
  constructor(core: CoreConstructor<E>, interaction: APIInteraction) {
    super(core)
    this.#discordApplicationId = core[2].APPLICATION_ID
    this.#interaction = interaction
    switch (interaction.type) {
      case 2:
      case 4: {
        let options: APIApplicationCommandInteractionDataOption[] | undefined
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
   * [Interaction Object](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)
   */
  get interaction() {
    return this.#interaction
  }

  /**
   * [Message Flags](https://discord.com/developers/docs/resources/message#message-object-message-flags)
   * @param {"SUPPRESS_EMBEDS" | "EPHEMERAL" | "SUPPRESS_NOTIFICATIONS" | "IS_COMPONENTS_V2"} flag
   * @returns {this}
   * @example
   * ```ts
   * return c.flags('SUPPRESS_EMBEDS', 'EPHEMERAL').res('[Docs](https://example.com)')
   * ```
   */
  flags = (...flag: ('SUPPRESS_EMBEDS' | 'EPHEMERAL' | 'SUPPRESS_NOTIFICATIONS' | 'IS_COMPONENTS_V2')[]) => {
    this.#throwIfNotAllowType([2, 3, 5])
    const flagNum = {
      SUPPRESS_EMBEDS: 1 << 2,
      EPHEMERAL: 1 << 6,
      SUPPRESS_NOTIFICATIONS: 1 << 12,
      IS_COMPONENTS_V2: 1 << 15,
    } as const
    this.#flags.flags = 0
    for (const f of flag) this.#flags.flags |= flagNum[f]
    return this
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @returns {Response}
   */
  res = (data: CustomCallbackData<APIInteractionResponseCallbackData>, file?: FileData) => {
    this.#throwIfNotAllowType([2, 3, 5])
    const body: APIInteractionResponse = {
      data: { ...this.#flags, ...prepareData(data) },
      type: this.#update ? 7 : 4,
    }
    return new ResponseObject(file ? formData(body, file) : body)
  }
  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   * @param {(c: This) => Promise<unknown>} handler
   * @returns {Response}
   * @example
   * ```ts
   * return c.resDefer(c => c.followup('Delayed Message'))
   * ```
   */
  resDefer = (handler?: (c: This) => Promise<unknown>) => {
    this.#throwIfNotAllowType([2, 3, 5])
    if (handler) this.executionCtx.waitUntil(handler(this as unknown as This))
    return new ResponseObject(
      this.#update
        ? ({ type: 6 } satisfies APIInteractionResponseDeferredMessageUpdate)
        : ({
            type: 5,
            data: this.#flags,
          } satisfies APIInteractionResponseDeferredChannelMessageWithSource),
    )
  }

  /**
   * Launch the Activity associated with the app. Only available for apps with Activities enabled
   * @returns {Response}
   */
  resActivity = () => {
    this.#throwIfNotAllowType([2, 3, 5])
    return new ResponseObject({ type: 12 } satisfies APIInteractionResponseLaunchActivity)
  }

  /**
   * Used to send messages after resDefer or resDeferUpdate
   * @param data [Data Structure](https://discord.com/developers/docs/resources/webhook#edit-webhook-message)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @example
   * ```ts
   * return c.resDefer(c => c.followup('Image file', { blob: Blob, name: 'image.png' }))
   * ```
   */
  followup = (data: CustomCallbackData<RESTPatchAPIInteractionOriginalResponseJSONBody> = {}, file?: FileData) => {
    this.#throwIfNotAllowType([2, 3, 5])
    this.#throwIfNonApplicationId()
    return this.rest(
      'PATCH',
      _webhooks_$_$_messages_original,
      [this.#discordApplicationId!, this.interaction.token],
      data,
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
    this.#throwIfNonApplicationId()
    return this.rest('DELETE', _webhooks_$_$_messages_original, [this.#discordApplicationId!, this.interaction.token])
  }

  /**
   * Used for sending messages after resDefer. Functions as a message deletion when called without arguments.
   * @param data string or [Data Structure](https://discord.com/developers/docs/resources/webhook#edit-webhook-message)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @example
   * ```ts
   * // followup message
   * return c.resDefer(c => c.followup('Image file', { blob: Blob, name: 'image.png' }))
   * // delete message
   * return c.update().resDefer(c => c.followup())
   * ```
   */
  /*
  followup = (data?: CustomCallbackData<RESTPatchAPIInteractionOriginalResponseJSONBody>, file?: FileData) => {
    this.#throwIfNotAllowType([2, 3, 5])
    if (!this.#discordApplicationId) throw newError('c.followup', 'DISCORD_APPLICATION_ID')
    const pathVars = [this.#discordApplicationId, this.interaction.token] as [string, string]
    if (data || file) return this.rest('PATCH', _webhooks_$_$_messages_original, pathVars, data || {}, file)
    return this.rest('DELETE', _webhooks_$_$_messages_original, pathVars)
  }
  */

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
  resModal = (data: Modal | APIModalInteractionResponseCallbackData) => {
    this.#throwIfNotAllowType([2, 3])
    return new ResponseObject({ type: 9, data: toJSON(data) } satisfies APIModalInteractionResponse)
  }

  /**
   * for components, change `c.res()` and `c.resDefer()` to a [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) that edits the original message
   * @param {boolean} [bool=true]
   * @returns {this}
   * @example
   * ```ts
   * return c.update().res('Edit the original message')
   * ```
   */
  update = (bool = true) => {
    this.#throwIfNotAllowType([3])
    this.#update = bool
    return this
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
    return new ResponseObject({ type: 8, data: toJSON(data) } satisfies APIApplicationCommandAutocompleteResponse)
  }
}

export class CronContext<E extends Env = any> extends ContextAll<E> {
  #cronEvent: CronEvent
  constructor(core: CoreConstructor<E>, event: CronEvent) {
    super(core)
    this.#cronEvent = event
  }

  /**
   * Cron Event
   */
  get cronEvent(): CronEvent {
    return this.#cronEvent
  }
}
