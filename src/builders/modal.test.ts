import { CUSTOM_ID_SEPARATOR } from '../utils'
import { Modal, TextInput } from './modal'

describe('Modal', () => {
  it('should create a modal with correct initial values', () => {
    const modal = new Modal('test', 'Test Modal')
    expect(modal.toJSON()).toEqual({
      title: 'Test Modal',
      custom_id: `test${CUSTOM_ID_SEPARATOR}`,
      components: [],
    })
  })

  it('should throw an error if unique_id contains separator', () => {
    expect(() => new Modal(`test${CUSTOM_ID_SEPARATOR}id`, 'Test')).toThrow(`Don't use "${CUSTOM_ID_SEPARATOR}"`)
  })

  it('should update custom_id', () => {
    const modal = new Modal('test', 'Test Modal')
    modal.custom_id('newId')
    expect(modal.toJSON().custom_id).toBe(`test${CUSTOM_ID_SEPARATOR}newId`)
  })

  it('should add text input components', () => {
    const modal = new Modal('test', 'Test Modal')
    const textInput = new TextInput('input1', 'Input 1')
    modal.row(textInput)
    expect(modal.toJSON().components).toHaveLength(1)
    expect(modal.toJSON().components[0].components).toHaveLength(1)
  })

  it('should update title', () => {
    const modal = new Modal('test', 'Test Modal')
    modal.title('New Title')
    expect(modal.toJSON().title).toBe('New Title')
  })
})

describe('TextInput', () => {
  it('should create a text input with correct initial values', () => {
    const textInput = new TextInput('input1', 'Input 1')
    expect(textInput.toJSON()).toEqual({
      type: 4,
      custom_id: 'input1',
      label: 'Input 1',
      style: 1,
    })
  })

  it('should set multi-line style', () => {
    const textInput = new TextInput('input1', 'Input 1', 'Multi')
    expect(textInput.toJSON().style).toBe(2)
  })

  it('should set min_length', () => {
    const textInput = new TextInput('input1', 'Input 1')
    textInput.min_length(5)
    expect(textInput.toJSON().min_length).toBe(5)
  })

  it('should set max_length', () => {
    const textInput = new TextInput('input1', 'Input 1')
    textInput.max_length(100)
    expect(textInput.toJSON().max_length).toBe(100)
  })

  it('should set required', () => {
    const textInput = new TextInput('input1', 'Input 1')
    textInput.required()
    expect(textInput.toJSON().required).toBe(true)
  })

  it('should set value', () => {
    const textInput = new TextInput('input1', 'Input 1')
    textInput.value('Default value')
    expect(textInput.toJSON().value).toBe('Default value')
  })

  it('should set placeholder', () => {
    const textInput = new TextInput('input1', 'Input 1')
    textInput.placeholder('Enter text here')
    expect(textInput.toJSON().placeholder).toBe('Enter text here')
  })
})
