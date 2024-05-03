import type { CustomCallbackData, FileData } from '../types'
import { addToken, apiUrl, errorDev, fetch429Retry, formData } from '../utils'

/**
 * [Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
 * @param file FileData: { blob: Blob, name: string }
 */
export const postMessage = async (
  token: string | undefined,
  channelId: string,
  data?: CustomCallbackData,
  file?: FileData,
) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
  if (!channelId) throw errorDev('Channel Id')
  return fetch429Retry(
    `${apiUrl}/channels/${channelId}/messages`,
    addToken(token, { method: 'POST', body: formData(data, file) }),
  )
}
