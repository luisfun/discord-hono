import type { CustomCallbackBase, CustomCallbackData, FileData } from './types'

export const apiUrl = 'https://discord.com/api/v10'

export class ResponseJson extends Response {
  constructor(json: object, init?: ResponseInit) {
    const body = JSON.stringify(json)
    const initJson = {
      ...init,
      headers: {
        ...init?.headers,
        'content-type': 'application/json;charset=UTF-8',
      },
    }
    super(body, initJson)
  }
}

export class RegexMap<K, V> extends Map<K, V> {
  override get(key: K) {
    const value = super.get(key)
    if (!value && typeof key === 'string') for (const [k, v] of this) if (k instanceof RegExp && k.test(key)) return v
    return value
  }
}

export const addToken = (token: string, init?: Parameters<typeof fetch>[1]): Parameters<typeof fetch>[1] => ({
  ...init,
  headers: {
    ...init?.headers,
    Authorization: `Bot ${token}`,
  },
})

export const prepareData = <T extends CustomCallbackBase>(data: CustomCallbackData<T>) => {
  if (typeof data === 'string') return { content: data }
  const components = data?.components
  const embeds = data?.embeds
  if (components) data = { ...data, components: 'toJSON' in components ? components.toJSON() : components }
  if (embeds) data = { ...data, embeds: embeds.map(embed => ('toJSON' in embed ? embed.toJSON() : embed)) }
  return data as T
}

export const formData = <T extends CustomCallbackBase>(data?: CustomCallbackData<T>, file?: FileData) => {
  const body = new FormData()
  if (data && Object.keys(data).length !== 0) body.append('payload_json', JSON.stringify(prepareData(data)))
  if (Array.isArray(file))
    for (let i = 0, len = file.length; i < len; i++) body.append(`files[${i}]`, file[i].blob, file[i].name)
  else if (file) body.append('files[0]', file.blob, file.name)
  return body
}

export const errorSys = (e: string) => new Error(`${e} not found`) // system
export const errorDev = (e: string) => new Error(`${e} is missing`) // developer
