import type {
  APIInteractionResponse,
  RESTDeleteAPIApplicationEmojiResult,
  RESTDeleteAPIChannelMessageOwnReactionResult,
  RESTDeleteAPIChannelMessageReactionResult,
  RESTDeleteAPIChannelMessageResult,
  RESTDeleteAPIChannelMessageUserReactionResult,
  RESTDeleteAPIChannelPermissionResult,
  RESTDeleteAPIChannelPinResult,
  RESTDeleteAPIChannelRecipientResult,
  RESTDeleteAPIChannelResult,
  RESTDeleteAPIChannelThreadMembersResult,
  RESTDeleteAPICurrentUserGuildResult,
  RESTDeleteAPIEntitlementResult,
  RESTDeleteAPIGuildBanResult,
  RESTDeleteAPIGuildEmojiResult,
  RESTDeleteAPIGuildIntegrationResult,
  RESTDeleteAPIGuildMemberResult,
  RESTDeleteAPIGuildMemberRoleResult,
  RESTDeleteAPIGuildResult,
  RESTDeleteAPIGuildRoleResult,
  RESTDeleteAPIGuildScheduledEventResult,
  RESTDeleteAPIGuildSoundboardSoundResult,
  RESTDeleteAPIGuildStickerResult,
  RESTDeleteAPIGuildTemplateResult,
  RESTDeleteAPIInviteResult,
  RESTDeleteAPIStageInstanceResult,
  RESTDeleteAPIWebhookResult,
  RESTDeleteAPIWebhookWithTokenMessageResult,
  RESTDeleteAPIWebhookWithTokenResult,
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
  RESTGetAPIChannelWebhooksResult,
  RESTGetAPICurrentUserApplicationRoleConnectionResult,
  RESTGetAPICurrentUserConnectionsResult,
  RESTGetAPICurrentUserGuildsQuery,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPIEntitlementResult,
  RESTGetAPIEntitlementsQuery,
  RESTGetAPIEntitlementsResult,
  RESTGetAPIGuildApplicationCommandsPermissionsResult,
  RESTGetAPIGuildBanResult,
  RESTGetAPIGuildBansQuery,
  RESTGetAPIGuildBansResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildEmojiResult,
  RESTGetAPIGuildEmojisResult,
  RESTGetAPIGuildIntegrationsResult,
  RESTGetAPIGuildInvitesResult,
  RESTGetAPIGuildMemberResult,
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildMembersSearchQuery,
  RESTGetAPIGuildMembersSearchResult,
  RESTGetAPIGuildOnboardingResult,
  RESTGetAPIGuildPreviewResult,
  RESTGetAPIGuildPruneCountQuery,
  RESTGetAPIGuildPruneCountResult,
  RESTGetAPIGuildQuery,
  RESTGetAPIGuildResult,
  RESTGetAPIGuildRoleResult,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIGuildScheduledEventQuery,
  RESTGetAPIGuildScheduledEventResult,
  RESTGetAPIGuildScheduledEventsQuery,
  RESTGetAPIGuildScheduledEventsResult,
  RESTGetAPIGuildScheduledEventUsersQuery,
  RESTGetAPIGuildScheduledEventUsersResult,
  RESTGetAPIGuildSoundboardSoundResult,
  RESTGetAPIGuildSoundboardSoundsResult,
  RESTGetAPIGuildStickerResult,
  RESTGetAPIGuildStickersResult,
  RESTGetAPIGuildTemplatesResult,
  RESTGetAPIGuildThreadsResult,
  RESTGetAPIGuildVanityUrlResult,
  RESTGetAPIGuildVoiceRegionsResult,
  RESTGetAPIGuildVoiceStateCurrentMemberResult,
  RESTGetAPIGuildVoiceStateUserResult,
  RESTGetAPIGuildWebhooksResult,
  RESTGetAPIGuildWelcomeScreenResult,
  RESTGetAPIGuildWidgetImageQuery,
  RESTGetAPIGuildWidgetImageResult,
  RESTGetAPIGuildWidgetJSONResult,
  RESTGetAPIGuildWidgetSettingsResult,
  RESTGetAPIInteractionFollowupResult,
  RESTGetAPIInteractionOriginalResponseResult,
  RESTGetAPIInviteQuery,
  RESTGetAPIInviteResult,
  RESTGetAPIPollAnswerVotersQuery,
  RESTGetAPIPollAnswerVotersResult,
  RESTGetAPISKUSubscriptionResult,
  RESTGetAPISKUSubscriptionsQuery,
  RESTGetAPISKUSubscriptionsResult,
  RESTGetAPISKUsResult,
  RESTGetAPISoundboardDefaultSoundsResult,
  RESTGetAPIStageInstanceResult,
  RESTGetAPIStickerPackResult,
  RESTGetAPIStickerResult,
  RESTGetAPITemplateResult,
  RESTGetAPIUserResult,
  RESTGetAPIVoiceRegionsResult,
  RESTGetAPIWebhookResult,
  RESTGetAPIWebhookWithTokenMessageQuery,
  RESTGetAPIWebhookWithTokenMessageResult,
  RESTGetAPIWebhookWithTokenResult,
  RESTGetCurrentApplicationResult,
  RESTGetCurrentUserGuildMemberResult,
  RESTGetStickerPacksResult,
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
  RESTPatchAPIChannelMessageResult,
  RESTPatchAPIChannelResult,
  RESTPatchAPICurrentGuildMemberJSONBody,
  RESTPatchAPICurrentGuildMemberNicknameJSONBody,
  RESTPatchAPICurrentGuildMemberNicknameResult,
  RESTPatchAPICurrentUserJSONBody,
  RESTPatchAPICurrentUserResult,
  RESTPatchAPIGuildChannelPositionsJSONBody,
  RESTPatchAPIGuildChannelPositionsResult,
  RESTPatchAPIGuildEmojiJSONBody,
  RESTPatchAPIGuildEmojiResult,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIGuildMemberResult,
  RESTPatchAPIGuildResult,
  RESTPatchAPIGuildRoleJSONBody,
  RESTPatchAPIGuildRolePositionsJSONBody,
  RESTPatchAPIGuildRolePositionsResult,
  RESTPatchAPIGuildRoleResult,
  RESTPatchAPIGuildScheduledEventJSONBody,
  RESTPatchAPIGuildScheduledEventResult,
  RESTPatchAPIGuildSoundboardSoundJSONBody,
  RESTPatchAPIGuildSoundboardSoundResult,
  RESTPatchAPIGuildStickerJSONBody,
  RESTPatchAPIGuildStickerResult,
  RESTPatchAPIGuildTemplateJSONBody,
  RESTPatchAPIGuildTemplateResult,
  RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
  RESTPatchAPIGuildVoiceStateCurrentMemberResult,
  RESTPatchAPIGuildVoiceStateUserJSONBody,
  RESTPatchAPIGuildVoiceStateUserResult,
  RESTPatchAPIGuildWelcomeScreenJSONBody,
  RESTPatchAPIGuildWelcomeScreenResult,
  RESTPatchAPIGuildWidgetSettingsJSONBody,
  RESTPatchAPIGuildWidgetSettingsResult,
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPatchAPIInteractionFollowupResult,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIInteractionOriginalResponseResult,
  RESTPatchAPIStageInstanceJSONBody,
  RESTPatchAPIStageInstanceResult,
  RESTPatchAPIWebhookJSONBody,
  RESTPatchAPIWebhookResult,
  RESTPatchAPIWebhookWithTokenJSONBody,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPatchAPIWebhookWithTokenResult,
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
  RESTPostAPIChannelMessageCrosspostResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
  RESTPostAPIChannelMessagesBulkDeleteResult,
  RESTPostAPIChannelMessagesThreadsJSONBody,
  RESTPostAPIChannelMessagesThreadsResult,
  RESTPostAPIChannelThreadsJSONBody,
  RESTPostAPIChannelThreadsResult,
  RESTPostAPIChannelTypingResult,
  RESTPostAPIChannelWebhookJSONBody,
  RESTPostAPIChannelWebhookResult,
  RESTPostAPICurrentUserCreateDMChannelJSONBody,
  RESTPostAPICurrentUserCreateDMChannelResult,
  RESTPostAPIEntitlementConsumeResult,
  RESTPostAPIEntitlementJSONBody,
  RESTPostAPIEntitlementResult,
  RESTPostAPIGuildBulkBanJSONBody,
  RESTPostAPIGuildBulkBanResult,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildChannelResult,
  RESTPostAPIGuildEmojiJSONBody,
  RESTPostAPIGuildEmojiResult,
  RESTPostAPIGuildPruneJSONBody,
  RESTPostAPIGuildPruneResult,
  RESTPostAPIGuildRoleJSONBody,
  RESTPostAPIGuildRoleResult,
  RESTPostAPIGuildScheduledEventJSONBody,
  RESTPostAPIGuildScheduledEventResult,
  RESTPostAPIGuildSoundboardSoundJSONBody,
  RESTPostAPIGuildSoundboardSoundResult,
  RESTPostAPIGuildsJSONBody,
  RESTPostAPIGuildsMFAJSONBody,
  RESTPostAPIGuildsMFAResult,
  RESTPostAPIGuildsResult,
  RESTPostAPIGuildTemplatesJSONBody,
  RESTPostAPIGuildTemplatesResult,
  RESTPostAPIInteractionCallbackQuery,
  RESTPostAPIInteractionCallbackResult,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  RESTPostAPIPollExpireResult,
  RESTPostAPISoundboardSendSoundJSONBody,
  RESTPostAPIStageInstanceJSONBody,
  RESTPostAPIStageInstanceResult,
  RESTPostAPITemplateCreateGuildJSONBody,
  RESTPostAPITemplateCreateGuildResult,
  RESTPostAPIWebhookWithTokenGitHubQuery,
  RESTPostAPIWebhookWithTokenGitHubResult,
  RESTPostAPIWebhookWithTokenGitHubWaitResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenQuery,
  RESTPostAPIWebhookWithTokenResult,
  RESTPostAPIWebhookWithTokenSlackQuery,
  RESTPostAPIWebhookWithTokenSlackResult,
  RESTPostAPIWebhookWithTokenSlackWaitResult,
  RESTPostAPIWebhookWithTokenWaitResult,
  RESTPutAPIApplicationCommandPermissionsJSONBody,
  RESTPutAPIApplicationCommandPermissionsResult,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationCommandsResult,
  RESTPutAPIApplicationGuildCommandsJSONBody,
  RESTPutAPIApplicationGuildCommandsResult,
  RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
  RESTPutAPIApplicationRoleConnectionMetadataResult,
  RESTPutAPIChannelMessageReactionResult,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPutAPIChannelPermissionResult,
  RESTPutAPIChannelPinResult,
  RESTPutAPIChannelRecipientJSONBody,
  RESTPutAPIChannelRecipientResult,
  RESTPutAPIChannelThreadMembersResult,
  RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
  RESTPutAPICurrentUserApplicationRoleConnectionResult,
  RESTPutAPIGuildApplicationCommandsPermissionsJSONBody,
  RESTPutAPIGuildApplicationCommandsPermissionsResult,
  RESTPutAPIGuildBanJSONBody,
  RESTPutAPIGuildBanResult,
  RESTPutAPIGuildIncidentActionsJSONBody,
  RESTPutAPIGuildMemberJSONBody,
  RESTPutAPIGuildMemberResult,
  RESTPutAPIGuildMemberRoleResult,
  RESTPutAPIGuildOnboardingJSONBody,
  RESTPutAPIGuildOnboardingResult,
  RESTPutAPIGuildTemplateSyncResult,
  //RESTPostAPIGuildStickerFormDataBody,
  //RESTPostAPIGuildStickerResult,
} from 'discord-api-types/v10'
import type { CustomCallbackData, FileData } from '../types'
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
  _applications_$_skus,
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
  _channels_$_polls_$_answers_$,
  _channels_$_polls_$_expire,
  _channels_$_recipients_$,
  _channels_$_sendsoundboardsound,
  _channels_$_threadmembers,
  _channels_$_threadmembers_$,
  _channels_$_threadmembers_me,
  _channels_$_threads,
  _channels_$_threads_archived_private,
  _channels_$_threads_archived_public,
  _channels_$_typing,
  _channels_$_users_me_threads_archived_private,
  _channels_$_webhooks,
  _guilds,
  _guilds_$,
  _guilds_$_auditlogs,
  _guilds_$_automoderation_rules,
  _guilds_$_automoderation_rules_$,
  _guilds_$_bans,
  _guilds_$_bans_$,
  _guilds_$_bulkban,
  _guilds_$_channels,
  _guilds_$_emojis,
  _guilds_$_emojis_$,
  _guilds_$_incidentactions,
  _guilds_$_integrations,
  _guilds_$_integrations_$,
  _guilds_$_invites,
  _guilds_$_members,
  _guilds_$_members_$,
  _guilds_$_members_$_roles_$,
  _guilds_$_members_me,
  _guilds_$_members_me_nick,
  _guilds_$_members_search,
  _guilds_$_mfa,
  _guilds_$_onboarding,
  _guilds_$_preview,
  _guilds_$_prune,
  _guilds_$_regions,
  _guilds_$_roles,
  _guilds_$_roles_$,
  _guilds_$_scheduledevents,
  _guilds_$_scheduledevents_$,
  _guilds_$_scheduledevents_$_users,
  _guilds_$_soundboardsounds,
  _guilds_$_soundboardsounds_$,
  _guilds_$_stickers,
  _guilds_$_stickers_$,
  _guilds_$_templates,
  _guilds_$_templates_$,
  _guilds_$_threads_active,
  _guilds_$_vanityurl,
  _guilds_$_voicestates_$,
  _guilds_$_voicestates_me,
  _guilds_$_webhooks,
  _guilds_$_welcomescreen,
  _guilds_$_widget,
  _guilds_$_widgetjson,
  _guilds_$_widgetpng,
  _guilds_templates_$,
  _interactions_$_$_callback,
  _invites_$,
  _skus_$_subscriptions,
  _skus_$_subscriptions_$,
  _soundboarddefaultsounds,
  _stageinstances,
  _stageinstances_$,
  _stickerpacks,
  _stickerpacks_$,
  _stickers_$,
  _users_$,
  _users_me,
  _users_me_applications_$_roleconnection,
  _users_me_channels,
  _users_me_connections,
  _users_me_guilds,
  _users_me_guilds_$,
  _users_me_guilds_$_member,
  _voice_regions,
  _webhooks_$,
  _webhooks_$_$,
  _webhooks_$_$_github,
  _webhooks_$_$_messages_$,
  _webhooks_$_$_messages_original,
  _webhooks_$_$_slack,
} from './rest-path'

