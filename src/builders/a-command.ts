import { ApplicationCommandOptionType } from 'discord-api-types/v10'
import { isArray, isString, toJSON } from '../utils'
import { type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

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
