import { describe, expect, it } from 'vitest'
import { CUSTOM_ID_SEPARATOR } from '../utils'
import {
  makeActionRow,
  makeButton,
  makeChannelSelect,
  makeCheckbox,
  makeCheckboxGroup,
  makeContainer,
  makeFile,
  makeFileUpload,
  makeLabel,
  makeLinkButton,
  makeMediaGallery,
  makeMentionableSelect,
  makePremiumButton,
  makeRadioGroup,
  makeRoleSelect,
  makeSection,
  makeSeparator,
  makeStringSelect,
  makeStringSelectOption,
  makeTextDisplay,
  makeTextInput,
  makeThumbnail,
  makeUserSelect,
} from './a-component'

describe('A-Component Builder', () => {
  describe('ActionRow', () => {
    it('should create an action row with button components', () => {
      const actionRow = makeActionRow([makeButton('test_button', 'Click Me'), makeButton('test_button_2', 'Next')])

      expect(actionRow.toJSON()).toEqual({
        type: 1,
        components: [
          { type: 2, style: 1, custom_id: 'test_button', label: 'Click Me' },
          { type: 2, style: 1, custom_id: 'test_button_2', label: 'Next' },
        ],
      })
    })
  })

  describe('Button', () => {
    it('should create a primary button', () => {
      const button = makeButton('test_button', 'Click Me')

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 1,
        custom_id: 'test_button',
        label: 'Click Me',
      })
    })

    it('should create a link button', () => {
      const button = makeLinkButton('https://example.com', 'Visit Website')

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 5,
        url: 'https://example.com',
        label: 'Visit Website',
      })
    })

    it('should create a button with emoji label', () => {
      const button = makeButton('test_button', ['🔥', 'Button'])

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 1,
        custom_id: 'test_button',
        label: 'Button',
        emoji: { name: '🔥' },
      })
    })

    it('should create a premium button', () => {
      const button = makePremiumButton('sku_123')

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 6,
        sku_id: 'sku_123',
      })
    })

    it('should add custom_id suffix', () => {
      const button = makeButton('test_button', 'Click Me').custom_value('suffix')

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 1,
        custom_id: `test_button${CUSTOM_ID_SEPARATOR}suffix`,
        label: 'Click Me',
      })
    })
  })

  describe('Link Button', () => {
    it('should create a link button with emoji label', () => {
      const button = makeLinkButton('https://example.com', ['🔥', 'Link'])

      expect(button.toJSON()).toEqual({
        type: 2,
        style: 5,
        url: 'https://example.com',
        label: 'Link',
        emoji: { name: '🔥' },
      })
    })
  })

  describe('Select', () => {
    it('should create a string select option', () => {
      const option = makeStringSelectOption('option1', 'Option 1')

      expect(option.toJSON()).toEqual({
        label: 'Option 1',
        value: 'option1',
      })
    })

    it('should create a string select menu', () => {
      const select = makeStringSelect('test_select', [
        ['option1', 'Option 1'],
        ['option2', ['👍', 'Option 2']],
      ])

      expect(select.toJSON()).toEqual({
        type: 3,
        custom_id: 'test_select',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2', emoji: { name: '👍' } },
        ],
      })
    })

    it('should create a user select menu', () => {
      const select = makeUserSelect('test_select')

      expect(select.toJSON()).toEqual({
        type: 5,
        custom_id: 'test_select',
      })
    })

    it('should create a role select menu', () => {
      const select = makeRoleSelect('test_select')

      expect(select.toJSON()).toEqual({
        type: 6,
        custom_id: 'test_select',
      })
    })

    it('should create a mentionable select menu', () => {
      const select = makeMentionableSelect('test_select')

      expect(select.toJSON()).toEqual({
        type: 7,
        custom_id: 'test_select',
      })
    })

    it('should create a channel select menu', () => {
      const select = makeChannelSelect('test_select')

      expect(select.toJSON()).toEqual({
        type: 8,
        custom_id: 'test_select',
      })
    })
  })

  describe('TextInput', () => {
    it('should create a short text input', () => {
      const textInput = makeTextInput('test_input', 'Question')

      expect(textInput.toJSON()).toEqual({
        type: 4,
        custom_id: 'test_input',
        style: 1,
        label: 'Question',
      })
    })

    it('should create a paragraph text input', () => {
      const textInput = makeTextInput('test_input', 'Details', 2)

      expect(textInput.toJSON()).toEqual({
        type: 4,
        custom_id: 'test_input',
        style: 2,
        label: 'Details',
      })
    })
  })

  describe('Section and Content', () => {
    it('should create a section with text display and accessory button', () => {
      const section = makeSection([makeTextDisplay('Hello world')], makeButton('btn1', 'Open'))

      expect(section.toJSON()).toEqual({
        type: 9,
        components: [{ type: 10, content: 'Hello world' }],
        accessory: { type: 2, style: 1, custom_id: 'btn1', label: 'Open' },
      })
    })

    it('should create a text display', () => {
      const textDisplay = makeTextDisplay('Hello, world!')

      expect(textDisplay.toJSON()).toEqual({
        type: 10,
        content: 'Hello, world!',
      })
    })

    it('should create a thumbnail', () => {
      const thumbnail = makeThumbnail('attachment://image.png')

      expect(thumbnail.toJSON()).toEqual({
        type: 11,
        media: { url: 'attachment://image.png' },
      })
    })

    it('should create a media gallery from urls', () => {
      const gallery = makeMediaGallery(['https://example.com/image1.png', 'https://example.com/image2.png'])

      expect(gallery.toJSON()).toEqual({
        type: 12,
        items: [
          { media: { url: 'https://example.com/image1.png' } },
          { media: { url: 'https://example.com/image2.png' } },
        ],
      })
    })

    it('should create a file component', () => {
      const file = makeFile('attachment://document.pdf')

      expect(file.toJSON()).toEqual({
        type: 13,
        file: { url: 'attachment://document.pdf' },
      })
    })
  })

  describe('Separator and Container', () => {
    it('should create a separator', () => {
      const separator = makeSeparator()

      expect(separator.toJSON()).toEqual({
        type: 14,
      })
    })

    it('should create a container with nested components', () => {
      const container = makeContainer([
        makeActionRow([makeButton('btn1', 'First')]),
        makeSection([makeTextDisplay('Body')], makeButton('btn2', 'Second')),
      ])

      expect(container.toJSON()).toEqual({
        type: 17,
        components: [
          { type: 1, components: [{ type: 2, style: 1, custom_id: 'btn1', label: 'First' }] },
          {
            type: 9,
            components: [{ type: 10, content: 'Body' }],
            accessory: { type: 2, style: 1, custom_id: 'btn2', label: 'Second' },
          },
        ],
      })
    })
  })

  describe('Label, Upload, Radio, Checkbox', () => {
    it('should create a label component', () => {
      const label = makeLabel('Label', makeTextInput('test_input', 'Name'))

      expect(label.toJSON()).toEqual({
        type: 18,
        label: 'Label',
        component: {
          type: 4,
          custom_id: 'test_input',
          style: 1,
          label: 'Name',
        },
      })
    })

    it('should create a file upload component', () => {
      const upload = makeFileUpload('upload_input')

      expect(upload.toJSON()).toEqual({
        type: 19,
        custom_id: 'upload_input',
      })
    })

    it('should create a radio group', () => {
      const radioGroup = makeRadioGroup('radio_group', [
        ['value1', 'Option 1'],
        ['value2', 'Option 2'],
      ])

      expect(radioGroup.toJSON()).toEqual({
        type: 21,
        custom_id: 'radio_group',
        options: [
          { label: 'Option 1', value: 'value1' },
          { label: 'Option 2', value: 'value2' },
        ],
      })
    })

    it('should create a checkbox group', () => {
      const checkboxGroup = makeCheckboxGroup('checkbox_group', [
        ['value1', 'Option 1'],
        ['value2', 'Option 2'],
      ])

      expect(checkboxGroup.toJSON()).toEqual({
        type: 22,
        custom_id: 'checkbox_group',
        options: [
          { label: 'Option 1', value: 'value1' },
          { label: 'Option 2', value: 'value2' },
        ],
      })
    })

    it('should create a checkbox', () => {
      const checkbox = makeCheckbox('checkbox')

      expect(checkbox.toJSON()).toEqual({
        type: 23,
        custom_id: 'checkbox',
      })
    })
  })
})
