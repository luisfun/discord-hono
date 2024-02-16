/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  APIBaseInteraction,
  InteractionType,
  APIApplicationCommandInteractionData,
  APIMessageComponentInteractionData,
  APIModalSubmission,
  APIApplicationCommand,
  ApplicationCommandType,
  APIInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type { CommandContext, ComponentContext, ModalContext, CronContext } from './context'
import type { Components } from './builder/components'

////////// Env //////////

export type Env = {
  Bindings?: Record<string, unknown>
  Variables?: Record<string, unknown>
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

////////// Handlers //////////

export type TypeCommandHandler<E extends Env = any> = (c: CommandContext<E>) => Promise<Response> | Response
export type TypeComponentHandler<E extends Env = any> = (c: ComponentContext<E>) => Promise<Response> | Response
export type TypeModalHandler<E extends Env = any> = (c: ModalContext<E>) => Promise<Response> | Response
export type TypeCronHandler<E extends Env = any> = (c: CronContext<E>) => Promise<unknown>
export type Handlers<H extends TypeCommandHandler | TypeComponentHandler | TypeModalHandler | TypeCronHandler> = [
  string,
  H,
][]

////////// PublicKeyHandler //////////

export type PublicKeyHandler<E extends Env> = (env: E['Bindings']) => string

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

export type CustomResponseCallbackData = Omit<APIInteractionResponseCallbackData, 'components'> & {
  components?: Components | APIInteractionResponseCallbackData['components']
}

////////// FileData //////////

export type FileData = {
  blob: Blob
  name: string
}
