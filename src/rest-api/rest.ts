import { addToken, apiUrl, errorDev, formData } from '../utils'
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
      body?: FormData | string,
    ) => {
      if (!token) throw errorDev('DISCORD_TOKEN')
      const url =
        apiUrl +
        path
          .replace(' ', '')
          // Decompose path into array format
          .split(/[{}]/)
          // Replace the contents of {} in the path
          .map((str, i) => (i % 2 ? variables[~~(i / 2)] : str))
          .join('')
      const init = {
        method,
        body,
        headers: typeof body === 'string' ? { 'content-type': 'application/json' } : undefined,
      }
      return fetch(url, addToken(token, init))
    }
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param query
   * @returns {Promise<{response: Response, result: any}>}
   */
  get = async <P extends GetPath>(path: P, variables: Variables<P>, query?: GetQuery<P>) => {
    const response = await this.#fetch(path, variables, 'GET', JSON.stringify(query))
    return { response, result: (await response.json()) as GetResult<P> }
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @returns {Promise<Response>}
   */
  put = <P extends PutPath>(path: P, variables: Variables<P>, data?: PutData<P>) =>
    this.#fetch(path, variables, 'PUT', JSON.stringify(data))
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  post = <P extends PostPath>(path: P, variables: Variables<P>, data: PostData<P>, file?: PostFile<P>) => {
    // @ts-expect-error
    const body = file ? formData(data, file) : JSON.stringify(data)
    return this.#fetch(path, variables, 'POST', body)
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @param data
   * @param {FileData} file
   * @returns {Promise<Response>}
   */
  patch = <P extends PatchPath>(path: P, variables: Variables<P>, data: PatchData<P>, file?: PatchFile<P>) => {
    // @ts-expect-error
    const body = file ? formData(data, file) : JSON.stringify(data)
    return this.#fetch(path, variables, 'PATCH', body)
  }
  /**
   * @param {string} path Official document path
   * @param {string[]} variables Variable part of official document path
   * @returns {Promise<Response>}
   */
  delete = <P extends DeletePath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'DELETE')
}
