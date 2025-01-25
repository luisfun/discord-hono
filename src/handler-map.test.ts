import { describe, it, expect, vi } from 'vitest'
import { RegExpMap, StringMap } from './handler-map'

// Mock errorDev function
vi.mock('./utils', () => ({
  errorDev: vi.fn((message: string) => new Error(message)),
}))

describe('RegExpMap', () => {
  it('should set and get handlers correctly', () => {
    const map = new RegExpMap()
    const handler = vi.fn()

    map.s(0, 'test', handler)
    expect(map.g(0, 'test')).toBe(handler)
  })

  it('should match RegExp keys', () => {
    const map = new RegExpMap()
    const handler = vi.fn()

    map.s(0, /^test/, handler)
    expect(map.g(0, 'test123')).toBe(handler)
  })

  it('should return default handler if exists', () => {
    const map = new RegExpMap()
    const defaultHandler = vi.fn()

    map.s(0, '', defaultHandler)
    expect(map.g(0, 'nonexistent')).toBe(defaultHandler)
  })

  it('should throw error if handler not found', () => {
    const map = new RegExpMap()

    expect(() => map.g(0, 'nonexistent')).toThrow('Handler')
  })
})

describe('StringMap', () => {
  it('should set and get handlers correctly', () => {
    const map = new StringMap()
    const handler = vi.fn()

    map.s(0, 'test', handler)
    expect(map.g(0, 'test')).toBe(handler)
  })

  it('should return default handler if exists', () => {
    const map = new StringMap()
    const defaultHandler = vi.fn()

    map.s(0, '', defaultHandler)
    expect(map.g(0, 'nonexistent')).toBe(defaultHandler)
  })

  it('should throw error if handler not found', () => {
    const map = new StringMap()

    expect(() => map.g(0, 'nonexistent')).toThrow('Handler')
  })
})
