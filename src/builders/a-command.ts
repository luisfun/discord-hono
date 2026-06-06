// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10'
import { type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

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

type ExtendedChatInputCommand = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'options'> & {
  options: (APIApplicationCommandOption | JsonBuilder<APIApplicationCommandOption, APIApplicationCommandOption, any>)[]
}

type ExtendedCommand = ExtendedChatInputCommand | Extract<RESTPostAPIApplicationCommandsJSONBody, { type: number }>

type CommandObject<I extends RESTPostAPIApplicationCommandsJSONBody> = Extract<
  ExtendedCommand,
  never extends I['type'] ? ExtendedChatInputCommand : { type: I['type'] }
>

const commandBuilder = <I extends RESTPostAPIApplicationCommandsJSONBody, E extends string = 'type'>(
  init: I & Record<Exclude<keyof I, keyof CommandObject<I>>, never>,
  options?: JsonBuilderOptions,
) => jsonBuilder<I, CommandObject<I>, E>(init, options)

// Naming based on the TOC: https://docs.discord.com/developers/interactions/application-commands

export const slashCommandBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) => commandBuilder({ name, description }, builderOptions)
//const testSlashCommand = slashCommandBuilder('test', 'A test command')

export const userCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  commandBuilder({ type: 2, name }, builderOptions)

export const messageCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  commandBuilder({ type: 3, name }, builderOptions)

export const entryPointCommandBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  commandBuilder({ type: 4, name }, builderOptions)

type ExtendedSubCommandOption = Omit<APIApplicationCommandSubcommandOption, 'options'> & {
  options: (
    | APIApplicationCommandBasicOption
    | JsonBuilder<APIApplicationCommandBasicOption, APIApplicationCommandBasicOption, any>
  )[]
}
type ExtendedSubCommandGroupOption = Omit<APIApplicationCommandSubcommandGroupOption, 'options'> & {
  options: (
    | APIApplicationCommandSubcommandOption
    | JsonBuilder<APIApplicationCommandSubcommandOption, APIApplicationCommandSubcommandOption, any>
  )[]
}

type ExtendedOnlyCommandOption = ExtendedSubCommandOption | ExtendedSubCommandGroupOption
type ExtendedCommandOption =
  | ExtendedOnlyCommandOption
  | Exclude<APIApplicationCommandOption, { type: ExtendedOnlyCommandOption['type'] }>

type CommandOptionObject<I extends APIApplicationCommandOption> = Extract<ExtendedCommandOption, { type: I['type'] }>

const commandOptionBuilder = <I extends APIApplicationCommandOption>(
  init: I & Record<Exclude<keyof I, keyof CommandOptionObject<I>>, never>,
  options?: JsonBuilderOptions,
) => jsonBuilder<I, CommandOptionObject<I>, 'type'>(init, options)

export const subCommandBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) => commandOptionBuilder({ type: 1, name, description }, builderOptions)

export const subCommandGroupBuilder = <N extends string, D extends string>(
  name: N,
  description: D,
  builderOptions?: JsonBuilderOptions,
) => commandOptionBuilder({ type: 2, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 3, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 4, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 5, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 6, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 7, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 8, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 9, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 10, name, description }, builderOptions)

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
) => commandOptionBuilder({ type: 11, name, description }, builderOptions)

/*
const testCommand = slashCommandBuilder('test', 'A test command').options([
  subCommandBuilder('sub1', 'A subcommand').options([stringOptionBuilder('option1', 'A string option')]),
  subCommandGroupBuilder('group1', 'A subcommand group').options([
    subCommandBuilder('sub2', 'Another subcommand').options([numberOptionBuilder('option2', 'A number option')]),
  ]),
])
*/
