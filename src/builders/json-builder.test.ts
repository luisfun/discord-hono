import { describe, expect, it } from 'vitest'
import { CUSTOM_ID_SEPARATOR } from '../utils'
import { createJsonBuilder } from './json-builder'

describe('json-builder', () => {
  it('should set values and serialize them', () => {
    const builder = createJsonBuilder<{ name: string }, { name: string; count: number }>({ name: 'test' })

    expect(builder.name('updated').count(3).toJSON()).toEqual({
      name: 'updated',
      count: 3,
    })
  })

  it('should append custom_value to custom_id', () => {
    const builder = createJsonBuilder<
      { custom_id: string },
      { custom_id: string; custom_value?: string; label: string }
    >({ custom_id: 'button' })

    expect(builder.custom_value('suffix').label('Click Me').toJSON()).toEqual({
      custom_id: `button${CUSTOM_ID_SEPARATOR}suffix`,
      label: 'Click Me',
    })
  })

  it('should append custom_value to an empty custom_id', () => {
    const builder = createJsonBuilder<
      { custom_id: string },
      { custom_id: string; custom_value?: string; label: string }
    >({ custom_id: '' })

    expect(builder.custom_value('value').label('Click Me').toJSON()).toEqual({
      custom_id: `${CUSTOM_ID_SEPARATOR}value`,
      label: 'Click Me',
    })
  })

  it('should preserve custom_id when custom_value is undefined', () => {
    const builder = createJsonBuilder<
      { custom_id: string },
      { custom_id: string; custom_value?: string; label: string }
    >({ custom_id: 'id' })

    expect(builder.label('Click Me').toJSON()).toEqual({
      custom_id: 'id',
      label: 'Click Me',
    })
  })

  it('should delete a property from the builder state', () => {
    const builder = createJsonBuilder<{ id: string; active: boolean }, { id: string; active?: boolean }>({
      id: '123',
      active: true,
    })

    expect(builder.delete('active').toJSON()).toEqual({ id: '123' })
  })

  it('should clone the builder and keep the original immutable when options.clone is true', () => {
    const builder = createJsonBuilder<{ nested: { count: number } }, { nested: { count: number } }>(
      { nested: { count: 1 } },
      { clone: true },
    )

    const cloned = builder.clone()
    cloned.nested({ count: 2 })

    expect(builder.toJSON()).toEqual({ nested: { count: 1 } })
    expect(cloned.toJSON()).toEqual({ nested: { count: 2 } })
  })

  it('should expose clone via the proxy when options.clone is false', () => {
    const builder = createJsonBuilder<{ nested: { count: number } }, { nested: { count: number } }>(
      { nested: { count: 1 } },
      { clone: false },
    )

    const cloned = builder.clone()
    cloned.nested({ count: 2 })

    expect(builder.toJSON()).toEqual({ nested: { count: 1 } })
    expect(cloned.toJSON()).toEqual({ nested: { count: 2 } })
  })

  it('should not treat then as a builder method', () => {
    const builder = createJsonBuilder<{ value: number }, { value: number }>({ value: 1 })

    expect((builder as any).then).toBeUndefined()
  })

  it('should reject reserved prototype keys in the default branch', () => {
    const builder = createJsonBuilder<{ value: number }, { value: number }>({ value: 1 })

    // @ts-expect-error Testing invalid key access
    // biome-ignore lint/suspicious/noProto: Testing invalid key access
    expect(() => builder.__proto__).toThrow(/Invalid key: __proto__/)
    expect(() => builder.constructor).toThrow(/Invalid key: constructor/)
  })

  it('should allow Object.prototype members through the default branch', () => {
    const builder = createJsonBuilder<{ value: number }, { value: number }>({ value: 1 })

    expect(typeof builder.toString).toBe('function')
    expect(builder.toString()).toBe('[object Object]')
  })
})
