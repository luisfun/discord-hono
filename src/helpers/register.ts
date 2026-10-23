import type {
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsResult,
} from 'discord-api-types/v10'

import { createRest } from '../rest/rest'
import { $applications$_$commands, $applications$_$guilds$_$commands } from '../rest/rest-path'
import type { JsonSerializable, TypedResponse } from '../types'
import { newError, toJSON } from '../utils'
import { inspectResponse } from './inspect-response'

interface RegisterOptions {
  silent?: boolean
}

interface Register {
  (
    commands: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody[]>,
    application_id: string | undefined,
    token: string | undefined,
    options?: RegisterOptions,
  ): Promise<TypedResponse<RESTPutAPIApplicationGuildCommandsResult>>
  (
    commands: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody[]>,
    application_id: string | undefined,
    token: string | undefined,
    guild_id?: string | undefined,
    options?: RegisterOptions,
  ): Promise<TypedResponse<RESTPutAPIApplicationGuildCommandsResult>>
}

/**
 * [Docs](https://discord-hono.luis.fun/rest-api/register/)
 * @param commands
 * @param application_id
 * @param token
 * @param guild_id
 * @param options - { silent?: boolean }
 */
export const register: Register = async (
  commands: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody[]>,
  application_id: string | undefined,
  token: string | undefined,
  guild_id_or_options?: RegisterOptions | string | undefined,
  options?: RegisterOptions,
): Promise<TypedResponse<RESTPutAPIApplicationGuildCommandsResult>> => {
  if (!token) throw newError('register', 'DISCORD_TOKEN')
  if (!application_id) throw newError('register', 'DISCORD_APPLICATION_ID')

  const rest = createRest(token)
  const json = commands.map(toJSON)
  const guild_id = typeof guild_id_or_options === 'string' ? guild_id_or_options : undefined
  const opts = typeof guild_id_or_options === 'object' ? guild_id_or_options : options
  const res = guild_id
    ? await rest(
        'PUT',
        $applications$_$guilds$_$commands,
        [application_id, guild_id],
        json as RESTPutAPIApplicationGuildCommandsJSONBody,
      )
    : await rest('PUT', $applications$_$commands, [application_id], json)

  if (opts?.silent) return res

  const logText = `${guild_id ? 'Guild' : 'Global'} Command Registration`
  if (res.ok) {
    console.info(`✅ Success ${logText}`)
  } else {
    const debug = await inspectResponse(res)
    console.error(`⚠️ ${res.status}: ${res.url}\n${debug.text}\n⚠️ Error ${logText}`)
  }
  return res
}

/*
import { makeSlashCommand } from '../builders'
import { SlashCommandBuilder } from '@discordjs/builders'

const testRegister = async () => {
  await register([makeSlashCommand('test', 'Test Command')], '', '', '')
  await register([new SlashCommandBuilder().setName('test').setDescription('Test Command')], '', '', 'guild_id')
}
*/
// Uncomment to test register function
// testRegister()
