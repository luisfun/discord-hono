import type { Command } from '../builders'
import { toJSON } from '../utils'

export const testCommandRequestBody = (command: Command | ReturnType<Command['toJSON']>): string => {
  const cmd: ReturnType<Command['toJSON']> = toJSON(command)
  return JSON.stringify({
    type: 2, // Command Number
    data: {
      name: cmd.name,
    },
  })
}

/**
 * ✅ Command Name
 * @param {Command | ReturnType<Command['toJSON']>} command
 * @returns {RequestInit}
 */
export const testCommandRequestInit = (command: Command | ReturnType<Command['toJSON']>): RequestInit => ({
  method: 'POST',
  headers: {
    'x-signature-ed25519': 'f'.repeat(128),
    'x-signature-timestamp': '1',
    'content-type': 'application/json',
  },
  body: testCommandRequestBody(command),
})
