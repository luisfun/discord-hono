import { Button, Command, Modal } from '../builders'
import { DiscordHono } from '../discord-hono'
import { createFactory } from './create-factory'

describe('createFactory', () => {
  const factory = createFactory()

  it('should create a DiscordHono instance', () => {
    const discord = factory.discord()
    expect(discord).toBeInstanceOf(DiscordHono)
  })

  it('should create a command wrapper', () => {
    const commandMock = new Command('name', 'description')
    const handlerMock = vi.fn()
    const result = factory.command(commandMock, handlerMock)
    expect(result).toEqual({ command: commandMock, handler: handlerMock })
  })

  it('should create a component wrapper', () => {
    const componentMock = new Button('str', 'label')
    const handlerMock = vi.fn()
    const result = factory.component(componentMock, handlerMock)
    expect(result).toEqual({ component: componentMock, handler: handlerMock })
  })

  it('should create an autocomplete wrapper', () => {
    const commandMock = new Command('name', 'description')
    const autocompleteMock = vi.fn()
    const handlerMock = vi.fn()
    const result = factory.autocomplete(commandMock, autocompleteMock, handlerMock)
    expect(result).toEqual({ command: commandMock, autocomplete: autocompleteMock, handler: handlerMock })
  })

  it('should create a modal wrapper', () => {
    const modalMock = new Modal('unique_id', 'title')
    const handlerMock = vi.fn()
    const result = factory.modal(modalMock, handlerMock)
    expect(result).toEqual({ modal: modalMock, handler: handlerMock })
  })

  it('should create a cron wrapper', () => {
    const cronExpression = '0 0 * * *'
    const handlerMock = vi.fn()
    const result = factory.cron(cronExpression, handlerMock)
    expect(result).toEqual({ cron: cronExpression, handler: handlerMock })
  })

  it('should load handlers into DiscordHono instance', () => {
    const app = factory.discord()
    const commandMock = new Command('name', 'description')
    const componentMock = new Button('str', 'label')
    const modalMock = new Modal('unique_id', 'title')
    const handlerMock = vi.fn()

    const handlers = [
      factory.command(commandMock, handlerMock),
      factory.component(componentMock, handlerMock),
      factory.modal(modalMock, handlerMock),
      factory.cron('0 0 * * *', handlerMock),
    ]

    vi.spyOn(app, 'command')
    vi.spyOn(app, 'component')
    vi.spyOn(app, 'modal')
    vi.spyOn(app, 'cron')

    app.loader(handlers)

    expect(app.command).toHaveBeenCalledWith('name', handlerMock)
    expect(app.component).toHaveBeenCalledWith('str', handlerMock)
    expect(app.modal).toHaveBeenCalledWith('unique_id', handlerMock)
    expect(app.cron).toHaveBeenCalledWith('0 0 * * *', handlerMock)
  })

  it('should throw an error for unknown wrapper type', () => {
    const app = factory.discord()
    expect(() => app.loader([{ unknownProp: 'value' } as any])).toThrow('Interaction Loader Unknown Object')
  })

  it('should return a list of commands', () => {
    const commandMock = new Command('name', 'description')
    const handlers = [factory.command(commandMock, vi.fn())]
    const commands = factory.getCommands(handlers)
    expect(commands).toEqual([commandMock])
  })
})
