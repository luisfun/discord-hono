import type {
  RESTDeleteAPIApplicationEmojiResult,
  RESTDeleteAPIChannelPermissionResult,
  RESTDeleteAPIChannelPinResult,
  RESTDeleteAPIChannelRecipientResult,
  RESTDeleteAPIChannelResult,
  RESTDeleteAPIChannelThreadMembersResult,
  RESTDeleteAPIEntitlementResult,
  RESTDeleteAPIGuildEmojiResult,
  RESTGetAPIApplicationCommandPermissionsResult,
  RESTGetAPIApplicationCommandResult,
  RESTGetAPIApplicationCommandsQuery,
  RESTGetAPIApplicationCommandsResult,
  RESTGetAPIApplicationEmojiResult,
  RESTGetAPIApplicationEmojisResult,
  RESTGetAPIApplicationGuildCommandResult,
  RESTGetAPIApplicationGuildCommandsQuery,
  RESTGetAPIApplicationGuildCommandsResult,
  RESTGetAPIApplicationRoleConnectionMetadataResult,
  RESTGetAPIAuditLogQuery,
  RESTGetAPIAuditLogResult,
  RESTGetAPIAutoModerationRuleResult,
  RESTGetAPIAutoModerationRulesResult,
  RESTGetAPIChannelInvitesResult,
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelPinsResult,
  RESTGetAPIChannelResult,
  RESTGetAPIChannelThreadMemberQuery,
  RESTGetAPIChannelThreadMemberResult,
  RESTGetAPIChannelThreadMembersQuery,
  RESTGetAPIChannelThreadMembersResult,
  RESTGetAPIChannelThreadsArchivedPrivateResult,
  RESTGetAPIChannelThreadsArchivedPublicResult,
  RESTGetAPIEntitlementResult,
  RESTGetAPIEntitlementsQuery,
  RESTGetAPIEntitlementsResult,
  RESTGetAPIGuildApplicationCommandsPermissionsResult,
  RESTGetAPIGuildEmojiResult,
  RESTGetAPIGuildEmojisResult,
  RESTGetAPIInteractionFollowupResult,
  RESTGetAPIInteractionOriginalResponseResult,
  RESTGetAPIWebhookWithTokenMessageQuery,
  RESTGetCurrentApplicationResult,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPatchAPIApplicationCommandResult,
  RESTPatchAPIApplicationEmojiJSONBody,
  RESTPatchAPIApplicationEmojiResult,
  RESTPatchAPIApplicationGuildCommandJSONBody,
  RESTPatchAPIApplicationGuildCommandResult,
  RESTPatchAPIAutoModerationRuleJSONBody,
  RESTPatchAPIAutoModerationRuleResult,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIChannelResult,
  RESTPatchAPIGuildEmojiJSONBody,
  RESTPatchAPIGuildEmojiResult,
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPatchAPIInteractionFollowupResult,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIInteractionOriginalResponseResult,
  RESTPatchCurrentApplicationJSONBody,
  RESTPatchCurrentApplicationResult,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationCommandsResult,
  RESTPostAPIApplicationEmojiJSONBody,
  RESTPostAPIApplicationEmojiResult,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsResult,
  RESTPostAPIAutoModerationRuleJSONBody,
  RESTPostAPIAutoModerationRuleResult,
  RESTPostAPIChannelFollowersJSONBody,
  RESTPostAPIChannelFollowersResult,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelInviteResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
  RESTPostAPIChannelMessagesThreadsJSONBody,
  RESTPostAPIChannelMessagesThreadsResult,
  RESTPostAPIChannelThreadsJSONBody,
  RESTPostAPIChannelThreadsResult,
  RESTPostAPIChannelTypingResult,
  RESTPostAPIEntitlementConsumeResult,
  RESTPostAPIEntitlementJSONBody,
  RESTPostAPIEntitlementResult,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildEmojiJSONBody,
  RESTPostAPIGuildEmojiResult,
  RESTPostAPIInteractionCallbackQuery,
  RESTPostAPIInteractionCallbackResult,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  RESTPutAPIApplicationCommandPermissionsJSONBody,
  RESTPutAPIApplicationCommandPermissionsResult,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationCommandsResult,
  RESTPutAPIApplicationGuildCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsResult,
  RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
  RESTPutAPIApplicationRoleConnectionMetadataResult,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPutAPIChannelPermissionResult,
  RESTPutAPIChannelPinResult,
  RESTPutAPIChannelRecipientJSONBody,
  RESTPutAPIChannelRecipientResult,
  RESTPutAPIChannelThreadMembersResult,
  RESTPutAPIGuildApplicationCommandsPermissionsJSONBody,
  RESTPutAPIGuildApplicationCommandsPermissionsResult,
} from 'discord-api-types/v10'
import type { FileData } from '../types'
import type {
  _applications_$_activityinstances_$,
  _applications_$_commands,
  _applications_$_commands_$,
  _applications_$_emojis,
  _applications_$_emojis_$,
  _applications_$_entitlements,
  _applications_$_entitlements_$,
  _applications_$_entitlements_$_consume,
  _applications_$_guilds_$_commands,
  _applications_$_guilds_$_commands_$,
  _applications_$_guilds_$_commands_$_permissions,
  _applications_$_guilds_$_commands_permissions,
  _applications_$_roleconnections_metadata,
  _applications_me,
  _channels_$,
  _channels_$_followers,
  _channels_$_invites,
  _channels_$_messages,
  _channels_$_messages_$,
  _channels_$_messages_$_crosspost,
  _channels_$_messages_$_reactions,
  _channels_$_messages_$_reactions_$,
  _channels_$_messages_$_reactions_$_$,
  _channels_$_messages_$_reactions_$_me,
  _channels_$_messages_$_threads,
  _channels_$_messages_bulkdelete,
  _channels_$_permissions_$,
  _channels_$_pins,
  _channels_$_pins_$,
  _channels_$_recipients_$,
  _channels_$_threadmembers,
  _channels_$_threadmembers_$,
  _channels_$_threadmembers_me,
  _channels_$_threads,
  _channels_$_threads_archived_private,
  _channels_$_threads_archived_public,
  _channels_$_typing,
  _channels_$_users_me_threads_archived_private,
  _guilds_$_auditlogs,
  _guilds_$_automoderation_rules,
  _guilds_$_automoderation_rules_$,
  _guilds_$_channels,
  _guilds_$_emojis,
  _guilds_$_emojis_$,
  _interactions_$_$_callback,
  _webhooks_$_$,
  _webhooks_$_$_messages_$,
  _webhooks_$_$_messages_original,
} from './rest-path'

