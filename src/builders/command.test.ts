import { describe, expect, it } from 'vitest'
import {
  commandOptionType,
  commandType,
  makeAttachmentOption,
  makeBooleanOption,
  makeChannelOption,
  makeEntryPointCommand,
  makeIntegerOption,
  makeMentionableOption,
  makeMessageCommand,
  makeNumberOption,
  makeRoleOption,
  makeSlashCommand,
  makeStringOption,
  makeSubCommand,
  makeSubCommandGroup,
  makeUserCommand,
  makeUserOption,
} from './command'

describe('a-command builders', () => {
  it('creates a basic slash command', () => {
    const command = makeSlashCommand('test', 'Test command').type(commandType.ChatInput)

    expect(command.toJSON()).toEqual({
      name: 'test',
      description: 'Test command',
      type: commandType.ChatInput,
    })
  })

  it('creates context and entry point commands', () => {
    const userCommand = makeUserCommand('user-info')
    const messageCommand = makeMessageCommand('message-info')
    const entryPointCommand = makeEntryPointCommand('entry-point')

    expect(userCommand.toJSON()).toEqual({
      type: commandType.User,
      name: 'user-info',
    })
    expect(messageCommand.toJSON()).toEqual({
      type: commandType.Message,
      name: 'message-info',
    })
    expect(entryPointCommand.toJSON()).toEqual({
      type: commandType.PrimaryEntryPoint,
      name: 'entry-point',
    })
  })

  it('creates subcommands and subcommand groups with nested options', () => {
    const option = makeStringOption('query', 'Search query').required(true).min_length(1).max_length(100)
    const subCommand = makeSubCommand('search', 'Search something').options([option])
    const subGroup = makeSubCommandGroup('content', 'Content actions').options([subCommand])
    const command = makeSlashCommand('lookup', 'Lookup command').options([subGroup])

    expect(command.toJSON()).toEqual({
      name: 'lookup',
      description: 'Lookup command',
      options: [
        {
          type: commandOptionType.SubcommandGroup,
          name: 'content',
          description: 'Content actions',
          options: [
            {
              type: commandOptionType.Subcommand,
              name: 'search',
              description: 'Search something',
              options: [
                {
                  type: commandOptionType.String,
                  name: 'query',
                  description: 'Search query',
                  required: true,
                  min_length: 1,
                  max_length: 100,
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('accepts union-typed builders for shared option methods', () => {
    const option: ReturnType<typeof makeStringOption> | ReturnType<typeof makeIntegerOption> = makeStringOption(
      'name',
      'Name',
    )

    const result = option.autocomplete(true)

    expect(result.toJSON()).toMatchObject({
      type: commandOptionType.String,
      name: 'name',
      description: 'Name',
      autocomplete: true,
    })
  })

  it('creates option builders with the correct type metadata', () => {
    const stringOption = makeStringOption('name', 'Name').required(true).autocomplete(true)
    const integerOption = makeIntegerOption('count', 'Count').required(true).min_value(1).max_value(10)
    const numberOption = makeNumberOption('ratio', 'Ratio').min_value(0).max_value(1)
    const booleanOption = makeBooleanOption('enabled', 'Enabled')
    const userOption = makeUserOption('owner', 'Owner')
    const channelOption = makeChannelOption('channel', 'Channel')
    const roleOption = makeRoleOption('staff-role', 'Staff role')
    const mentionableOption = makeMentionableOption('mention', 'Mentionable target')
    const attachmentOption = makeAttachmentOption('file', 'File attachment')

    expect(stringOption.toJSON()).toMatchObject({
      type: commandOptionType.String,
      name: 'name',
      description: 'Name',
      required: true,
      autocomplete: true,
    })
    expect(integerOption.toJSON()).toMatchObject({
      type: commandOptionType.Integer,
      name: 'count',
      description: 'Count',
      required: true,
      min_value: 1,
      max_value: 10,
    })
    expect(numberOption.toJSON()).toMatchObject({
      type: commandOptionType.Number,
      name: 'ratio',
      description: 'Ratio',
      min_value: 0,
      max_value: 1,
    })
    expect(booleanOption.toJSON()).toMatchObject({
      type: commandOptionType.Boolean,
      name: 'enabled',
      description: 'Enabled',
    })
    expect(userOption.toJSON()).toMatchObject({
      type: commandOptionType.User,
      name: 'owner',
      description: 'Owner',
    })
    expect(channelOption.toJSON()).toMatchObject({
      type: commandOptionType.Channel,
      name: 'channel',
      description: 'Channel',
    })
    expect(roleOption.toJSON()).toMatchObject({
      type: commandOptionType.Role,
      name: 'staff-role',
      description: 'Staff role',
    })
    expect(mentionableOption.toJSON()).toMatchObject({
      type: commandOptionType.Mentionable,
      name: 'mention',
      description: 'Mentionable target',
    })
    expect(attachmentOption.toJSON()).toMatchObject({
      type: commandOptionType.Attachment,
      name: 'file',
      description: 'File attachment',
    })
  })
})
