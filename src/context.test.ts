import type { APIInteraction } from 'discord-api-types/v10'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CronContext, InteractionContext } from './context'
import type { AutocompleteContext, CommandContext, ComponentContext, ModalContext } from './types'
import { ResponseObject } from './utils'

describe('Context', () => {
  const mockRequest = new Request('https://example.com')
  const mockEnv = { DISCORD_TOKEN: 'mock-token', DISCORD_APPLICATION_ID: 'mock-app-id' }
  const mockWaitUntil = vi.fn()
  const mockExecutionCtx = { waitUntil: mockWaitUntil, passThroughOnException: vi.fn() }
  const mockDiscordEnv = { TOKEN: 'mock-token', APPLICATION_ID: 'mock-app-id' }
  const mockCronEvent = { cron: '* * * * *', type: 'cron', scheduledTime: 0 }
  const mockFetchEvent = {
    request: mockRequest,
    respondWith: vi.fn(),
    ...mockExecutionCtx,
  }

  describe('ContextAll', () => {
    it('should store getters', async () => {
      const c = new InteractionContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'key'], {} as APIInteraction)
      expect(c.env).toBe(mockEnv)
      expect(() => c.event).toThrow()
      expect(c.executionCtx).toBe(mockExecutionCtx)
      await c.executionCtx.waitUntil(Promise.resolve())
      expect(mockWaitUntil).toHaveBeenCalledWith(expect.any(Promise))
      expect(c.key).toBe('key')

      const c2 = new InteractionContext([mockEnv, mockFetchEvent, mockDiscordEnv, 'key'], {} as APIInteraction)
      expect(c2.event).toBe(mockFetchEvent)

      const c3 = new CronContext([mockEnv, undefined, mockDiscordEnv, 'key'], mockCronEvent)
      expect(() => c3.executionCtx).toThrow()
    })
  })

  it('var method', () => {
    const c = new InteractionContext<{ Variables: { key: string } }, any>(
      [mockEnv, mockExecutionCtx, mockDiscordEnv, 'key'],
      {} as APIInteraction,
    )
    c.set('key', 'value')
    expect(c.get('key')).toBe('value')
    expect(c.var.key).toBe('value')
  })

  describe('InteractionContext', () => {
    it('should store request, interaction', () => {
      const mockInteraction = { type: 2, data: { name: 'test' } } as APIInteraction
      const c = new InteractionContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'key'], mockInteraction)
      expect(c.interaction).toBe(mockInteraction)
    })

    it('should handle ephemeral responses', async () => {
      const mockInteraction = {
        type: 2,
        data: { name: 'test-command' },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'], mockInteraction)
      const response = context.ephemeral().res({ content: 'Ephemeral response' })
      expect(response).toBeInstanceOf(ResponseObject)
      expect((await response.json()).data.flags).toBe(1 << 6)
    })

    it('should handle followup responses', async () => {
      const mockInteraction = {
        type: 2,
        data: { name: 'test-command' },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'], mockInteraction)
      const response = await context.followup({ content: 'Followup response' })
      expect(response).toBeInstanceOf(Response)
    })

    it('should handle modal responses', async () => {
      const mockInteraction = {
        type: 2,
        data: { name: 'test-command' },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'], mockInteraction)
      const modalData = { custom_id: 'modal-id', title: 'Modal Title', components: [] }
      const response = context.resModal(modalData)
      expect(response).toBeInstanceOf(ResponseObject)
      expect((await response.json()).data).toEqual(modalData)
    })
  })

  describe('CommandContext', () => {
    let context: CommandContext

    beforeEach(() => {
      const mockInteraction = {
        type: 2,
        data: {
          name: 'test-command',
          options: [
            { name: 'option1', type: 3, value: 'value1' },
            { name: 'option2', type: 4, value: 42 },
          ],
        },
        token: 'mock-token',
      } as APIInteraction
      context = new InteractionContext(
        [mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'],
        mockInteraction,
      ) as CommandContext
    })

    it('should set options as variables', () => {
      expect(context.get('option1')).toBe('value1')
      expect(context.get('option2')).toBe(42)
    })

    it('should handle subcommands correctly', () => {
      const subCommandInteraction = {
        type: 2,
        data: {
          name: 'parent',
          options: [
            {
              type: 1,
              name: 'subcommand',
              options: [{ name: 'suboption', type: 3, value: 'subvalue' }],
            },
          ],
        },
        token: 'mock-token',
      } as APIInteraction
      const subContext = new InteractionContext(
        [mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'],
        subCommandInteraction,
      ) as CommandContext
      expect(subContext.sub).toEqual({ group: '', command: 'subcommand', string: 'subcommand' })
      expect(subContext.get('suboption')).toBe('subvalue')
    })
  })

  describe('ComponentContext', () => {
    it('should set custom_id as a variable', () => {
      const mockInteraction = {
        type: 3,
        data: { custom_id: 'test-custom-id' },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext(
        [mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'],
        mockInteraction,
      ) as ComponentContext
      expect(context.get('custom_id')).toBe('test-custom-id')
    })
  })

  describe('ModalContext', () => {
    it('should set modal input values as variables', () => {
      const mockInteraction = {
        type: 5,
        data: {
          custom_id: 'test-modal',
          components: [
            {
              components: [
                { custom_id: 'input1', value: 'value1' },
                { custom_id: 'input2', value: 'value2' },
              ],
            },
          ],
        },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext(
        [mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'],
        mockInteraction,
      ) as ModalContext
      expect(context.get('custom_id')).toBe('test-modal')
      expect(context.get('input1')).toBe('value1')
      expect(context.get('input2')).toBe('value2')
    })
  })

  describe('AutocompleteContext', () => {
    it('should set focused option', () => {
      const mockInteraction = {
        type: 4,
        data: {
          name: 'test-command',
          options: [
            { name: 'option1', type: 3, value: 'value1', focused: true },
            { name: 'option2', type: 4, value: 42 },
          ],
        },
        token: 'mock-token',
      } as APIInteraction
      const context = new InteractionContext(
        [mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'],
        mockInteraction,
      ) as AutocompleteContext
      expect(context.focused).toEqual({ name: 'option1', type: 3, value: 'value1', focused: true })
    })
  })

  describe('CronContext', () => {
    it('should store cron event', () => {
      const mockCronEvent = { cron: '* * * * *', type: 'cron', scheduledTime: 0 }
      const context = new CronContext([mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key'], mockCronEvent)
      expect(context.cronEvent).toEqual(mockCronEvent)
    })
  })
})
