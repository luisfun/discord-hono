import type { ArgFileData, CustomResponseData } from '../types'
import { addToken, apiUrl, errorDev, formData } from '../utils'

/**
 * [API Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
 * @param file FileData: { blob: Blob, name: string }
 */
export const postMessage = async (
  token: string | undefined,
  channelId: string,
  data?: CustomResponseData,
  file?: ArgFileData,
) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
  try {
    return await fetch(
      `${apiUrl}/channels/${channelId}/messages`,
      addToken(token, { method: 'POST', body: formData(data, file) }),
    )
  } catch (e) {
    console.warn('API fetch() Error: POST message\n', e)
    return undefined
  }
}

/**
 * [API Delete Message](https://discord.com/developers/docs/resources/channel#delete-message)
 */
export const deleteMessage = async (token: string | undefined, channelId: string, messageId: string) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
  try {
    return await fetch(`${apiUrl}/channels/${channelId}/messages/${messageId}`, addToken(token, { method: 'DELETE' }))
  } catch (e) {
    console.warn('API fetch() Error: DELETE message\n', e)
    return undefined
  }
}

/**
 * @deprecated
 * [API Followup Message](https://discord.com/developers/docs/interactions/receiving-and-responding#followup-messages)
 * Used to send messages after resDefer.
 * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
 * @param file FileData: { blob: Blob, name: string }
 */
export const followupMessage = async (
  applicationId: string | undefined,
  interactionToken: string | undefined,
  data?: CustomResponseData,
  file?: ArgFileData,
) => {
  if (!applicationId) throw errorDev('DISCORD_APPLICATION_ID')
  if (!interactionToken) throw errorDev('Interaction Token')
  try {
    return await fetch(`${apiUrl}/webhooks/${applicationId}/${interactionToken}`, {
      method: 'POST',
      body: formData(data, file),
    })
  } catch (e) {
    console.warn('API fetch() Error: POST followup\n', e)
    return undefined
  }
}

/**
 * @deprecated
 */
export const followupDeleteMessage = async (
  applicationId: string | undefined,
  interactionToken: string | undefined,
  messageId: string | undefined,
) => {
  if (!applicationId) throw errorDev('DISCORD_APPLICATION_ID')
  if (!interactionToken) throw errorDev('Interaction Token')
  if (!messageId) throw errorDev('Message Id')
  try {
    return await fetch(`${apiUrl}/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, {
      method: 'DELETE',
    })
  } catch (e) {
    console.warn('API fetch() Error: DELETE followup\n', e)
    return undefined
  }
}
