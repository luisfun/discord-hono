import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIBaseAutoPopulatedSelectMenuComponent,
  APIButtonComponentWithCustomId,
  APIChannelSelectComponent,
  APIInteractionDataResolved,
  APIMessageApplicationCommandInteractionDataResolved,
  APIMessageChannelSelectInteractionData,
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIMessageMentionableSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  APIModalSubmitInteraction,
  APIStringSelectComponent,
  ComponentType,
  RESTPostAPIApplicationCommandsJSONBody,
  SelectMenuDefaultValueType,
} from 'discord-api-types/v10'
import type { Context } from './context'

////////// Utils //////////

export type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type ExcludeMethods<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }

export type NoSemicolon<S extends string> = S extends `${string};${string}` ? never : S

export type JsonSerializable<V> = V extends (infer U)[] ? JsonSerializable<U>[] : { toJSON(): V } | V

export type ResolvedToJSON<V> = V extends (infer U)[] ? ResolvedToJSON<U>[] : V extends { toJSON(): infer R } ? R : V

////////// Env //////////

export interface Env {
  Bindings?: object
  Variables?: Record<string, unknown>
}

////////// DiscordEnv //////////

export interface DiscordEnv {
  TOKEN?: string | undefined
  PUBLIC_KEY?: string | undefined
  APPLICATION_ID?: string | undefined
}

////////// Context //////////

type ResolvedCategory = keyof APIInteractionDataResolved | keyof APIMessageApplicationCommandInteractionDataResolved
type ResolvedReturnType<T extends ResolvedCategory> = T extends keyof APIInteractionDataResolved
  ? NonNullable<APIInteractionDataResolved[T]>[string]
  : T extends keyof APIMessageApplicationCommandInteractionDataResolved
    ? APIMessageApplicationCommandInteractionDataResolved[T][string]
    : never
type ResolvedData<T> = T extends { data: { resolved: infer R } } ? R : never
type RetypedResolved<T extends RESTPostAPIApplicationCommandsJSONBody = any> =
  T extends RESTPostAPIApplicationCommandsJSONBody
    ? ResolvedData<CommandIntaraction<T>>
    : { [K in ResolvedCategory]?: Record<string, ResolvedReturnType<K> | undefined> }

export type TargetIdData<T> = T extends { data: { target_id: infer R } }
  ? { target_id: R }
  : T extends { data: { target_id?: infer R } }
    ? { target_id?: R }
    : {}

type CommandRef<T extends RESTPostAPIApplicationCommandsJSONBody> = RetypedResolved<T> &
  TargetIdData<CommandIntaraction<T>> & {
    key: string
  }
type ComponentRef = RetypedResolved & {
  key: string
  custom_value?: string
  values?: string[]
}
type ModalRef = RetypedResolved & {
  key: string
  custom_value?: string
}
interface CronRef {
  key: string
}
export type ContextRef = CommandRef<any> & ComponentRef & ModalRef & CronRef

// biome-ignore format: ternary operator
type CommandIntaraction<T extends RESTPostAPIApplicationCommandsJSONBody> =
  T extends { type: 1 } ? Extract<APIApplicationCommandInteraction, { data: { type: 1 } }> :
  T extends { type: 2 } ? Extract<APIApplicationCommandInteraction, { data: { type: 2 } }> :
  T extends { type: 3 } ? Extract<APIApplicationCommandInteraction, { data: { type: 3 } }> :
  T extends { type: 4 } ? Extract<APIApplicationCommandInteraction, { data: { type: 4 } }> :
  APIApplicationCommandInteraction

export type InteractionComponent =
  | APIButtonComponentWithCustomId
  | APIStringSelectComponent
  | APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>
  | APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>
  | APIBaseAutoPopulatedSelectMenuComponent<
      ComponentType.MentionableSelect,
      SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role
    >
  | APIChannelSelectComponent

// biome-ignore format: ternary operator
type ComponentInteraction<T extends InteractionComponent> =
  T extends APIButtonComponentWithCustomId ? APIMessageComponentButtonInteraction :
  T extends APIStringSelectComponent ? Omit<APIMessageComponentSelectMenuInteraction, 'data'> & { data: APIMessageStringSelectInteractionData } :
  T extends APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User> ? Omit<APIMessageComponentSelectMenuInteraction, 'data'> & { data: APIMessageUserSelectInteractionData } :
  T extends APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role> ? Omit<APIMessageComponentSelectMenuInteraction, 'data'> & { data: APIMessageRoleSelectInteractionData } :
  T extends APIBaseAutoPopulatedSelectMenuComponent<ComponentType.MentionableSelect, SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role> ? Omit<APIMessageComponentSelectMenuInteraction, 'data'> & { data: APIMessageMentionableSelectInteractionData } :
  T extends APIChannelSelectComponent ? Omit<APIMessageComponentSelectMenuInteraction, 'data'> & { data: APIMessageChannelSelectInteractionData } :
  APIMessageComponentInteraction

