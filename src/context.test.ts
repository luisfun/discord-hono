import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CronContext, InteractionContext } from './context'
import type { AutocompleteContext, CommandContext, ComponentContext, ModalContext } from './types'

describe('Context Classes', () => {
  const mockEnv = { DISCORD_TOKEN: 'mock-token', DISCORD_APPLICATION_ID: 'mock-app-id' }
  const mockExecutionCtx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() }
  const mockDiscordEnv = { TOKEN: 'mock-token', APPLICATION_ID: 'mock-app-id' }
  const mockRequest = new Request('https://example.com')

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
      }
      context = new InteractionContext(
        mockRequest,
        mockEnv,
        mockExecutionCtx,
        mockDiscordEnv,
        // @ts-expect-error
        mockInteraction,
        'test-key',
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
      }
      const subContext = new InteractionContext(
        mockRequest,
        mockEnv,
        mockExecutionCtx,
        mockDiscordEnv,
        // @ts-expect-error
        subCommandInteraction,
        'test-key',
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
      }
      const context = new InteractionContext(
        mockRequest,
        mockEnv,
        mockExecutionCtx,
        mockDiscordEnv,
        // @ts-expect-error
        mockInteraction,
        'test-key',
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
      }
      const context = new InteractionContext(
        mockRequest,
        mockEnv,
        mockExecutionCtx,
        mockDiscordEnv,
        // @ts-expect-error
        mockInteraction,
        'test-key',
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
      }
      const context = new InteractionContext(
        mockRequest,
        mockEnv,
        mockExecutionCtx,
        mockDiscordEnv,
        // @ts-expect-error
        mockInteraction,
        'test-key',
      ) as AutocompleteContext
      expect(context.focused).toEqual({ name: 'option1', type: 3, value: 'value1', focused: true })
    })
  })

  describe('CronContext', () => {
    it('should store cron event', () => {
      const mockCronEvent = { cron: '* * * * *', type: 'cron', scheduledTime: 0 }
      const context = new CronContext(mockCronEvent, mockEnv, mockExecutionCtx, mockDiscordEnv, 'test-key')
      expect(context.cronEvent).toEqual(mockCronEvent)
    })
  })
})
