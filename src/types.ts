import type { EmbedBuilder } from '@discordjs/builders'
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
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

export type ExcludeMethods<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }

export type ComponentType = Button<any> | Select<any, any> //'Button' | 'Select'
// biome-ignore format: ternary operator
type ComponentInteraction<T extends ComponentType> =
  T extends Button<any> ? APIMessageComponentButtonInteraction :
  T extends Select<any, any> ? APIMessageComponentSelectMenuInteraction :
  APIMessageComponentInteraction

export type CommandContext<E extends Env = any> = ExcludeMethods<
  Context<E, CommandContext<E>>,
  'update' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: APIApplicationCommandInteraction }

export type ComponentContext<E extends Env = any, T extends ComponentType = any> = ExcludeMethods<
  Context<E & { Variables: { custom_id?: string } }, ComponentContext<E, T>>,
  'sub' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: ComponentInteraction<T> }

export type AutocompleteContext<E extends Env = any> = ExcludeMethods<
  Context<E, AutocompleteContext<E>>,
  'flags' | 'res' | 'resDefer' | 'resActivity' | 'followup' | 'resModal' | 'update' | 'interaction'
> & { interaction: APIApplicationCommandAutocompleteInteraction }

export type ModalContext<E extends Env = any> = ExcludeMethods<
  Context<E & { Variables: { custom_id?: string } }, ModalContext<E>>,
  'sub' | 'resModal' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: APIModalSubmitInteraction }

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
  | 'resolved'
> & { interaction: CronEvent }

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
