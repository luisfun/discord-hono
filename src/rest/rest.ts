import type { FileData } from '../types'
import { errorDev, formData } from '../utils'
import type {
  DeletePath,
  GetPath,
  GetQuery,
  GetResult,
  PatchData,
  PatchFile,
  PatchPath,
  PostData,
  PostFile,
  PostPath,
  PutData,
  PutPath,
  Variables,
} from './rest-types'

const API_VER = 'v10'

export class Rest {
  #fetch
  /**
   * [Documentation](https://discord-hono.luis.fun/rest-api/rest/)
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
      if (!token) throw errorDev('DISCORD_TOKEN')
      const isJson = !file
      const body = isJson ? JSON.stringify(data) : formData(data, file)
      const Authorization = `Bot ${token}`
      return fetch(
        `https://discord.com/api/${
          API_VER +
          path
            .replace(' ', '')
            .split(/[{}]/)
            .map((str, i) => (i % 2 ? variables[~~(i / 2)] : str))
            .join('')
        }`,
        {
          method,
          body,
          headers: isJson ? { Authorization, 'content-type': 'application/json' } : { Authorization },
        },
      )
    }
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param query
   * @returns {Promise<{response: Response, result: any}>}
   */
  get = async <P extends GetPath>(path: P, variables: Variables<P>, query?: GetQuery<P>) => {
    const response = await this.#fetch(path, variables, 'GET', query)
    return { response, result: (await response.json()) as GetResult<P> }
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @returns {Promise<Response>}
   */
  put = <P extends PutPath>(path: P, variables: Variables<P>, data?: PutData<P>) =>
    this.#fetch(path, variables, 'PUT', data)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  post = <P extends PostPath>(path: P, variables: Variables<P>, data: PostData<P>, file?: PostFile<P>) =>
    this.#fetch(path, variables, 'POST', data, file)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  patch = <P extends PatchPath>(path: P, variables: Variables<P>, data: PatchData<P>, file?: PatchFile<P>) =>
    this.#fetch(path, variables, 'PATCH', data, file)
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @returns {Promise<Response>}
   */
  delete = <P extends DeletePath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'DELETE')
}
