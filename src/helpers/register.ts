import type {
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsJSONBody,
} from 'discord-api-types/v10'
import { createRest } from '../rest/rest'
import { $applications$_$commands, $applications$_$guilds$_$commands } from '../rest/rest-path'
import type { JsonSerializable } from '../types'
import { newError, toJSON } from '../utils'

/**
 * [Docs](https://discord-hono.luis.fun/rest-api/register/)
 * @param {JsonSerializable<RESTPostAPIApplicationCommandsJSONBody[]>} commands
 * @param {string} application_id
 * @param {string} token
 * @param {string} [guild_id]
 */
export const register = async (
  commands: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody[]>,
  application_id: string | undefined,
  token: string | undefined,
  guild_id?: string | undefined,
): Promise<string> => {
  if (!token) throw newError('register', 'DISCORD_TOKEN')
  if (!application_id) throw newError('register', 'DISCORD_APPLICATION_ID')

  const rest = createRest(token)
  const json = commands.map(toJSON)
  let res: Response
  if (guild_id)
    res = await rest(
      'PUT',
      $applications$_$guilds$_$commands,
      [application_id, guild_id],
      json as RESTPutAPIApplicationGuildCommandsJSONBody,
    )
  else res = await rest('PUT', $applications$_$commands, [application_id], json)

  let logText = ''
  if (res.ok) {
    logText = '===== ✅ Success ====='
    console.info(logText)
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

/*
import { makeSlashCommand } from '../builders/a-command'
import { SlashCommandBuilder } from '@discordjs/builders'

const testRegister = async () => {
  await register([makeSlashCommand('test', 'Test Command')], '', '', '')
  await register([new SlashCommandBuilder().setName('test').setDescription('Test Command')], '', '', 'guild_id')
}
*/
// Uncomment to test register function
// testRegister()
