import type { SlashCommandBuilder } from '@discordjs/builders'
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10'
import type { Command } from '../builders/command'
import { createRest } from '../rest/rest'
import { _applications_$_commands, _applications_$_guilds_$_commands } from '../rest/rest-path'
import { newError, toJSON } from '../utils'

/**
 * [Docs](https://discord-hono.luis.fun/rest-api/register/)
 * @param {(Command | SlashCommandBuilder | RESTPostAPIApplicationCommandsJSONBody)[]} commands
 * @param {string} application_id
 * @param {string} token
 * @param {string} [guild_id]
 */
export const register = async (
  commands: (Command | SlashCommandBuilder | RESTPostAPIApplicationCommandsJSONBody)[],
  application_id: string | undefined,
  token: string | undefined,
  guild_id?: string | undefined,
) => {
  if (!token) throw newError('register', 'DISCORD_TOKEN')
  if (!application_id) throw newError('register', 'DISCORD_APPLICATION_ID')

  const rest = createRest(token)
  const json = commands.map(toJSON)
  let res: Response
  if (guild_id) res = await rest('PUT', _applications_$_guilds_$_commands, [application_id, guild_id], json)
  else res = await rest('PUT', _applications_$_commands, [application_id], json)

  let logText = ''
  if (res.ok) {
    logText = '===== ✅ Success ====='
    console.log(logText)
  } else {
    logText = `Error registering commands\n${res.url}: ${res.status} ${res.statusText}`
    try {
      const error = await res.text()
      if (error) {
        logText += `\n\n${error}`
      }
    } catch (e) {
      logText += `\n\nError reading body from request:\n${e}`
    }
    logText += '\n===== ⚠️ Error ====='
    console.error(logText)
  }
  return logText
}
