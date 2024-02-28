import type { ApplicationCommand } from './types'
import { apiUrl } from './utils'
import { Command } from './builder/command'

// cloudflare-sample-app
// Copyright (c) 2022 Justin Beckwith
// https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE

export const register = async (
  commands: (Command | ApplicationCommand)[],
  applicationId: string | undefined,
  token: string | undefined,
  guildId?: string | undefined,
) => {
  if (!token) throw new Error('The DISCORD_TOKEN environment variable is required.')
  if (!applicationId) throw new Error('The DISCORD_APPLICATION_ID environment variable is required.')
  const url = guildId
    ? `${apiUrl}/applications/${applicationId}/guilds/${guildId}/commands`
    : `${apiUrl}/applications/${applicationId}/commands`
  const applicationCommands = commands.map(cmd => {
    if (cmd instanceof Command) return cmd.build()
    return cmd
  })

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(applicationCommands),
  })

  if (response.ok) {
    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
    console.log('Registered all commands')
  } else {
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`
    try {
      const error = await response.text()
      if (error) {
        errorText = `${errorText} \n\n ${error}`
      }
    } catch (err) {
      console.error('Error reading body from request:', err)
    }
    console.error(errorText)
    console.error('Error registering commands')
  }
}
