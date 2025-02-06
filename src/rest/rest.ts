import type { FileData } from '../types'
import { formData, newError } from '../utils'
import type {
  DeletePath,
  GetMethod,
  GetPath,
  GetQuery,
  PatchData,
  PatchMethod,
  PatchPath,
  PostData,
  PostMethod,
  PostPath,
  PutData,
  PutMethod,
  PutPath,
  Variables,
} from './rest-types'

const API_VER = 'v10'

export const createRest =
  (token: string | undefined) =>
  (method: string, path: string, variables: string[], data?: object, file?: FileData) => {
    if (!token) throw newError('Rest', 'DISCORD_TOKEN')
    const headers: HeadersInit = { Authorization: `Bot ${token}` }
    if (!file) headers['content-type'] = 'application/json'
    return fetch(
      `https://discord.com/api/${API_VER + path.replace(/\{[^}]*\}/g, () => [...variables].shift() || '')}`,
      { method, headers, body: file ? formData(data, file) : JSON.stringify(data) },
    )
  }

//const rest = createRest('')
//const res = await rest('GET', '/channels/{channel.id}/messages/{message.id}', ['channel.id', 'message.id'])

export class Rest {
  #fetch
  /**
   * [Documentation](https://discord-hono.luis.fun/interactions/rest/)
   * @param {string} token
   */
  constructor(token: string | undefined) {
    this.#fetch = (
      path: string,
      variables: string[],
      method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
      data?: object,
      file?: FileData,
    ) => {
      if (!token) throw newError('Rest', 'DISCORD_TOKEN')
      const Authorization = `Bot ${token}`
      return fetch(
        `https://discord.com/api/${
          API_VER +
          path
            .split(/[{}]/)
            .map((str, i) => (i & 1 ? variables[i >> 1] : str))
            .join('')
        }`,
        {
          method,
          body: file ? formData(data, file) : JSON.stringify(data),
          headers: file ? { Authorization } : { Authorization, 'content-type': 'application/json' },
        },
      )
    }
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param query
   * @returns {Promise<Response>}
   */
  get: GetMethod = async <P extends GetPath>(path: P, variables: Variables<P>, query?: GetQuery<P>) =>
    this.#fetch(path, variables, 'GET', query)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @returns {Promise<Response>}
   */
  put: PutMethod = <P extends PutPath>(path: P, variables: Variables<P>, data?: PutData<P>) =>
    this.#fetch(path, variables, 'PUT', data)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  post: PostMethod = <P extends PostPath>(path: P, variables: Variables<P>, data?: PostData<P>, file?: FileData) =>
    this.#fetch(path, variables, 'POST', data, file)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  patch: PatchMethod = <P extends PatchPath>(path: P, variables: Variables<P>, data?: PatchData<P>, file?: FileData) =>
    this.#fetch(path, variables, 'PATCH', data, file)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @returns {Promise<Response>}
   */
  delete = <P extends DeletePath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'DELETE')
}
