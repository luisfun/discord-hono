import type { RESTPostAPIWebhookWithTokenJSONBody, RESTPostAPIWebhookWithTokenQuery } from 'discord-api-types/v10'
import type { Query } from '../rest/rest-types'
import type { CustomCallbackData, FileData } from '../types'
import { formData, prepareData, queryStringify } from '../utils'

/**
 * [Documentation](https://discord-hono.luis.fun/interactions/webhook/)
 * @param {string} url webhook url
 * @param {CustomCallbackData<RESTPostAPIWebhookWithTokenJSONBody & Query<RESTPostAPIWebhookWithTokenQuery>>} data [RESTPostAPIWebhookWithTokenJSONBody](https://discord-api-types.dev/api/next/discord-api-types-v10/interface/RESTPostAPIWebhookWithTokenJSONBody)
 * @param {FileData} file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
 * @returns {Promise<Response>}
 */
export const webhook = (
  url: string,
  // @ts-expect-error: インデックス シグネチャがありません。ts(2344)
  data: CustomCallbackData<RESTPostAPIWebhookWithTokenJSONBody & Query<RESTPostAPIWebhookWithTokenQuery>>,
  file?: FileData,
) => {
  const headers: HeadersInit = {}
  if (!file) headers['content-type'] = 'application/json'
  const requestData: RequestInit = { method: 'POST', headers }
  const prepared = prepareData(data) as (Record<string, unknown> & { query?: Record<string, unknown> }) | undefined
  requestData.body = file ? formData(prepared, file) : JSON.stringify(prepared)
  return fetch(`${url + queryStringify(prepared?.query)}`, requestData)
}
