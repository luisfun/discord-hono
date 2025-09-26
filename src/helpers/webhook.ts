import type { $webhooks$_$_, RestData, RestFile, RestQuery, RestResult } from '../rest'
import type { TypedResponse } from '../types'
import { formData, isArray, prepareData, queryStringify } from '../utils'

/**
 * [Documentation](https://discord-hono.luis.fun/interactions/webhook/)
 * @param {string | [string] | [string, RestQuery<"POST", typeof $webhooks$_$_>]} url webhook url
 * @param {RestData<"POST", typeof $webhooks$_$_>} data [RESTPostAPIWebhookWithTokenJSONBody](https://discord-api-types.dev/api/next/discord-api-types-v10/interface/RESTPostAPIWebhookWithTokenJSONBody)
 * @param {RestFile<"POST", typeof $webhooks$_$_>} file File: { blob: Blob, name: string } | { blob: Blob, name: string }[]
 * @returns {RestResult<"POST", typeof $webhooks$_$_>}
 */
export const webhook = (
  url: string | [string] | [string, RestQuery<'POST', typeof $webhooks$_$_>],
  data: RestData<'POST', typeof $webhooks$_$_>,
  file?: RestFile<'POST', typeof $webhooks$_$_>,
): Promise<TypedResponse<RestResult<'POST', typeof $webhooks$_$_>>> =>
  fetch(isArray(url) ? `${url[0] + queryStringify(url[1] as Record<string, unknown> | undefined)}` : url, {
    method: 'POST',
    headers: file ? {} : { 'content-type': 'application/json' },
    body: file ? formData(prepareData(data), file) : JSON.stringify(prepareData(data)),
  })

// const res = await webhook('https://discord.com/api/webhooks/123/abc', 'Hello, world!').then(r => r.json())
