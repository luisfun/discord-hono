import { describe, expect, it } from 'vitest'
import { CUSTOM_ID_SEPARATOR } from '../utils'
import { makeActionRow, makeButton } from './a-component'

describe('JsonBuilder', () => {
  it('joins custom values without dropping empty suffixes', () => {
    const button = makeButton('id', 'Click Me').custom_value('')
    expect(button.toJSON()).toMatchObject({
      custom_id: `id${CUSTOM_ID_SEPARATOR}`,
      label: 'Click Me',
    })
  })

  it('serializes custom_id alone and appends separator plus custom_value when present', () => {
    const button = makeButton('id', 'Click Me')
    expect(button.toJSON().custom_id).toBe('id')
    expect(button.custom_value('suffix').toJSON().custom_id).toBe(`id${CUSTOM_ID_SEPARATOR}suffix`)
  })

  it('supports chaining, cloning, and nested builder serialization', () => {
    const row = makeActionRow([makeButton('row-button', 'Go')])
    const clone = row.clone()
    expect(row.toJSON()).toEqual({
      type: 1,
      components: [{ type: 2, style: 1, custom_id: 'row-button', label: 'Go' }],
    })
    expect(clone.toJSON()).toEqual(row.toJSON())
    expect(clone.toJSON()).not.toBe(row.toJSON())
  })

  it('throws when a custom id or value contains the routing separator', () => {
    expect(() => makeButton(`base${CUSTOM_ID_SEPARATOR}bad` as string, 'Click')).toThrow(
      `Don't use "${CUSTOM_ID_SEPARATOR}"`,
    )
    expect(() => makeButton('base', 'Click').custom_value(`bad${CUSTOM_ID_SEPARATOR}value`).toJSON()).toThrow(
      `Don't use "${CUSTOM_ID_SEPARATOR}"`,
    )
  })
})
