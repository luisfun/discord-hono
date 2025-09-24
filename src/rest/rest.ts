import type { FileData } from '../types'
import { formData, isString, newError, prepareData, queryStringify } from '../utils'
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
   * @param {Record<string, any> | Record<string, any>[]} data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  (
    method: string,
    path: string,
    variables: (string | Record<string, any>)[] = [],
    data?: Record<string, any> | Record<string, any>[] | string,
    file?: FileData,
  ): ReturnType<typeof fetch> => {
    if (!token) throw newError('REST', 'DISCORD_TOKEN')
    const vars = variables.filter(v => isString(v))
    const headers: HeadersInit = { Authorization: `Bot ${token}` }
    if (!file) headers['content-type'] = 'application/json'
    const prepared: Record<string, unknown> | Record<string, unknown>[] | undefined = prepareData(data)
    const init: RequestInit = { method, headers, body: file ? formData(prepared, file) : JSON.stringify(prepared) }
    return fetch(
      `https://discord.com/api/${API_VER + path.replace(/\{[^}]*\}/g, () => vars.shift() ?? '') + queryStringify(variables.find(v => !isString(v)) as Record<string, unknown> | undefined)}`,
      init,
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
const res3 = await rest('GET', '/channels/{channel.id}', ['channel.id']).then(r => r.json())
const res4 = await rest('GET', '/users/@me/guilds', [{ after: '' }]).then(r => r.json())
const res5 = await rest('POST', "/interactions/{interaction.id}/{interaction.token}/callback", ["", ""], {type: 1}).then(r => r.json())
*/
