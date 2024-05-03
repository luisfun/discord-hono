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
 */
export const rest = (token: string | undefined) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
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
          const response = await fetch429Retry(channelUrl, initGet)
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
        delete: () => fetch429Retry(channelUrl, initDelete),
        messages: <M extends string | undefined>(messageId?: M) => {
          const messageUrl = messageId ? `${channelUrl}/messages/${messageId}` : `${channelUrl}/messages`
          return {
            // ****************************** Not done yet: messages() のパラメータ
            /**
             * messages().get() -> [get message list](https://discord.com/developers/docs/resources/channel#get-channel-messages)
             * messages(messageId).get() -> [get message](https://discord.com/developers/docs/resources/channel#get-channel-message)
             */
            get: async () => {
              const response = await fetch429Retry(messageUrl, initGet)
              return { response, result: (await response.json()) as ChannelMessageGetResult<M> }
            },
            // ****************************** Not done yet: formData() の再設計
            /**
             * messages().post("data") -> [post message](https://discord.com/developers/docs/resources/channel#create-message)
             */
            post: (jsonBody: RESTPostAPIChannelMessageJSONBody, file?: FileData) => {
              return fetch429Retry(messageUrl, init({ ...mPost, body: formData(jsonBody, file) }))
            },
            // ****************************** Not done yet: formData() の再設計
            /**
             * https://discord.com/developers/docs/resources/channel#edit-message
             */
            patch: (jsonBody: RESTPatchAPIChannelMessageJSONBody, file?: FileData) => {
              // @ts-expect-error
              return fetch429Retry(messageUrl, init({ ...mPatch, body: formData(jsonBody, file) })) // formData 見直し
            },
            /**
             * https://discord.com/developers/docs/resources/channel#delete-message
             */
            delete: () => fetch429Retry(messageUrl, initDelete),
            /**
             * https://discord.com/developers/docs/resources/channel#crosspost-message
             */
            crosspost: () => fetch429Retry(`${messageUrl}/crosspost`, initPost),
            reactions: (emoji?: string) => {
              const reactionUrl = emoji ? `${messageUrl}/reactions/${emoji}` : `${messageUrl}/reactions`
              return {
                /**
                 * https://discord.com/developers/docs/resources/channel#get-reactions
                 */
                get: async () => {
                  const response = await fetch429Retry(reactionUrl, initGet)
                  return { response, result: (await response.json()) as RESTGetAPIChannelMessageReactionUsersResult }
                },
                /**
                 * reactions().delete() -> [delete all reactions](https://discord.com/developers/docs/resources/channel#delete-all-reactions)
                 * reactions(emoji).delete() -> [delete all reactions for emoji](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
                 */
                delete: () => fetch429Retry(reactionUrl, initDelete),
                me: () => {
                  const meUrl = `${reactionUrl}/@me`
                  return {
                    /**
                     * https://discord.com/developers/docs/resources/channel#create-reaction
                     */
                    put: () => fetch429Retry(meUrl, initPut),
                    /**
                     * https://discord.com/developers/docs/resources/channel#delete-own-reaction
                     */
                    delete: () => fetch429Retry(meUrl, initDelete),
                  }
                },
                user: (userId: string) => {
                  const userUrl = `${reactionUrl}/${userId}`
                  return {
                    /**
                     * https://discord.com/developers/docs/resources/channel#delete-user-reaction
                     */
                    delete: () => fetch429Retry(userUrl, initDelete),
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
