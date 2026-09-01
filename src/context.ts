import type {
  APIApplicationCommandAutocompleteResponse,
  APIApplicationCommandInteractionDataBasicOption,
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
  APIMessage,
  APIModalInteractionResponse,
  APIModalInteractionResponseCallbackData,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
} from 'discord-api-types/v10'
import { $webhooks$_$_$messages$original, createRest } from './rest'
import type {
  AutocompleteContext,
  CommandContext,
  ComponentContext,
  ContextRef,
  CronContext,
  CronEvent,
  CustomCallbackData,
  DiscordEnv,
  Env,
  ExecutionContext,
  FetchEventLike,
  FileData,
  JsonSerializable,
  ModalContext,
  TypedResponse,
} from './types'
import { formData, isArray, isProto, type MessageFlag, messageFlags, newError, prepareData, toJSON } from './utils'

type ExecutionCtx = FetchEventLike | ExecutionContext | undefined

type ContextVariableMap = {}
type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false

type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption

interface SubKey {
  group: string
  command: string
  string: string
}

export class Context<
  E extends Env,
  This extends CommandContext | ComponentContext | AutocompleteContext | ModalContext | CronContext,
> {
  #env: E['Bindings']
  #executionCtx: ExecutionCtx
  #discord: DiscordEnv
  #var = new Map()
  #ref: ContextRef
  #rest: ReturnType<typeof createRest> | undefined = undefined
  // interaction
  #interaction: APIInteraction | CronEvent
  #flags: { flags?: number } = {} // 235
  #sub: SubKey = { group: '', command: '', string: '' } // 24
  #update = false // 3
  #focused: AutocompleteOption | undefined // 4
  #throwIfNotAllowType(allowType: (APIInteraction | CronEvent)['type'][]): void {
    if (!allowType.includes(this.#interaction.type)) throw newError('c.***', 'Invalid method')
  }
  constructor(
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    key: string,
    interaction: APIInteraction | CronEvent,
  ) {
    this.#env = env
    this.#executionCtx = executionCtx
    this.#discord = discord
    this.#interaction = interaction
    this.#ref = { key }
    if ('data' in interaction && interaction.data) {
      const { data } = interaction
      for (const k of ['custom_value', 'target_id', 'values'] as const)
        if (k in data) (this.#ref as any)[k] = (data as any)[k]
      // security-ignore: `data.resolved` is raw data from the Discord API, and the risk of prototype pollution is low.
      if ('resolved' in data) this.#ref = { ...this.#ref, ...data.resolved }
    }
    switch (interaction.type) {
      case 2:
      case 4: {
        let options: APIApplicationCommandInteractionDataOption[] | undefined
        if ('options' in interaction.data) {
          options = interaction.data.options
          if (options?.[0]?.type === 2) {
            this.#sub.group = options[0].name
            this.#sub.string = `${options[0].name} `
            options = options[0].options
          }
          if (options?.[0]?.type === 1) {
            this.#sub.command = options[0].name
            this.#sub.string += options[0].name
            options = options[0].options
          }
        }
        if (options)
          for (const e of options as APIApplicationCommandInteractionDataBasicOption[]) {
            const { type } = e
            // string | integer | number
            if ((type === 3 || type === 4 || type === 10) && e.focused) this.#focused = e
            this.set<any>(e.name, e.value)
          }
        break
      }
      case 5: {
        const modalRows = interaction.data?.components
        if (modalRows)
          for (const row of modalRows) {
            if ('components' in row) for (const modal of row.components) this.set<any>(modal.custom_id, modal.value)
            if ('component' in row) {
              const component = row.component
              this.set<any>(component.custom_id, 'value' in component ? component.value : component.values)
            }
          }
      }
    }
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
   * @param key
   * @param value
   */
  set<Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void
  set<Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void
  set(key: string, value: unknown): void {
    if (isProto(key)) throw newError('c.set', 'Key: prototype-pollution')
    this.#var.set(key, value)
  }
  /**
   * @param key
   * @returns
   */
  get<Key extends keyof E['Variables']>(key: Key): E['Variables'][Key]
  get<Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key]
  get(key: string): unknown {
    return this.#var.get(key)
  }
  /**
   * Variables object
   */
  get var(): Readonly<
    ContextVariableMap & (IsAny<E['Variables']> extends true ? Record<string, any> : E['Variables'])
  > {
    return Object.fromEntries(this.#var)
  }

  /**
   * Quick reference
   * @beta This may include breaking changes
   */
  get ref(): Readonly<ContextRef> {
    return this.#ref
  }

  /**
   * `c.rest` = `createRest(c.env.DISCORD_TOKEN)`
   */
  get rest(): ReturnType<typeof createRest> {
    this.#rest ??= createRest(this.#discord.TOKEN)
    return this.#rest
  }

  /**
   * [Interaction Object](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)
   */
  get interaction(): APIInteraction | CronEvent {
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
  flags(...flag: MessageFlag[]): This {
    this.#throwIfNotAllowType([2, 3, 5])
    this.#flags.flags = messageFlags(...flag)
    return this as unknown as This
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
   * @returns
   */
  res(data: CustomCallbackData<APIInteractionResponseCallbackData>, file?: FileData): Response {
    this.#throwIfNotAllowType([2, 3, 5])
    const body: APIInteractionResponse = {
      data: { ...this.#flags, ...prepareData(data) },
      type: this.#update ? 7 : 4,
    }
    return file ? new Response(formData(body, file)) : Response.json(body)
  }
  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   * @param handler
   * @returns
   * @example
   * ```ts
   * return c.resDefer(c => c.followup('Delayed Message'))
   * ```
   */
  resDefer(handler?: (c: This) => Promise<unknown>): Response {
    this.#throwIfNotAllowType([2, 3, 5])
    if (handler) this.executionCtx.waitUntil(handler(this as unknown as This))
    return Response.json(
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
   * @returns
   */
  resActivity(): Response {
    this.#throwIfNotAllowType([2, 3, 5])
    return Response.json({ type: 12 } satisfies APIInteractionResponseLaunchActivity)
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
  followup(
    data?: CustomCallbackData<RESTPatchAPIInteractionOriginalResponseJSONBody>,
    file?: FileData,
  ): Promise<TypedResponse<APIMessage | never>> {
    this.#throwIfNotAllowType([2, 3, 5])
    if (!this.#discord.APPLICATION_ID) throw newError('c.followup', 'DISCORD_APPLICATION_ID')
    const pathVars: [string, string] = [this.#discord.APPLICATION_ID, (this.#interaction as APIInteraction).token]
    if (data || file)
      return this.rest(
        'PATCH',
        $webhooks$_$_$messages$original,
        pathVars,
        { ...this.#flags, ...prepareData(data || {}) },
        file,
      )
    return this.rest('DELETE', $webhooks$_$_$messages$original, pathVars)
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
  get sub(): SubKey {
    this.#throwIfNotAllowType([2, 4])
    return this.#sub
  }

  /**
   * Response for modal window display
   * @param data
   * @returns
   * @example
   * ```ts
   * return c.resModal(makeModal('unique-id', 'Title', [
   *   makeActionRow([makeTextInput('custom_id', 'Label')])
   * ]))
   * ```
   */
  resModal(data: JsonSerializable<APIModalInteractionResponseCallbackData>): Response {
    this.#throwIfNotAllowType([2, 3])
    return Response.json({ type: 9, data: toJSON(data) } satisfies APIModalInteractionResponse)
  }

  /**
   * for components, change `c.res()` and `c.resDefer()` to a [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) that edits the original message
   * @param bool
   * @returns
   * @example
   * ```ts
   * return c.update().res('Edit the original message')
   * ```
   */
  update(bool: boolean = true): This {
    this.#throwIfNotAllowType([3, 5])
    this.#update = bool
    return this as unknown as This
  }

  /**
   * Focused Option
   *
   * [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data)
   */
  get focused(): AutocompleteOption | undefined {
    this.#throwIfNotAllowType([4])
    return this.#focused
  }

  /**
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
   * @returns
   */
  resAutocomplete(
    data:
      | JsonSerializable<APICommandAutocompleteInteractionResponseCallbackData>
      | Required<APICommandAutocompleteInteractionResponseCallbackData>['choices'],
  ): Response {
    this.#throwIfNotAllowType([4])
    const responseData: APICommandAutocompleteInteractionResponseCallbackData = isArray(data)
      ? { choices: data }
      : toJSON(data)
    return Response.json({ type: 8, data: responseData } satisfies APIApplicationCommandAutocompleteResponse)
  }
}
