
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

export const fetchFormData = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  const initFormData = {
    ...init,
    headers: {
      'content-type': 'multipart/form-data;charset=UTF-8',
      ...init?.headers,
    },
  }
  return await fetch(input, initFormData)
}

/*
export const jsonToFormData = (json: Record<string, string | Blob>) => {
  const body = new FormData()
  for (const key in json) body.append(key, json[key])
  return body
}
*/