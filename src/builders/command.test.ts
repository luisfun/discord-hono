import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChannelType,
  InteractionContextType,
  Locale,
} from 'discord-api-types/v10'
import { Command, Option, SubCommand, SubGroup } from './command'

describe('Command class', () => {
  it('creates a basic command', () => {
    const command = new Command('test', 'Test command')
    expect(command.toJSON()).toEqual({
      name: 'test',
      description: 'Test command',
    })
  })

  it('sets command properties', () => {
    const command = new Command('test', 'Test command')
      .type(ApplicationCommandType.ChatInput)
      .name_localizations({ [Locale.Japanese]: 'テスト' })
      .description_localizations({ [Locale.Japanese]: 'テストコマンド' })
      .default_member_permissions('0')
      .dm_permission(false)
      .nsfw()
      .integration_types(ApplicationIntegrationType.GuildInstall)
      .contexts(InteractionContextType.Guild)

    expect(command.toJSON()).toMatchObject({
      name: 'test',
      description: 'Test command',
      type: ApplicationCommandType.ChatInput,
      name_localizations: { [Locale.Japanese]: 'テスト' },
      description_localizations: { [Locale.Japanese]: 'テストコマンド' },
      default_member_permissions: '0',
      dm_permission: false,
      nsfw: true,
      integration_types: [ApplicationIntegrationType.GuildInstall],
      contexts: [InteractionContextType.Guild],
    })
  })

  it('adds options to command', () => {
    const subCommand = new SubCommand('sub', 'Sub command')
    const option = new Option('opt', 'Option', 'String')
    const command = new Command('test', 'Test command').options(subCommand, option)

    expect(command.toJSON().options).toHaveLength(2)
    expect(command.toJSON().options?.[0]).toMatchObject(subCommand.toJSON())
    expect(command.toJSON().options?.[1]).toMatchObject(option.toJSON())
  })
})

describe('SubGroup class', () => {
  it('creates a sub group', () => {
    const subGroup = new SubGroup('group', 'Group description')
    expect(subGroup.toJSON()).toMatchObject({
      name: 'group',
      description: 'Group description',
      type: 2,
    })
  })

  it('adds sub commands to sub group', () => {
    const subCommand = new SubCommand('sub', 'Sub command')
    const subGroup = new SubGroup('group', 'Group description').options(subCommand)

    expect(subGroup.toJSON().options).toHaveLength(1)
    expect(subGroup.toJSON().options?.[0]).toMatchObject(subCommand.toJSON())
  })
})

describe('SubCommand class', () => {
  it('creates a sub command', () => {
    const subCommand = new SubCommand('sub', 'Sub command')
    expect(subCommand.toJSON()).toMatchObject({
      name: 'sub',
      description: 'Sub command',
      type: 1,
    })
  })

  it('adds options to sub command', () => {
    const option = new Option('opt', 'Option', 'String')
    const subCommand = new SubCommand('sub', 'Sub command').options(option)

    expect(subCommand.toJSON().options).toHaveLength(1)
    expect(subCommand.toJSON().options?.[0]).toMatchObject(option.toJSON())
  })
})

describe('Option class', () => {
  it('creates a string option', () => {
    const option = new Option('opt', 'Option', 'String')
    expect(option.toJSON()).toMatchObject({
      name: 'opt',
      description: 'Option',
      type: 3,
    })
  })

  it('sets option properties', () => {
    const option = new Option('opt', 'Option', 'String').required().min_length(1).max_length(10).autocomplete()

    expect(option.toJSON()).toMatchObject({
      name: 'opt',
      description: 'Option',
      type: 3,
      required: true,
      min_length: 1,
      max_length: 10,
      autocomplete: true,
    })
  })

  it('sets channel types for channel option', () => {
    const option = new Option('channel', 'Channel', 'Channel').channel_types(
      ChannelType.GuildText,
      ChannelType.GuildVoice,
    )

    expect(option.toJSON()).toMatchObject({
      name: 'channel',
      description: 'Channel',
      type: 7,
      channel_types: [ChannelType.GuildText, ChannelType.GuildVoice],
    })
  })

  it('sets min and max values for number option', () => {
    const option = new Option('num', 'Number', 'Number').min_value(0).max_value(100)

    expect(option.toJSON()).toMatchObject({
      name: 'num',
      description: 'Number',
      type: 10,
      min_value: 0,
      max_value: 100,
    })
  })

  it('warns when using incompatible methods', () => {
    // biome-ignore lint: empty block
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error
    const _option = new Option('str', 'String', 'String')
      // @ts-expect-error
      .min_value(0)
      // @ts-expect-error
      .channel_types(ChannelType.GuildText)

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    consoleSpy.mockRestore()
  })
})