///// Unknowns /////
// [Get Application Activity Instance](https://discord.com/developers/docs/resources/application#get-application-activity-instance)
// [Start Thread in Forum or Media Channel](https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel)
// [List Public Archived Threads](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
// [List Private Archived Threads](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
// [List Joined Private Archived Threads](https://discord.com/developers/docs/resources/channel#list-joined-private-archived-threads)

type CouldNotFind = unknown

export type RestMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'

////////////////////////////////////////
//////                            //////
//////            Path            //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
type RestPathNV<M extends RestMethod> =
  M extends 'GET' ?
    // Application
    | typeof _applications_me
  : never

// biome-ignore format: ternary operator
type RestPathVars<M extends RestMethod> =
  M extends 'GET' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_$
    // Application Commands
    | typeof _applications_$_commands_$
    | typeof _applications_$_guilds_$_commands_$
    | typeof _applications_$_guilds_$_commands_permissions
    | typeof _applications_$_guilds_$_commands_$_permissions
    // Application
    | typeof _applications_$_activityinstances_$
    // Application Role Connection Metadata
    | typeof _applications_$_roleconnections_metadata
    // Auto Moderation
    | typeof _guilds_$_automoderation_rules
    | typeof _guilds_$_automoderation_rules_$
    // Channel
    | typeof _channels_$
    | typeof _channels_$_invites
    | typeof _channels_$_pins
    // Emoji
    | typeof _guilds_$_emojis
    | typeof _guilds_$_emojis_$
    | typeof _applications_$_emojis
    | typeof _applications_$_emojis_$
    // Entitlement
    | typeof _applications_$_entitlements_$
    // Message
    | typeof _channels_$_messages_$_reactions_$
  : M extends 'PUT' ?
    // Channel
    | typeof _channels_$_pins_$
    | typeof _channels_$_threadmembers_me
    | typeof _channels_$_threadmembers_$
    // Message
    | typeof _channels_$_messages_$_reactions_$_me
  : M extends 'POST' ?
    // Channel
    | typeof _channels_$_typing
    // Entitlement
    | typeof _applications_$_entitlements_$_consume
    // Message
    | typeof _channels_$_messages_$_crosspost
  : M extends 'PATCH' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_$
  : M extends 'DELETE' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_original
    | typeof _webhooks_$_$_messages_$
    // Application Commands
    | typeof _applications_$_commands_$
    | typeof _applications_$_guilds_$_commands_$
    // Auto Moderation
    | typeof _guilds_$_automoderation_rules_$
    // Channel
    | typeof _channels_$
    | typeof _channels_$_permissions_$
    | typeof _channels_$_pins_$
    | typeof _channels_$_recipients_$
    | typeof _channels_$_threadmembers_me
    | typeof _channels_$_threadmembers_$
    // Emoji
    | typeof _guilds_$_emojis_$
    | typeof _applications_$_emojis_$
    // Entitlement
    | typeof _applications_$_entitlements_$
    // Message
    | typeof _channels_$_messages_$
    | typeof _channels_$_messages_$_reactions
    | typeof _channels_$_messages_$_reactions_$
    | typeof _channels_$_messages_$_reactions_$_me
    | typeof _channels_$_messages_$_reactions_$_$  
  : never

