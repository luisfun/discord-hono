/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  APIBaseInteraction,
  InteractionType,
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommand,
  ApplicationCommandType,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption, // 1
  APIApplicationCommandSubcommandGroupOption, // 2
  APIApplicationCommandStringOption, // 3
  APIApplicationCommandIntegerOption, // 4
  APIApplicationCommandBooleanOption, // 5
  APIApplicationCommandUserOption, // 6
  APIApplicationCommandChannelOption, // 7
  APIApplicationCommandRoleOption, // 8
  APIApplicationCommandMentionableOption, // 9
  APIApplicationCommandNumberOption, // 10
  APIApplicationCommandAttachmentOption, // 11
  ApplicationCommandOptionType,
} from 'discord-api-types/v10'
import type { Context } from './context'

////////// Values //////////

type Bindings = Record<string, unknown>
type Variables = Record<string, unknown>

export type Env = {
  Bindings?: Bindings
  Variables?: Variables
}

////////// ScheduledEvent //////////
// https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/#syntax

export type ScheduledEvent = {
  cron: string
  type: string
  scheduledTime: number
}

////////// CommandHandler //////////

export type CommandHandler<E extends Env = any> = (c: Context<E>) => Promise<Response> | Response
/**
 * [ApplicationCommand](https://discord.com/developers/docs/interactions/application-commands)
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
 * [ApplicationCommand](https://discord.com/developers/docs/interactions/application-commands)
 */
export type Commands<E extends Env = any> = [ApplicationCommand, CommandHandler<E>][]

export type SetCommandsHandler<E extends Env = any> = (commands: Commands<E>) => void

////////// ScheduledHandler //////////

export type ScheduledHandler<E extends Env = any> = (c: Context<E>) => Promise<unknown>

export type ScheduledArray<E extends Env = any> = [string, ScheduledHandler<E>][]

export type SetScheduledHandler<E extends Env = any> = (cron: string, scheduled: ScheduledHandler<E>) => void

////////// ValidationTargets //////////

export type ValidationTargets = {
  json: any
  form: Record<string, string | File>
  query: Record<string, string | string[]>
  queries: Record<string, string[]> // Deprecated. Will be obsolete in v4.
  param: Record<string, string>
  header: Record<string, string>
  cookie: Record<string, string>
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

////////// JSONValue //////////
/*
type JSONPrimitive = string | boolean | number | null | undefined
type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[]
type JSONObject = { [key: string]: JSONPrimitive | JSONArray | JSONObject | object }
export type JSONValue = JSONObject | JSONArray | JSONPrimitive
*/

////////// ApplicationCommandOption //////////
// prettier-ignore
export type ApplicationCommandOption<T extends ApplicationCommandOptionType> =
  T extends 1 ? APIApplicationCommandSubcommandOption :
  T extends 2 ? APIApplicationCommandSubcommandGroupOption :
  T extends 3 ? APIApplicationCommandStringOption :
  T extends 4 ? APIApplicationCommandIntegerOption :
  T extends 5 ? APIApplicationCommandBooleanOption :
  T extends 6 ? APIApplicationCommandUserOption :
  T extends 7 ? APIApplicationCommandChannelOption :
  T extends 8 ? APIApplicationCommandRoleOption :
  T extends 9 ? APIApplicationCommandMentionableOption :
  T extends 10 ? APIApplicationCommandNumberOption :
  T extends 11 ? APIApplicationCommandAttachmentOption :
  APIApplicationCommandOption
