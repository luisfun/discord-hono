import type { CustomCallbackData, FileData } from './types'

export const CUSTOM_ID_SEPARATOR = ';'

export class ResponseObject extends Response {
  constructor(obj: object | FormData, status?: number) {
    const isForm = obj instanceof FormData
    super(isForm ? obj : JSON.stringify(obj), {
      status,
      headers: isForm ? undefined : { 'content-type': 'application/json' },
    })
  }
}

// type any !!!!!!!!!
export const toJSON = (obj: object) => ('toJSON' in obj && typeof obj.toJSON === 'function' ? obj.toJSON() : obj)

export const prepareData = <T extends Record<string, unknown>>(
  data: CustomCallbackData<T> | Record<string, unknown>[] | undefined,
) => {
  if (!data) return undefined
  if (typeof data === 'string') return { content: data } as unknown as T
  if (Array.isArray(data)) return data
  const { components, embeds, ...rest } = data
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (components) rest.components = toJSON(components)
  // @ts-expect-error Finally, the type is adjusted using an 'as' clause.
  if (embeds) rest.embeds = embeds.map(toJSON)
  return rest as T
}

export const formData = (data?: object, file?: FileData) => {
  const body = new FormData()
  if (data && Object.keys(data).length > 0) body.append('payload_json', JSON.stringify(data))
  if (Array.isArray(file))
    for (let i = 0, len = file.length; i < len; i++) body.append(`files[${i}]`, file[i].blob, file[i].name)
  else if (file) body.append('files[0]', file.blob, file.name)
  return body
}

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
