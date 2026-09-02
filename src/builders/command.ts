// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  RESTPostAPIPrimaryEntryPointApplicationCommandJSONBody,
} from 'discord-api-types/v10'
import { createJsonBuilder, type JsonBuilderOptions } from './json-builder'

// type fix https://docs.discord.com/developers/interactions/application-commands#create-global-application-command

interface ContextMenuCommandJson
  extends Omit<
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    'description' | 'description_localizations' | 'options' | 'handler'
  > {}
interface EntryPointCommandJson
  extends Omit<
    RESTPostAPIPrimaryEntryPointApplicationCommandJSONBody,
    'description' | 'description_localizations' | 'options'
  > {}

export const commandType = {
  ChatInput: 1,
  User: 2,
  Message: 3,
  PrimaryEntryPoint: 4,
} as const satisfies Record<string, ApplicationCommandType>

export const commandOptionType = {
  Subcommand: 1,
  SubcommandGroup: 2,
  String: 3,
  Integer: 4,
  Boolean: 5,
  User: 6,
  Channel: 7,
  Role: 8,
  Mentionable: 9,
  Number: 10,
  Attachment: 11,
} as const satisfies Record<string, ApplicationCommandOptionType>

// Naming based on the TOC: https://docs.discord.com/developers/interactions/application-commands

export const makeSlashCommand = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ name: N; description: D }, RESTPostAPIChatInputApplicationCommandsJSONBody, 'type'>(
    { name, description },
    builderOptions,
  )
//const testSlashCommand = makeSlashCommand('test', 'A test command')

export const makeUserCommand = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  createJsonBuilder<{ type: 2; name: N }, ContextMenuCommandJson, 'type'>({ type: 2, name }, builderOptions)

export const makeMessageCommand = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  createJsonBuilder<{ type: 3; name: N }, ContextMenuCommandJson, 'type'>({ type: 3, name }, builderOptions)

export const makeEntryPointCommand = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  createJsonBuilder<{ type: 4; name: N }, EntryPointCommandJson, 'type'>({ type: 4, name }, builderOptions)

export const makeSubCommand = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 1; name: N; description: D }, APIApplicationCommandSubcommandOption, 'type'>(
    { type: 1, name, description },
    builderOptions,
  )

export const makeSubCommandGroup = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 2; name: N; description: D }, APIApplicationCommandSubcommandGroupOption, 'type'>(
    { type: 2, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeStringOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 3; name: N; description: D }, APIApplicationCommandStringOption, 'type'>(
    { type: 3, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeIntegerOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 4; name: N; description: D }, APIApplicationCommandIntegerOption, 'type'>(
    { type: 4, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeBooleanOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 5; name: N; description: D }, APIApplicationCommandBooleanOption, 'type'>(
    { type: 5, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeUserOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 6; name: N; description: D }, APIApplicationCommandUserOption, 'type'>(
    { type: 6, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeChannelOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 7; name: N; description: D }, APIApplicationCommandChannelOption, 'type'>(
    { type: 7, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeRoleOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 8; name: N; description: D }, APIApplicationCommandRoleOption, 'type'>(
    { type: 8, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeMentionableOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 9; name: N; description: D }, APIApplicationCommandMentionableOption, 'type'>(
    { type: 9, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeNumberOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 10; name: N; description: D }, APIApplicationCommandNumberOption, 'type'>(
    { type: 10, name, description },
    builderOptions,
  )

/**
 * Command Option
 * @param name
 * @param description
 * @param builderOptions
 * @returns
 */
export const makeAttachmentOption = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<{ type: 11; name: N; description: D }, APIApplicationCommandAttachmentOption, 'type'>(
    { type: 11, name, description },
    builderOptions,
  )
