import type { EmbedBuilder } from '@discordjs/builders'
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIInteractionDataResolved,
  APIMessageApplicationCommandInteractionDataResolved,
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10'
import type { Button, Components, Select } from './builders/components'
import type {
  ContentFile,
  ContentMediaGallery,
  ContentTextDisplay,
  LayoutActionRow,
  LayoutContainer,
  LayoutSection,
  LayoutSeparator,
} from './builders/components-v2'
import type { Embed } from './builders/embed'
import type { Poll } from './builders/poll'
import type { Context } from './context'

////////// Utils //////////

export type ExcludeMethods<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }

////////// Env //////////

export type Env = {
  Bindings?: object
  Variables?: Record<string, unknown>
}

////////// DiscordEnv //////////

export type DiscordEnv = {
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
type RetypedResolved = {
  [K in ResolvedCategory]?: Record<string, ResolvedReturnType<K> | undefined>
}

type CommandRef = RetypedResolved & {
  key: string
  target_id?: string
}
type ComponentRef = RetypedResolved & {
  key: string
  custom_value?: string
  values?: string[]
}
type ModalRef = {
  key: string
  custom_value?: string
}
type CronRef = {
  key: string
}
export type ContextRef = CommandRef & ComponentRef & ModalRef & CronRef

export type ComponentType = Button<any> | Select<any, any> //'Button' | 'Select'
// biome-ignore format: ternary operator
type ComponentInteraction<T extends ComponentType> =
  T extends Button<any> ? APIMessageComponentButtonInteraction :
  T extends Select<any, any> ? APIMessageComponentSelectMenuInteraction :
  APIMessageComponentInteraction

export type CommandContext<E extends Env = any> = ExcludeMethods<
  Context<E, CommandContext<E>>,
  'update' | 'focused' | 'resAutocomplete' | 'interaction' | 'ref'
> & { interaction: Readonly<APIApplicationCommandInteraction>; ref: Readonly<CommandRef> }

export type ComponentContext<E extends Env = any, T extends ComponentType = any> = ExcludeMethods<
  Context<E, ComponentContext<E, T>>,
  'sub' | 'focused' | 'resAutocomplete' | 'interaction' | 'ref'
> & { interaction: Readonly<ComponentInteraction<T>>; ref: Readonly<ComponentRef> }

export type AutocompleteContext<E extends Env = any> = ExcludeMethods<
  Context<E, AutocompleteContext<E>>,
  'flags' | 'res' | 'resDefer' | 'resActivity' | 'followup' | 'resModal' | 'update' | 'interaction' | 'ref'
> & { interaction: Readonly<APIApplicationCommandAutocompleteInteraction>; ref: Readonly<CommandRef> }

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

export type CommandHandler<E extends Env> = (c: CommandContext<E>) => Promise<Response> | Response
export type ComponentHandler<E extends Env, T extends ComponentType> = (
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
export type InitOptions<E extends Env> = {
  verify?: Verify
  discordEnv?: (env: E['Bindings']) => DiscordEnv
}

////////// CronEvent //////////
// https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/#syntax

export type CronEvent = {
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
      components?:
        | Components
        | (
            | LayoutActionRow
            | LayoutSection
            | LayoutSeparator
            | LayoutContainer
            | ContentTextDisplay
            | ContentMediaGallery
            | ContentFile
          )[]
        | T['components']
      embeds?: (Embed | EmbedBuilder)[] | T['embeds']
      poll?: Poll | T['poll']
    })
  | string

////////// FileData //////////

type FileUnit = {
  blob: Blob
  name: string
}
export type FileData = FileUnit | FileUnit[]

///////// TypedResponse //////////

export type TypedResponse<T> = Omit<Response, 'json'> & { json(): Promise<T> }
