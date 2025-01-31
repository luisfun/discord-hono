import type { EmbedBuilder } from '@discordjs/builders'
import type {
  APIActionRowComponent,
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIEmbed,
  APIMessageActionRowComponent,
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10'
import type { Components } from './builders/components'
import type { Embed } from './builders/embed'
import type { CronContext, InteractionContext } from './context'
import type { RegExpMap, StringMap } from './handler-map'

////////// Env //////////

export type Env = {
  Bindings?: Record<string, unknown>
  Variables?: Record<string, unknown>
}

////////// DiscordEnv //////////

export type DiscordEnv = {
  TOKEN?: string
  PUBLIC_KEY?: string
  APPLICATION_ID?: string
}

////////// Context //////////

type ExcludeMethods<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }
// biome-ignore format: ternary operator
type ComponentInteraction<T extends ComponentType> =
  T extends 'Button' ? APIMessageComponentButtonInteraction :
  T extends 'Select' ? APIMessageComponentSelectMenuInteraction :
  APIMessageComponentInteraction

export type CommandContext<E extends Env = any> = ExcludeMethods<
  InteractionContext<E>,
  'resUpdate' | 'resDeferUpdate' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: APIApplicationCommandInteraction }
export type ComponentContext<E extends Env = any, T extends ComponentType = any> = ExcludeMethods<
  InteractionContext<E & { Variables: { custom_id?: string } }>,
  'sub' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: ComponentInteraction<T> }
export type AutocompleteContext<E extends Env = any> = ExcludeMethods<
  InteractionContext<E>,
  | 'ephemeral'
  | 'res'
  | 'resDefer'
  | 'followup'
  | 'followupDelete'
  | 'resModal'
  | 'resUpdate'
  | 'resDeferUpdate'
  | 'interaction'
> & { interaction: APIApplicationCommandAutocompleteInteraction }
export type ModalContext<E extends Env = any> = ExcludeMethods<
  InteractionContext<E & { Variables: { custom_id?: string } }>,
  'sub' | 'resModal' | 'resUpdate' | 'resDeferUpdate' | 'focused' | 'resAutocomplete' | 'interaction'
> & { interaction: APIModalSubmitInteraction }

////////// Handler //////////

export type ComponentType = 'Button' | 'Select'
export type CommandHandler<E extends Env> = (c: CommandContext<E>) => Promise<Response> | Response
export type ComponentHandler<E extends Env, T extends 'Button' | 'Select'> = (
  c: ComponentContext<E, T>,
) => Promise<Response> | Response
export type AutocompleteHandler<E extends Env> = (c: AutocompleteContext<E>) => Promise<Response> | Response
export type ModalHandler<E extends Env> = (c: ModalContext<E>) => Promise<Response> | Response
export type CronHandler<E extends Env> = (c: CronContext<E>) => Promise<unknown>

export type HandlerNumber = 0 | 2 | 3 | 4 | 5
// biome-ignore format: ternary operator
export type AnyHandler<E extends Env, N extends HandlerNumber> =
  N extends 0 ? CronHandler<E> :
  N extends 2 ? CommandHandler<E> :
  N extends 3 ? ComponentHandler<E, any> :
  N extends 4 ? AutocompleteHandler<E> :
  N extends 5 ? ModalHandler<E> :
  never

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
  HandlerMap?: typeof StringMap | typeof RegExpMap
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

export type CustomCallbackBase = object & {
  components?: APIActionRowComponent<APIMessageActionRowComponent>[] | null
  embeds?: APIEmbed[] | null
}
export type CustomCallbackData<T extends CustomCallbackBase> =
  | (Omit<T, 'components' | 'embeds'> & {
      components?: Components | T['components']
      embeds?: (Embed | EmbedBuilder)[] | T['embeds']
    })
  | string

////////// FileData //////////

type FileUnit = {
  blob: Blob
  name: string
}
export type FileData = FileUnit | FileUnit[]