// biome-ignore format: ternary operator
type RestPathVarsData<M extends RestMethod> =
  M extends 'GET' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_original
    | typeof _webhooks_$_$_messages_$
    // Application Commands
    | typeof _applications_$_commands
    | typeof _applications_$_guilds_$_commands
    // Audit Log
    | typeof _guilds_$_auditlogs
    // Channel
    | typeof _channels_$_threadmembers_$
    | typeof _channels_$_threadmembers
    | typeof _channels_$_threads_archived_public
    | typeof _channels_$_threads_archived_private
    | typeof _channels_$_users_me_threads_archived_private
    // Entitlement
    | typeof _applications_$_entitlements
    // Message
    | typeof _channels_$_messages
    | typeof _channels_$_messages_$
  : M extends 'PUT' ?
    // Application Commands
    | typeof _applications_$_commands
    | typeof _applications_$_guilds_$_commands
    | typeof _applications_$_guilds_$_commands_$_permissions
    | typeof _applications_$_guilds_$_commands_permissions
    // Application Role Connection Metadata
    | typeof _applications_$_roleconnections_metadata
    // Channel
    | typeof _channels_$_permissions_$
    | typeof _channels_$_recipients_$
  : M extends 'POST' ?
    // Application Commands
    | typeof _applications_$_commands
    | typeof _applications_$_guilds_$_commands
    // Auto Moderation
    | typeof _guilds_$_automoderation_rules
    // Channel
    | typeof _channels_$_invites
    | typeof _channels_$_followers
    | typeof _channels_$_messages_$_threads
    | typeof _channels_$_threads
    // Emoji
    | typeof _guilds_$_emojis
    | typeof _applications_$_emojis
    // Entitlement
    | typeof _applications_$_entitlements
    // Message
    | typeof _channels_$_messages_bulkdelete
    // Guild
    | typeof _guilds_$_channels
  : M extends 'PATCH' ?
    // Application Commands
    | typeof _applications_$_commands_$
    | typeof _applications_$_guilds_$_commands_$
    // Application
    | typeof _applications_me
    // Auto Moderation
    | typeof _guilds_$_automoderation_rules_$
    // Channel
    | typeof _channels_$
    // Emoji
    | typeof _guilds_$_emojis_$
    | typeof _applications_$_emojis_$
  : never

// biome-ignore format: ternary operator
type RestPathVarsDataFile<M extends RestMethod> =
  M extends 'POST' ?
    // Receiving and Responding
    | typeof _interactions_$_$_callback
    | typeof _webhooks_$_$_messages_original
    | typeof _webhooks_$_$
    // Channel
    | typeof _channels_$_threads
    // Message
    | typeof _channels_$_messages
  : M extends 'PATCH' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_$
    // Message
    | typeof _channels_$_messages_$
  : never

export type RestPath<M extends RestMethod> =
  | RestPathNV<M>
  | RestPathVars<M>
  | RestPathVarsData<M>
  | RestPathVarsDataFile<M>