///// Unknowns /////
// [Get Application Activity Instance](https://discord.com/developers/docs/resources/application#get-application-activity-instance)
// [Start Thread in Forum or Media Channel](https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel)
// [List Public Archived Threads](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
// [List Private Archived Threads](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
// [List Joined Private Archived Threads](https://discord.com/developers/docs/resources/channel#list-joined-private-archived-threads)
// [Modify Current Member](https://discord.com/developers/docs/resources/guild#modify-current-member)
// [Modify Guild Incident Actions](https://discord.com/developers/docs/resources/guild#modify-guild-incident-actions)
// [Create Group DM](https://discord.com/developers/docs/resources/user#create-group-dm)

///// Not supported yet /////
// [Create Guild Sticker](https://discord.com/developers/docs/resources/sticker#create-guild-sticker) // https://discord-api-types.dev/search?q=RESTPostAPIGuildSticker

type CouldNotFind = Record<string, unknown>

export type Query<T> = { query?: T }

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
    // Soundboard
    | typeof _soundboarddefaultsounds
    // Sticker
    | typeof _stickerpacks
    // User
    | typeof _users_me
    | typeof _users_me_connections
    // Voice
    | typeof _voice_regions
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
    // Guild
    | typeof _guilds_$_preview
    | typeof _guilds_$_channels
    | typeof _guilds_$_threads_active
    | typeof _guilds_$_members_$
    | typeof _guilds_$_bans_$
    | typeof _guilds_$_roles
    | typeof _guilds_$_roles_$
    | typeof _guilds_$_regions
    | typeof _guilds_$_invites
    | typeof _guilds_$_integrations
    | typeof _guilds_$_widget
    | typeof _guilds_$_widgetjson
    | typeof _guilds_$_vanityurl
    | typeof _guilds_$_welcomescreen
    | typeof _guilds_$_onboarding
    // Guild Template
    | typeof _guilds_templates_$
    | typeof _guilds_$_templates
    // Message
    | typeof _channels_$_messages_$
    // SKU
    | typeof _applications_$_skus
    // Soundboard
    | typeof _guilds_$_soundboardsounds
    | typeof _guilds_$_soundboardsounds_$
    // Stage Instance
    | typeof _stageinstances_$
    // Sticker
    | typeof _stickers_$
    | typeof _stickerpacks_$
    | typeof _guilds_$_stickers
    | typeof _guilds_$_stickers_$
    // Subscription
    | typeof _skus_$_subscriptions_$
    // User
    | typeof _users_$
    | typeof _users_me_guilds_$_member
    | typeof _users_me_applications_$_roleconnection
    // Voice
    | typeof _guilds_$_voicestates_me
    | typeof _guilds_$_voicestates_$
    // Webhook
    | typeof _channels_$_webhooks
    | typeof _guilds_$_webhooks
    | typeof _webhooks_$
    | typeof _webhooks_$_$
  : M extends 'PUT' ?
    // Channel
    | typeof _channels_$_pins_$
    | typeof _channels_$_threadmembers_me
    | typeof _channels_$_threadmembers_$
    // Guild
    | typeof _guilds_$_members_$_roles_$
    // Guild Template
    | typeof _guilds_$_templates_$
    // Message
    | typeof _channels_$_messages_$_reactions_$_me
  : M extends 'POST' ?
    // Channel
    | typeof _channels_$_typing
    // Entitlement
    | typeof _applications_$_entitlements_$_consume
    // Message
    | typeof _channels_$_messages_$_crosspost
    // Poll
    | typeof _channels_$_polls_$_expire
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
    // Guild
    | typeof _guilds_$
    | typeof _guilds_$_members_$_roles_$
    | typeof _guilds_$_members_$
    | typeof _guilds_$_bans_$
    | typeof _guilds_$_roles_$
    | typeof _guilds_$_integrations_$
    // Guild Schedule Event
    | typeof _guilds_$_scheduledevents_$
    // Guild Template
    | typeof _guilds_$_templates_$
    // Invite
    | typeof _invites_$
    // Message
    | typeof _channels_$_messages_$_reactions_$_me
    | typeof _channels_$_messages_$_reactions_$_$  
    | typeof _channels_$_messages_$_reactions
    | typeof _channels_$_messages_$_reactions_$
    | typeof _channels_$_messages_$
    // Soundboard
    | typeof _guilds_$_soundboardsounds_$
    // Stage Instance
    | typeof _stageinstances_$
    // Sticker
    | typeof _guilds_$_stickers_$
    // User
    | typeof _users_me_guilds_$
    // Webhook
    | typeof _webhooks_$
    | typeof _webhooks_$_$
    | typeof _webhooks_$_$_messages_$
  : never

