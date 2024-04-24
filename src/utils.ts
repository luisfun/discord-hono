import { Components } from './builder/components'
import type { ArgFileData, CustomResponseData } from './types'

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

export const addToken = (token: string, init?: RequestInit): RequestInit => ({
  ...init,
  headers: {
    ...init?.headers,
    Authorization: `Bot ${token}`,
  },
})

export const formData = (data?: CustomResponseData, file?: ArgFileData) => {
  const body = new FormData()
  if (typeof data === 'string') data = { content: data }
  if (data?.components)
    data.components = data.components instanceof Components ? data.components.build() : data.components
  if (data) body.append('payload_json', JSON.stringify(data))
  if (Array.isArray(file))
    for (let i = 0, len = file.length; i < len; i++) body.append(`files[${i}]`, file[i].blob, file[i].name)
  else if (file) body.append('files[0]', file.blob, file.name)
  return body
}

export const ephemeralData = (data?: CustomResponseData) => {
  if (typeof data === 'string') data = { content: data }
  return { ...data, flags: 1 << 6 }
}