////////////////////////////////////////
//////                            //////
//////         Variables          //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestVariables<P extends RestPath<any>> =
  P extends
    | typeof _applications_me
  ? [] :
  P extends
    | typeof _applications_$_commands
    | typeof _applications_$_roleconnections_metadata
    | typeof _guilds_$_auditlogs
    | typeof _guilds_$_automoderation_rules
    | typeof _channels_$
    | typeof _channels_$_invites
    | typeof _channels_$_followers
    | typeof _channels_$_typing
    | typeof _channels_$_pins
    | typeof _channels_$_threads
    | typeof _channels_$_threadmembers_me
    | typeof _channels_$_threadmembers
    | typeof _channels_$_threads_archived_public
    | typeof _channels_$_threads_archived_private
    | typeof _channels_$_users_me_threads_archived_private
    | typeof _channels_$_messages
    | typeof _channels_$_messages_bulkdelete
    | typeof _guilds_$_emojis
    | typeof _applications_$_emojis
    | typeof _applications_$_entitlements
    | typeof _guilds_$_channels
  ? [string] :
  P extends
    | typeof _interactions_$_$_callback
    | typeof _webhooks_$_$_messages_original
    | typeof _webhooks_$_$
    | typeof _applications_$_commands_$
    | typeof _applications_$_guilds_$_commands
    | typeof _applications_$_guilds_$_commands_permissions
    | typeof _applications_$_activityinstances_$
    | typeof _guilds_$_automoderation_rules_$
    | typeof _channels_$_permissions_$
    | typeof _channels_$_pins_$
    | typeof _channels_$_recipients_$
    | typeof _channels_$_messages_$_threads
    | typeof _channels_$_threadmembers_$
    | typeof _channels_$_messages_$
    | typeof _channels_$_messages_$_crosspost
    | typeof _channels_$_messages_$_reactions
    | typeof _guilds_$_emojis_$
    | typeof _applications_$_emojis_$
    | typeof _applications_$_entitlements_$
    | typeof _applications_$_entitlements_$_consume
  ? [string, string] :
  P extends
    | typeof _webhooks_$_$_messages_$
    | typeof _applications_$_guilds_$_commands_$
    | typeof _applications_$_guilds_$_commands_$_permissions
    | typeof _channels_$_messages_$_reactions_$_me
    | typeof _channels_$_messages_$_reactions_$
  ? [string, string, string] :
  P extends
    | typeof _channels_$_messages_$_reactions_$_$
  ? [string, string, string, string] : string[]

