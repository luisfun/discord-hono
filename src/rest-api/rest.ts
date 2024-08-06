import type {
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import { addToken, apiUrl, errorDev, fetch429Retry, formData } from '../utils'

type GetPath =
  // Messages https://discord.com/developers/docs/resources/message
  | '/channels/{channel.id}/messages'
  | '/channels/{channel.id}/messages/{message.id}'
  | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}'

type GetQuery<P extends GetPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages'
    ? RESTGetAPIChannelMessagesQuery
    : P extends '/channels/{channel.id}/messages/{message.id}'
      ? RESTGetAPIChannelMessageReactionUsersQuery
      : undefined

type GetResult<P extends GetPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages'
    ? RESTGetAPIChannelMessagesResult
    : P extends '/channels/{channel.id}/messages/{message.id}'
      ? RESTGetAPIChannelMessageResult
      : P extends '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}'
        ? RESTGetAPIChannelMessageReactionUsersResult
        : undefined

type PutPath =
  // Messages https://discord.com/developers/docs/resources/message
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me'

type PostPath =
  // Messages https://discord.com/developers/docs/resources/message
  | '/channels/{channel.id}/messages'
  | '/channels/{channel.id}/messages/{message.id}/crosspost'
  | '/channels/{channel.id}/messages/bulk-delete'

type PostData<P extends PostPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages'
    ? RESTPostAPIChannelMessageJSONBody
    : P extends '/channels/{channel.id}/messages/bulk-delete'
      ? RESTPostAPIChannelMessagesBulkDeleteJSONBody
      : undefined

type PostFile<P extends PostPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages' ? FileData : undefined

type PatchPath =
  // Messages https://discord.com/developers/docs/resources/message
  '/channels/{channel.id}/messages/{message.id}'

type PatchData<P extends PatchPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages/{message.id}' ? RESTPatchAPIChannelMessageJSONBody : undefined

type PatchFile<P extends PatchPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends '/channels/{channel.id}/messages/{message.id}' ? FileData : undefined

type DeletePath =
  // Messages https://discord.com/developers/docs/resources/message
  | '/channels/{channel.id}/messages/{message.id}'
  | '/channels/{channel.id}/messages/{message.id}/reactions'
  | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}'
  | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me'
  | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}'

type Variables<P extends GetPath | PutPath | PostPath | PatchPath | DeletePath> = P extends
  | '/channels/{channel.id}/messages'
  | '/channels/{channel.id}/messages/bulk-delete'
  ? [string]
  : P extends
        | '/channels/{channel.id}/messages/{message.id}'
        | '/channels/{channel.id}/messages/{message.id}/crosspost'
        | '/channels/{channel.id}/messages/{message.id}/reactions'
    ? [string, string]
    : P extends
          | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me'
          | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}'
      ? [string, string, string]
      : P extends '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}'
        ? [string, string, string, string]
        : []

export class Rest {
  #fetch
  /**
   * [Documentation](https://discord-hono.luis.fun/rest-api/rest/)
   *
   * Supports: [Messages](https://discord.com/developers/docs/resources/message)
   * @param {string} token
   * @param {number} [retry=0] Number of retries when 429 etc.
   */
  constructor(token: string | undefined, retry = 0) {
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
      return fetch429Retry(url, addToken(token, init), retry)
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
  put = <P extends PutPath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'PUT')
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
