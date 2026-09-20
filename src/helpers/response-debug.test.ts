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
      json: {
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
      },
      text: '{\n  "message": "Invalid Form Body",\n  "code": 50035,\n  "errors": {\n    "content": {\n      "_errors": [\n        {\n          "code": "BASE_TYPE_MAX_LENGTH",\n          "message": "Must be 2000 or fewer in length."\n        }\n      ]\n    }\n  }\n}',
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
      json: {
        code: 50_035,
        message: 'Invalid Form Body',
        errors: { embeds: { '0': { title: { _errors: [{ message: 'Required' }] } } } },
      },
      text: '{\n  "code": 50035,\n  "message": "Invalid Form Body",\n  "errors": {\n    "embeds": {\n      "0": {\n        "title": {\n          "_errors": [\n            {\n              "message": "Required"\n            }\n          ]\n        }\n      }\n    }\n  }\n}',
      message: '50035: Invalid Form Body\nembeds.0.title: Required',
    })
  })

  it('summarizes arrays when the depth limit is reached', async () => {
    const response = Response.json({ items: ['first', 'second'] })

    await expect(responseDebug(response)).resolves.toMatchObject({
      text: '{\n  "items": "[...+2]"\n}',
    })
  })

  it('preserves empty arrays', async () => {
    const response = Response.json({ items: [] })

    await expect(responseDebug(response)).resolves.toMatchObject({
      text: '{\n  "items": []\n}',
    })
  })

  it('summarizes objects when the depth limit is reached', async () => {
    const response = Response.json({ details: { first: 1, second: 2 } })

    await expect(responseDebug(response)).resolves.toMatchObject({
      text: '{\n  "details": "{...+2}"\n}',
    })
  })

  it('returns a parse error when the response body is not JSON', async () => {
    const response = new Response('not json', { status: 500 })

    await expect(responseDebug(response)).resolves.toEqual({
      json: undefined,
      text: 'JSON parse error',
      message: 'JSON parse error',
    })
  })
})