////////////////////////////////////////
//////                            //////
//////            Data            //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestData<M extends RestMethod, P extends RestPath<M>> =
  M extends 'GET' ?
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_original ? RESTGetAPIWebhookWithTokenMessageQuery :
    P extends typeof _webhooks_$_$_messages_$ ? RESTGetAPIWebhookWithTokenMessageQuery :
    // Application Commands
    P extends typeof _applications_$_commands ? RESTGetAPIApplicationCommandsQuery :
    P extends typeof _applications_$_guilds_$_commands ? RESTGetAPIApplicationGuildCommandsQuery :
    // Audit Log
    P extends typeof _guilds_$_auditlogs ? RESTGetAPIAuditLogQuery :
    // Channel
    P extends typeof _channels_$_threadmembers_$ ? RESTGetAPIChannelThreadMemberQuery :
    P extends typeof _channels_$_threadmembers ? RESTGetAPIChannelThreadMembersQuery :
    P extends typeof _channels_$_threads_archived_public ? CouldNotFind :
    P extends typeof _channels_$_threads_archived_private ? CouldNotFind :
    P extends typeof _channels_$_users_me_threads_archived_private ? CouldNotFind :
    // Entitlement
    P extends typeof _applications_$_entitlements ? RESTGetAPIEntitlementsQuery :
    // Message
    P extends typeof _channels_$_messages ? RESTGetAPIChannelMessagesQuery :
    P extends typeof _channels_$_messages_$ ? RESTGetAPIChannelMessageReactionUsersQuery :
    never
  : M extends 'PUT' ?
    // Application Commands
    P extends typeof _applications_$_commands ? RESTPutAPIApplicationCommandsJSONBody :
    P extends typeof _applications_$_guilds_$_commands ? RESTPutAPIApplicationGuildCommandsJSONBody :
    P extends typeof _applications_$_guilds_$_commands_$_permissions ? RESTPutAPIApplicationCommandPermissionsJSONBody :
    P extends typeof _applications_$_guilds_$_commands_permissions ? RESTPutAPIGuildApplicationCommandsPermissionsJSONBody :
    // Application Role Connection Metadata
    P extends typeof _applications_$_roleconnections_metadata ? RESTPutAPIApplicationRoleConnectionMetadataJSONBody :
    // Channel
    P extends typeof _channels_$_permissions_$ ? RESTPutAPIChannelPermissionJSONBody :
    P extends typeof _channels_$_recipients_$ ? RESTPutAPIChannelRecipientJSONBody :
    never
  : M extends 'POST' ?
    // Receiving and Responding
    P extends typeof _interactions_$_$_callback ? RESTPostAPIInteractionCallbackQuery :
    P extends typeof _webhooks_$_$_messages_original ? RESTPatchAPIInteractionOriginalResponseJSONBody :
    P extends typeof _webhooks_$_$ ? RESTPostAPIInteractionFollowupJSONBody :
    // Application Commands
    P extends typeof _applications_$_commands ? RESTPostAPIApplicationCommandsJSONBody :
    P extends typeof _applications_$_guilds_$_commands ? RESTPostAPIApplicationGuildCommandsJSONBody :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules ? RESTPostAPIAutoModerationRuleJSONBody :
    // Channel
    P extends typeof _channels_$_invites ? RESTPostAPIChannelInviteJSONBody :
    P extends typeof _channels_$_followers ? RESTPostAPIChannelFollowersJSONBody :
    P extends typeof _channels_$_messages_$_threads ? RESTPostAPIChannelMessagesThreadsJSONBody :
    P extends typeof _channels_$_threads ? RESTPostAPIChannelThreadsJSONBody | CouldNotFind :
    // Emoji
    P extends typeof _guilds_$_emojis ? RESTPostAPIGuildEmojiJSONBody :
    P extends typeof _applications_$_emojis ? RESTPostAPIApplicationEmojiJSONBody :
    // Entitlement
    P extends typeof _applications_$_entitlements ? RESTPostAPIEntitlementJSONBody :
    // Message
    P extends typeof _channels_$_messages ? RESTPostAPIChannelMessageJSONBody :
    P extends typeof _channels_$_messages_bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteJSONBody :
    // Guild
    P extends typeof _guilds_$_channels ? RESTPostAPIGuildChannelJSONBody :
    never  
  : M extends 'PATCH' ?
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_$ ? RESTPatchAPIInteractionFollowupJSONBody :
    // Application Commands
    P extends typeof _applications_$_commands_$ ? RESTPatchAPIApplicationCommandJSONBody :
    P extends typeof _applications_$_guilds_$_commands_$ ? RESTPatchAPIApplicationGuildCommandJSONBody :
    // Application
    P extends typeof _applications_me ? RESTPatchCurrentApplicationJSONBody :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules_$ ? RESTPatchAPIAutoModerationRuleJSONBody :
    // Message
    P extends typeof _channels_$_messages_$ ? RESTPatchAPIChannelMessageJSONBody :
    // Channel
    P extends typeof _channels_$ ? RESTPatchAPIChannelJSONBody :
    // Emoji
    P extends typeof _guilds_$_emojis_$ ? RESTPatchAPIGuildEmojiJSONBody :
    P extends typeof _applications_$_emojis_$ ? RESTPatchAPIApplicationEmojiJSONBody :
    never  
  : never

////////////////////////////////////////
//////                            //////
//////            File            //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestFile<M extends RestMethod, P extends RestPath<M>> =
  M extends 'POST' ?
    P extends
      // Receiving and Responding
      | typeof _interactions_$_$_callback
      | typeof _webhooks_$_$_messages_original
      | typeof _webhooks_$_$
      // Channel
      | typeof _channels_$_threads
      // Message
      | typeof _channels_$_messages
    ? FileData : never
  : M extends 'PATCH' ?
    P extends
      // Receiving and Responding
      | typeof _webhooks_$_$_messages_$
      // Message
      | typeof _channels_$_messages_$
    ? FileData : never
  : never

