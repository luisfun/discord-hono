import type { APIApplicationCommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10'
import type { JsonSerializable } from '../types'
import { newError, toJSON } from '../utils'

/**
 * @alpha
 */
export const testCommandRequestBodyJson = <V extends {}>(
  command: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>,
  options?: V,
): APIApplicationCommandInteraction => {
  const cmd = toJSON(command)
  const supportOptionType = [3, 4, 5, 10] // STRING, INTEGER, BOOLEAN, NUMBER
  const interaction: APIApplicationCommandInteraction = {
    type: 2, // Command Number
    // @ts-expect-error
    data: {
      name: cmd.name,
      id: '0'.repeat(32),
      type: cmd.type || 1,
    },
  }
  // CHAT_INPUT with options
  if (interaction.data.type === 1 && cmd.options) {
    if (cmd.options.every(opt => supportOptionType.includes(opt.type))) {
      if (options) {
        interaction.data.options = []
        for (const [name, value] of Object.entries(options)) {
          const type = cmd.options.find(opt => opt.name === name)?.type
          if (!type) throw newError('testCommandRequestBody', `option: "${name}" is not found`)
          // @ts-expect-error
          interaction.data.options.push({ name, value, type })
        }
      }
    } else {
      console.warn('discord-hono(testCommandRequestBody): options are not supported yet')
    }
  }
  return interaction
}

/**
 * @alpha
 * ✅ Command: name, type
 *
 * ✅ Options: STRING, INTEGER, BOOLEAN, NUMBER
 * @param command
 * @param options
 * @returns
 */
export const testCommandRequestInit = <V extends {}>(
  command: JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>,
  options?: V,
): RequestInit => ({
  method: 'POST',
  headers: {
    'x-signature-ed25519': 'f'.repeat(128),
    'x-signature-timestamp': '1',
    'content-type': 'application/json',
  },
  body: JSON.stringify(testCommandRequestBodyJson(command, options)),
})
