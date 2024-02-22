import type { CustomResponseCallbackData, FileData, ApiResponse } from './types'
import { Components } from './builder/components'

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

export const formData = (data?: CustomResponseCallbackData, files?: FileData[]) => {
  const body = new FormData()
  if (data?.components)
    data.components = data.components instanceof Components ? data.components.build() : data.components
  body.append('payload_json', JSON.stringify(data))
  if (files?.[0])
    for (let i = 0, len = files.length; i < len; i++) body.append(`files[${i}]`, files[i].blob, files[i].name)
  return body
}
