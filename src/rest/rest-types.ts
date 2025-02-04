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
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchCurrentApplicationJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPutAPIApplicationCommandPermissionsJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsJSONBody,
  RESTPutAPIGuildApplicationCommandsPermissionsJSONBody,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import type {
  //_applications_$_activityinstances_$,
  _applications_$_commands,
  _applications_$_commands_$,
  _applications_$_guilds_$_commands,
  _applications_$_guilds_$_commands_$,
  _applications_$_guilds_$_commands_$_permissions,
  _applications_$_guilds_$_commands_permissions,
  _applications_me,
  _channels_$,
  _channels_$_messages,
  _channels_$_messages_$,
  _channels_$_messages_$_crosspost,
  _channels_$_messages_$_reactions,
  _channels_$_messages_$_reactions_$,
  _channels_$_messages_$_reactions_$_$,
  _channels_$_messages_$_reactions_$_me,
  _channels_$_messages_bulkdelete,
  _webhooks_$_$,
  _webhooks_$_$_messages_$,
} from './rest-path'

type TypedResponse<T> = Omit<Response, 'json'> & { json(): Promise<T> }

////////////////////////////////////////
//////                            //////
//////         GetMethod          //////
//////                            //////
////////////////////////////////////////

type GetPathNonQuery =
  // Receiving and Responding
  | typeof _webhooks_$_$_messages_$
  // Application Commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands_$
  | typeof _applications_$_guilds_$_commands_permissions
  | typeof _applications_$_guilds_$_commands_$_permissions
  // Application
  | typeof _applications_me
  // Messages
  | typeof _channels_$_messages_$_reactions_$

// biome-ignore format: ternary operator
type GetResultNonQuery<P extends GetPathNonQuery> =
  // Application Commands
  P extends typeof _applications_$_commands_$ ? RESTGetAPIApplicationCommandResult :
  P extends typeof _applications_$_guilds_$_commands_$ ? RESTGetAPIApplicationGuildCommandResult :
  P extends typeof _applications_$_guilds_$_commands_permissions ? RESTGetAPIGuildApplicationCommandsPermissionsResult :
  P extends typeof _applications_$_guilds_$_commands_$_permissions ? RESTGetAPIApplicationCommandPermissionsResult :
  // Application
  P extends typeof _applications_me ? RESTGetCurrentApplicationResult :
  // Messages
  P extends typeof _channels_$_messages_$_reactions_$ ? RESTGetAPIChannelMessageReactionUsersResult :
  undefined

type GetPathWithQuery =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_guilds_$_commands
  // Messages
  | typeof _channels_$_messages
  | typeof _channels_$_messages_$

export type GetPath = GetPathNonQuery | GetPathWithQuery

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

// biome-ignore format: ternary operator
type GetResultWithQuery<P extends GetPathWithQuery> =
  // Application Commands
  P extends typeof _applications_$_commands ? RESTGetAPIApplicationCommandsResult :
  P extends typeof _applications_$_guilds_$_commands ? RESTGetAPIApplicationGuildCommandsResult :
  // Messages
  P extends typeof _channels_$_messages ? RESTGetAPIChannelMessagesResult :
  P extends typeof _channels_$_messages_$ ? RESTGetAPIChannelMessageResult :
  undefined

export type GetMethod = {
  <P extends GetPathNonQuery>(path: P, variables: Variables<P>): Promise<TypedResponse<GetResultNonQuery<P>>>
  <P extends GetPathWithQuery>(
    path: P,
    variables: Variables<P>,
    query: GetQuery<P>,
  ): Promise<TypedResponse<GetResultWithQuery<P>>>
}

////////////////////////////////////////
//////                            //////
//////         PutMethod          //////
//////                            //////
////////////////////////////////////////

type PutPathNonData =
  // Messages
  typeof _channels_$_messages_$_reactions_$_me

type PutPathWithData =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_guilds_$_commands
  | typeof _applications_$_guilds_$_commands_$_permissions
  | typeof _applications_$_guilds_$_commands_permissions
  // Messages
  | typeof _channels_$_messages_$_reactions_$_me

export type PutPath = PutPathNonData | PutPathWithData

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

export type PutMethod = {
  <P extends PutPathNonData>(path: P, variables: Variables<P>): Promise<Response>
  <P extends PutPathWithData>(path: P, variables: Variables<P>, data: PutData<P>): Promise<Response>
}

////////////////////////////////////////
//////                            //////
//////         PostMethod         //////
//////                            //////
////////////////////////////////////////

type PostPathNonData =
  // Messages
  typeof _channels_$_messages_$_crosspost

type PostPathWithDataNonFile =
  // Application Commands
  | typeof _applications_$_commands
  | typeof _applications_$_guilds_$_commands
  // Messages
  | typeof _channels_$_messages_bulkdelete

