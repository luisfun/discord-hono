import type {
  RESTGetAPIApplicationCommandPermissionsResult,
  RESTGetAPIApplicationCommandResult,
  RESTGetAPIApplicationCommandsQuery,
  RESTGetAPIApplicationCommandsResult,
  RESTGetAPIApplicationGuildCommandResult,
  RESTGetAPIApplicationGuildCommandsQuery,
  RESTGetAPIApplicationGuildCommandsResult,
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIGuildApplicationCommandsPermissionsResult,
  RESTGetCurrentApplicationResult,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPatchAPIApplicationGuildCommandJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchCurrentApplicationJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
  RESTPutAPIApplicationCommandPermissionsJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsJSONBody,
  RESTPutAPIGuildApplicationCommandsPermissionsJSONBody,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import type {
  _applications_$_activityinstances_$,
  _applications_$_commands,
  _applications_$_commands_$,
  _applications_$_guilds_$_commands,
  _applications_$_guilds_$_commands_$,
  _applications_$_guilds_$_commands_$_permissions,
  _applications_$_guilds_$_commands_permissions,
  _applications_me,
  _channels_$_messages,
  _channels_$_messages_$,
  _channels_$_messages_$_crosspost,
  _channels_$_messages_$_reactions,
  _channels_$_messages_$_reactions_$,
  _channels_$_messages_$_reactions_$_$,
  _channels_$_messages_$_reactions_$_me,
  _channels_$_messages_bulkdelete,
} from './rest-path'

export type GetPath =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands
  | typeof _applications_$_guilds_$_commands_$
  | typeof _applications_$_guilds_$_commands_permissions
  | typeof _applications_$_guilds_$_commands_$_permissions
  // Application
  | typeof _applications_me
  // Messages
  | typeof _channels_$_messages
  | typeof _channels_$_messages_$
  | typeof _channels_$_messages_$_reactions_$

export type GetQuery<P extends GetPath> =
  // Application Commands
  P extends typeof _applications_$_commands
    ? RESTGetAPIApplicationCommandsQuery
    : P extends typeof _applications_$_guilds_$_commands
      ? RESTGetAPIApplicationGuildCommandsQuery
      : // Messages
        P extends typeof _channels_$_messages
        ? RESTGetAPIChannelMessagesQuery
        : P extends typeof _channels_$_messages_$
          ? RESTGetAPIChannelMessageReactionUsersQuery
          : undefined

export type GetResult<P extends GetPath> =
  // Application Commands
  P extends typeof _applications_$_commands
    ? RESTGetAPIApplicationCommandsResult
    : P extends typeof _applications_$_commands_$
      ? RESTGetAPIApplicationCommandResult
      : P extends typeof _applications_$_guilds_$_commands
        ? RESTGetAPIApplicationGuildCommandsResult
        : P extends typeof _applications_$_guilds_$_commands_$
          ? RESTGetAPIApplicationGuildCommandResult
          : P extends typeof _applications_$_guilds_$_commands_permissions
            ? RESTGetAPIGuildApplicationCommandsPermissionsResult
            : P extends typeof _applications_$_guilds_$_commands_$_permissions
              ? RESTGetAPIApplicationCommandPermissionsResult
              : // Application
                P extends typeof _applications_me
                ? RESTGetCurrentApplicationResult
                : // Messages
                  P extends typeof _channels_$_messages
                  ? RESTGetAPIChannelMessagesResult
                  : P extends typeof _channels_$_messages_$
                    ? RESTGetAPIChannelMessageResult
                    : P extends typeof _channels_$_messages_$_reactions_$
                      ? RESTGetAPIChannelMessageReactionUsersResult
                      : undefined

export type PutPath =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_guilds_$_commands
  | typeof _applications_$_guilds_$_commands_$_permissions
  | typeof _applications_$_guilds_$_commands_permissions
  // Messages
  | typeof _channels_$_messages_$_reactions_$_me

export type PutData<P extends PutPath> =
  // Application Commands
  P extends typeof _applications_$_commands
    ? RESTPutAPIApplicationCommandsJSONBody
    : P extends typeof _applications_$_guilds_$_commands
      ? RESTPutAPIApplicationGuildCommandsJSONBody
      : P extends typeof _applications_$_guilds_$_commands_$_permissions
        ? RESTPutAPIApplicationCommandPermissionsJSONBody
        : P extends typeof _applications_$_guilds_$_commands_permissions
          ? RESTPutAPIGuildApplicationCommandsPermissionsJSONBody
          : undefined

export type PostPath =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_guilds_$_commands
  // Messages
  | typeof _channels_$_messages
  | typeof _channels_$_messages_$_crosspost
  | typeof _channels_$_messages_bulkdelete

export type PostData<P extends PostPath> =
  // Application Commands
  P extends typeof _applications_$_commands
    ? RESTPostAPIApplicationCommandsJSONBody
    : P extends typeof _applications_$_guilds_$_commands
      ? RESTPostAPIApplicationGuildCommandsJSONBody
      : // Messages
        P extends typeof _channels_$_messages
        ? RESTPostAPIChannelMessageJSONBody
        : P extends typeof _channels_$_messages_bulkdelete
          ? RESTPostAPIChannelMessagesBulkDeleteJSONBody
          : undefined

export type PostFile<P extends PostPath> =
  // Messages
  P extends typeof _channels_$_messages ? FileData : undefined

export type PatchPath =
  // Application Commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands_$
  // Application
  | typeof _applications_me
  // Messages
  | typeof _channels_$_messages_$

export type PatchData<P extends PatchPath> =
  // Application Commands
  P extends typeof _applications_$_commands_$
    ? RESTPatchAPIApplicationCommandJSONBody
    : P extends typeof _applications_$_guilds_$_commands_$
      ? RESTPatchAPIApplicationGuildCommandJSONBody
      : // Application
        P extends typeof _applications_me
        ? RESTPatchCurrentApplicationJSONBody
        : // Messages
          P extends typeof _channels_$_messages_$
          ? RESTPatchAPIChannelMessageJSONBody
          : undefined

export type PatchFile<P extends PatchPath> =
  // Messages
  P extends typeof _channels_$_messages_$ ? FileData : undefined

export type DeletePath =
  // Application Commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands_$
  // Messages
  | typeof _channels_$_messages_$
  | typeof _channels_$_messages_$_reactions
  | typeof _channels_$_messages_$_reactions_$
  | typeof _channels_$_messages_$_reactions_$_me
  | typeof _channels_$_messages_$_reactions_$_$

export type Variables<P extends GetPath | PutPath | PostPath | PatchPath | DeletePath> = P extends
  | typeof _applications_$_commands
  | typeof _channels_$_messages
  | typeof _channels_$_messages_bulkdelete
  ? [string]
  : P extends
        | typeof _applications_$_commands_$
        | typeof _applications_$_guilds_$_commands
        | typeof _applications_$_guilds_$_commands_permissions
        | typeof _channels_$_messages_$
        | typeof _channels_$_messages_$_crosspost
        | typeof _channels_$_messages_$_reactions
    ? [string, string]
    : P extends
          | typeof _applications_$_guilds_$_commands_$
          | typeof _applications_$_guilds_$_commands_$_permissions
          | typeof _channels_$_messages_$_reactions_$_me
          | typeof _channels_$_messages_$_reactions_$
      ? [string, string, string]
      : P extends typeof _channels_$_messages_$_reactions_$_$
        ? [string, string, string, string]
        : []
