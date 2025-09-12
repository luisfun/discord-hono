import type { Command } from '../builders'
import { toJSON } from '../utils'

export const testCommandRequestInit = (command: Command | ReturnType<Command['toJSON']>): RequestInit => {
  const cmd: ReturnType<Command['toJSON']> = toJSON(command)
  return {
    method: 'POST',
    headers: {
      'x-signature-ed25519': 'f'.repeat(128),
      'x-signature-timestamp': '1',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 2, // ApplicationCommand
      application_id: '123456789012345678',
      data: {
        id: '987654321098765432',
        name: cmd.name,
      },
      guild_id: '876543210987654321',
      channel_id: '765432109876543210',
      member: {
        user: {
          id: '654321098765432109',
          username: 'TestUser',
        },
        roles: ['111111111111111111', '222222222222222222'],
        premium_since: null,
        permissions: '2147483647',
        pending: false,
        nick: 'Tester',
        mute: false,
        joined_at: '2020-01-01T00:00:00.000000+00:00',
        is_pending: false,
        deaf: false,
      },
      token: 'A_UNIQUE_TOKEN',
      version: 1,
    }),
  }
}