type PostPathWithDataWithFile =
  // Receiving and Responding
  | typeof _webhooks_$_$
  // Messages
  | typeof _channels_$_messages

export type PostPath = PostPathNonData | PostPathWithDataNonFile | PostPathWithDataWithFile

// biome-ignore format: ternary operator
export type PostData<P extends PostPath> =
  // Receiving and Responding
  P extends typeof _webhooks_$_$ ? RESTPostAPIInteractionFollowupJSONBody :
  // Application Commands
  P extends typeof _applications_$_commands ? RESTPostAPIApplicationCommandsJSONBody :
  P extends typeof _applications_$_guilds_$_commands ? RESTPostAPIApplicationGuildCommandsJSONBody :
  // Messages
  P extends typeof _channels_$_messages ? RESTPostAPIChannelMessageJSONBody :
  P extends typeof _channels_$_messages_bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteJSONBody :
  undefined

export type PostMethod = {
  <P extends PostPathNonData>(path: P, variables: Variables<P>): Promise<Response>
  <P extends PostPathWithDataNonFile>(path: P, variables: Variables<P>, data: PostData<P>): Promise<Response>
  <P extends PostPathWithDataWithFile>(
    path: P,
    variables: Variables<P>,
    data: PostData<P>,
    file?: FileData,
  ): Promise<Response>
}

////////////////////////////////////////
//////                            //////
//////        PatchMethod         //////
//////                            //////
////////////////////////////////////////

type PatchPathNonData =
  // Receiving and Responding
  typeof _webhooks_$_$_messages_$

type PatchPathWithDataNonFile =
  // Application Commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands_$
  // Application
  | typeof _applications_me
  // Channel
  | typeof _channels_$

type PatchPathWithDataWithFile =
  // Messages
  typeof _channels_$_messages_$

export type PatchPath = PatchPathNonData | PatchPathWithDataNonFile | PatchPathWithDataWithFile

// biome-ignore format: ternary operator
export type PatchData<P extends PatchPath> =
  // Application Commands
  P extends typeof _applications_$_commands_$ ? RESTPatchAPIApplicationCommandJSONBody :
  P extends typeof _applications_$_guilds_$_commands_$ ? RESTPatchAPIApplicationGuildCommandJSONBody :
  // Application
  P extends typeof _applications_me ? RESTPatchCurrentApplicationJSONBody :
  // Messages
  P extends typeof _channels_$_messages_$ ? RESTPatchAPIChannelMessageJSONBody :
  // Channel
  P extends typeof _channels_$ ? RESTPatchAPIChannelJSONBody :
  undefined

export type PatchMethod = {
  <P extends PatchPathNonData>(path: P, variables: Variables<P>): Promise<Response>
  <P extends PatchPathWithDataNonFile>(path: P, variables: Variables<P>, data: PatchData<P>): Promise<Response>
  <P extends PatchPathWithDataWithFile>(
    path: P,
    variables: Variables<P>,
    data: PatchData<P>,
    file?: FileData,
  ): Promise<Response>
}

////////////////////////////////////////
//////                            //////
//////        DeleteMethod        //////
//////                            //////
////////////////////////////////////////

export type DeletePath =
  // Receiving and Responding
  | typeof _webhooks_$_$_messages_$
  // Application Commands
  | typeof _applications_$_commands_$
  | typeof _applications_$_guilds_$_commands_$
  // Messages
  | typeof _channels_$_messages_$
  | typeof _channels_$_messages_$_reactions
  | typeof _channels_$_messages_$_reactions_$
  | typeof _channels_$_messages_$_reactions_$_me
  | typeof _channels_$_messages_$_reactions_$_$

////////////////////////////////////////
//////                            //////
//////         Variables          //////
//////                            //////
////////////////////////////////////////

export type Variables<P extends GetPath | PutPath | PostPath | PatchPath | DeletePath> = P extends
  | typeof _applications_$_commands
  | typeof _channels_$_messages
  | typeof _channels_$_messages_bulkdelete
  | typeof _channels_$
  ? [string]
  : P extends
        | typeof _webhooks_$_$
        | typeof _applications_$_commands_$
        | typeof _applications_$_guilds_$_commands
        | typeof _applications_$_guilds_$_commands_permissions
        | typeof _channels_$_messages_$
        | typeof _channels_$_messages_$_crosspost
        | typeof _channels_$_messages_$_reactions
    ? [string, string]
    : P extends
          | typeof _webhooks_$_$_messages_$
          | typeof _applications_$_guilds_$_commands_$
          | typeof _applications_$_guilds_$_commands_$_permissions
          | typeof _channels_$_messages_$_reactions_$_me
          | typeof _channels_$_messages_$_reactions_$
      ? [string, string, string]
      : P extends typeof _channels_$_messages_$_reactions_$_$
        ? [string, string, string, string]
        : []
