import type { EmbedBuilder } from '@discordjs/builders'
import type {
  APIEmbed,
  APIInteractionResponseCallbackData,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10'
import type { Embed } from './builder'
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

export type CustomCallbackBase =
  | APIInteractionResponseCallbackData
  | RESTPostAPIChannelMessageJSONBody
  | RESTPatchAPIChannelMessageJSONBody
export type CustomCallbackData<T extends CustomCallbackBase = APIInteractionResponseCallbackData> =
  | (Omit<T, 'components' | 'embeds'> & {
      components?: Components | T['components']
      embeds?: (Embed | EmbedBuilder | APIEmbed)[] | null
    })
  | string

////////// FileData //////////

type FileDataUnit = {
  blob: Blob
  name: string
}
export type FileData = FileDataUnit | FileDataUnit[]