////////////////////////////////////////
//////                            //////
//////           Result           //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestResult<M extends RestMethod, P extends RestPath<M>> =
  M extends 'GET' ?
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_original ? RESTGetAPIInteractionOriginalResponseResult :
    P extends typeof _webhooks_$_$_messages_$ ? RESTGetAPIInteractionFollowupResult :
    // Application Commands
    P extends typeof _applications_$_commands ? RESTGetAPIApplicationCommandsResult :
    P extends typeof _applications_$_commands_$ ? RESTGetAPIApplicationCommandResult :
    P extends typeof _applications_$_guilds_$_commands ? RESTGetAPIApplicationGuildCommandsResult :
    P extends typeof _applications_$_guilds_$_commands_$ ? RESTGetAPIApplicationGuildCommandResult :
    P extends typeof _applications_$_guilds_$_commands_permissions ? RESTGetAPIGuildApplicationCommandsPermissionsResult :
    P extends typeof _applications_$_guilds_$_commands_$_permissions ? RESTGetAPIApplicationCommandPermissionsResult :
    // Application
    P extends typeof _applications_me ? RESTGetCurrentApplicationResult :
    P extends typeof _applications_$_activityinstances_$ ? CouldNotFind :
    // Application Role Connection Metadata
    P extends typeof _applications_$_roleconnections_metadata ? RESTGetAPIApplicationRoleConnectionMetadataResult :
    // Audit Log
    P extends typeof _guilds_$_auditlogs ? RESTGetAPIAuditLogResult :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules ? RESTGetAPIAutoModerationRulesResult :
    P extends typeof _guilds_$_automoderation_rules_$ ? RESTGetAPIAutoModerationRuleResult :
    // Channel
    P extends typeof _channels_$ ? RESTGetAPIChannelResult :
    P extends typeof _channels_$_invites ? RESTGetAPIChannelInvitesResult :
    P extends typeof _channels_$_pins ? RESTGetAPIChannelPinsResult :
    P extends typeof _channels_$_threadmembers_$ ? RESTGetAPIChannelThreadMemberResult :
    P extends typeof _channels_$_threadmembers ? RESTGetAPIChannelThreadMembersResult :
    P extends typeof _channels_$_threads_archived_public ? RESTGetAPIChannelThreadsArchivedPublicResult :
    P extends typeof _channels_$_threads_archived_private ? RESTGetAPIChannelThreadsArchivedPrivateResult :
    P extends typeof _channels_$_users_me_threads_archived_private ? CouldNotFind :
    // Emoji
    P extends typeof _guilds_$_emojis ? RESTGetAPIGuildEmojisResult :
    P extends typeof _guilds_$_emojis_$ ? RESTGetAPIGuildEmojiResult :
    P extends typeof _applications_$_emojis ? RESTGetAPIApplicationEmojisResult :
    P extends typeof _applications_$_emojis_$ ? RESTGetAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof _applications_$_entitlements ? RESTGetAPIEntitlementsResult :
    P extends typeof _applications_$_entitlements_$ ? RESTGetAPIEntitlementResult :
    // Message
    P extends typeof _channels_$_messages ? RESTGetAPIChannelMessagesResult :
    P extends typeof _channels_$_messages_$ ? RESTGetAPIChannelMessageResult :
    P extends typeof _channels_$_messages_$_reactions_$ ? RESTGetAPIChannelMessageReactionUsersResult :
    never
  : M extends 'PUT' ?
    // Application Commands
    P extends typeof _applications_$_commands ? RESTPutAPIApplicationCommandsResult :
    P extends typeof _applications_$_guilds_$_commands ? RESTPutAPIApplicationGuildCommandsResult :
    P extends typeof _applications_$_guilds_$_commands_$_permissions ? RESTPutAPIApplicationCommandPermissionsResult :
    P extends typeof _applications_$_guilds_$_commands_permissions ? RESTPutAPIGuildApplicationCommandsPermissionsResult :
    // Application Role Connection Metadata
    P extends typeof _applications_$_roleconnections_metadata ? RESTPutAPIApplicationRoleConnectionMetadataResult :
    // Channel
    P extends typeof _channels_$_permissions_$ ? RESTPutAPIChannelPermissionResult :
    P extends typeof _channels_$_pins_$ ? RESTPutAPIChannelPinResult :
    P extends typeof _channels_$_recipients_$ ? RESTPutAPIChannelRecipientResult :
    P extends typeof _channels_$_threadmembers_me ? RESTPutAPIChannelThreadMembersResult :
    P extends typeof _channels_$_threadmembers_$ ? RESTPutAPIChannelThreadMembersResult :
    never
  : M extends 'POST' ?
    // Receiving and Responding
    P extends typeof _interactions_$_$_callback ? RESTPostAPIInteractionCallbackResult :
    P extends typeof _webhooks_$_$_messages_original ? RESTPatchAPIInteractionOriginalResponseResult :
    P extends typeof _webhooks_$_$ ? RESTPostAPIInteractionFollowupResult :
    // Application Commands
    P extends typeof _applications_$_commands ? RESTPostAPIApplicationCommandsResult :
    P extends typeof _applications_$_guilds_$_commands ? RESTPostAPIApplicationGuildCommandsResult :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules ? RESTPostAPIAutoModerationRuleResult :
    // Channel
    P extends typeof _channels_$_invites ? RESTPostAPIChannelInviteResult :
    P extends typeof _channels_$_followers ? RESTPostAPIChannelFollowersResult :
    P extends typeof _channels_$_typing ? RESTPostAPIChannelTypingResult :
    P extends typeof _channels_$_messages_$_threads ? RESTPostAPIChannelMessagesThreadsResult :
    P extends typeof _channels_$_threads ? RESTPostAPIChannelThreadsResult | CouldNotFind :
    // Emoji
    P extends typeof _guilds_$_emojis ? RESTPostAPIGuildEmojiResult :
    P extends typeof _applications_$_emojis ? RESTPostAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof _applications_$_entitlements_$_consume ? RESTPostAPIEntitlementConsumeResult :
    P extends typeof _applications_$_entitlements ? RESTPostAPIEntitlementResult :
    never
  : M extends 'PATCH' ?
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_$ ? RESTPatchAPIInteractionFollowupResult :
    // Application Commands
    P extends typeof _applications_$_commands_$ ? RESTPatchAPIApplicationCommandResult :
    P extends typeof _applications_$_guilds_$_commands_$ ? RESTPatchAPIApplicationGuildCommandResult :
    // Application
    P extends typeof _applications_me ? RESTPatchCurrentApplicationResult :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules_$ ? RESTPatchAPIAutoModerationRuleResult :
    // Channel
    P extends typeof _channels_$ ? RESTPatchAPIChannelResult :
    // Emoji
    P extends typeof _guilds_$_emojis_$ ? RESTPatchAPIGuildEmojiResult :
    P extends typeof _applications_$_emojis_$ ? RESTPatchAPIApplicationEmojiResult :
    never
  : M extends 'DELETE' ?
    // Channel
    P extends typeof _channels_$ ? RESTDeleteAPIChannelResult :
    P extends typeof _channels_$_permissions_$ ? RESTDeleteAPIChannelPermissionResult :
    P extends typeof _channels_$_pins_$ ? RESTDeleteAPIChannelPinResult :
    P extends typeof _channels_$_recipients_$ ? RESTDeleteAPIChannelRecipientResult :
    P extends typeof _channels_$_threadmembers_me ? RESTDeleteAPIChannelThreadMembersResult :
    P extends typeof _channels_$_threadmembers_$ ? RESTDeleteAPIChannelThreadMembersResult :
    // Emoji
    P extends typeof _guilds_$_emojis_$ ? RESTDeleteAPIGuildEmojiResult :
    P extends typeof _applications_$_emojis_$ ? RESTDeleteAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof _applications_$_entitlements_$ ? RESTDeleteAPIEntitlementResult :
    never
  : never

type TypedResponse<T> = Omit<Response, 'json'> & { json(): Promise<T> }

export type Rest = {
  <M extends RestMethod, P extends RestPathNV<M>>(method: M, path: P): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVars<M>>(
    method: M,
    path: P,
    variables: RestVariables<P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsData<M>>(
    method: M,
    path: P,
    variables: RestVariables<P>,
    data: RestData<M, P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsDataFile<M>>(
    method: M,
    path: P,
    variables: RestVariables<P>,
    data: RestData<M, P>,
    file?: RestFile<M, P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
}
