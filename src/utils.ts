import type { CustomCallbackBase, CustomCallbackData, FileData } from './types'

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

export const prepareData = <T extends CustomCallbackBase>(data: CustomCallbackData<T>) => {
  if (typeof data === 'string') return { content: data }
  const components = data?.components
  const embeds = data?.embeds
  if (components) data = { ...data, components: toJSON(components) }
  if (embeds) data = { ...data, embeds: embeds.map(toJSON) }
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
