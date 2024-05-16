import { Command } from '../builder/command'
import type { ApplicationCommand } from '../types'
import { apiUrl, errorDev } from '../utils'

// cloudflare-sample-app
// Copyright (c) 2022 Justin Beckwith
// https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE

/**
 * @sample
 * ```ts
 * register(
 *   commands,
 *   env.DISCORD_APPLICATION_ID,
 *   env.DISCORD_TOKEN,
 *   //env.DISCORD_TEST_GUILD_ID,
 * )
 * ```
 */
export const register = async (
  commands: (Command | ApplicationCommand)[],
  applicationId: string | undefined,
  token: string | undefined,
  guildId?: string | undefined,
) => {
  if (!token) throw errorDev('DISCORD_TOKEN')
  if (!applicationId) throw errorDev('DISCORD_APPLICATION_ID')

  const url = guildId
    ? `${apiUrl}/applications/${applicationId}/guilds/${guildId}/commands`
    : `${apiUrl}/applications/${applicationId}/commands`
  const body = JSON.stringify(
    commands.map(cmd => {
      if (cmd instanceof Command) return cmd.build()
      return cmd
    }),
  )

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body,
  })

  if (response.ok) {
    const data = await response.json()
    console.log(`${JSON.stringify(data, null, 2)}\n===== ✅ Success =====`)
  } else {
    let errorText = `Error registering commands\n${response.url}: ${response.status} ${response.statusText}`
    try {
      const error = await response.text()
      if (error) {
        errorText += `\n\n${error}`
      }
    } catch (e) {
      errorText += `\n\nError reading body from request:\n${e}`
    }
    console.error(`${errorText}\n===== ⚠️ Error =====`)
  }
}
