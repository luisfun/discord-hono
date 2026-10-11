import type { CustomCallbackData, FileData } from './types'

export const CUSTOM_ID_SEPARATOR = ';'

export const isString = (value: unknown): value is string => typeof value === 'string' // || value instanceof String
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)
// export const toArray = <T>(value: T | T[]) => (isArray(value) ? value : [value])

export const isProto = (value: unknown): boolean =>
  value === '__proto__' || value === 'constructor' || value === 'prototype'

const messageFlagData = {
  SUPPRESS_EMBEDS: 1 << 2,
  EPHEMERAL: 1 << 6,
  SUPPRESS_NOTIFICATIONS: 1 << 12,
  IS_COMPONENTS_V2: 1 << 15,
} as const

export type MessageFlag = keyof typeof messageFlagData

export const messageFlags = (...flags: MessageFlag[]): number => {
  let result = 0
  for (const f of flags) result |= messageFlagData[f]
  return result
}

const permissionFlagData = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n,
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
  USE_SOUNDBOARD: 1n << 42n,
  CREATE_GUILD_EXPRESSIONS: 1n << 43n,
  CREATE_EVENTS: 1n << 44n,
  USE_EXTERNAL_SOUNDS: 1n << 45n,
  SEND_VOICE_MESSAGES: 1n << 46n,
  SET_VOICE_CHANNEL_STATUS: 1n << 48n,
  SEND_POLLS: 1n << 49n,
  USE_EXTERNAL_APPS: 1n << 50n,
  PIN_MESSAGES: 1n << 51n,
  BYPASS_SLOWMODE: 1n << 52n,
} as const

type PermissionFlag = keyof typeof permissionFlagData

/**
 * @see https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags
 */
export const permissionFlags = (...flags: PermissionFlag[]): number => {
  let result = 0n
  for (const f of flags) result |= permissionFlagData[f]
  return Number(result)
}

export type ToJSON<T> = T extends { toJSON(): infer R } ? R : T

export const toJSON = <T>(obj: T): ToJSON<T> =>
  typeof (obj as any)?.toJSON === 'function' ? (obj as any).toJSON() : (obj as any)

export const prepareData = <T extends Record<string, unknown>>(
  data: CustomCallbackData<T> | Record<string, unknown>[] | undefined,
): T | Record<string, unknown>[] | undefined => {
  if (!data) return undefined
  if (isString(data)) return { content: data } as unknown as T
  if (isArray(data)) return data
  const { components, embeds, poll, ...rest } = data
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (components) rest.components = isArray(components) ? components.map(toJSON) : toJSON(components)
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (embeds) rest.embeds = embeds.map(toJSON)
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (poll) rest.poll = toJSON(poll)
  return rest as T
}

export const formData = (data?: object, file?: FileData): FormData => {
  const body = new FormData()
  if (data && Object.keys(data).length > 0) body.append('payload_json', JSON.stringify(data))
  if (file)
    // oxlint-disable-next-line unicorn/no-array-for-each
    (isArray(file) ? file : [file]).forEach((f, i) => {
      body.append(`files[${i}]`, f.blob, f.name)
    })
  return body
}

/**
 * new Error(\`discord-hono(${locate}): ${text}\`)
 */
export const newError = (locate: string, text: string): Error => new Error(`discord-hono(${locate}): ${text}`)

/**
 * console.warn(\`discord-hono(${locate}): ${text}\`)
 */
export const consoleWarn = (locate: string, text: string): void => console.warn(`discord-hono(${locate}): ${text}`)

export const queryStringify = (query: Record<string, unknown> | undefined): '' | `?${string}` => {
  if (!query) return ''
  const queryMap: Record<string, string> = {}
  // oxlint-disable-next-line eqeqeq, no-eq-null
  for (const [key, value] of Object.entries(query)) if (value != null) queryMap[key] = String(value)
  return `?${new URLSearchParams(queryMap).toString()}`
}
