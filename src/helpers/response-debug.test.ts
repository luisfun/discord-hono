import { describe, expect, it } from 'vitest'
import { formatResponseError, responseDebug } from './response-debug'

describe('formatResponseError', () => {
  it('formats Discord validation errors', () => {
    expect(
      formatResponseError({
        message: 'Invalid Form Body',
        code: 50_035,
        errors: {
          content: {
            _errors: [
              {
                code: 'BASE_TYPE_MAX_LENGTH',
                message: 'Must be 2000 or fewer in length.',
              },
            ],
          },
        },
      }),
    ).toBe('50035: Invalid Form Body\ncontent: Must be 2000 or fewer in length.')
  })

  it('formats nested validation errors', () => {
    expect(
      formatResponseError({
        code: 50_035,
        message: 'Invalid Form Body',
        errors: { embeds: { '0': { title: { _errors: [{ message: 'Required' }] } } } },
      }),
    ).toBe('50035: Invalid Form Body\nembeds.0.title: Required')
  })
})

describe('responseDebug', () => {
  it('uses the formatted error as message', async () => {
    const response = Response.json(
      { message: 'Invalid Form Body', code: 50_035, errors: { content: { _errors: [{ message: 'Required' }] } } },
      { status: 400 },
    )

    await expect(responseDebug(response)).resolves.toMatchObject({
      message: '50035: Invalid Form Body\ncontent: Required',
    })
  })
})
