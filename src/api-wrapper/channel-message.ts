import type { CustomResponseCallbackData, FileData } from '../types'
import { apiUrl, fetchMessage, fetchAuth } from '../utils'

/**
 * [API Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 */
export const postMessage = async (channelId: string, data?: CustomResponseCallbackData, ...files: FileData[]) =>
  await fetchMessage(`${apiUrl}/channels/${channelId}/messages`, data, files)

/**
 * [API Delete Message](https://discord.com/developers/docs/resources/channel#delete-message)
 */
export const deleteMessage = async (token: string | undefined, channelId: string, messageId: string) => {
  if (!token) throw new Error('DISCORD_TOKEN is not set. Set up in app.token() or use deleteMessage.')
  return await fetchAuth(token, `${apiUrl}/channels/${channelId}/messages/${messageId}`, { method: 'DELETE' })
}
