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
  makeSubCommandGroup,
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
    const autocompleteCommandMock = makeSlashCommand('autocomplete', 'description').options([
      makeStringOption('text', 'text').required(true),
    ])
    const componentMock = makeButton('str', 'label')
    const modalMock = makeModal('unique_id', 'title', [])
    const handlerMock = vi.fn()
    const autocompleteMock = vi.fn()

    const handlers = [
      factory.command(commandMock, handlerMock),
      factory.autocomplete(autocompleteCommandMock, autocompleteMock, handlerMock),
      factory.component(componentMock, handlerMock),
      factory.modal(modalMock, handlerMock),
      factory.cron('0 0 * * *', handlerMock),
    ]

    vi.spyOn(app, 'command')
    vi.spyOn(app, 'autocomplete')
    vi.spyOn(app, 'component')
    vi.spyOn(app, 'modal')
    vi.spyOn(app, 'cron')

    app.loader(handlers)

    expect(app.command).toHaveBeenCalledWith('name', handlerMock)
    expect(app.autocomplete).toHaveBeenCalledWith('autocomplete', autocompleteMock)
    expect(app.component).toHaveBeenCalledWith('str', handlerMock)
    expect(app.modal).toHaveBeenCalledWith('unique_id', handlerMock)
    expect(app.cron).toHaveBeenCalledWith('0 0 * * *', handlerMock)
  })

  it('should route subcommands using Object.values and invoke the fallback handler when unmatched', async () => {
    const handlers = {
      ping: factory.subCommand(
        makeSubCommand('ping', 'Ping the bot'),
        vi.fn(() => Response.json({ ok: 'ping' })),
      ),
      admin: factory.subCommandGroup(
        makeSubCommandGroup('admin', 'Admin commands').options([makeSubCommand('status', 'Display admin status')]),
        vi.fn(() => Response.json({ ok: 'admin' })),
      ),
    }

    const defaultHandler = vi.fn(c => Response.json({ error: `Subcommand not found: ${c.sub.command}` }))
    const loader = factory.subLoader(Object.values(handlers), defaultHandler)

    const commandResponse = await loader({ sub: { command: 'ping', group: undefined } } as any)
    expect(handlers.ping.handler).toHaveBeenCalledTimes(1)
    expect(defaultHandler).not.toHaveBeenCalled()
    expect(await commandResponse.json()).toEqual({ ok: 'ping' })

    const groupResponse = await loader({ sub: { command: 'status', group: 'admin' } } as any)
    expect(handlers.admin.handler).toHaveBeenCalledTimes(1)
    expect(await groupResponse.json()).toEqual({ ok: 'admin' })

    const unmatched = await loader({ sub: { command: 'missing', group: undefined } } as any)
    expect(defaultHandler).toHaveBeenCalledTimes(1)
    expect(await unmatched.json()).toEqual({ error: 'Subcommand not found: missing' })
  })

  it('should accept subcommand arrays in subcommand groups', () => {
    const handlers = {
      ping: factory.subCommand(
        makeSubCommand('ping', 'Ping the bot'),
        vi.fn(() => Response.json({ ok: 'ping' })),
      ),
    }

    const group = makeSubCommandGroup('group', 'group option').options(factory.getSubCommands(Object.values(handlers)))
    expect(group.toJSON().options).toHaveLength(1)
  })

  it('should return a list of commands', () => {
    const commandMock = makeSlashCommand('name', 'description')
    const handlers = [factory.command(commandMock, vi.fn())]
    const commands = factory.getCommands(handlers)
    expect(commands).toEqual([commandMock])
  })
})
