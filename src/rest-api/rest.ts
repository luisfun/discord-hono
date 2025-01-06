import type {
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetCurrentApplicationResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchCurrentApplicationJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import { addToken, apiUrl, errorDev, fetch429Retry, formData } from '../utils'
import type {
  _applications_$_activityinstances_$,
  _applications_me,
  _channels_$_messages,
  _channels_$_messages_$,
  _channels_$_messages_$_crosspost,
  _channels_$_messages_$_reactions,
  _channels_$_messages_$_reactions_$,
  _channels_$_messages_$_reactions_$_$,
  _channels_$_messages_$_reactions_$_me,
  _channels_$_messages_bulkdelete,
} from './rest-path'

type GetPath =
  // Application https://discord.com/developers/docs/resources/application
  | typeof _applications_me
  // Messages https://discord.com/developers/docs/resources/message
  | typeof _channels_$_messages
  | typeof _channels_$_messages_$
  | typeof _channels_$_messages_$_reactions_$

type GetQuery<P extends GetPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends typeof _channels_$_messages
    ? RESTGetAPIChannelMessagesQuery
    : P extends typeof _channels_$_messages_$
      ? RESTGetAPIChannelMessageReactionUsersQuery
      : undefined

type GetResult<P extends GetPath> =
  // Application https://discord.com/developers/docs/resources/application
  P extends typeof _applications_me
    ? RESTGetCurrentApplicationResult
    : // Messages https://discord.com/developers/docs/resources/message
      P extends typeof _channels_$_messages
      ? RESTGetAPIChannelMessagesResult
      : P extends typeof _channels_$_messages_$
        ? RESTGetAPIChannelMessageResult
        : P extends typeof _channels_$_messages_$_reactions_$
          ? RESTGetAPIChannelMessageReactionUsersResult
          : undefined

type PutPath =
  // Messages https://discord.com/developers/docs/resources/message
  typeof _channels_$_messages_$_reactions_$_me

type PostPath =
  // Messages https://discord.com/developers/docs/resources/message
  typeof _channels_$_messages | typeof _channels_$_messages_$_crosspost | typeof _channels_$_messages_bulkdelete

type PostData<P extends PostPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends typeof _channels_$_messages
    ? RESTPostAPIChannelMessageJSONBody
    : P extends typeof _channels_$_messages_bulkdelete
      ? RESTPostAPIChannelMessagesBulkDeleteJSONBody
      : undefined

type PostFile<P extends PostPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends typeof _channels_$_messages ? FileData : undefined

type PatchPath =
  // Application https://discord.com/developers/docs/resources/application
  | typeof _applications_me
  // Messages https://discord.com/developers/docs/resources/message
  | typeof _channels_$_messages_$

type PatchData<P extends PatchPath> =
  // Application https://discord.com/developers/docs/resources/application
  P extends typeof _applications_me
    ? RESTPatchCurrentApplicationJSONBody
    : // Messages https://discord.com/developers/docs/resources/message
      P extends typeof _channels_$_messages_$
      ? RESTPatchAPIChannelMessageJSONBody
      : undefined

type PatchFile<P extends PatchPath> =
  // Messages https://discord.com/developers/docs/resources/message
  P extends typeof _channels_$_messages_$ ? FileData : undefined

type DeletePath =
  // Messages https://discord.com/developers/docs/resources/message
  | typeof _channels_$_messages_$
  | typeof _channels_$_messages_$_reactions
  | typeof _channels_$_messages_$_reactions_$
  | typeof _channels_$_messages_$_reactions_$_me
  | typeof _channels_$_messages_$_reactions_$_$

type Variables<P extends GetPath | PutPath | PostPath | PatchPath | DeletePath> = P extends
  | typeof _channels_$_messages
  | typeof _channels_$_messages_bulkdelete
  ? [string]
  : P extends
        | typeof _channels_$_messages_$
        | typeof _channels_$_messages_$_crosspost
        | typeof _channels_$_messages_$_reactions
    ? [string, string]
    : P extends typeof _channels_$_messages_$_reactions_$_me | typeof _channels_$_messages_$_reactions_$
      ? [string, string, string]
      : P extends typeof _channels_$_messages_$_reactions_$_$
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
