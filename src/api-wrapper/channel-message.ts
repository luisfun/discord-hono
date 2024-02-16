import type { CustomResponseCallbackData, FileData } from '../types'
import { apiUrl, fetchMessage } from '../utils'

/**
 * [API Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 */
export const postMessage = async (channelId: string, data?: CustomResponseCallbackData, ...files: FileData[]) =>
  await fetchMessage(`${apiUrl}/channels/${channelId}/messages`, data, files)

/**
 * [API Delete Message](https://discord.com/developers/docs/resources/channel#delete-message)
 */
export const deleteMessage = async (channelId: string, messageId: string) =>
  await fetch(`${apiUrl}/channels/${channelId}/messages/${messageId}`, { method: 'DELETE' })
