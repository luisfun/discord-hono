import { describe, expect, it, vi } from 'vitest'

import { $interactions$_$_$callback } from '../rest'
import type { CommandContext } from '../types'
import { callbackModal, res202 } from './interaction-callback'

describe('res202', () => {
  it('returns a 202 response and schedules the handler with the context', () => {
    const waitUntil = vi.fn()
    const context = {
      executionCtx: { waitUntil },
    } as unknown as CommandContext
    const handlerPromise = Promise.resolve('done')
    const handler = vi.fn().mockReturnValue(handlerPromise)

    const response = res202(context, handler)

    expect(response.status).toBe(202)
    expect(response.body).toBeNull()
    expect(handler).toHaveBeenCalledWith(context)
    expect(waitUntil).toHaveBeenCalledWith(handlerPromise)
  })

  it('does not schedule a handler when either argument is missing', () => {
    const waitUntil = vi.fn()
    const context = {
      executionCtx: { waitUntil },
    } as unknown as CommandContext
    const handler = vi.fn()

    expect(res202(context).status).toBe(202)
    expect(res202(undefined, handler).status).toBe(202)
    expect(waitUntil).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('callbackModal', () => {
  it('posts the serialized modal callback data for the interaction', async () => {
    const serializedData = {
      custom_id: 'feedback',
      title: 'Feedback',
      components: [],
    }
    const data = { toJSON: vi.fn(() => serializedData) }
    const response = Promise.resolve(new Response(null))
    const rest = vi.fn().mockReturnValue(response)
    const context = {
      interaction: { id: 'interaction-id', token: 'interaction-token' },
      rest,
    } as unknown as CommandContext

    await expect(callbackModal(context, data)).resolves.toBe(await response)

    expect(data.toJSON).toHaveBeenCalledOnce()
    expect(rest).toHaveBeenCalledWith('POST', $interactions$_$_$callback, ['interaction-id', 'interaction-token'], {
      type: 9,
      data: serializedData,
    })
  })
})
