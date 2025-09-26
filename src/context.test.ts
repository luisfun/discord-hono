import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIInteractionGuildMember,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10'
import { Locale } from 'discord-api-types/v10'
import { describe, expect, it, vi } from 'vitest'
import { Context } from './context'
import { $webhooks$_$_$messages$original, createRest } from './rest'
import type { CommandContext, ComponentContext } from './types'
import { isString } from './utils'

// Mock createRest to avoid actual API calls
vi.mock('./rest', () => ({
  createRest: vi.fn().mockReturnValue(
    vi.fn().mockImplementation((method, _endpoint, _pathVars, _data, _file) => {
      if (method === 'PATCH') return Promise.resolve({})
      if (method === 'DELETE') return Promise.resolve({})
      return Promise.resolve({})
    }),
  ),
  $webhooks$_$_$messages$original: '/webhooks/{}/{}/messages/@original',
}))

// Mock newError for testing error throwing
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    newError: (name: string, message: string) => new Error(`${name}: ${message}`),
    prepareData: (data: unknown) => (isString(data) ? { content: data } : data),
    formData: vi.fn().mockReturnValue(new FormData()),
    toJSON: (data: unknown) => data,
  }
})

describe('Context', () => {
  const env = { TEST_ENV: 'test' }
  const executionCtx = {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  }
  const discordEnv = { TOKEN: 'test-token' }
  const cronEvent = { cron: '*/5 * * * *', scheduledTime: Date.now(), type: 'scheduled' }
  const key = 'test-key'

  it('should create a context with all properties', () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, cronEvent)
    expect(ctx.env).toEqual(env)
    expect(ctx.executionCtx).toEqual(executionCtx)
    expect(ctx.key).toEqual(key)
    expect(ctx.interaction).toEqual(cronEvent)
  })

  it('should handle variables', () => {
    const ctx = new Context<{ Variables: { testVar: string } }, any>(env, executionCtx, discordEnv, key, cronEvent)
    ctx.set('testVar', 'testValue')
    expect(ctx.get('testVar')).toEqual('testValue')
    expect(ctx.var).toEqual({ testVar: 'testValue' })
  })

  it('should provide access to rest client', () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, cronEvent)
    expect(ctx.rest).toBeDefined()
    expect(createRest).toHaveBeenCalledWith('test-token')
  })
})

