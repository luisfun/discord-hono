import { describe, expect, it, vi } from 'vitest'
import { CUSTOM_ID_SEPARATOR } from '../utils'
import { Button, Components, Select } from './components'

describe('Components Builder', () => {
  describe('Components', () => {
    it('should create empty component list', () => {
      const components = new Components()
      expect(components.toJSON()).toEqual([])
    })

    it('should add a row with a button', () => {
      const components = new Components()
      const button = new Button('test_button', 'Click Me')

      components.row(button)

      expect(components.toJSON()).toEqual([
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Click Me',
              style: 1,
              custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
            },
          ],
        },
      ])
    })

    it('should add multiple rows', () => {
      const components = new Components()
      const button1 = new Button('button1', 'First')
      const button2 = new Button('button2', 'Second')

      components.row(button1).row(button2)

      expect(components.toJSON()).toHaveLength(2)
    })

    it('should warn when adding more than 5 action rows', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const components = new Components()

      // Add 6 rows
      for (let i = 0; i < 6; i++) {
        components.row(new Button(`button${i}`, `Button ${i}`))
      }

      expect(consoleSpy).toHaveBeenCalledWith('You can have up to 5 Action Rows per message')
      consoleSpy.mockRestore()
    })
  })

  describe('Button', () => {
    it('should create a primary button', () => {
      const button = new Button('test_button', 'Click Me')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
      })
    })

    it('should create a secondary button', () => {
      const button = new Button('test_button', 'Click Me', 'Secondary')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 2,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
      })
    })

    it('should create a link button', () => {
      const button = new Button('https://example.com', 'Visit Website', 'Link')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Visit Website',
        style: 5,
        url: 'https://example.com',
      })
    })

    it('should create a SKU button', () => {
      const button = new Button('sku_123', '', 'SKU')

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 6,
        sku_id: 'sku_123',
      })
    })

    it('should add emoji to button', () => {
      const button = new Button('test_button', 'Click Me').emoji('👍')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
        emoji: { name: '👍' },
      })
    })

    it('should create button with emoji from constructor', () => {
      const button = new Button('test_button', ['👍', 'Click Me'])

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
        emoji: { name: '👍' },
      })
    })

    it('should add custom_id suffix', () => {
      const button = new Button('test_button', 'Click Me').custom_id('suffix')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}suffix`,
      })
    })

    it('should disable a button', () => {
      const button = new Button('test_button', 'Click Me').disabled()

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Click Me',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
        disabled: true,
      })
    })

    it('should change label', () => {
      const button = new Button('test_button', 'Original').label('Changed')

      expect(button.toJSON()).toEqual({
        type: 2,
        label: 'Changed',
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}`,
      })
    })
  })

  describe('Select', () => {
    it('should create a string select menu', () => {
      const select = new Select('test_select')

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
      })
    })

    it('should create a user select menu', () => {
      const select = new Select('test_select', 'User')

      expect(select.toJSON()).toEqual({
        type: 5,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
      })
    })

    it('should add options to string select menu', () => {
      const select = new Select('test_select').options({ label: 'Option 1', value: 'option1' })

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        options: [{ label: 'Option 1', value: 'option1' }],
      })
    })

    it('should add channel types to channel select menu', () => {
      const select = new Select('test_select', 'Channel').channel_types(0, 1) // GUILD_TEXT and DM

      expect(select.toJSON()).toEqual({
        type: 8,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        channel_types: [0, 1],
      })
    })

    it('should add placeholder', () => {
      const select = new Select('test_select').placeholder('Choose an option')

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        placeholder: 'Choose an option',
      })
    })

    it('should add default values to user select menu', () => {
      const select = new Select('test_select', 'User').default_values({ id: '123456789', type: 'user' })

      expect(select.toJSON()).toEqual({
        type: 5,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        default_values: [{ id: '123456789', type: 'user' }],
      })
    })

    it('should add min and max values', () => {
      const select = new Select('test_select').min_values(1).max_values(3)

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        min_values: 1,
        max_values: 3,
      })
    })

    it('should disable a select menu', () => {
      const select = new Select('test_select').disabled()

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}`,
        disabled: true,
      })
    })

    it('should add custom_id suffix', () => {
      const select = new Select('test_select').custom_id('suffix')

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: `test_select${CUSTOM_ID_SEPARATOR}suffix`,
      })
    })
  })
})
