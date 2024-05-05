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
interface GetVar<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key]
  <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key]
}
interface SetVar<E extends Env> {
  <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void
  <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void
}

class ContextBase<E extends Env> {
  #env: E['Bindings'] = {}
  #executionCtx: ExecutionCtx
  protected discord: DiscordEnv
  #var: E['Variables'] = {}
  constructor(env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv) {
    this.#env = env
    this.#executionCtx = executionCtx
    this.discord = discord
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
  // c.set, c.get, c.var.propName is Variables
  set: SetVar<E> = (key: string, value: unknown) => {
    this.#var ??= {}
    this.#var[key as string] = value
  }
  get: GetVar<E> = (key: string) => {
    return this.#var ? this.#var[key] : undefined
  }
  get var(): Readonly<E['Variables'] & ContextVariableMap> {
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
  #ephemeral: boolean | undefined = undefined
  constructor(req: Request, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv, interaction: D) {
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
   * @param bool default true
   */
  ephemeral = (bool = true) => {
    this.#ephemeral = bool
    return this
  }

  /**
   * @deprecated
   * use c.res()
   */
  resBase = (json: APIInteractionResponse) => this.res('data' in json ? json.data : {}, json.type)
  /**
   * Response to request.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param type [Callback Type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type)
   * @returns Response
   */
  res = <T extends InteractionCallbackType = 4>(data: InteractionCallbackData<T>, type: T = 4 as T) => {
    let json: APIInteractionResponse
    const flags = this.#ephemeral ? 1 << 6 : 0
    switch (type) {
      case 4:
      case 7: {
        json = { data: { flags, ...prepareData(data as InteractionCallbackData<4 | 7>) }, type }
        break
      }
      case 5: {
        json = { data: { flags, ...(data as InteractionCallbackData<5>) }, type }
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
   * @deprecated
   * use c.ephemeral().res()
   */
  resEphemeral = (data: CustomCallbackData) => this.ephemeral().res(data)
  resDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) this.waitUntil(handler(this, ...args))
    return this.res({}, 5)
  }
  /**
   * Used to send messages after resDefer.
   * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
   * @param file FileData: { blob: Blob, name: string }
   * @param retry Number of retries at rate limit. default: 0
   */
  followup = (data?: CustomCallbackData, file?: FileData, retry = 0) => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    // biome-ignore format: ternary operator
    data = data
      ? { flags: this.#ephemeral ? 1 << 6 : 0, ...prepareData(data) }
      : this.#ephemeral ? { flags: 1 << 6 } : undefined
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.discord.APPLICATION_ID}/${this.#interaction.token}`,
      { method: 'POST', body: formData(data, file) },
      retry,
    )
  }
  followupDelete = () => {
    if (!this.discord.APPLICATION_ID) throw errorDev('DISCORD_APPLICATION_ID')
    if (!this.#interaction.message?.id) throw errorSys('Message Id')
    return fetch429Retry(
      `${apiUrl}/webhooks/${this.discord.APPLICATION_ID}/${this.#interaction.token}/messages/${this.#interaction.message?.id}`,
      { method: 'DELETE' },
    )
  }
}

type CommandValues = Record<string, string | number | boolean | undefined>
type SubCommands = {
  group: string
  command: string
  string: string
}
export class CommandContext<E extends Env = any> extends RequestContext<E, InteractionData<2>> {
  #sub: SubCommands = { group: '', command: '', string: '' }
  #values: CommandValues = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
    interaction: InteractionData<2>,
  ) {
    super(req, env, executionCtx, discord, interaction)
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
        this.#values = options?.reduce((obj: CommandValues, e) => {
          if (e.type === 1 || e.type === 2) return obj // for ts-error
          obj[e.name] = e.value
          return obj
        }, {})
      }
    }
  }

  get sub(): SubCommands {
    return this.#sub
  }
  get values(): CommandValues {
    return this.#values
  }

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
  ) {
    super(req, env, executionCtx, discord, interaction as ComponentInteractionData<T>)
  }

  resUpdate = (data: CustomCallbackData) => this.res(data, 7)
  resDeferUpdate = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) => {
    if (handler) this.waitUntil(handler(this, ...args))
    return this.res(undefined, 6)
  }
  /**
   * @deprecated
   * rename -> c.resDeferUpdate()
   */
  resUpdateDefer = <T>(handler?: (c: this, ...args: T[]) => Promise<unknown>, ...args: T[]) =>
    this.resDeferUpdate(handler, ...args)
  /**
   * Delete the previous message and post a new one.
   * If the argument is empty, only message deletion is performed.
   * Internally, it hits the API endpoint of followup.
   */
  resRepost = (data?: CustomCallbackData) => {
    if (!data) return this.resUpdateDefer(this.followupDelete)
    this.waitUntil(this.followupDelete())
    return this.res(data)
  }
  /**
   * @deprecated
   * use c.ephemeral().resRepost()
   */
  resRepostEphemeral = (data: CustomCallbackData) => this.ephemeral().resRepost(data)
  resModal = (data: Modal | APIModalInteractionResponseCallbackData) => this.res(data, 9)
}

export class ModalContext<E extends Env = any> extends RequestContext<E, InteractionData<5>> {
  #values: Record<string, string | undefined> = {}
  constructor(
    req: Request,
    env: E['Bindings'],
    executionCtx: ExecutionCtx,
    discord: DiscordEnv,
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
  constructor(event: CronEvent, env: E['Bindings'], executionCtx: ExecutionCtx, discord: DiscordEnv) {
    super(env, executionCtx, discord)
    this.#cronEvent = event
  }

  get cronEvent(): CronEvent {
    return this.#cronEvent
  }
}
