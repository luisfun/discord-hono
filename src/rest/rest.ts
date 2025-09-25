import type { TypedResponse } from '../types'
import { formData, isString, newError, prepareData, queryStringify } from '../utils'
import type { Rest, RestData, RestFile, RestMethod, RestPath, RestQuery, RestResult, RestVariables } from './rest-types'

const API_VER = 'v10'

/**
 * [Documentation](https://discord-hono.luis.fun/interactions/rest/)
 * @param {string} token
 */
export const createRest =
  (token: string | undefined): Rest =>
  /**
   * [Documentation](https://discord-hono.luis.fun/interactions/rest/)
   * @param {RestMethod} method
   * @param {RestPath<any>} path Official document path
   * @param {(string | Record<string, any>)[]} variables Variable part of official document path
   * @param {Record<string, any> | Record<string, any>[]} data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  <M extends RestMethod, P extends RestPath<M>>(
    method: M,
    path: P,
    variables: RestVariables<P> | [...RestVariables<P>, RestQuery<M, P>] | [] = [],
    data?: RestData<M, P>,
    file?: RestFile<M, P>,
  ): Promise<TypedResponse<RestResult<M, P>>> => {
    if (!token) throw newError('REST', 'DISCORD_TOKEN')
    const vars = variables.filter(v => isString(v))
    const headers: HeadersInit = { Authorization: `Bot ${token}` }
    if (!file) headers['content-type'] = 'application/json'
    const requestInit: RequestInit = { method, headers }
    if (method.toUpperCase() !== 'GET')
      requestInit.body = file ? formData(prepareData<any>(data), file) : JSON.stringify(prepareData(data))
    return fetch(
      `https://discord.com/api/${API_VER + path.replace(/\{[^}]*\}/g, () => vars.shift() ?? '') + queryStringify(variables.find(v => !isString(v)) as Record<string, unknown> | undefined)}`,
      requestInit,
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
