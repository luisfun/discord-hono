/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  APIBaseInteraction,
  InteractionType,
  APIApplicationCommandInteractionData,
  APIMessageComponentInteractionData,
  APIModalSubmission,
  APIApplicationCommand,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import type { CommandContext, ComponentContext, ModalContext, CronContext } from './context'

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
export type TypeCommandHandler<E extends Env> = (c: CommandContext<E>) => Promise<Response> | Response
/**
 * [Application Command](https://discord.com/developers/docs/interactions/application-commands)
 */
export type Commands<E extends Env = any> = [ApplicationCommand, TypeCommandHandler<E>][]

////////// ComponentHandlers //////////

type TypeComponentHandler<E extends Env> = (c: ComponentContext<E>) => Promise<Response> | Response
export type Handlers<E extends Env = any> = [string, TypeComponentHandler<E>][]

////////// ModalHandlers //////////

type TypeModalHandler<E extends Env> = (c: ModalContext<E>) => Promise<unknown>
export type ModalHandlers<E extends Env = any> = [string, TypeModalHandler<E>][]

////////// CronHandler //////////

export type CronHandler<E extends Env = any> = (c: CronContext<E>) => Promise<unknown>

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

////////// FileData //////////

export type FileData = {
  blob: Blob
  name: string
}
