import { CUSTOM_ID_SEPARATOR } from '../utils'
import { Button, Components, Select } from './components'

describe('Components', () => {
  let components: Components

  beforeEach(() => {
    components = new Components()
  })

  it('should create a row with components', () => {
    const button = new Button('test', 'Click me')
    const select = new Select('select')
    components.row(button, select)
    expect(components.toJSON()).toHaveLength(1)
    expect(components.toJSON()[0].components).toHaveLength(2)
  })

  it('should warn when adding more than 5 rows', () => {
    // biome-ignore lint: empty block
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (let i = 0; i < 6; i++) {
      components.row(new Button('test', 'Click me'))
    }
    expect(consoleSpy).toHaveBeenCalledWith('You can have up to 5 Action Rows per message')
    consoleSpy.mockRestore()
  })
})

describe('Button', () => {
  it('should create a primary button', () => {
    const button = new Button('test', 'Click me')
    expect(button.toJSON()).toEqual({
      type: 2,
      label: 'Click me',
      style: 1,
      custom_id: `test${CUSTOM_ID_SEPARATOR}`,
    })
  })

  it('should create a link button', () => {
    const button = new Button('https://example.com', 'Visit', 'Link')
    expect(button.toJSON()).toEqual({
      type: 2,
      label: 'Visit',
      style: 5,
      url: 'https://example.com',
    })
  })

  it('should add an emoji', () => {
    const button = new Button('test', 'Click me').emoji('👍')
    // @ts-expect-error
    expect(button.toJSON().emoji).toEqual({ name: '👍' })
  })

  it('should set custom_id', () => {
    const button = new Button('test', 'Click me').custom_id('custom')
    // @ts-expect-error
    expect(button.toJSON().custom_id).toBe(`test${CUSTOM_ID_SEPARATOR}custom`)
  })

  it('should disable the button', () => {
    const button = new Button('test', 'Click me').disabled()
    expect(button.toJSON().disabled).toBe(true)
  })
})

describe('Select', () => {
  it('should create a string select menu', () => {
    const select = new Select('test')
    expect(select.toJSON()).toEqual({
      type: 3,
      custom_id: `test${CUSTOM_ID_SEPARATOR}`,
    })
  })

  it('should add options to string select', () => {
    const select = new Select('test').options({ label: 'Option 1', value: 'opt1' })
    // @ts-expect-error
    expect(select.toJSON().options).toEqual([{ label: 'Option 1', value: 'opt1' }])
  })

  it('should create a channel select menu', () => {
    const select = new Select('test', 'Channel')
    expect(select.toJSON()).toEqual({
      type: 8,
      custom_id: `test${CUSTOM_ID_SEPARATOR}`,
    })
  })

  it('should set channel types for channel select', () => {
    const select = new Select('test', 'Channel').channel_types(0, 1)
    // @ts-expect-error
    expect(select.toJSON().channel_types).toEqual([0, 1])
  })

  it('should set placeholder', () => {
    const select = new Select('test').placeholder('Choose an option')
    expect(select.toJSON().placeholder).toBe('Choose an option')
  })

  it('should set min and max values', () => {
    const select = new Select('test').min_values(1).max_values(3)
    expect(select.toJSON().min_values).toBe(1)
    expect(select.toJSON().max_values).toBe(3)
  })

  it('should disable the select menu', () => {
    const select = new Select('test').disabled()
    expect(select.toJSON().disabled).toBe(true)
  })
})
