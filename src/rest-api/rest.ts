import type {
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import { addToken, apiUrl, errorDev, fetch429Retry, formData } from '../utils'

type GetPath =
  // Messages https://discord.com/developers/docs/resources/message
  | '/channels/{channel.id}/messages'
  | '/channels/{channel.id}/messages/{message.id}'
  | '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}'

type GetResult<P extends GetPath> = P extends '/channels/{channel.id}/messages'
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

type PatchPath =
  // Messages https://discord.com/developers/docs/resources/message
  '/channels/{channel.id}/messages/{message.id}'

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
  constructor(token: string, retry = 0) {
    this.#fetch = (
      path: string,
      variables: string[],
      method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
      body?: BodyInit,
    ) => {
      const url =
        apiUrl +
        path
          .replace(' ', '')
          // Decompose path into array format
          .split('{')
          .flatMap(str => str.split('}'))
          // Replace the contents of {} in the path
          .map((str, i) => {
            if (i % 2 === 0) return str
            return variables[Math.trunc(i / 2)]
          })
          .join('')
      const init = {
        method,
        body,
        headers: body
          ? { 'content-type': body instanceof FormData ? 'multipart/form-data' : 'application/json' }
          : undefined,
      }
      return fetch429Retry(url, addToken(token, init), retry)
    }
  }
  get = async <P extends GetPath>(path: P, variables: Variables<P>) => {
    const response = await this.#fetch(path, variables, 'GET')
    return { response, result: (await response.json()) as GetResult<P> }
  }
  put = <P extends PutPath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'PUT')
  post = <P extends PostPath>(path: P, variables: Variables<P>, data: any, file?: FileData) => {
    let body: BodyInit
    switch (path) {
      case '/channels/{channel.id}/messages':
        body = formData(data, file)
        break
      default:
        body = JSON.stringify(data)
    }
    return this.#fetch(path, variables, 'POST', body)
  }
  patch = <P extends PatchPath>(path: P, variables: Variables<P>, data: any, file?: FileData) => {
    let body: BodyInit
    switch (path) {
      case '/channels/{channel.id}/messages/{message.id}':
        body = formData(data, file)
        break
      default:
        body = JSON.stringify(data)
    }
    return this.#fetch(path, variables, 'PATCH', body)
  }
  delete = <P extends DeletePath>(path: P, variables: Variables<P>) => this.#fetch(path, variables, 'DELETE')
}

//const a = new Rest("").post("/channels/{channel.id}/messages", [""], "")

const mGet = { method: 'GET' } as const
const mPut = { method: 'PUT' } as const
const mPost = { method: 'POST' } as const
const mPatch = { method: 'PATCH' } as const
const mDelete = { method: 'DELETE' } as const

type ChannelMessageGetResult<M extends string | undefined> = M extends string
  ? RESTGetAPIChannelMessageResult
  : RESTGetAPIChannelMessagesResult

/*
 * Response Rules
 * get: { response, result }
 * other: response
 */
/**
 * @param token required
 * @param retry Number of retries at rate limit. default: 0
 */
export const rest = (token: string | undefined, retry = 0) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
  const fetchRest = (input: Parameters<typeof fetch>[0], init: Parameters<typeof fetch>[1]) =>
    fetch429Retry(input, init, retry)
  const init = (init: Parameters<typeof fetch>[1]): Parameters<typeof fetch>[1] => addToken(token, init)
  const initGet = init(mGet)
  const initPut = init(mPut)
  const initPost = init(mPost)
  const initDelete = init(mDelete)
  return {
    /**
     * @param channelId required
     */
    channels: (channelId: string | undefined) => {
      if (!channelId) throw errorDev('Channel Id')
      const channelUrl = `${apiUrl}/channels/${channelId}`
      return {
        /**
         * https://discord.com/developers/docs/resources/channel#get-channel
         */
        get: async () => {
          const response = await fetchRest(channelUrl, initGet)
          return { response, result: (await response.json()) as RESTGetAPIChannelResult }
        },
        // ****************************** Not done yet
        /**
         * https://discord.com/developers/docs/resources/channel#modify-channel
         */
        //patch: () => {},
        /**
         * https://discord.com/developers/docs/resources/channel#deleteclose-channel
         */
        delete: () => fetchRest(channelUrl, initDelete),
        messages: <M extends string | undefined>(messageId?: M) => {
          const messageUrl = messageId ? `${channelUrl}/messages/${messageId}` : `${channelUrl}/messages`
          return {
            // ****************************** Not done yet: messages() のパラメータ
            /**
             * messages().get() -> [get message list](https://discord.com/developers/docs/resources/channel#get-channel-messages)
             * messages(messageId).get() -> [get message](https://discord.com/developers/docs/resources/channel#get-channel-message)
             */
            get: async () => {
              const response = await fetchRest(messageUrl, initGet)
              return { response, result: (await response.json()) as ChannelMessageGetResult<M> }
            },
            /**
             * messages().post("data") -> [post message](https://discord.com/developers/docs/resources/channel#create-message)
             */
            post: (data: RESTPostAPIChannelMessageJSONBody | undefined, file?: FileData) => {
              return fetchRest(messageUrl, init({ ...mPost, body: formData(data, file) }))
            },
            /**
             * https://discord.com/developers/docs/resources/channel#edit-message
             */
            patch: (data: RESTPatchAPIChannelMessageJSONBody | undefined, file?: FileData) => {
              return fetchRest(messageUrl, init({ ...mPatch, body: formData(data, file) }))
            },
            /**
             * https://discord.com/developers/docs/resources/channel#delete-message
             */
            delete: () => fetchRest(messageUrl, initDelete),
            crosspost: () => {
              const crosspostUrl = `${messageUrl}/crosspost`
              return {
                /**
                 * https://discord.com/developers/docs/resources/channel#crosspost-message
                 */
                post: () => fetchRest(crosspostUrl, initPost),
              }
            },
            reactions: (emoji?: string) => {
              const reactionUrl = emoji ? `${messageUrl}/reactions/${emoji}` : `${messageUrl}/reactions`
              return {
                /**
                 * https://discord.com/developers/docs/resources/channel#get-reactions
                 */
                get: async () => {
                  const response = await fetchRest(reactionUrl, initGet)
                  return { response, result: (await response.json()) as RESTGetAPIChannelMessageReactionUsersResult }
                },
                /**
                 * reactions().delete() -> [delete all reactions](https://discord.com/developers/docs/resources/channel#delete-all-reactions)
                 * reactions(emoji).delete() -> [delete all reactions for emoji](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
                 */
                delete: () => fetchRest(reactionUrl, initDelete),
                me: () => {
                  const meUrl = `${reactionUrl}/@me`
                  return {
                    /**
                     * https://discord.com/developers/docs/resources/channel#create-reaction
                     */
                    put: () => fetchRest(meUrl, initPut),
                    /**
                     * https://discord.com/developers/docs/resources/channel#delete-own-reaction
                     */
                    delete: () => fetchRest(meUrl, initDelete),
                  }
                },
                user: (userId: string) => {
                  const userUrl = `${reactionUrl}/${userId}`
                  return {
                    /**
                     * https://discord.com/developers/docs/resources/channel#delete-user-reaction
                     */
                    delete: () => fetchRest(userUrl, initDelete),
                  }
                },
              }
            },
          }
        },
      }
    },
  }
}
