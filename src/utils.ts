import type { CustomCallbackData, FileData } from './types'

export const CUSTOM_ID_SEPARATOR = ';'

export const isString = (value: unknown): value is string => typeof value === 'string' // || value instanceof String
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)
// export const toArray = <T>(value: T | T[]) => (isArray(value) ? value : [value])

export const isProto = (value: unknown): boolean =>
  value === '__proto__' || value === 'constructor' || value === 'prototype'

const messageFlagData = {
  SUPPRESS_EMBEDS: 2,
  EPHEMERAL: 6,
  SUPPRESS_NOTIFICATIONS: 12,
  IS_COMPONENTS_V2: 15,
} as const

export type MessageFlag = keyof typeof messageflagData

export const messageFlags = (...flag: MessageFlag[]): number =>
  flag.reduce((result, f) => result | (1 << messageflagData[f]), 0)

const permissionFlagData = {
  CREATE_INSTANT_INVITE: 0,
  KICK_MEMBERS: 1,
  BAN_MEMBERS: 2,
  ADMINISTRATOR: 3,
  MANAGE_CHANNELS: 4,
  MANAGE_GUILD: 5,
  ADD_REACTIONS: 6,
  VIEW_AUDIT_LOG: 7,
  PRIORITY_SPEAKER: 8,
  STREAM: 9,
  VIEW_CHANNEL: 10,
  SEND_MESSAGES: 11,
  SEND_TTS_MESSAGES: 12,
  MANAGE_MESSAGES: 13,
  EMBED_LINKS: 14,
  ATTACH_FILES: 15,
  READ_MESSAGE_HISTORY: 16,
  MENTION_EVERYONE: 17,
  USE_EXTERNAL_EMOJIS: 18,
  VIEW_GUILD_INSIGHTS: 19,
  CONNECT: 20,
  SPEAK: 21,
  MUTE_MEMBERS: 22,
  DEAFEN_MEMBERS: 23,
  MOVE_MEMBERS: 24,
  USE_VAD: 25,
  CHANGE_NICKNAME: 26,
  MANAGE_NICKNAMES: 27,
  MANAGE_ROLES: 28,
  MANAGE_WEBHOOKS: 29,
  MANAGE_GUILD_EXPRESSIONS: 30,
  USE_APPLICATION_COMMANDS: 31,
  REQUEST_TO_SPEAK: 32,
  MANAGE_EVENTS: 33,
  MANAGE_THREADS: 34,
  CREATE_PUBLIC_THREADS: 35,
  CREATE_PRIVATE_THREADS: 36,
  USE_EXTERNAL_STICKERS: 37,
  SEND_MESSAGES_IN_THREADS: 38,
  USE_EMBEDDED_ACTIVITIES: 39,
  MODERATE_MEMBERS: 40,
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 41,
  USE_SOUNDBOARD: 42,
  CREATE_GUILD_EXPRESSIONS: 43,
  CREATE_EVENTS: 44,
  USE_EXTERNAL_SOUNDS: 45,
  SEND_VOICE_MESSAGES: 46,
  SET_VOICE_CHANNEL_STATUS: 48,
  SEND_POLLS: 49,
  USE_EXTERNAL_APPS: 50,
  PIN_MESSAGES: 51,
  BYPASS_SLOWMODE: 52,
} as const

type PermissionFlag = keyof typeof permissionFlagData

export const permissionFlags = (...flag: PermissionFlag[]): number =>
  Number(flag.reduce((result, f) => result | (1n << BigInt(permissionFlagData[f])), 0n))

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
