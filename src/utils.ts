import type { APIInteractionResponseCallbackData } from 'discord-api-types/v10'
import type { FileData } from './types'

export const apiUrl = 'https://discord.com/api/v10'

export class ResponseJson extends Response {
  constructor(json: object, init?: ResponseInit) {
    const body = JSON.stringify(json)
    const initJson = {
      ...init,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...init?.headers,
      },
    }
    super(body, initJson)
  }
}

/**
 * fetch(input, { body })
 * @param method default 'POST'
 */
export const fetchMessage = async (
  input: URL | RequestInfo,
  data?: APIInteractionResponseCallbackData,
  files?: FileData[],
  method?: string,
) => {
  const body = new FormData()
  body.append('payload_json', JSON.stringify(data))
  if (files?.[0])
    for (let i = 0, len = files.length; i < len; i++) body.append(`files[${i}]`, files[i].blob, files[i].name)
  return await fetch(input, { method: method || 'POST', body })
}
