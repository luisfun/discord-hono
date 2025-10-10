import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { Components, Embed } from '.'
import { formData, messageFlags, newError, prepareData, queryStringify, toJSON } from './utils'

describe('toJSON function', () => {
  it('should return the result of toJSON method if it exists', () => {
    const obj = {
      toJSON: () => ({ custom: 'json' }),
    }
    expect(toJSON(obj)).toEqual({ custom: 'json' })
  })

  it('should return the object itself if toJSON method does not exist', () => {
    const obj = { key: 'value' }
    expect(toJSON(obj)).toEqual(obj)
  })

  it('should return the object itself if toJSON is not a function', () => {
    const obj = {
      toJSON: 'not a function',
    }
    expect(toJSON(obj)).toEqual(obj)
  })

  it('should handle empty objects', () => {
    const obj = {}
    expect(toJSON(obj)).toEqual({})
  })

  it('should handle objects with nested properties', () => {
    const obj = {
      nested: {
        toJSON: () => ({ custom: 'nested json' }),
      },
    }
    expect(toJSON(obj)).toEqual(obj)
  })
})

describe('prepareData', () => {
  it('should handle string input', () => {
    const input = 'test string'
    const result = prepareData(input)
    expect(result).toEqual({ content: 'test string' })
  })

  it('should handle object input without components or embeds', () => {
    const input = { someKey: 'someValue' }
    const result = prepareData(input)
    expect(result).toEqual(input)
  })

  it('should handle object input with both components and embeds', () => {
    const input = {
      components: new Components(),
      embeds: [new Embed()],
    }
    const result = prepareData(input)
    expect(result).toEqual({
      components: [],
      embeds: [{}],
    })
  })
})

describe('formData function', () => {
  let appendSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    appendSpy = vi.fn()
    vi.stubGlobal(
      'FormData',
      vi.fn(() => ({
        append: appendSpy,
      })),
    )
  })

  it('should create FormData with payload_json when data is provided', () => {
    const mockData = { key: 'value' }
    formData(mockData)

    expect(appendSpy).toHaveBeenCalledWith('payload_json', JSON.stringify(mockData))
  })

  it('should not append payload_json when data is empty', () => {
    formData({})

    expect(appendSpy).not.toHaveBeenCalledWith('payload_json', expect.any(String))
  })

  it('should append single file when file object is provided', () => {
    const mockFile = { blob: new Blob(), name: 'test.txt' }
    formData(undefined, mockFile)

    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFile.blob, mockFile.name)
  })

  it('should append multiple files when file array is provided', () => {
    const mockFiles = [
      { blob: new Blob(), name: 'test1.txt' },
      { blob: new Blob(), name: 'test2.txt' },
    ]
    formData(undefined, mockFiles)

    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFiles[0]?.blob, mockFiles[0]?.name)
    expect(appendSpy).toHaveBeenCalledWith('files[1]', mockFiles[1]?.blob, mockFiles[1]?.name)
  })

  it('should handle both data and file', () => {
    const mockData = { key: 'value' }
    const mockFile = { blob: new Blob(), name: 'test.txt' }
    formData(mockData, mockFile)

    expect(appendSpy).toHaveBeenCalledWith('payload_json', JSON.stringify(mockData))
    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFile.blob, mockFile.name)
  })
})

test('newError function', () => {
  const e = newError('locate', 'text')
  expect(e).toBeInstanceOf(Error)
  expect(e.message).toBe('discord-hono(locate): text')
})

describe('queryStringify', () => {
  it('should return empty string when query is undefined', () => {
    expect(queryStringify(undefined)).toBe('')
  })

  it('should convert simple key-value pairs to query string', () => {
    const query = { key1: 'value1', key2: 'value2' }
    expect(queryStringify(query)).toBe('?key1=value1&key2=value2')
  })

  it('should handle numeric values', () => {
    const query = { limit: 10, offset: 20 }
    expect(queryStringify(query)).toBe('?limit=10&offset=20')
  })

  it('should handle boolean values', () => {
    const query = { active: true, deleted: false }
    expect(queryStringify(query)).toBe('?active=true&deleted=false')
  })

  it('should ignore undefined values', () => {
    const query = { key1: 'value1', key2: undefined, key3: 'value3' }
    expect(queryStringify(query)).toBe('?key1=value1&key3=value3')
  })

  it('should encode special characters properly', () => {
    const query = { search: 'hello world', filter: 'category=books' }
    expect(queryStringify(query)).toBe('?search=hello+world&filter=category%3Dbooks')
  })

  it('should handle empty object', () => {
    expect(queryStringify({})).toBe('?')
  })
})

describe('messageFlags', () => {
  it('should return 0 when no flags are provided', () => {
    // 何も指定しない場合は 0
    expect(messageFlags()).toBe(0)
  })

  it('should return correct value for single flag', () => {
    // 各フラグ単体
    expect(messageFlags('SUPPRESS_EMBEDS')).toBe(1 << 2)
    expect(messageFlags('EPHEMERAL')).toBe(1 << 6)
    expect(messageFlags('SUPPRESS_NOTIFICATIONS')).toBe(1 << 12)
    expect(messageFlags('IS_COMPONENTS_V2')).toBe(1 << 15)
  })

  it('should combine multiple flags using bitwise OR', () => {
    // 複数フラグの組み合わせ
    expect(messageFlags('SUPPRESS_EMBEDS', 'EPHEMERAL')).toBe((1 << 2) | (1 << 6))
    expect(messageFlags('SUPPRESS_EMBEDS', 'SUPPRESS_NOTIFICATIONS', 'IS_COMPONENTS_V2')).toBe(
      (1 << 2) | (1 << 12) | (1 << 15),
    )
  })
})