// Optional化のチェック GET のみ
// biome-ignore format: ternary operator
type RestPathVarsOptionalData<M extends RestMethod> =
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
    // Guild
    | typeof _guilds_$
    | typeof _guilds_$_members
    | typeof _guilds_$_bans
    | typeof _guilds_$_prune
    | typeof _guilds_$_widgetpng
    // Guild Schedule Event
    | typeof _guilds_$_scheduledevents
    | typeof _guilds_$_scheduledevents_$
    | typeof _guilds_$_scheduledevents_$_users
    // Invite
    | typeof _invites_$
    // Message
    | typeof _channels_$_messages
    | typeof _channels_$_messages_$_reactions_$
    // Poll
    | typeof _channels_$_polls_$_answers_$
    // Subscription
    | typeof _skus_$_subscriptions
    // User
    | typeof _users_me_guilds
  : never

// biome-ignore format: ternary operator
type RestPathVarsData<M extends RestMethod> =
  M extends 'GET' ?
    // Guild
    | typeof _guilds_$_members_search
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
    // Guild
    | typeof _guilds_$_members_$
    | typeof _guilds_$_bans_$
    | typeof _guilds_$_onboarding
    | typeof _guilds_$_incidentactions
    // User
    | typeof _users_me_applications_$_roleconnection
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
    // Guild
    | typeof _guilds
    | typeof _guilds_$_channels
    | typeof _guilds_$_bulkban
    | typeof _guilds_$_roles
    | typeof _guilds_$_roles_$
    | typeof _guilds_$_mfa
    | typeof _guilds_$_prune
    // Guild Schedule Event
    | typeof _guilds_$_scheduledevents
    // Guild Template
    | typeof _guilds_templates_$
    | typeof _guilds_$_templates
    // Message
    | typeof _channels_$_messages_bulkdelete
    // Soundboard
    | typeof _channels_$_sendsoundboardsound
    | typeof _guilds_$_soundboardsounds
    // Stage Instance
    | typeof _stageinstances
    // User
    | typeof _users_me_channels
    // Webhook
    | typeof _channels_$_webhooks
    | typeof _webhooks_$_$
    | typeof _webhooks_$_$_slack
    | typeof _webhooks_$_$_github
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
    // Guild
    | typeof _guilds_$
    | typeof _guilds_$_channels
    | typeof _guilds_$_members_$
    | typeof _guilds_$_members_me
    | typeof _guilds_$_members_me_nick
    | typeof _guilds_$_roles
    | typeof _guilds_$_widget
    | typeof _guilds_$_welcomescreen
    // Guild Schedule Event
    | typeof _guilds_$_scheduledevents_$
    // Guild Template
    | typeof _guilds_$_templates_$
    // Soundboard
    | typeof _guilds_$_soundboardsounds_$
    // Stage Instance
    | typeof _stageinstances_$
    // Sticker
    | typeof _guilds_$_stickers_$
    // User
    | typeof _users_me
    // Voice
    | typeof _guilds_$_voicestates_me
    | typeof _guilds_$_voicestates_$
    // Webhook
    | typeof _webhooks_$
    | typeof _webhooks_$_$
  : never

