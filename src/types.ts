/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  APIBaseInteraction,
  InteractionType,
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommand,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import type { Context } from './context'

////////// Env //////////

export type Env = {
  Bindings?: Record<string, unknown>
  Variables?: Record<string, unknown>
}

////////// Command //////////

export type CommandHandler<E extends Env = any> = (c: Context<E>) => Promise<Response> | Response
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
/**
 * [Application Command](https://discord.com/developers/docs/interactions/application-commands)
 */
export type Commands<E extends Env = any> = [ApplicationCommand, CommandHandler<E>][]

////////// CronHandler //////////

export type CronHandler<E extends Env = any> = (c: Context<E>) => Promise<unknown>

////////// PublicKeyHandler //////////

export type PublicKeyHandler<E extends Env = any> = (env: E['Bindings']) => string

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

////////// Interaction //////////
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export type Interaction = APIBaseInteraction<InteractionType, APIChatInputApplicationCommandInteractionData>

////////// FileData //////////

export type FileData = {
  blob: Blob
  name: string
}
