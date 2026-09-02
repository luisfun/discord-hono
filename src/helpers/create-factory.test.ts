import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import {
  makeActionRow,
  makeButton,
  makeChannelSelect,
  makeLabel,
  makeModal,
  makeSlashCommand,
  makeStringOption,
  makeSubCommand,
  makeTextInput,
} from '../builders'
import { DiscordHono } from '../discord-hono'
import { toJSON } from '../utils'
import { createFactory } from './create-factory'

describe('createFactory', () => {
  const factory = createFactory()

  it('should create a DiscordHono instance', () => {
    const discord = factory.discord()
    expect(discord).toBeInstanceOf(DiscordHono)
  })

  it('should create a command wrapper', () => {
    const commandMock = makeSlashCommand('name', 'description')
    const handlerMock = vi.fn()
    const result = factory.command(commandMock, handlerMock)
    expect(result).toEqual({ command: commandMock, handler: handlerMock })
  })

  it('should create a subcommand wrapper with inferred Variables', () => {
    const subCommandMock = makeSubCommand('sub', 'A subcommand').options([
      makeStringOption('text', 'A string option').required(true),
    ])

    const result = factory.subCommand(subCommandMock, c => {
      expectTypeOf(c.var.text).toEqualTypeOf<string>()
      return c.res(`text: ${c.var.text}`)
    })

    expect(result.subCommand).toEqual(subCommandMock)
    expect(result.handler).toBeInstanceOf(Function)
  })

  it('should accept JsonSerializable commands while preserving Variables typing', () => {
    const commandJson = {
      name: 'echo',
      description: 'echo command',
      options: [{ type: 3, name: 'text', description: 'text option', required: true }],
    } as const satisfies RESTPostAPIApplicationCommandsJSONBody

    const result = factory.command(commandJson, c => {
      expectTypeOf(c.var.text).toEqualTypeOf<string>()
      return c.res('ok')
    })

    expect(result.command).toEqual(commandJson)
  })

  it('should infer Variables from command option names', () => {
    const result = factory.command(
      makeSlashCommand('test2', 'Another test command').options([
        makeStringOption('text', 'A string option').required(true),
      ]),
      c => {
        expectTypeOf(c.var.text).toEqualTypeOf<string>()
        return c.res(`text: ${c.var.text}`)
      },
    )

    expect(toJSON(result.command).name).toBe('test2')
  })

  it('should infer Variables from nested subcommand option names', () => {
    const result = factory.command(
      makeSlashCommand('test2', 'Another test command').options([
        makeSubCommand('sub1', 'A subcommand').options([makeStringOption('text', 'A string option').required(true)]),
      ]),
      c => {
        expectTypeOf(c.var.text).toEqualTypeOf<string>()
        return c.res(`text: ${c.var.text}`)
      },
    )

    expect(toJSON(result.command).name).toBe('test2')
  })

  it('should create a component wrapper', () => {
    const componentMock = makeButton('str', 'label')
    const handlerMock = vi.fn()
    const result = factory.component(componentMock, handlerMock)
    expect(result).toEqual({ component: componentMock, handler: handlerMock })
  })

  it('should create an autocomplete wrapper', () => {
    const commandMock = makeSlashCommand('name', 'description')
    const autocompleteMock = vi.fn()
    const handlerMock = vi.fn()
    const result = factory.autocomplete(commandMock, autocompleteMock, handlerMock)
    expect(result).toEqual({ command: commandMock, autocomplete: autocompleteMock, handler: handlerMock })
  })

  it('should create a modal wrapper', () => {
    const modalMock = makeModal('unique_id', 'title', [])
    const handlerMock = vi.fn()
    const result = factory.modal(modalMock, handlerMock)
    expect(result).toEqual({ modal: modalMock, handler: handlerMock })
  })

  it('should infer Variables from modal input ids', () => {
    const result = factory.modal(
      makeModal('testModal', 'A test modal', [
        makeActionRow([makeTextInput('text', 'A text input').required(true)]),
        makeLabel('label1', makeChannelSelect('channel').required(true)),
      ]),
      c => {
        expectTypeOf(c.var.text).toEqualTypeOf<string>()
        expectTypeOf(c.var.channel).toEqualTypeOf<string[]>()
        return c.res(`text: ${c.var.text}, channel: ${c.var.channel}`)
      },
    )

    expect(toJSON(result.modal).custom_id).toBe('testModal')
  })

  it('should create a cron wrapper', () => {
    const cronExpression = '0 0 * * *'
    const handlerMock = vi.fn()
    const result = factory.cron(cronExpression, handlerMock)
    expect(result).toEqual({ cron: cronExpression, handler: handlerMock })
  })

  it('should load handlers into DiscordHono instance', () => {
    const app = factory.discord()
    const commandMock = makeSlashCommand('name', 'description')
    const componentMock = makeButton('str', 'label')
    const modalMock = makeModal('unique_id', 'title', [])
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
    expect(() => app.loader([{ unknownProp: 'value' } as any])).toThrow()
  })

  it('should return a list of commands', () => {
    const commandMock = makeSlashCommand('name', 'description')
    const handlers = [factory.command(commandMock, vi.fn())]
    const commands = factory.getCommands(handlers)
    expect(commands).toEqual([commandMock])
  })
})
