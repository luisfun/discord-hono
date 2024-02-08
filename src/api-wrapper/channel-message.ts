import type {
  RESTPostAPIChannelMessageFormDataBody,
} from 'discord-api-types/v10'
import { apiUrl, fetchFormData } from '../utils'

/**
 * [API Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 */
export const postMessage = async (json: RESTPostAPIChannelMessageFormDataBody, channelId: string) =>
  await fetchFormData(
    `${apiUrl}/channels/${channelId}/messages`,
    { method: 'POST', body: JSON.stringify(json) },
  )

/**
 * [API Delete Message](https://discord.com/developers/docs/resources/channel#delete-message)
 */
export const deleteMessage = async (channelId: string, messageId: string) =>
  await fetch(
    `${apiUrl}/channels/${channelId}/messages/${messageId}`,
    { method: 'DELETE' },
  )
