import { Components } from './builder/components'
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

export class RegexMap<K = any, V = any> extends Map<K, V> {
  /**
   * When the key is regex, perform regex.test(key) and return the value when it matches.
   */
  match(key: K) {
    if (typeof key === 'string')
      for (const k of this.keys()) if (k === key || (k instanceof RegExp && k.test(key))) return this.get(k)
    return this.get(key)
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
  if (data?.components) {
    const components = data.components instanceof Components ? data.components.build() : data.components
    return { ...data, components }
  }
  return data as Omit<CustomCallbackData<T>, 'components'>
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
export const errorOther = (e: string) => new Error(`There is no ${e}`) // other

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, Math.max(ms, 0)))

const retryOffset = 1e4
export const fetch429Retry = async (
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1],
  retry = 0,
): Promise<Response> => {
  let res: Response
  try {
    res = await fetch(input, init)
    if (res.status !== 429 || retry < 1) return res
    const retryAfter = Number(res.headers.get('Retry-After')) * 1e3
    await sleep(retryAfter + retryOffset)
    return fetch429Retry(input, init, retry - 1)
  } catch {
    if (retry < 1) throw new Error('fetch error')
    console.error('fetch error, retry')
    await sleep(retryOffset)
    return fetch429Retry(input, init, retry - 1)
  }
}
