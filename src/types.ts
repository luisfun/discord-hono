import type {
  APIApplicationCommand,
  APIApplicationCommandInteractionData,
  APIBaseInteraction,
  APIInteractionResponseCallbackData,
  APIMessageComponentInteractionData,
  APIModalSubmission,
  ApplicationCommandType,
  InteractionType,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10'
import type { Components } from './builder/components'

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

////////// Command //////////

/**
 * [Application Command](https://discord.com/developers/docs/interactions/application-commands)
 */
export type ApplicationCommand = Omit<
  APIApplicationCommand,
  'id' | 'type' | 'application_id' | 'default_member_permissions' | 'version'
> & {
  id?: string
  type?: ApplicationCommandType
  application_id?: string
  default_member_permissions?: string | null
  version?: string
}

////////// EnvHandler //////////

export type DiscordEnvHandler<E extends Env = Env> = (env: E['Bindings']) => DiscordEnv

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

export type InteractionCommandData = APIBaseInteraction<
  InteractionType.ApplicationCommand,
  APIApplicationCommandInteractionData
>
export type InteractionComponentData = APIBaseInteraction<
  InteractionType.MessageComponent,
  APIMessageComponentInteractionData
>
export type InteractionModalData = APIBaseInteraction<InteractionType.ModalSubmit, APIModalSubmission>

export type CustomCallbackBase =
  | APIInteractionResponseCallbackData
  | RESTPostAPIChannelMessageJSONBody
  | RESTPatchAPIChannelMessageJSONBody
export type CustomCallbackData<T extends CustomCallbackBase = APIInteractionResponseCallbackData> =
  | (Omit<T, 'components'> & { components?: Components | T['components'] })
  | string

////////// FileData //////////

type FileDataUnit = {
  blob: Blob
  name: string
}
export type FileData = FileDataUnit | FileDataUnit[]
