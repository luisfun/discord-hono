import type { CustomCallbackData, FileData } from './types'

export const CUSTOM_ID_SEPARATOR = ';'

// type any !!!!!!!!!
export const toJSON = (obj: object) => ('toJSON' in obj && typeof obj.toJSON === 'function' ? obj.toJSON() : obj)

export const prepareData = <T extends Record<string, unknown>>(
  data: CustomCallbackData<T> | Record<string, unknown>[] | undefined,
) => {
  if (!data) return undefined
  if (typeof data === 'string') return { content: data } as unknown as T
  if (Array.isArray(data)) return data
  const { components, embeds, poll, ...rest } = data
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (components) rest.components = Array.isArray(components) ? components.map(toJSON) : toJSON(components)
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (embeds) rest.embeds = embeds.map(toJSON)
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (poll) rest.poll = toJSON(poll)
  return rest as T
}

export const formData = (data?: object, file?: FileData) => {
  const body = new FormData()
  if (data && Object.keys(data).length > 0) body.append('payload_json', JSON.stringify(data))
  if (file) (Array.isArray(file) ? file : [file]).forEach((f, i) => body.append(`files[${i}]`, f.blob, f.name))
  return body
}

/**
 * new Error(\`discord-hono(${locate}): ${text}\`)
 */
export const newError = (locate: string, text: string) => new Error(`discord-hono(${locate}): ${text}`)

export const queryStringify = (query: Record<string, unknown> | undefined) => {
  if (!query) return ''
  const queryMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue
    queryMap[key] = String(value)
  }
  return `?${new URLSearchParams(queryMap).toString()}`
}

// export const isString = (value: unknown): value is string => typeof value === 'string' || value instanceof String
// export const isArray = (value: unknown) => Array.isArray(value)
// export const toArray = <T>(value: T | T[]) => (isArray(value) ? value : [value])
