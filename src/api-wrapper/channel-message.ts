import type { CustomResponseCallbackData, FileData } from '../types'
import { apiUrl, addToken, formData, apiResponse } from '../utils'

/**
 * [API Create Message](https://discord.com/developers/docs/resources/channel#create-message)
 * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
 * @param file FileData: { blob: Blob, name: string }
 */
export const postMessage = async (
  token: string | undefined,
  channelId: string,
  data: CustomResponseCallbackData | string,
  ...files: FileData[]
) => {
  if (!token) throw new Error('DISCORD_TOKEN is not set. Set up in app.discordKey or use postMessage.')
  if (typeof data === 'string') data = { content: data }
  try {
    return apiResponse(
      await fetch(
        `${apiUrl}/channels/${channelId}/messages`,
        addToken(token, { method: 'POST', body: formData(data, files) }),
      ),
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
  if (!token) throw new Error('DISCORD_TOKEN is not set. Set up in app.discordKey or use deleteMessage.')
  try {
    return apiResponse(
      await fetch(`${apiUrl}/channels/${channelId}/messages/${messageId}`, addToken(token, { method: 'DELETE' })),
    )
  } catch (e) {
    console.warn('API fetch() Error: DELETE message\n', e)
    return undefined
  }
}

/**
 * [API Followup Message](https://discord.com/developers/docs/interactions/receiving-and-responding#followup-messages)
 * Used to send messages after resDefer.
 * @param data [Data Structure](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure)
 * @param file FileData: { blob: Blob, name: string }
 */
export const followupMessage = async (
  applicationId: string | undefined,
  interactionToken: string | undefined,
  data: CustomResponseCallbackData | string,
  ...files: FileData[]
) => {
  if (!applicationId)
    throw new Error('DISCORD_APPLICATION_ID is not set. Set up in app.discordKey or use followupMessage.')
  if (!interactionToken) throw new Error('Interaction Token is not set. You can use followupMessage.')
  if (typeof data === 'string') data = { content: data }
  try {
    return apiResponse(
      await fetch(`${apiUrl}/webhooks/${applicationId}/${interactionToken}`, {
        method: 'POST',
        body: formData(data, files),
      }),
    )
  } catch (e) {
    console.warn('API fetch() Error: POST followup\n', e)
    return undefined
  }
}

export const followupDeleteMessage = async (
  applicationId: string | undefined,
  interactionToken: string | undefined,
  messageId: string | undefined,
) => {
  if (!applicationId)
    throw new Error('DISCORD_APPLICATION_ID is not set. Set up in app.discordKey or use followupDeleteMessage.')
  if (!interactionToken) throw new Error('Interaction Token is not set. You can use followupDeleteMessage.')
  if (!messageId) throw new Error('Message Id is not set. You can use followupDeleteMessage.')
  try {
    return apiResponse(
      await fetch(`${apiUrl}/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, {
        method: 'DELETE',
      }),
    )
  } catch (e) {
    console.warn('API fetch() Error: DELETE followup\n', e)
    return undefined
  }
}