export type CommandContext<
  E extends Env = any,
  T extends RESTPostAPIApplicationCommandsJSONBody = any,
> = ExcludeMethods<
  Context<E, CommandContext<E, T>>,
  'update' | 'focused' | 'resAutocomplete' | 'interaction' | 'ref'
> & { interaction: Readonly<CommandIntaraction<T>>; ref: Readonly<CommandRef<T>> }

export type ComponentContext<E extends Env = any, T extends InteractionComponent = any> = ExcludeMethods<
  Context<E, ComponentContext<E, T>>,
  'sub' | 'focused' | 'resAutocomplete' | 'interaction' | 'ref'
> & { interaction: Readonly<ComponentInteraction<T>>; ref: Readonly<ComponentRef> }

export type AutocompleteContext<
  E extends Env = any,
  T extends RESTPostAPIApplicationCommandsJSONBody = any,
> = ExcludeMethods<
  Context<E, AutocompleteContext<E, T>>,
  'flags' | 'res' | 'resDefer' | 'resActivity' | 'followup' | 'resModal' | 'update' | 'interaction' | 'ref'
> & { interaction: Readonly<APIApplicationCommandAutocompleteInteraction>; ref: Readonly<CommandRef<T>> }

export type ModalContext<E extends Env = any> = ExcludeMethods<
  Context<E, ModalContext<E>>,
  'sub' | 'resModal' | 'focused' | 'resAutocomplete' | 'interaction' | 'ref'
> & { interaction: Readonly<APIModalSubmitInteraction>; ref: Readonly<ModalRef> }

export type CronContext<E extends Env = any> = ExcludeMethods<
  Context<E, CronContext<E>>,
  | 'flags'
  | 'res'
  | 'resDefer'
  | 'resActivity'
  | 'followup'
  | 'sub'
  | 'resModal'
  | 'update'
  | 'focused'
  | 'resAutocomplete'
  | 'interaction'
  | 'ref'
> & { interaction: Readonly<CronEvent>; ref: Readonly<CronRef> }

////////// Handler //////////

export type CommandHandler<E extends Env, T extends RESTPostAPIApplicationCommandsJSONBody> = (
  c: CommandContext<E, T>,
) => Promise<Response> | Response
export type ComponentHandler<E extends Env, T extends InteractionComponent> = (
  c: ComponentContext<E, T>,
) => Promise<Response> | Response
export type AutocompleteHandler<E extends Env> = (c: AutocompleteContext<E>) => Promise<Response> | Response
export type ModalHandler<E extends Env> = (c: ModalContext<E>) => Promise<Response> | Response
export type CronHandler<E extends Env> = (c: CronContext<E>) => Promise<unknown>

////////// InitOptions //////////

export type Verify = (
  body: string,
  signature: string | null,
  timestamp: string | null,
  publicKey: string,
) => Promise<boolean> | boolean
export interface InitOptions<E extends Env> {
  verify?: Verify
  discordEnv?: DiscordEnv | ((env: E['Bindings'] | undefined) => DiscordEnv)
}

////////// CronEvent //////////
// https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/#syntax

export interface CronEvent {
  cron: string
  type: string
  scheduledTime: number
}

////////// ExecutionContext //////////

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

////////// FetchEventLike //////////

export abstract class FetchEventLike {
  abstract readonly request: Request
  abstract respondWith(promise: Response | Promise<Response>): void
  abstract passThroughOnException(): void
  abstract waitUntil(promise: Promise<void>): void
}

////////// InteractionData //////////

export type CustomCallbackData<T extends Record<string, unknown>> =
  | (Omit<T, 'components' | 'embeds' | 'poll'> & {
      components?: JsonSerializable<T['components']>
      embeds?: JsonSerializable<T['embeds']>
      poll?: JsonSerializable<T['poll']>
    })
  | string

////////// FileData //////////

interface FileUnit {
  blob: Blob
  name: string
}
export type FileData = FileUnit | FileUnit[]

///////// TypedResponse //////////

export interface TypedResponse<T> extends Omit<Response, 'json'> {
  json(): Promise<T>
}
