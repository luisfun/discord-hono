import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formData } from '../utils'
import { webhook } from './webhook'

// モックの設定
vi.mock('../utils', async importOriginal => {
  const actual = await importOriginal<typeof import('../utils')>()
  return {
    ...actual,
    formData: vi.fn((data, file) => `mocked-form-data-${JSON.stringify(data)}-${JSON.stringify(file)}`),
    prepareData: vi.fn(data => ({ ...data, prepared: true })),
  }
})

describe('webhook', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok'))
  })

  afterEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = originalFetch
  })

  it('should make a POST request with JSON body when no file is provided', async () => {
    const url = 'https://discord.com/api/webhooks/123/abc'
    const data = { content: 'Hello, world!' }

    await webhook(url, data)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(`${url}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, prepared: true }),
    })
  })

  it('should make a POST request with form data when file is provided', async () => {
    const url = 'https://discord.com/api/webhooks/123/abc'
    const data = { content: 'Hello with file!' }
    const file = { blob: new Blob(['test file content']), name: 'test.txt' }

    await webhook(url, data, file)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(`${url}`, {
      method: 'POST',
      headers: {},
      body: `mocked-form-data-${JSON.stringify({ ...data, prepared: true })}-${JSON.stringify(file)}`,
    })
    expect(formData).toHaveBeenCalledWith({ ...data, prepared: true }, file)
  })

  it('should handle query parameters correctly', async () => {
    const url = 'https://discord.com/api/webhooks/123/abc'
    const data = {
      content: 'Hello, world!',
    }

    await webhook([url, { wait: true, thread_id: '456' }], data)

    //expect(queryStringify).toHaveBeenCalledWith(data.query)
    expect(globalThis.fetch).toHaveBeenCalledWith(`${url}?wait=true&thread_id=456`, expect.any(Object))
  })

  it('should handle array of files correctly', async () => {
    const url = 'https://discord.com/api/webhooks/123/abc'
    const data = { content: 'Multiple files' }
    const files = [
      { blob: new Blob(['file1']), name: 'file1.txt' },
      { blob: new Blob(['file2']), name: 'file2.txt' },
    ]

    await webhook(url, data, files)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(formData).toHaveBeenCalledWith({ ...data, prepared: true }, files)
  })
})
