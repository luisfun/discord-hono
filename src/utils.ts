import type { APIInteractionResponseCallbackData } from 'discord-api-types/v10'

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
    };
    super(body, initJson)
  }
}

export type FileData = {
  blob: Blob,
  name: string,
}

/**
 * fetch(input, { body })
 * @param method default 'POST'
 */
export const fetchMessage = async (input: URL | RequestInfo, data?: APIInteractionResponseCallbackData, file?: FileData | FileData[], method?: string) => {
  const body = new FormData()
  body.append('payload_json', JSON.stringify(data))
  if(file){
    if(!Array.isArray(file)) body.append(`files[0]`, file.blob, file.name)
    else for(let i=0, len=file.length; i<len; i++) body.append(`files[${i}]`, file[i].blob, file[i].name)
  }
  return await fetch(input, { method: method || 'POST', body })
}
