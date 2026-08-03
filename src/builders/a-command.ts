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
import { type JsonBuilderOptions, jsonBuilder } from './json-builder'

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

export const slashCommandBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ name: N; description: D }, RESTPostAPIChatInputApplicationCommandsJSONBody>(
    { name, description },
    builderOptions,
  )
//const testSlashCommand = slashCommandBuilder('test', 'A test command')

export const userCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 2; name: N }, RESTPostAPIContextMenuApplicationCommandsJSONBody>(
    { type: 2, name },
    builderOptions,
  )

export const messageCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 3; name: N }, RESTPostAPIContextMenuApplicationCommandsJSONBody>(
    { type: 3, name },
    builderOptions,
  )

export const entryPointCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 4; name: N }, RESTPostAPIPrimaryEntryPointApplicationCommandJSONBody>(
    { type: 4, name },
    builderOptions,
  )

export const subCommandBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 1; name: N; description: D }, APIApplicationCommandSubcommandOption>(
    { type: 1, name, description },
    builderOptions,
  )

export const subCommandGroupBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 2; name: N; description: D }, APIApplicationCommandSubcommandGroupOption>(
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
export const stringOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 3; name: N; description: D }, APIApplicationCommandStringOption>(
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
export const integerOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 4; name: N; description: D }, APIApplicationCommandIntegerOption>(
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
export const booleanOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 5; name: N; description: D }, APIApplicationCommandBooleanOption>(
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
export const userOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 6; name: N; description: D }, APIApplicationCommandUserOption>(
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
export const channelOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 7; name: N; description: D }, APIApplicationCommandChannelOption>(
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
export const roleOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 8; name: N; description: D }, APIApplicationCommandRoleOption>(
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
export const mentionableOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 9; name: N; description: D }, APIApplicationCommandMentionableOption>(
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
export const numberOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 10; name: N; description: D }, APIApplicationCommandNumberOption>(
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
export const attachmentOptionBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 11; name: N; description: D }, APIApplicationCommandAttachmentOption>(
    { type: 11, name, description },
    builderOptions,
  )

/*
const testCommand = slashCommandBuilder('test', 'A test command').options([
  subCommandBuilder('sub1', 'A subcommand').options([stringOptionBuilder('option1', 'A string option')]),
  subCommandGroupBuilder('group1', 'A subcommand group').options([
    subCommandBuilder('sub2', 'Another subcommand').options([numberOptionBuilder('option2', 'A number option')]),
  ]),
])
*/
