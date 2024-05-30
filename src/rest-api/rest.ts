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