describe('Context', () => {
  const env = { TEST_ENV: 'test' }
  const executionCtx = {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  }
  const discordEnv = {
    TOKEN: 'test-token',
    APPLICATION_ID: 'app-id',
  }
  const key = 'test-key'

  // @ts-expect-error
  const member: APIInteractionGuildMember = {
    user: {
      id: 'user-id',
      global_name: 'global-name',
      username: 'username',
      discriminator: '0000',
      avatar: null,
    },
    roles: [],
    joined_at: '',
    deaf: false,
    mute: false,
  }

  // Mock command interaction
  // @ts-expect-error
  const commandInteraction: APIApplicationCommandInteraction = {
    id: 'interaction-id',
    application_id: 'app-id',
    type: 2, // APPLICATION_COMMAND
    token: 'token',
    version: 1,
    data: {
      id: 'command-id',
      name: 'test-command',
      type: 1,
      options: [
        {
          name: 'option1',
          type: 3, // STRING
          value: 'value1',
        },
      ],
    },
    guild_id: 'guild-id',
    channel_id: 'channel-id',
    member: member,
    app_permissions: '0',
    locale: Locale.EnglishUS,
    guild_locale: Locale.EnglishUS,
  }

  // Mock subcommand interaction
  const subCommandInteraction: APIApplicationCommandInteraction = {
    ...commandInteraction,
    data: {
      ...commandInteraction.data,
      // @ts-expect-error
      options: [
        {
          name: 'group',
          type: 2, // SUB_COMMAND_GROUP
          options: [
            {
              name: 'sub',
              type: 1, // SUB_COMMAND
              options: [
                {
                  name: 'option1',
                  type: 3, // STRING
                  value: 'value1',
                },
              ],
            },
          ],
        },
      ],
    },
  }

  // Mock component interaction
  const componentInteraction: APIMessageComponentInteraction = {
    id: 'interaction-id',
    application_id: 'app-id',
    type: 3, // MESSAGE_COMPONENT
    token: 'token',
    version: 1,
    data: {
      custom_id: 'button-1',
      component_type: 2, // BUTTON
    },
    guild_id: 'guild-id',
    channel_id: 'channel-id',
    member: member,
    app_permissions: '0',
    locale: Locale.EnglishUS,
    guild_locale: Locale.EnglishUS,
    // @ts-expect-error
    message: {
      id: 'message-id',
      channel_id: 'channel-id',
      content: 'message content',
      author: {
        id: 'bot-id',
        global_name: 'global-bot-name',
        username: 'bot',
        discriminator: '0000',
        avatar: null,
      },
      attachments: [],
      embeds: [],
      mentions: [],
      mention_roles: [],
      pinned: false,
      mention_everyone: false,
      tts: false,
      timestamp: '',
      edited_timestamp: null,
      //flags: 0,
      components: [],
    },
  }

  // Mock autocomplete interaction
  // @ts-expect-error
  const autocompleteInteraction: APIApplicationCommandAutocompleteInteraction = {
    id: 'interaction-id',
    application_id: 'app-id',
    type: 4, // APPLICATION_COMMAND_AUTOCOMPLETE
    token: 'token',
    version: 1,
    data: {
      id: 'command-id',
      name: 'test-command',
      type: 1,
      options: [
        {
          name: 'option1',
          type: 3, // STRING
          value: 'val',
          focused: true,
        },
      ],
    },
    guild_id: 'guild-id',
    channel_id: 'channel-id',
    member: member,
    app_permissions: '0',
    locale: Locale.EnglishUS,
    guild_locale: Locale.EnglishUS,
  }

  // Mock modal interaction
  // @ts-expect-error
  const modalInteraction: APIModalSubmitInteraction = {
    id: 'interaction-id',
    application_id: 'app-id',
    type: 5, // MODAL_SUBMIT
    token: 'token',
    version: 1,
    data: {
      custom_id: 'modal-1',
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'input-1',
              value: 'input value',
            },
          ],
        },
      ],
    },
    guild_id: 'guild-id',
    channel_id: 'channel-id',
    member: member,
    app_permissions: '0',
    locale: Locale.EnglishUS,
    guild_locale: Locale.EnglishUS,
  }

  it('should handle command interactions', () => {
    const ctx = new Context<{ Variables: { option1: string } }, any>(
      env,
      executionCtx,
      discordEnv,
      key,
      commandInteraction,
    )
    expect(ctx.interaction).toEqual(commandInteraction)
    expect(ctx.get('option1')).toEqual('value1')
  })

  it('should handle subcommand interactions', () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, subCommandInteraction)
    expect(ctx.sub).toEqual({
      group: 'group',
      command: 'sub',
      string: 'group sub',
    })
  })

  it('should handle component interactions', () => {
    const ctx = new Context<{ Variables: { custom_id: string } }, any>(
      env,
      executionCtx,
      discordEnv,
      key,
      componentInteraction,
    )
    expect(ctx.get('custom_id')).toEqual('button-1')
  })

  it('should handle autocomplete interactions', () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, autocompleteInteraction)
    expect(ctx.focused).toBeDefined()
    expect(ctx.focused?.name).toEqual('option1')
    expect(ctx.focused?.value).toEqual('val')
  })

  it('should handle modal interactions', () => {
    const ctx = new Context<{ Variables: { custom_id: string; 'input-1': string } }, any>(
      env,
      executionCtx,
      discordEnv,
      key,
      modalInteraction,
    )
    expect(ctx.get('custom_id')).toEqual('modal-1')
    expect(ctx.get('input-1')).toEqual('input value')
  })

  it('should set flags correctly', async () => {
    const ctx = new Context<any, CommandContext>(env, executionCtx, discordEnv, key, commandInteraction)
    const response = ctx.flags('EPHEMERAL').res('Test message')
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.data.flags).toEqual(64) // EPHEMERAL flag value
  })

  it('should create proper response', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    const response = ctx.res('Test message')
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(4) // CHANNEL_MESSAGE_WITH_SOURCE
    expect(body.data.content).toEqual('Test message')
  })

  it('should create defer response', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    const response = ctx.resDefer()
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(5) // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  })

  it('should create update response for components', async () => {
    const ctx = new Context<any, ComponentContext>(env, executionCtx, discordEnv, key, componentInteraction)
    const response = ctx.update().res('Updated message')
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(7) // UPDATE_MESSAGE
    expect(body.data.content).toEqual('Updated message')
  })

  it('should throw error for invalid method calls', () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    expect(() => ctx.update()).toThrow('c.***')
  })

  it('should allow followup messages', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    await ctx.followup('Followup message')
    expect(ctx.rest).toHaveBeenCalledWith(
      'PATCH',
      $webhooks$_$_$messages$original,
      ['app-id', 'token'],
      'Followup message',
      undefined,
    )
  })

  it('should create modal response', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    const response = ctx.resModal({ title: 'Test Modal', custom_id: 'modal-test', components: [] })
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(9) // MODAL
    expect(body.data.title).toEqual('Test Modal')
  })

  it('should create autocomplete response', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, autocompleteInteraction)
    const response = ctx.resAutocomplete({ choices: [{ name: 'Option 1', value: 'option1' }] })
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(8) // APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
    expect(body.data.choices).toEqual([{ name: 'Option 1', value: 'option1' }])
  })

  it('should create activity response', async () => {
    const ctx = new Context(env, executionCtx, discordEnv, key, commandInteraction)
    const response = ctx.resActivity()
    const body = await response.json() //JSON.parse(response.body as string)
    expect(body.type).toEqual(12) // LAUNCH_ACTIVITY
  })

  it('should throw error when event is not found', () => {
    const ctx = new Context(env, undefined, discordEnv, key, commandInteraction)
    expect(() => ctx.event).toThrow('c.event: not found')
  })

  it('should throw error when executionCtx is not found', () => {
    const ctx = new Context(env, undefined, discordEnv, key, commandInteraction)
    expect(() => ctx.executionCtx).toThrow('c.executionCtx: not found')
  })
})