// biome-ignore format: ternary operator
type RestPathVarsDataFile<M extends RestMethod> =
  M extends 'POST' ?
    // Receiving and Responding
    | typeof _interactions_$_$_callback
    | typeof _webhooks_$_$
    // Channel
    | typeof _channels_$_threads
    // Message
    | typeof _channels_$_messages
  : M extends 'PATCH' ?
    // Receiving and Responding
    | typeof _webhooks_$_$_messages_original
    | typeof _webhooks_$_$_messages_$
    // Message
    | typeof _channels_$_messages_$
    // Webhook
    | typeof _webhooks_$_$_messages_$
  : never

export type RestPath<M extends RestMethod> =
  | RestPathNV<M>
  | RestPathVars<M>
  | RestPathVarsOptionalData<M>
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
    | typeof _guilds
    | typeof _soundboarddefaultsounds
    | typeof _stageinstances
    | typeof _stickerpacks
    | typeof _users_me
    | typeof _users_me_guilds
    | typeof _users_me_channels
    | typeof _users_me_connections
    | typeof _voice_regions
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
    | typeof _guilds_$
    | typeof _guilds_$_preview
    | typeof _guilds_$_channels
    | typeof _guilds_$_threads_active
    | typeof _guilds_$_members
    | typeof _guilds_$_members_search
    | typeof _guilds_$_members_me
    | typeof _guilds_$_members_me_nick
    | typeof _guilds_$_bans
    | typeof _guilds_$_bulkban
    | typeof _guilds_$_roles
    | typeof _guilds_$_mfa
    | typeof _guilds_$_prune
    | typeof _guilds_$_regions
    | typeof _guilds_$_invites
    | typeof _guilds_$_integrations
    | typeof _guilds_$_widget
    | typeof _guilds_$_widgetjson
    | typeof _guilds_$_vanityurl
    | typeof _guilds_$_widgetpng
    | typeof _guilds_$_welcomescreen
    | typeof _guilds_$_onboarding
    | typeof _guilds_$_incidentactions
    | typeof _guilds_$_scheduledevents
    | typeof _guilds_templates_$
    | typeof _guilds_$_templates
    | typeof _invites_$
    | typeof _applications_$_skus
    | typeof _channels_$_sendsoundboardsound
    | typeof _guilds_$_soundboardsounds
    | typeof _stageinstances_$
    | typeof _stickers_$
    | typeof _stickerpacks_$
    | typeof _guilds_$_stickers
    | typeof _skus_$_subscriptions
    | typeof _users_$
    | typeof _users_me_guilds_$_member
    | typeof _users_me_guilds_$
    | typeof _users_me_applications_$_roleconnection
    | typeof _guilds_$_voicestates_me
    | typeof _channels_$_webhooks
    | typeof _guilds_$_webhooks
    | typeof _webhooks_$
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
    | typeof _guilds_$_members_$
    | typeof _guilds_$_bans_$
    | typeof _guilds_$_roles_$
    | typeof _guilds_$_integrations_$
    | typeof _guilds_$_scheduledevents_$
    | typeof _guilds_$_scheduledevents_$_users
    | typeof _guilds_$_templates_$
    | typeof _channels_$_polls_$_expire
    | typeof _guilds_$_soundboardsounds_$
    | typeof _guilds_$_stickers_$
    | typeof _skus_$_subscriptions_$
    | typeof _guilds_$_voicestates_$
    | typeof _webhooks_$_$_slack
    | typeof _webhooks_$_$_github
  ? [string, string] :
  P extends
    | typeof _webhooks_$_$_messages_$
    | typeof _applications_$_guilds_$_commands_$
    | typeof _applications_$_guilds_$_commands_$_permissions
    | typeof _guilds_$_members_$_roles_$
    | typeof _channels_$_messages_$_reactions_$_me
    | typeof _channels_$_messages_$_reactions_$
    | typeof _channels_$_polls_$_answers_$
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
    // Guild
    P extends typeof _guilds_$ ? RESTGetAPIGuildQuery :
    P extends typeof _guilds_$_members ? RESTGetAPIGuildMembersQuery :
    P extends typeof _guilds_$_members_search ? RESTGetAPIGuildMembersSearchQuery :
    P extends typeof _guilds_$_bans ? RESTGetAPIGuildBansQuery :
    P extends typeof _guilds_$_prune ? RESTGetAPIGuildPruneCountQuery :
    P extends typeof _guilds_$_widgetpng ? RESTGetAPIGuildWidgetImageQuery :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents ? RESTGetAPIGuildScheduledEventsQuery :
    P extends typeof _guilds_$_scheduledevents_$ ? RESTGetAPIGuildScheduledEventQuery :
    P extends typeof _guilds_$_scheduledevents_$_users ? RESTGetAPIGuildScheduledEventUsersQuery :
    // Invite
    P extends typeof _invites_$ ? RESTGetAPIInviteQuery :
    // Message
    P extends typeof _channels_$_messages ? RESTGetAPIChannelMessagesQuery :
    P extends typeof _channels_$_messages_$_reactions_$ ? RESTGetAPIChannelMessageReactionUsersQuery :
    // Poll
    P extends typeof _channels_$_polls_$_answers_$ ? RESTGetAPIPollAnswerVotersQuery :
    // Subscription
    P extends typeof _skus_$_subscriptions ? RESTGetAPISKUSubscriptionsQuery :
    // User
    P extends typeof _users_me_guilds ? RESTGetAPICurrentUserGuildsQuery :
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
    // Guild
    P extends typeof _guilds_$_members_$ ? RESTPutAPIGuildMemberJSONBody :
    P extends typeof _guilds_$_bans_$ ? RESTPutAPIGuildBanJSONBody :
    P extends typeof _guilds_$_onboarding ? RESTPutAPIGuildOnboardingJSONBody :
    P extends typeof _guilds_$_incidentactions ? RESTPutAPIGuildIncidentActionsJSONBody :
    // User
    P extends typeof _users_me_applications_$_roleconnection ? RESTPutAPICurrentUserApplicationRoleConnectionJSONBody :
    never
  : M extends 'POST' ?
    // Duplication
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof _webhooks_$_$ ? CustomCallbackData<RESTPostAPIInteractionFollowupJSONBody> | CustomCallbackData<RESTPostAPIWebhookWithTokenJSONBody & Query<RESTPostAPIWebhookWithTokenQuery>> | undefined :
    // Receiving and Responding
    P extends typeof _interactions_$_$_callback ? APIInteractionResponse & Query<RESTPostAPIInteractionCallbackQuery> | undefined :
    // Application Commands
    P extends typeof _applications_$_commands ? RESTPostAPIApplicationCommandsJSONBody :
    P extends typeof _applications_$_guilds_$_commands ? RESTPostAPIApplicationGuildCommandsJSONBody :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules ? RESTPostAPIAutoModerationRuleJSONBody :
    // Channel
    P extends typeof _channels_$_invites ? RESTPostAPIChannelInviteJSONBody :
    P extends typeof _channels_$_followers ? RESTPostAPIChannelFollowersJSONBody :
    P extends typeof _channels_$_messages_$_threads ? RESTPostAPIChannelMessagesThreadsJSONBody :
    P extends typeof _channels_$_threads ? RESTPostAPIChannelThreadsJSONBody | undefined | CouldNotFind :
    // Emoji
    P extends typeof _guilds_$_emojis ? RESTPostAPIGuildEmojiJSONBody :
    P extends typeof _applications_$_emojis ? RESTPostAPIApplicationEmojiJSONBody :
    // Entitlement
    P extends typeof _applications_$_entitlements ? RESTPostAPIEntitlementJSONBody :
    // Guild
    P extends typeof _guilds ? RESTPostAPIGuildsJSONBody :
    P extends typeof _guilds_$_channels ? RESTPostAPIGuildChannelJSONBody :
    P extends typeof _guilds_$_bulkban ? RESTPostAPIGuildBulkBanJSONBody :
    P extends typeof _guilds_$_roles ? RESTPostAPIGuildRoleJSONBody :
    P extends typeof _guilds_$_mfa ? RESTPostAPIGuildsMFAJSONBody :
    P extends typeof _guilds_$_prune ? RESTPostAPIGuildPruneJSONBody :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents ? RESTPostAPIGuildScheduledEventJSONBody :
    // Guild Template
    P extends typeof _guilds_templates_$ ? RESTPostAPITemplateCreateGuildJSONBody :
    P extends typeof _guilds_$_templates ? RESTPostAPIGuildTemplatesJSONBody :
    // Message
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof _channels_$_messages ? CustomCallbackData<RESTPostAPIChannelMessageJSONBody> | undefined :
    P extends typeof _channels_$_messages_bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteJSONBody :
    // Soundboard
    P extends typeof _channels_$_sendsoundboardsound ? RESTPostAPISoundboardSendSoundJSONBody :
    P extends typeof _guilds_$_soundboardsounds ? RESTPostAPIGuildSoundboardSoundJSONBody :
    // Stage Instance
    P extends typeof _stageinstances ? RESTPostAPIStageInstanceJSONBody :
    // User
    P extends typeof _users_me_channels ? RESTPostAPICurrentUserCreateDMChannelJSONBody | CouldNotFind :
    // Webhook
    P extends typeof _channels_$_webhooks ? RESTPostAPIChannelWebhookJSONBody :
    P extends typeof _webhooks_$_$_slack ? Query<RESTPostAPIWebhookWithTokenSlackQuery> :
    P extends typeof _webhooks_$_$_github ? Query<RESTPostAPIWebhookWithTokenGitHubQuery> :
    never
  : M extends 'PATCH' ?
    // Duplication
    P extends typeof _webhooks_$_$_messages_$ ? CustomCallbackData<RESTPatchAPIInteractionFollowupJSONBody> | CustomCallbackData<RESTPatchAPIWebhookWithTokenMessageJSONBody> | undefined :
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_original ? CustomCallbackData<RESTPatchAPIInteractionOriginalResponseJSONBody> | undefined :
    // Application Commands
    P extends typeof _applications_$_commands_$ ? RESTPatchAPIApplicationCommandJSONBody :
    P extends typeof _applications_$_guilds_$_commands_$ ? RESTPatchAPIApplicationGuildCommandJSONBody :
    // Application
    P extends typeof _applications_me ? RESTPatchCurrentApplicationJSONBody :
    // Auto Moderation
    P extends typeof _guilds_$_automoderation_rules_$ ? RESTPatchAPIAutoModerationRuleJSONBody :
    // Channel
    P extends typeof _channels_$ ? RESTPatchAPIChannelJSONBody :
    // Emoji
    P extends typeof _guilds_$_emojis_$ ? RESTPatchAPIGuildEmojiJSONBody :
    P extends typeof _applications_$_emojis_$ ? RESTPatchAPIApplicationEmojiJSONBody :
    // Guild
    P extends typeof _guilds_$ ? RESTPatchAPIGuildJSONBody :
    P extends typeof _guilds_$_channels ? RESTPatchAPIGuildChannelPositionsJSONBody :
    P extends typeof _guilds_$_members_$ ? RESTPatchAPIGuildMemberJSONBody :
    P extends typeof _guilds_$_members_me ? RESTPatchAPICurrentGuildMemberJSONBody :
    P extends typeof _guilds_$_members_me_nick ? RESTPatchAPICurrentGuildMemberNicknameJSONBody :
    P extends typeof _guilds_$_roles ? RESTPatchAPIGuildRolePositionsJSONBody :
    P extends typeof _guilds_$_roles_$ ? RESTPatchAPIGuildRoleJSONBody :
    P extends typeof _guilds_$_widget ? RESTPatchAPIGuildWidgetSettingsJSONBody :
    P extends typeof _guilds_$_welcomescreen ? RESTPatchAPIGuildWelcomeScreenJSONBody :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents_$ ? RESTPatchAPIGuildScheduledEventJSONBody :
    // Guild Template
    P extends typeof _guilds_$_templates_$ ? RESTPatchAPIGuildTemplateJSONBody :
    // Message
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof _channels_$_messages_$ ? CustomCallbackData<RESTPatchAPIChannelMessageJSONBody> | undefined :
    // Soundboard
    P extends typeof _guilds_$_soundboardsounds_$ ? RESTPatchAPIGuildSoundboardSoundJSONBody :
    // Stage Instance
    P extends typeof _stageinstances_$ ? RESTPatchAPIStageInstanceJSONBody :
    // Sticker
    P extends typeof _guilds_$_stickers_$ ? RESTPatchAPIGuildStickerJSONBody :
    // User
    P extends typeof _users_me ? RESTPatchAPICurrentUserJSONBody :
    // Voice
    P extends typeof _guilds_$_voicestates_me ? RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody :
    P extends typeof _guilds_$_voicestates_$ ? RESTPatchAPIGuildVoiceStateUserJSONBody :
    // Webhook
    P extends typeof _webhooks_$ ? RESTPatchAPIWebhookJSONBody :
    P extends typeof _webhooks_$_$ ? RESTPatchAPIWebhookWithTokenJSONBody :
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
      | typeof _webhooks_$_$
      // Channel
      | typeof _channels_$_threads
      // Message
      | typeof _channels_$_messages
    ? FileData : never
  : M extends 'PATCH' ?
    P extends
      // Receiving and Responding
      | typeof _webhooks_$_$_messages_original
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
    P extends typeof _webhooks_$_$_messages_$ ? RESTGetAPIInteractionFollowupResult | RESTGetAPIWebhookWithTokenMessageResult :
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
    // Guild
    P extends typeof _guilds_$ ? RESTGetAPIGuildResult :
    P extends typeof _guilds_$_preview ? RESTGetAPIGuildPreviewResult :
    P extends typeof _guilds_$_channels ? RESTGetAPIGuildChannelsResult :
    P extends typeof _guilds_$_threads_active ? RESTGetAPIGuildThreadsResult :
    P extends typeof _guilds_$_members_$ ? RESTGetAPIGuildMemberResult :
    P extends typeof _guilds_$_members ? RESTGetAPIGuildMembersResult :
    P extends typeof _guilds_$_members_search ? RESTGetAPIGuildMembersSearchResult :
    P extends typeof _guilds_$_bans ? RESTGetAPIGuildBansResult :
    P extends typeof _guilds_$_bans_$ ? RESTGetAPIGuildBanResult :
    P extends typeof _guilds_$_roles ? RESTGetAPIGuildRolesResult :
    P extends typeof _guilds_$_roles_$ ? RESTGetAPIGuildRoleResult :
    P extends typeof _guilds_$_prune ? RESTGetAPIGuildPruneCountResult :
    P extends typeof _guilds_$_regions ? RESTGetAPIGuildVoiceRegionsResult :
    P extends typeof _guilds_$_invites ? RESTGetAPIGuildInvitesResult :
    P extends typeof _guilds_$_integrations ? RESTGetAPIGuildIntegrationsResult :
    P extends typeof _guilds_$_widget ? RESTGetAPIGuildWidgetSettingsResult :
    P extends typeof _guilds_$_widgetjson ? RESTGetAPIGuildWidgetJSONResult :
    P extends typeof _guilds_$_vanityurl ? RESTGetAPIGuildVanityUrlResult :
    P extends typeof _guilds_$_widgetpng ? RESTGetAPIGuildWidgetImageResult :
    P extends typeof _guilds_$_welcomescreen ? RESTGetAPIGuildWelcomeScreenResult :
    P extends typeof _guilds_$_onboarding ? RESTGetAPIGuildOnboardingResult :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents ? RESTGetAPIGuildScheduledEventsResult :
    P extends typeof _guilds_$_scheduledevents_$ ? RESTGetAPIGuildScheduledEventResult :
    P extends typeof _guilds_$_scheduledevents_$_users ? RESTGetAPIGuildScheduledEventUsersResult :
    // Guild Template
    P extends typeof _guilds_templates_$ ? RESTGetAPITemplateResult :
    P extends typeof _guilds_$_templates ? RESTGetAPIGuildTemplatesResult :
    // Invite
    P extends typeof _invites_$ ? RESTGetAPIInviteResult :
    // Message
    P extends typeof _channels_$_messages ? RESTGetAPIChannelMessagesResult :
    P extends typeof _channels_$_messages_$ ? RESTGetAPIChannelMessageResult :
    P extends typeof _channels_$_messages_$_reactions_$ ? RESTGetAPIChannelMessageReactionUsersResult :
    // Poll
    P extends typeof _channels_$_polls_$_answers_$ ? RESTGetAPIPollAnswerVotersResult :
    // SKU
    P extends typeof _applications_$_skus ? RESTGetAPISKUsResult :
    // Soundboard
    P extends typeof _soundboarddefaultsounds ? RESTGetAPISoundboardDefaultSoundsResult :
    P extends typeof _guilds_$_soundboardsounds ? RESTGetAPIGuildSoundboardSoundsResult :
    P extends typeof _guilds_$_soundboardsounds_$ ? RESTGetAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof _stageinstances_$ ? RESTGetAPIStageInstanceResult :
    // Sticker
    P extends typeof _stickers_$ ? RESTGetAPIStickerResult :
    P extends typeof _stickerpacks ? RESTGetStickerPacksResult :
    P extends typeof _stickerpacks_$ ? RESTGetAPIStickerPackResult :
    P extends typeof _guilds_$_stickers ? RESTGetAPIGuildStickersResult :
    P extends typeof _guilds_$_stickers_$ ? RESTGetAPIGuildStickerResult :
    // Subscription
    P extends typeof _skus_$_subscriptions ? RESTGetAPISKUSubscriptionsResult :
    P extends typeof _skus_$_subscriptions_$ ? RESTGetAPISKUSubscriptionResult :
    // User
    P extends typeof _users_me ? RESTGetAPICurrentUserResult :
    P extends typeof _users_$ ? RESTGetAPIUserResult :
    P extends typeof _users_me_guilds ? RESTGetAPICurrentUserGuildsResult :
    P extends typeof _users_me_guilds_$_member ? RESTGetCurrentUserGuildMemberResult :
    P extends typeof _users_me_connections ? RESTGetAPICurrentUserConnectionsResult :
    P extends typeof _users_me_applications_$_roleconnection ? RESTGetAPICurrentUserApplicationRoleConnectionResult :
    // Voice
    P extends typeof _voice_regions ? RESTGetAPIVoiceRegionsResult :
    P extends typeof _guilds_$_voicestates_me ? RESTGetAPIGuildVoiceStateCurrentMemberResult :
    P extends typeof _guilds_$_voicestates_$ ? RESTGetAPIGuildVoiceStateUserResult :
    // Webhook
    P extends typeof _channels_$_webhooks ? RESTGetAPIChannelWebhooksResult :
    P extends typeof _guilds_$_webhooks ? RESTGetAPIGuildWebhooksResult :
    P extends typeof _webhooks_$ ? RESTGetAPIWebhookResult :
    P extends typeof _webhooks_$_$ ? RESTGetAPIWebhookWithTokenResult :
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
    // Guild
    P extends typeof _guilds_$_members_$ ? RESTPutAPIGuildMemberResult :
    P extends typeof _guilds_$_members_$_roles_$ ? RESTPutAPIGuildMemberRoleResult :
    P extends typeof _guilds_$_bans_$ ? RESTPutAPIGuildBanResult :
    P extends typeof _guilds_$_onboarding ? RESTPutAPIGuildOnboardingResult :
    P extends typeof _guilds_$_incidentactions ? CouldNotFind :
    // Guild Template
    P extends typeof _guilds_$_templates_$ ? RESTPutAPIGuildTemplateSyncResult :
    // Message
    P extends typeof _channels_$_messages_$_reactions_$_me ? RESTPutAPIChannelMessageReactionResult :
    // User
    P extends typeof _users_me_applications_$_roleconnection ? RESTPutAPICurrentUserApplicationRoleConnectionResult :
    never
  : M extends 'POST' ?
    // Receiving and Responding
    P extends typeof _interactions_$_$_callback ? RESTPostAPIInteractionCallbackResult :
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
    // Guild
    P extends typeof _guilds ? RESTPostAPIGuildsResult :
    P extends typeof _guilds_$_channels ? RESTPostAPIGuildChannelResult :
    P extends typeof _guilds_$_bulkban ? RESTPostAPIGuildBulkBanResult :
    P extends typeof _guilds_$_roles ? RESTPostAPIGuildRoleResult :
    P extends typeof _guilds_$_mfa ? RESTPostAPIGuildsMFAResult :
    P extends typeof _guilds_$_prune ? RESTPostAPIGuildPruneResult :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents ? RESTPostAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof _guilds_templates_$ ? RESTPostAPITemplateCreateGuildResult :
    P extends typeof _guilds_$_templates ? RESTPostAPIGuildTemplatesResult :
    // Message
    P extends typeof _channels_$_messages ? RESTPostAPIChannelMessageResult :
    P extends typeof _channels_$_messages_$_crosspost ? RESTPostAPIChannelMessageCrosspostResult :
    P extends typeof _channels_$_messages_bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteResult :
    // Poll
    P extends typeof _channels_$_polls_$_expire ? RESTPostAPIPollExpireResult :
    // Soundboard
    P extends typeof _guilds_$_soundboardsounds ? RESTPostAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof _stageinstances ? RESTPostAPIStageInstanceResult :
    // User
    P extends typeof _users_me_channels ? RESTPostAPICurrentUserCreateDMChannelResult | CouldNotFind :
    // Webhook
    P extends typeof _channels_$_webhooks ? RESTPostAPIChannelWebhookResult :
    P extends typeof _webhooks_$_$ ? RESTPostAPIWebhookWithTokenResult | RESTPostAPIWebhookWithTokenWaitResult :
    P extends typeof _webhooks_$_$_slack ? RESTPostAPIWebhookWithTokenSlackResult | RESTPostAPIWebhookWithTokenSlackWaitResult :
    P extends typeof _webhooks_$_$_github ? RESTPostAPIWebhookWithTokenGitHubResult | RESTPostAPIWebhookWithTokenGitHubWaitResult :
    never
  : M extends 'PATCH' ?
    // Receiving and Responding
    P extends typeof _webhooks_$_$_messages_original ? RESTPatchAPIInteractionOriginalResponseResult :
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
    // Guild
    P extends typeof _guilds_$ ? RESTPatchAPIGuildResult :
    P extends typeof _guilds_$_channels ? RESTPatchAPIGuildChannelPositionsResult :
    P extends typeof _guilds_$_members_$ ? RESTPatchAPIGuildMemberResult :
    P extends typeof _guilds_$_members_me ? CouldNotFind :
    P extends typeof _guilds_$_members_me_nick ? RESTPatchAPICurrentGuildMemberNicknameResult :
    P extends typeof _guilds_$_roles ? RESTPatchAPIGuildRolePositionsResult :
    P extends typeof _guilds_$_roles_$ ? RESTPatchAPIGuildRoleResult :
    P extends typeof _guilds_$_widget ? RESTPatchAPIGuildWidgetSettingsResult :
    P extends typeof _guilds_$_welcomescreen ? RESTPatchAPIGuildWelcomeScreenResult :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents_$ ? RESTPatchAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof _guilds_$_templates_$ ? RESTPatchAPIGuildTemplateResult :
    // Message
    P extends typeof _channels_$_messages_$ ? RESTPatchAPIChannelMessageResult :
    // Soundboard
    P extends typeof _guilds_$_soundboardsounds_$ ? RESTPatchAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof _stageinstances_$ ? RESTPatchAPIStageInstanceResult :
    // Sticker
    P extends typeof _guilds_$_stickers_$ ? RESTPatchAPIGuildStickerResult :
    // User
    P extends typeof _users_me ? RESTPatchAPICurrentUserResult :
    // Voice
    P extends typeof _guilds_$_voicestates_me ? RESTPatchAPIGuildVoiceStateCurrentMemberResult :
    P extends typeof _guilds_$_voicestates_$ ? RESTPatchAPIGuildVoiceStateUserResult :
    // Webhook
    P extends typeof _webhooks_$ ? RESTPatchAPIWebhookResult :
    P extends typeof _webhooks_$_$ ? RESTPatchAPIWebhookWithTokenResult :
    P extends typeof _webhooks_$_$_messages_$ ? RESTPatchAPIWebhookWithTokenMessageResult :
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
    // Guild
    P extends typeof _guilds_$ ? RESTDeleteAPIGuildResult :
    P extends typeof _guilds_$_members_$_roles_$ ? RESTDeleteAPIGuildMemberRoleResult :
    P extends typeof _guilds_$_members_$ ? RESTDeleteAPIGuildMemberResult :
    P extends typeof _guilds_$_bans_$ ? RESTDeleteAPIGuildBanResult :
    P extends typeof _guilds_$_roles_$ ? RESTDeleteAPIGuildRoleResult :
    P extends typeof _guilds_$_integrations_$ ? RESTDeleteAPIGuildIntegrationResult :
    // Guild Schedule Event
    P extends typeof _guilds_$_scheduledevents_$ ? RESTDeleteAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof _guilds_$_templates_$ ? RESTDeleteAPIGuildTemplateResult :
    // Invite
    P extends typeof _invites_$ ? RESTDeleteAPIInviteResult :
    // Message
    P extends typeof _channels_$_messages_$_reactions_$_me ? RESTDeleteAPIChannelMessageOwnReactionResult :
    P extends typeof _channels_$_messages_$_reactions_$_$ ? RESTDeleteAPIChannelMessageUserReactionResult :
    P extends typeof _channels_$_messages_$_reactions ? CouldNotFind :
    P extends typeof _channels_$_messages_$_reactions_$ ? RESTDeleteAPIChannelMessageReactionResult :
    P extends typeof _channels_$_messages_$ ? RESTDeleteAPIChannelMessageResult :
    // Soundboard
    P extends typeof _guilds_$_soundboardsounds_$ ? RESTDeleteAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof _stageinstances_$ ? RESTDeleteAPIStageInstanceResult :
    // Sticker
    P extends typeof _guilds_$_stickers_$ ? RESTDeleteAPIGuildStickerResult :
    // User
    P extends typeof _users_me_guilds_$ ? RESTDeleteAPICurrentUserGuildResult :
    // Webhook
    P extends typeof _webhooks_$ ? RESTDeleteAPIWebhookResult :
    P extends typeof _webhooks_$_$ ? RESTDeleteAPIWebhookWithTokenResult :
    P extends typeof _webhooks_$_$_messages_$ ? RESTDeleteAPIWebhookWithTokenMessageResult :
    never
  : never

type TypedResponse<T> = Omit<Response, 'json'> & { json(): Promise<T> }

export type Rest = {
  <M extends RestMethod, P extends RestPathNV<M>>(
    method: M,
    path: P,
    variables?: RestVariables<P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVars<M>>(
    method: M,
    path: P,
    variables: RestVariables<P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsOptionalData<M>>(
    method: M,
    path: P,
    variables: RestVariables<P>,
    data?: RestData<M, P>,
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
