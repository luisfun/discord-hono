import { describe, expect, it } from 'vitest'
import { CUSTOM_ID_SEPARATOR } from '../utils'
import { makeActionRow, makeLabel, makeStringSelect, makeTextInput } from './a-component'
import { makeModal } from './a-modal'

describe('A-Modal Builder', () => {
  it('should create a modal with correct initial values', () => {
    const modal = makeModal('test', 'Test Modal', [])

    expect(modal.toJSON()).toEqual({
      title: 'Test Modal',
      custom_id: 'test',
      components: [],
    })
  })

  it('should add custom_id suffix', () => {
    const modal = makeModal('test', 'Test Modal', []).custom_value('newId')

    expect(modal.toJSON()).toEqual({
      title: 'Test Modal',
      custom_id: `test${CUSTOM_ID_SEPARATOR}newId`,
      components: [],
    })
  })

  it('should create a modal with action row and label components', () => {
    const modal = makeModal('test', 'Test Modal', [
      makeActionRow([makeTextInput('name', 'Your Name')]),
      makeLabel(
        'Favorite color',
        makeStringSelect('color', [
          ['red', 'Red'],
          ['blue', 'Blue'],
        ]),
      ),
    ])

    expect(modal.toJSON()).toEqual({
      title: 'Test Modal',
      custom_id: 'test',
      components: [
        {
          type: 1,
          components: [{ type: 4, custom_id: 'name', style: 1, label: 'Your Name' }],
        },
        {
          type: 18,
          label: 'Favorite color',
          component: {
            type: 3,
            custom_id: 'color',
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Blue', value: 'blue' },
            ],
          },
        },
      ],
    })
  })

  it('should update title and replace components via builder methods', () => {
    const modal = makeModal('test', 'Test Modal', [makeActionRow([makeTextInput('name', 'Your Name')])])
      .title('New Title')
      .components([
        makeLabel(
          'Favorite color',
          makeStringSelect('color', [
            ['red', 'Red'],
            ['blue', 'Blue'],
          ]),
        ),
      ])

    expect(modal.toJSON()).toEqual({
      title: 'New Title',
      custom_id: 'test',
      components: [
        {
          type: 18,
          label: 'Favorite color',
          component: {
            type: 3,
            custom_id: 'color',
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Blue', value: 'blue' },
            ],
          },
        },
      ],
    })
  })
})
