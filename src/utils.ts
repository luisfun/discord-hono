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

export const apiResponse = (res: Response): ApiResponse => {
  const xRateLimit = {
    RetryAfter: res.headers.get('Retry-After'),
    Limit: res.headers.get('X-RateLimit-Limit'),
    Remaining: res.headers.get('X-RateLimit-Limit'),
    Reset: res.headers.get('X-RateLimit-Reset'),
    ResetAfter: res.headers.get('X-RateLimit-Reset-After'),
    Bucket: res.headers.get('X-RateLimit-Bucket'),
    Scope: res.headers.get('X-RateLimit-Scope'),
    Global: res.headers.get('X-RateLimit-Global'),
  }
  return { res, xRateLimit }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, Math.max(ms, 0)))
