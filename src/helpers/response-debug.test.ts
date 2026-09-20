import { describe, expect, it } from 'vitest'
import { responseDebug } from './response-debug'

describe('responseDebug', () => {
  const createErrorResponse = (body: object): Response =>
    new Response(JSON.stringify(body), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })

  it('formats Discord validation errors as a message', async () => {
    const response = createErrorResponse({
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
    })

    await expect(responseDebug(response)).resolves.toMatchObject({
      message: '50035: Invalid Form Body\ncontent: Must be 2000 or fewer in length.',
    })
  })

  it('formats nested validation errors as a message', async () => {
    const response = createErrorResponse({
      code: 50_035,
      message: 'Invalid Form Body',
      errors: { embeds: { '0': { title: { _errors: [{ message: 'Required' }] } } } },
    })

    await expect(responseDebug(response)).resolves.toMatchObject({
      message: '50035: Invalid Form Body\nembeds.0.title: Required',
    })
  })
})
