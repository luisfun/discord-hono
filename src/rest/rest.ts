import type { FileData } from '../types'
import { formData, newError } from '../utils'
import type { Rest } from './rest-types'

const API_VER = 'v10'

/**
 * [Documentation](https://discord-hono.luis.fun/interactions/rest/)
 * @param {string} token
 */
export const createRest =
  (token: string | undefined): Rest =>
  /**
   * [Documentation](https://discord-hono.luis.fun/interactions/rest/)
   * @param {'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'} method
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param {Record<string, any>} data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  (
    method: string,
    path: string,
    variables: string[] = [],
    data?: Record<string, any> & { query?: any },
    file?: FileData,
  ) => {
    if (!token) throw newError('Rest', 'DISCORD_TOKEN')
    const isGet = method.toUpperCase() === 'GET'
    const vars = [...variables]
    const query: Record<string, string> | undefined = isGet ? data : data?.query
    const headers: HeadersInit = { Authorization: `Bot ${token}` }
    if (!file) headers['content-type'] = 'application/json'
    const requestData: RequestInit = { method, headers }
    if (!isGet) requestData.body = file ? formData(data, file) : JSON.stringify(data)
    return fetch(
      `https://discord.com/api/${API_VER + path.replace(/\{[^}]*\}/g, () => vars.shift() ?? '') + (query ? `/?${new URLSearchParams(query).toString()}` : '')}`,
      requestData,
    )
  }

/*
const rest = createRest('')
const res1 = await rest('POST', '/applications/{application.id}/commands', ['application.id'], {
  name: '',
  //description: '',
}).then(r => r.json())
const res2 = await rest('GET', '/applications/{application.id}/activity-instances/{instance_id}', [
  'application.id',
  'instance_id',
]).then(r => r.json())
// @ts-expect-error
const res3 = await rest('GET', '/unknown', [], { content: '' }).then(r => r.json())
const res4 = await rest('GET', '/applications/@me').then(r => r.json())
const res5 = await rest('POST', "/interactions/{interaction.id}/{interaction.token}/callback", ["", ""], {type: 1}).then(r => r.json())
*/
