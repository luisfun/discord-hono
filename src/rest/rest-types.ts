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
import type { CustomCallbackData, FileData, TypedResponse } from '../types'
import type {
  $applications$_$activityinstances$_,
  $applications$_$commands,
  $applications$_$commands$_,
  $applications$_$emojis,
  $applications$_$emojis$_,
  $applications$_$entitlements,
  $applications$_$entitlements$_,
  $applications$_$entitlements$_$consume,
  $applications$_$guilds$_$commands,
  $applications$_$guilds$_$commands$_,
  $applications$_$guilds$_$commands$_$permissions,
  $applications$_$guilds$_$commands$permissions,
  $applications$_$roleconnections$metadata,
  $applications$_$skus,
  $applications$me,
  $channels$_,
  $channels$_$followers,
  $channels$_$invites,
  $channels$_$messages,
  $channels$_$messages$_,
  $channels$_$messages$_$crosspost,
  $channels$_$messages$_$reactions,
  $channels$_$messages$_$reactions$_,
  $channels$_$messages$_$reactions$_$_,
  $channels$_$messages$_$reactions$_$me,
  $channels$_$messages$_$threads,
  $channels$_$messages$bulkdelete,
  $channels$_$permissions$_,
  $channels$_$pins,
  $channels$_$pins$_,
  $channels$_$polls$_$answers$_,
  $channels$_$polls$_$expire,
  $channels$_$recipients$_,
  $channels$_$sendsoundboardsound,
  $channels$_$threadmembers,
  $channels$_$threadmembers$_,
  $channels$_$threadmembers$me,
  $channels$_$threads,
  $channels$_$threads$archived$private,
  $channels$_$threads$archived$public,
  $channels$_$typing,
  $channels$_$users$me$threads$archived$private,
  $channels$_$webhooks,
  $guilds,
  $guilds$_,
  $guilds$_$auditlogs,
  $guilds$_$automoderation$rules,
  $guilds$_$automoderation$rules$_,
  $guilds$_$bans,
  $guilds$_$bans$_,
  $guilds$_$bulkban,
  $guilds$_$channels,
  $guilds$_$emojis,
  $guilds$_$emojis$_,
  $guilds$_$incidentactions,
  $guilds$_$integrations,
  $guilds$_$integrations$_,
  $guilds$_$invites,
  $guilds$_$members,
  $guilds$_$members$_,
  $guilds$_$members$_$roles$_,
  $guilds$_$members$me,
  $guilds$_$members$me$nick,
  $guilds$_$members$search,
  $guilds$_$mfa,
  $guilds$_$onboarding,
  $guilds$_$preview,
  $guilds$_$prune,
  $guilds$_$regions,
  $guilds$_$roles,
  $guilds$_$roles$_,
  $guilds$_$scheduledevents,
  $guilds$_$scheduledevents$_,
  $guilds$_$scheduledevents$_$users,
  $guilds$_$soundboardsounds,
  $guilds$_$soundboardsounds$_,
  $guilds$_$stickers,
  $guilds$_$stickers$_,
  $guilds$_$templates,
  $guilds$_$templates$_,
  $guilds$_$threads$active,
  $guilds$_$vanityurl,
  $guilds$_$voicestates$_,
  $guilds$_$voicestates$me,
  $guilds$_$webhooks,
  $guilds$_$welcomescreen,
  $guilds$_$widget,
  $guilds$_$widgetjson,
  $guilds$_$widgetpng,
  $guilds$templates$_,
  $interactions$_$_$callback,
  $invites$_,
  $skus$_$subscriptions,
  $skus$_$subscriptions$_,
  $soundboarddefaultsounds,
  $stageinstances,
  $stageinstances$_,
  $stickerpacks,
  $stickerpacks$_,
  $stickers$_,
  $users$_,
  $users$me,
  $users$me$applications$_$roleconnection,
  $users$me$channels,
  $users$me$connections,
  $users$me$guilds,
  $users$me$guilds$_,
  $users$me$guilds$_$member,
  $voice$regions,
  $webhooks$_,
  $webhooks$_$_,
  $webhooks$_$_$github,
  $webhooks$_$_$messages$_,
  $webhooks$_$_$messages$original,
  $webhooks$_$_$slack,
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
    | typeof $applications$me
    // Soundboard
    | typeof $soundboarddefaultsounds
    // Sticker
    | typeof $stickerpacks
    // User
    | typeof $users$me
    | typeof $users$me$connections
    | typeof $users$me$guilds
    // Voice
    | typeof $voice$regions
  : never

// biome-ignore format: ternary operator
type RestPathVars<M extends RestMethod> =
  M extends 'GET' ?
    // Receiving and Responding
    | typeof $webhooks$_$_$messages$original
    | typeof $webhooks$_$_$messages$_
    // Application Commands
    | typeof $applications$_$commands
    | typeof $applications$_$commands$_
    | typeof $applications$_$guilds$_$commands
    | typeof $applications$_$guilds$_$commands$_
    | typeof $applications$_$guilds$_$commands$permissions
    | typeof $applications$_$guilds$_$commands$_$permissions
    // Application
    | typeof $applications$_$activityinstances$_
    // Application Role Connection Metadata
    | typeof $applications$_$roleconnections$metadata
    // Audit Log
    | typeof $guilds$_$auditlogs
    // Auto Moderation
    | typeof $guilds$_$automoderation$rules
    | typeof $guilds$_$automoderation$rules$_
    // Channel
    | typeof $channels$_
    | typeof $channels$_$invites
    | typeof $channels$_$pins
    | typeof $channels$_$threadmembers$_
    | typeof $channels$_$threadmembers
    | typeof $channels$_$threads$archived$public
    | typeof $channels$_$threads$archived$private
    | typeof $channels$_$users$me$threads$archived$private
    // Emoji
    | typeof $guilds$_$emojis
    | typeof $guilds$_$emojis$_
    | typeof $applications$_$emojis
    | typeof $applications$_$emojis$_
    // Entitlement
    | typeof $applications$_$entitlements
    | typeof $applications$_$entitlements$_
    // Guild
    | typeof $guilds$_
    | typeof $guilds$_$members
    | typeof $guilds$_$bans
    | typeof $guilds$_$prune
    | typeof $guilds$_$widgetpng
    | typeof $guilds$_$preview
    | typeof $guilds$_$channels
    | typeof $guilds$_$threads$active
    | typeof $guilds$_$members$_
    | typeof $guilds$_$bans$_
    | typeof $guilds$_$roles
    | typeof $guilds$_$roles$_
    | typeof $guilds$_$regions
    | typeof $guilds$_$invites
    | typeof $guilds$_$integrations
    | typeof $guilds$_$widget
    | typeof $guilds$_$widgetjson
    | typeof $guilds$_$vanityurl
    | typeof $guilds$_$welcomescreen
    | typeof $guilds$_$onboarding
    // Guild Schedule Event
    | typeof $guilds$_$scheduledevents
    | typeof $guilds$_$scheduledevents$_
    | typeof $guilds$_$scheduledevents$_$users
    // Guild Template
    | typeof $guilds$templates$_
    | typeof $guilds$_$templates
    // Invite
    | typeof $invites$_
    // Message
    | typeof $channels$_$messages
    | typeof $channels$_$messages$_
    | typeof $channels$_$messages$_$reactions$_
    // Poll
    | typeof $channels$_$polls$_$answers$_
    // SKU
    | typeof $applications$_$skus
    // Soundboard
    | typeof $guilds$_$soundboardsounds
    | typeof $guilds$_$soundboardsounds$_
    // Stage Instance
    | typeof $stageinstances$_
    // Sticker
    | typeof $stickers$_
    | typeof $stickerpacks$_
    | typeof $guilds$_$stickers
    | typeof $guilds$_$stickers$_
    // Subscription
    | typeof $skus$_$subscriptions
    | typeof $skus$_$subscriptions$_
    // User
    | typeof $users$_
    | typeof $users$me$guilds$_$member
    | typeof $users$me$applications$_$roleconnection
    // Voice
    | typeof $guilds$_$voicestates$me
    | typeof $guilds$_$voicestates$_
    // Webhook
    | typeof $channels$_$webhooks
    | typeof $guilds$_$webhooks
    | typeof $webhooks$_
    | typeof $webhooks$_$_
  : M extends 'PUT' ?
    // Channel
    | typeof $channels$_$pins$_
    | typeof $channels$_$threadmembers$me
    | typeof $channels$_$threadmembers$_
    // Guild
    | typeof $guilds$_$members$_$roles$_
    // Guild Template
    | typeof $guilds$_$templates$_
    // Message
    | typeof $channels$_$messages$_$reactions$_$me
  : M extends 'POST' ?
    // Channel
    | typeof $channels$_$typing
    // Entitlement
    | typeof $applications$_$entitlements$_$consume
    // Message
    | typeof $channels$_$messages$_$crosspost
    // Poll
    | typeof $channels$_$polls$_$expire
  : M extends 'PATCH' ?
    // Receiving and Responding
    | typeof $webhooks$_$_$messages$_
  : M extends 'DELETE' ?
    // Receiving and Responding
    | typeof $webhooks$_$_$messages$original
    | typeof $webhooks$_$_$messages$_
    // Application Commands
    | typeof $applications$_$commands$_
    | typeof $applications$_$guilds$_$commands$_
    // Auto Moderation
    | typeof $guilds$_$automoderation$rules$_
    // Channel
    | typeof $channels$_
    | typeof $channels$_$permissions$_
    | typeof $channels$_$pins$_
    | typeof $channels$_$recipients$_
    | typeof $channels$_$threadmembers$me
    | typeof $channels$_$threadmembers$_
    // Emoji
    | typeof $guilds$_$emojis$_
    | typeof $applications$_$emojis$_
    // Entitlement
    | typeof $applications$_$entitlements$_
    // Guild
    | typeof $guilds$_
    | typeof $guilds$_$members$_$roles$_
    | typeof $guilds$_$members$_
    | typeof $guilds$_$bans$_
    | typeof $guilds$_$roles$_
    | typeof $guilds$_$integrations$_
    // Guild Schedule Event
    | typeof $guilds$_$scheduledevents$_
    // Guild Template
    | typeof $guilds$_$templates$_
    // Invite
    | typeof $invites$_
    // Message
    | typeof $channels$_$messages$_$reactions$_$me
    | typeof $channels$_$messages$_$reactions$_$_
    | typeof $channels$_$messages$_$reactions
    | typeof $channels$_$messages$_$reactions$_
    | typeof $channels$_$messages$_
    // Soundboard
    | typeof $guilds$_$soundboardsounds$_
    // Stage Instance
    | typeof $stageinstances$_
    // Sticker
    | typeof $guilds$_$stickers$_
    // User
    | typeof $users$me$guilds$_
    // Webhook
    | typeof $webhooks$_
    | typeof $webhooks$_$_
    | typeof $webhooks$_$_$messages$_
  : never

// biome-ignore format: ternary operator
type RestPathVarsQueryRequired<M extends RestMethod> =
  M extends 'GET' ?
    // Guild
    | typeof $guilds$_$members$search
  : never

// biome-ignore format: ternary operator
type RestPathVarsData<M extends RestMethod> =
  M extends 'PUT' ?
    // Application Commands
    | typeof $applications$_$commands
    | typeof $applications$_$guilds$_$commands
    | typeof $applications$_$guilds$_$commands$_$permissions
    | typeof $applications$_$guilds$_$commands$permissions
    // Application Role Connection Metadata
    | typeof $applications$_$roleconnections$metadata
    // Channel
    | typeof $channels$_$permissions$_
    | typeof $channels$_$recipients$_
    // Guild
    | typeof $guilds$_$members$_
    | typeof $guilds$_$bans$_
    | typeof $guilds$_$onboarding
    | typeof $guilds$_$incidentactions
    // User
    | typeof $users$me$applications$_$roleconnection
  : M extends 'POST' ?
    // Application Commands
    | typeof $applications$_$commands
    | typeof $applications$_$guilds$_$commands
    // Auto Moderation
    | typeof $guilds$_$automoderation$rules
    // Channel
    | typeof $channels$_$invites
    | typeof $channels$_$followers
    | typeof $channels$_$messages$_$threads
    | typeof $channels$_$threads
    // Emoji
    | typeof $guilds$_$emojis
    | typeof $applications$_$emojis
    // Entitlement
    | typeof $applications$_$entitlements
    // Guild
    | typeof $guilds
    | typeof $guilds$_$channels
    | typeof $guilds$_$bulkban
    | typeof $guilds$_$roles
    | typeof $guilds$_$roles$_
    | typeof $guilds$_$mfa
    | typeof $guilds$_$prune
    // Guild Schedule Event
    | typeof $guilds$_$scheduledevents
    // Guild Template
    | typeof $guilds$templates$_
    | typeof $guilds$_$templates
    // Message
    | typeof $channels$_$messages$bulkdelete
    // Soundboard
    | typeof $channels$_$sendsoundboardsound
    | typeof $guilds$_$soundboardsounds
    // Stage Instance
    | typeof $stageinstances
    // User
    | typeof $users$me$channels
    // Webhook
    | typeof $channels$_$webhooks
    | typeof $webhooks$_$_
    | typeof $webhooks$_$_$slack
    | typeof $webhooks$_$_$github
  : M extends 'PATCH' ?
    // Application Commands
    | typeof $applications$_$commands$_
    | typeof $applications$_$guilds$_$commands$_
    // Application
    | typeof $applications$me
    // Auto Moderation
    | typeof $guilds$_$automoderation$rules$_
    // Channel
    | typeof $channels$_
    // Emoji
    | typeof $guilds$_$emojis$_
    | typeof $applications$_$emojis$_
    // Guild
    | typeof $guilds$_
    | typeof $guilds$_$channels
    | typeof $guilds$_$members$_
    | typeof $guilds$_$members$me
    | typeof $guilds$_$members$me$nick
    | typeof $guilds$_$roles
    | typeof $guilds$_$widget
    | typeof $guilds$_$welcomescreen
    // Guild Schedule Event
    | typeof $guilds$_$scheduledevents$_
    // Guild Template
    | typeof $guilds$_$templates$_
    // Soundboard
    | typeof $guilds$_$soundboardsounds$_
    // Stage Instance
    | typeof $stageinstances$_
    // Sticker
    | typeof $guilds$_$stickers$_
    // User
    | typeof $users$me
    // Voice
    | typeof $guilds$_$voicestates$me
    | typeof $guilds$_$voicestates$_
    // Webhook
    | typeof $webhooks$_
    | typeof $webhooks$_$_
  : never

// biome-ignore format: ternary operator
type RestPathVarsDataFile<M extends RestMethod> =
  M extends 'POST' ?
    // Receiving and Responding
    | typeof $interactions$_$_$callback
    | typeof $webhooks$_$_
    // Channel
    | typeof $channels$_$threads
    // Message
    | typeof $channels$_$messages
  : M extends 'PATCH' ?
    // Receiving and Responding
    | typeof $webhooks$_$_$messages$original
    | typeof $webhooks$_$_$messages$_
    // Message
    | typeof $channels$_$messages$_
    // Webhook
    | typeof $webhooks$_$_$messages$_
  : never

export type RestPath<M extends RestMethod> =
  | RestPathNV<M>
  | RestPathVars<M>
  | RestPathVarsQueryRequired<M>
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
    | typeof $applications$me
    | typeof $guilds
    | typeof $soundboarddefaultsounds
    | typeof $stageinstances
    | typeof $stickerpacks
    | typeof $users$me
    | typeof $users$me$guilds
    | typeof $users$me$channels
    | typeof $users$me$connections
    | typeof $voice$regions
  ? [] :
  P extends
    | typeof $applications$_$commands
    | typeof $applications$_$roleconnections$metadata
    | typeof $guilds$_$auditlogs
    | typeof $guilds$_$automoderation$rules
    | typeof $channels$_
    | typeof $channels$_$invites
    | typeof $channels$_$followers
    | typeof $channels$_$typing
    | typeof $channels$_$pins
    | typeof $channels$_$threads
    | typeof $channels$_$threadmembers$me
    | typeof $channels$_$threadmembers
    | typeof $channels$_$threads$archived$public
    | typeof $channels$_$threads$archived$private
    | typeof $channels$_$users$me$threads$archived$private
    | typeof $channels$_$messages
    | typeof $channels$_$messages$bulkdelete
    | typeof $guilds$_$emojis
    | typeof $applications$_$emojis
    | typeof $applications$_$entitlements
    | typeof $guilds$_
    | typeof $guilds$_$preview
    | typeof $guilds$_$channels
    | typeof $guilds$_$threads$active
    | typeof $guilds$_$members
    | typeof $guilds$_$members$search
    | typeof $guilds$_$members$me
    | typeof $guilds$_$members$me$nick
    | typeof $guilds$_$bans
    | typeof $guilds$_$bulkban
    | typeof $guilds$_$roles
    | typeof $guilds$_$mfa
    | typeof $guilds$_$prune
    | typeof $guilds$_$regions
    | typeof $guilds$_$invites
    | typeof $guilds$_$integrations
    | typeof $guilds$_$widget
    | typeof $guilds$_$widgetjson
    | typeof $guilds$_$vanityurl
    | typeof $guilds$_$widgetpng
    | typeof $guilds$_$welcomescreen
    | typeof $guilds$_$onboarding
    | typeof $guilds$_$incidentactions
    | typeof $guilds$_$scheduledevents
    | typeof $guilds$templates$_
    | typeof $guilds$_$templates
    | typeof $invites$_
    | typeof $applications$_$skus
    | typeof $channels$_$sendsoundboardsound
    | typeof $guilds$_$soundboardsounds
    | typeof $stageinstances$_
    | typeof $stickers$_
    | typeof $stickerpacks$_
    | typeof $guilds$_$stickers
    | typeof $skus$_$subscriptions
    | typeof $users$_
    | typeof $users$me$guilds$_$member
    | typeof $users$me$guilds$_
    | typeof $users$me$applications$_$roleconnection
    | typeof $guilds$_$voicestates$me
    | typeof $channels$_$webhooks
    | typeof $guilds$_$webhooks
    | typeof $webhooks$_
  ? [string] :
  P extends
    | typeof $interactions$_$_$callback
    | typeof $webhooks$_$_$messages$original
    | typeof $webhooks$_$_
    | typeof $applications$_$commands$_
    | typeof $applications$_$guilds$_$commands
    | typeof $applications$_$guilds$_$commands$permissions
    | typeof $applications$_$activityinstances$_
    | typeof $guilds$_$automoderation$rules$_
    | typeof $channels$_$permissions$_
    | typeof $channels$_$pins$_
    | typeof $channels$_$recipients$_
    | typeof $channels$_$messages$_$threads
    | typeof $channels$_$threadmembers$_
    | typeof $channels$_$messages$_
    | typeof $channels$_$messages$_$crosspost
    | typeof $channels$_$messages$_$reactions
    | typeof $guilds$_$emojis$_
    | typeof $applications$_$emojis$_
    | typeof $applications$_$entitlements$_
    | typeof $applications$_$entitlements$_$consume
    | typeof $guilds$_$members$_
    | typeof $guilds$_$bans$_
    | typeof $guilds$_$roles$_
    | typeof $guilds$_$integrations$_
    | typeof $guilds$_$scheduledevents$_
    | typeof $guilds$_$scheduledevents$_$users
    | typeof $guilds$_$templates$_
    | typeof $channels$_$polls$_$expire
    | typeof $guilds$_$soundboardsounds$_
    | typeof $guilds$_$stickers$_
    | typeof $skus$_$subscriptions$_
    | typeof $guilds$_$voicestates$_
    | typeof $webhooks$_$_$slack
    | typeof $webhooks$_$_$github
  ? [string, string] :
  P extends
    | typeof $webhooks$_$_$messages$_
    | typeof $applications$_$guilds$_$commands$_
    | typeof $applications$_$guilds$_$commands$_$permissions
    | typeof $guilds$_$members$_$roles$_
    | typeof $channels$_$messages$_$reactions$_$me
    | typeof $channels$_$messages$_$reactions$_
    | typeof $channels$_$polls$_$answers$_
  ? [string, string, string] :
  P extends
    | typeof $channels$_$messages$_$reactions$_$_
  ? [string, string, string, string] : string[]

////////////////////////////////////////
//////                            //////
//////            Query           //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestQuery<M extends RestMethod, P extends RestPath<M>> =
  M extends 'GET' ?
    // Receiving and Responding
    P extends typeof $webhooks$_$_$messages$original ? RESTGetAPIWebhookWithTokenMessageQuery :
    P extends typeof $webhooks$_$_$messages$_ ? RESTGetAPIWebhookWithTokenMessageQuery :
    // Application Commands
    P extends typeof $applications$_$commands ? RESTGetAPIApplicationCommandsQuery :
    P extends typeof $applications$_$guilds$_$commands ? RESTGetAPIApplicationGuildCommandsQuery :
    // Audit Log
    P extends typeof $guilds$_$auditlogs ? RESTGetAPIAuditLogQuery :
    // Channel
    P extends typeof $channels$_$threadmembers$_ ? RESTGetAPIChannelThreadMemberQuery :
    P extends typeof $channels$_$threadmembers ? RESTGetAPIChannelThreadMembersQuery :
    P extends typeof $channels$_$threads$archived$public ? CouldNotFind :
    P extends typeof $channels$_$threads$archived$private ? CouldNotFind :
    P extends typeof $channels$_$users$me$threads$archived$private ? CouldNotFind :
    // Entitlement
    P extends typeof $applications$_$entitlements ? RESTGetAPIEntitlementsQuery :
    // Guild
    P extends typeof $guilds$_ ? RESTGetAPIGuildQuery :
    P extends typeof $guilds$_$members ? RESTGetAPIGuildMembersQuery :
    P extends typeof $guilds$_$members$search ? RESTGetAPIGuildMembersSearchQuery :
    P extends typeof $guilds$_$bans ? RESTGetAPIGuildBansQuery :
    P extends typeof $guilds$_$prune ? RESTGetAPIGuildPruneCountQuery :
    P extends typeof $guilds$_$widgetpng ? RESTGetAPIGuildWidgetImageQuery :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents ? RESTGetAPIGuildScheduledEventsQuery :
    P extends typeof $guilds$_$scheduledevents$_ ? RESTGetAPIGuildScheduledEventQuery :
    P extends typeof $guilds$_$scheduledevents$_$users ? RESTGetAPIGuildScheduledEventUsersQuery :
    // Invite
    P extends typeof $invites$_ ? RESTGetAPIInviteQuery :
    // Message
    P extends typeof $channels$_$messages ? RESTGetAPIChannelMessagesQuery :
    P extends typeof $channels$_$messages$_$reactions$_ ? RESTGetAPIChannelMessageReactionUsersQuery :
    // Poll
    P extends typeof $channels$_$polls$_$answers$_ ? RESTGetAPIPollAnswerVotersQuery :
    // Subscription
    P extends typeof $skus$_$subscriptions ? RESTGetAPISKUSubscriptionsQuery :
    // User
    P extends typeof $users$me$guilds ? RESTGetAPICurrentUserGuildsQuery :
    never
  : M extends 'POST' ?
    // Duplication
    P extends typeof $webhooks$_$_ ? RESTPostAPIWebhookWithTokenQuery :
    // Receiving and Responding
    P extends typeof $interactions$_$_$callback ? RESTPostAPIInteractionCallbackQuery :
    // Webhook
    P extends typeof $webhooks$_$_$slack ? RESTPostAPIWebhookWithTokenSlackQuery :
    P extends typeof $webhooks$_$_$github ? RESTPostAPIWebhookWithTokenGitHubQuery :
    never
  : never

////////////////////////////////////////
//////                            //////
//////            Data            //////
//////                            //////
////////////////////////////////////////

// biome-ignore format: ternary operator
export type RestData<M extends RestMethod, P extends RestPath<M>> =
  M extends 'PUT' ?
    // Application Commands
    P extends typeof $applications$_$commands ? RESTPutAPIApplicationCommandsJSONBody :
    P extends typeof $applications$_$guilds$_$commands ? RESTPutAPIApplicationGuildCommandsJSONBody :
    P extends typeof $applications$_$guilds$_$commands$_$permissions ? RESTPutAPIApplicationCommandPermissionsJSONBody :
    P extends typeof $applications$_$guilds$_$commands$permissions ? RESTPutAPIGuildApplicationCommandsPermissionsJSONBody :
    // Application Role Connection Metadata
    P extends typeof $applications$_$roleconnections$metadata ? RESTPutAPIApplicationRoleConnectionMetadataJSONBody :
    // Channel
    P extends typeof $channels$_$permissions$_ ? RESTPutAPIChannelPermissionJSONBody :
    P extends typeof $channels$_$recipients$_ ? RESTPutAPIChannelRecipientJSONBody :
    // Guild
    P extends typeof $guilds$_$members$_ ? RESTPutAPIGuildMemberJSONBody :
    P extends typeof $guilds$_$bans$_ ? RESTPutAPIGuildBanJSONBody :
    P extends typeof $guilds$_$onboarding ? RESTPutAPIGuildOnboardingJSONBody :
    P extends typeof $guilds$_$incidentactions ? RESTPutAPIGuildIncidentActionsJSONBody :
    // User
    P extends typeof $users$me$applications$_$roleconnection ? RESTPutAPICurrentUserApplicationRoleConnectionJSONBody :
    never
  : M extends 'POST' ?
    // Duplication
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof $webhooks$_$_ ? CustomCallbackData<RESTPostAPIInteractionFollowupJSONBody> | CustomCallbackData<RESTPostAPIWebhookWithTokenJSONBody> | undefined :
    // Receiving and Responding
    P extends typeof $interactions$_$_$callback ? APIInteractionResponse :
    // Application Commands
    P extends typeof $applications$_$commands ? RESTPostAPIApplicationCommandsJSONBody :
    P extends typeof $applications$_$guilds$_$commands ? RESTPostAPIApplicationGuildCommandsJSONBody :
    // Auto Moderation
    P extends typeof $guilds$_$automoderation$rules ? RESTPostAPIAutoModerationRuleJSONBody :
    // Channel
    P extends typeof $channels$_$invites ? RESTPostAPIChannelInviteJSONBody :
    P extends typeof $channels$_$followers ? RESTPostAPIChannelFollowersJSONBody :
    P extends typeof $channels$_$messages$_$threads ? RESTPostAPIChannelMessagesThreadsJSONBody :
    P extends typeof $channels$_$threads ? RESTPostAPIChannelThreadsJSONBody | undefined | CouldNotFind :
    // Emoji
    P extends typeof $guilds$_$emojis ? RESTPostAPIGuildEmojiJSONBody :
    P extends typeof $applications$_$emojis ? RESTPostAPIApplicationEmojiJSONBody :
    // Entitlement
    P extends typeof $applications$_$entitlements ? RESTPostAPIEntitlementJSONBody :
    // Guild
    P extends typeof $guilds ? RESTPostAPIGuildsJSONBody :
    P extends typeof $guilds$_$channels ? RESTPostAPIGuildChannelJSONBody :
    P extends typeof $guilds$_$bulkban ? RESTPostAPIGuildBulkBanJSONBody :
    P extends typeof $guilds$_$roles ? RESTPostAPIGuildRoleJSONBody :
    P extends typeof $guilds$_$mfa ? RESTPostAPIGuildsMFAJSONBody :
    P extends typeof $guilds$_$prune ? RESTPostAPIGuildPruneJSONBody :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents ? RESTPostAPIGuildScheduledEventJSONBody :
    // Guild Template
    P extends typeof $guilds$templates$_ ? RESTPostAPITemplateCreateGuildJSONBody :
    P extends typeof $guilds$_$templates ? RESTPostAPIGuildTemplatesJSONBody :
    // Message
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof $channels$_$messages ? CustomCallbackData<RESTPostAPIChannelMessageJSONBody> | undefined :
    P extends typeof $channels$_$messages$bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteJSONBody :
    // Soundboard
    P extends typeof $channels$_$sendsoundboardsound ? RESTPostAPISoundboardSendSoundJSONBody :
    P extends typeof $guilds$_$soundboardsounds ? RESTPostAPIGuildSoundboardSoundJSONBody :
    // Stage Instance
    P extends typeof $stageinstances ? RESTPostAPIStageInstanceJSONBody :
    // User
    P extends typeof $users$me$channels ? RESTPostAPICurrentUserCreateDMChannelJSONBody | CouldNotFind :
    // Webhook
    P extends typeof $channels$_$webhooks ? RESTPostAPIChannelWebhookJSONBody :
    never
  : M extends 'PATCH' ?
    // Duplication
    P extends typeof $webhooks$_$_$messages$_ ? CustomCallbackData<RESTPatchAPIInteractionFollowupJSONBody> | CustomCallbackData<RESTPatchAPIWebhookWithTokenMessageJSONBody> | undefined :
    // Receiving and Responding
    P extends typeof $webhooks$_$_$messages$original ? CustomCallbackData<RESTPatchAPIInteractionOriginalResponseJSONBody> | undefined :
    // Application Commands
    P extends typeof $applications$_$commands$_ ? RESTPatchAPIApplicationCommandJSONBody :
    P extends typeof $applications$_$guilds$_$commands$_ ? RESTPatchAPIApplicationGuildCommandJSONBody :
    // Application
    P extends typeof $applications$me ? RESTPatchCurrentApplicationJSONBody :
    // Auto Moderation
    P extends typeof $guilds$_$automoderation$rules$_ ? RESTPatchAPIAutoModerationRuleJSONBody :
    // Channel
    P extends typeof $channels$_ ? RESTPatchAPIChannelJSONBody :
    // Emoji
    P extends typeof $guilds$_$emojis$_ ? RESTPatchAPIGuildEmojiJSONBody :
    P extends typeof $applications$_$emojis$_ ? RESTPatchAPIApplicationEmojiJSONBody :
    // Guild
    P extends typeof $guilds$_ ? RESTPatchAPIGuildJSONBody :
    P extends typeof $guilds$_$channels ? RESTPatchAPIGuildChannelPositionsJSONBody :
    P extends typeof $guilds$_$members$_ ? RESTPatchAPIGuildMemberJSONBody :
    P extends typeof $guilds$_$members$me ? RESTPatchAPICurrentGuildMemberJSONBody :
    P extends typeof $guilds$_$members$me$nick ? RESTPatchAPICurrentGuildMemberNicknameJSONBody :
    P extends typeof $guilds$_$roles ? RESTPatchAPIGuildRolePositionsJSONBody :
    P extends typeof $guilds$_$roles$_ ? RESTPatchAPIGuildRoleJSONBody :
    P extends typeof $guilds$_$widget ? RESTPatchAPIGuildWidgetSettingsJSONBody :
    P extends typeof $guilds$_$welcomescreen ? RESTPatchAPIGuildWelcomeScreenJSONBody :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents$_ ? RESTPatchAPIGuildScheduledEventJSONBody :
    // Guild Template
    P extends typeof $guilds$_$templates$_ ? RESTPatchAPIGuildTemplateJSONBody :
    // Message
    // @ts-expect-error インデックス シグネチャがありません。ts(2344)
    P extends typeof $channels$_$messages$_ ? CustomCallbackData<RESTPatchAPIChannelMessageJSONBody> | undefined :
    // Soundboard
    P extends typeof $guilds$_$soundboardsounds$_ ? RESTPatchAPIGuildSoundboardSoundJSONBody :
    // Stage Instance
    P extends typeof $stageinstances$_ ? RESTPatchAPIStageInstanceJSONBody :
    // Sticker
    P extends typeof $guilds$_$stickers$_ ? RESTPatchAPIGuildStickerJSONBody :
    // User
    P extends typeof $users$me ? RESTPatchAPICurrentUserJSONBody :
    // Voice
    P extends typeof $guilds$_$voicestates$me ? RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody :
    P extends typeof $guilds$_$voicestates$_ ? RESTPatchAPIGuildVoiceStateUserJSONBody :
    // Webhook
    P extends typeof $webhooks$_ ? RESTPatchAPIWebhookJSONBody :
    P extends typeof $webhooks$_$_ ? RESTPatchAPIWebhookWithTokenJSONBody :
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
      | typeof $interactions$_$_$callback
      | typeof $webhooks$_$_
      // Channel
      | typeof $channels$_$threads
      // Message
      | typeof $channels$_$messages
    ? FileData : never
  : M extends 'PATCH' ?
    P extends
      // Receiving and Responding
      | typeof $webhooks$_$_$messages$original
      | typeof $webhooks$_$_$messages$_
      // Message
      | typeof $channels$_$messages$_
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
    P extends typeof $webhooks$_$_$messages$original ? RESTGetAPIInteractionOriginalResponseResult :
    P extends typeof $webhooks$_$_$messages$_ ? RESTGetAPIInteractionFollowupResult | RESTGetAPIWebhookWithTokenMessageResult :
    // Application Commands
    P extends typeof $applications$_$commands ? RESTGetAPIApplicationCommandsResult :
    P extends typeof $applications$_$commands$_ ? RESTGetAPIApplicationCommandResult :
    P extends typeof $applications$_$guilds$_$commands ? RESTGetAPIApplicationGuildCommandsResult :
    P extends typeof $applications$_$guilds$_$commands$_ ? RESTGetAPIApplicationGuildCommandResult :
    P extends typeof $applications$_$guilds$_$commands$permissions ? RESTGetAPIGuildApplicationCommandsPermissionsResult :
    P extends typeof $applications$_$guilds$_$commands$_$permissions ? RESTGetAPIApplicationCommandPermissionsResult :
    // Application
    P extends typeof $applications$me ? RESTGetCurrentApplicationResult :
    P extends typeof $applications$_$activityinstances$_ ? CouldNotFind :
    // Application Role Connection Metadata
    P extends typeof $applications$_$roleconnections$metadata ? RESTGetAPIApplicationRoleConnectionMetadataResult :
    // Audit Log
    P extends typeof $guilds$_$auditlogs ? RESTGetAPIAuditLogResult :
    // Auto Moderation
    P extends typeof $guilds$_$automoderation$rules ? RESTGetAPIAutoModerationRulesResult :
    P extends typeof $guilds$_$automoderation$rules$_ ? RESTGetAPIAutoModerationRuleResult :
    // Channel
    P extends typeof $channels$_ ? RESTGetAPIChannelResult :
    P extends typeof $channels$_$invites ? RESTGetAPIChannelInvitesResult :
    P extends typeof $channels$_$pins ? RESTGetAPIChannelPinsResult :
    P extends typeof $channels$_$threadmembers$_ ? RESTGetAPIChannelThreadMemberResult :
    P extends typeof $channels$_$threadmembers ? RESTGetAPIChannelThreadMembersResult :
    P extends typeof $channels$_$threads$archived$public ? RESTGetAPIChannelThreadsArchivedPublicResult :
    P extends typeof $channels$_$threads$archived$private ? RESTGetAPIChannelThreadsArchivedPrivateResult :
    P extends typeof $channels$_$users$me$threads$archived$private ? CouldNotFind :
    // Emoji
    P extends typeof $guilds$_$emojis ? RESTGetAPIGuildEmojisResult :
    P extends typeof $guilds$_$emojis$_ ? RESTGetAPIGuildEmojiResult :
    P extends typeof $applications$_$emojis ? RESTGetAPIApplicationEmojisResult :
    P extends typeof $applications$_$emojis$_ ? RESTGetAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof $applications$_$entitlements ? RESTGetAPIEntitlementsResult :
    P extends typeof $applications$_$entitlements$_ ? RESTGetAPIEntitlementResult :
    // Guild
    P extends typeof $guilds$_ ? RESTGetAPIGuildResult :
    P extends typeof $guilds$_$preview ? RESTGetAPIGuildPreviewResult :
    P extends typeof $guilds$_$channels ? RESTGetAPIGuildChannelsResult :
    P extends typeof $guilds$_$threads$active ? RESTGetAPIGuildThreadsResult :
    P extends typeof $guilds$_$members$_ ? RESTGetAPIGuildMemberResult :
    P extends typeof $guilds$_$members ? RESTGetAPIGuildMembersResult :
    P extends typeof $guilds$_$members$search ? RESTGetAPIGuildMembersSearchResult :
    P extends typeof $guilds$_$bans ? RESTGetAPIGuildBansResult :
    P extends typeof $guilds$_$bans$_ ? RESTGetAPIGuildBanResult :
    P extends typeof $guilds$_$roles ? RESTGetAPIGuildRolesResult :
    P extends typeof $guilds$_$roles$_ ? RESTGetAPIGuildRoleResult :
    P extends typeof $guilds$_$prune ? RESTGetAPIGuildPruneCountResult :
    P extends typeof $guilds$_$regions ? RESTGetAPIGuildVoiceRegionsResult :
    P extends typeof $guilds$_$invites ? RESTGetAPIGuildInvitesResult :
    P extends typeof $guilds$_$integrations ? RESTGetAPIGuildIntegrationsResult :
    P extends typeof $guilds$_$widget ? RESTGetAPIGuildWidgetSettingsResult :
    P extends typeof $guilds$_$widgetjson ? RESTGetAPIGuildWidgetJSONResult :
    P extends typeof $guilds$_$vanityurl ? RESTGetAPIGuildVanityUrlResult :
    P extends typeof $guilds$_$widgetpng ? RESTGetAPIGuildWidgetImageResult :
    P extends typeof $guilds$_$welcomescreen ? RESTGetAPIGuildWelcomeScreenResult :
    P extends typeof $guilds$_$onboarding ? RESTGetAPIGuildOnboardingResult :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents ? RESTGetAPIGuildScheduledEventsResult :
    P extends typeof $guilds$_$scheduledevents$_ ? RESTGetAPIGuildScheduledEventResult :
    P extends typeof $guilds$_$scheduledevents$_$users ? RESTGetAPIGuildScheduledEventUsersResult :
    // Guild Template
    P extends typeof $guilds$templates$_ ? RESTGetAPITemplateResult :
    P extends typeof $guilds$_$templates ? RESTGetAPIGuildTemplatesResult :
    // Invite
    P extends typeof $invites$_ ? RESTGetAPIInviteResult :
    // Message
    P extends typeof $channels$_$messages ? RESTGetAPIChannelMessagesResult :
    P extends typeof $channels$_$messages$_ ? RESTGetAPIChannelMessageResult :
    P extends typeof $channels$_$messages$_$reactions$_ ? RESTGetAPIChannelMessageReactionUsersResult :
    // Poll
    P extends typeof $channels$_$polls$_$answers$_ ? RESTGetAPIPollAnswerVotersResult :
    // SKU
    P extends typeof $applications$_$skus ? RESTGetAPISKUsResult :
    // Soundboard
    P extends typeof $soundboarddefaultsounds ? RESTGetAPISoundboardDefaultSoundsResult :
    P extends typeof $guilds$_$soundboardsounds ? RESTGetAPIGuildSoundboardSoundsResult :
    P extends typeof $guilds$_$soundboardsounds$_ ? RESTGetAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof $stageinstances$_ ? RESTGetAPIStageInstanceResult :
    // Sticker
    P extends typeof $stickers$_ ? RESTGetAPIStickerResult :
    P extends typeof $stickerpacks ? RESTGetStickerPacksResult :
    P extends typeof $stickerpacks$_ ? RESTGetAPIStickerPackResult :
    P extends typeof $guilds$_$stickers ? RESTGetAPIGuildStickersResult :
    P extends typeof $guilds$_$stickers$_ ? RESTGetAPIGuildStickerResult :
    // Subscription
    P extends typeof $skus$_$subscriptions ? RESTGetAPISKUSubscriptionsResult :
    P extends typeof $skus$_$subscriptions$_ ? RESTGetAPISKUSubscriptionResult :
    // User
    P extends typeof $users$me ? RESTGetAPICurrentUserResult :
    P extends typeof $users$_ ? RESTGetAPIUserResult :
    P extends typeof $users$me$guilds ? RESTGetAPICurrentUserGuildsResult :
    P extends typeof $users$me$guilds$_$member ? RESTGetCurrentUserGuildMemberResult :
    P extends typeof $users$me$connections ? RESTGetAPICurrentUserConnectionsResult :
    P extends typeof $users$me$applications$_$roleconnection ? RESTGetAPICurrentUserApplicationRoleConnectionResult :
    // Voice
    P extends typeof $voice$regions ? RESTGetAPIVoiceRegionsResult :
    P extends typeof $guilds$_$voicestates$me ? RESTGetAPIGuildVoiceStateCurrentMemberResult :
    P extends typeof $guilds$_$voicestates$_ ? RESTGetAPIGuildVoiceStateUserResult :
    // Webhook
    P extends typeof $channels$_$webhooks ? RESTGetAPIChannelWebhooksResult :
    P extends typeof $guilds$_$webhooks ? RESTGetAPIGuildWebhooksResult :
    P extends typeof $webhooks$_ ? RESTGetAPIWebhookResult :
    P extends typeof $webhooks$_$_ ? RESTGetAPIWebhookWithTokenResult :
    never
  : M extends 'PUT' ?
    // Application Commands
    P extends typeof $applications$_$commands ? RESTPutAPIApplicationCommandsResult :
    P extends typeof $applications$_$guilds$_$commands ? RESTPutAPIApplicationGuildCommandsResult :
    P extends typeof $applications$_$guilds$_$commands$_$permissions ? RESTPutAPIApplicationCommandPermissionsResult :
    P extends typeof $applications$_$guilds$_$commands$permissions ? RESTPutAPIGuildApplicationCommandsPermissionsResult :
    // Application Role Connection Metadata
    P extends typeof $applications$_$roleconnections$metadata ? RESTPutAPIApplicationRoleConnectionMetadataResult :
    // Channel
    P extends typeof $channels$_$permissions$_ ? RESTPutAPIChannelPermissionResult :
    P extends typeof $channels$_$pins$_ ? RESTPutAPIChannelPinResult :
    P extends typeof $channels$_$recipients$_ ? RESTPutAPIChannelRecipientResult :
    P extends typeof $channels$_$threadmembers$me ? RESTPutAPIChannelThreadMembersResult :
    P extends typeof $channels$_$threadmembers$_ ? RESTPutAPIChannelThreadMembersResult :
    // Guild
    P extends typeof $guilds$_$members$_ ? RESTPutAPIGuildMemberResult :
    P extends typeof $guilds$_$members$_$roles$_ ? RESTPutAPIGuildMemberRoleResult :
    P extends typeof $guilds$_$bans$_ ? RESTPutAPIGuildBanResult :
    P extends typeof $guilds$_$onboarding ? RESTPutAPIGuildOnboardingResult :
    P extends typeof $guilds$_$incidentactions ? CouldNotFind :
    // Guild Template
    P extends typeof $guilds$_$templates$_ ? RESTPutAPIGuildTemplateSyncResult :
    // Message
    P extends typeof $channels$_$messages$_$reactions$_$me ? RESTPutAPIChannelMessageReactionResult :
    // User
    P extends typeof $users$me$applications$_$roleconnection ? RESTPutAPICurrentUserApplicationRoleConnectionResult :
    never
  : M extends 'POST' ?
    // Receiving and Responding
    P extends typeof $interactions$_$_$callback ? RESTPostAPIInteractionCallbackResult :
    P extends typeof $webhooks$_$_ ? RESTPostAPIInteractionFollowupResult :
    // Application Commands
    P extends typeof $applications$_$commands ? RESTPostAPIApplicationCommandsResult :
    P extends typeof $applications$_$guilds$_$commands ? RESTPostAPIApplicationGuildCommandsResult :
    // Auto Moderation
    P extends typeof $guilds$_$automoderation$rules ? RESTPostAPIAutoModerationRuleResult :
    // Channel
    P extends typeof $channels$_$invites ? RESTPostAPIChannelInviteResult :
    P extends typeof $channels$_$followers ? RESTPostAPIChannelFollowersResult :
    P extends typeof $channels$_$typing ? RESTPostAPIChannelTypingResult :
    P extends typeof $channels$_$messages$_$threads ? RESTPostAPIChannelMessagesThreadsResult :
    P extends typeof $channels$_$threads ? RESTPostAPIChannelThreadsResult | CouldNotFind :
    // Emoji
    P extends typeof $guilds$_$emojis ? RESTPostAPIGuildEmojiResult :
    P extends typeof $applications$_$emojis ? RESTPostAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof $applications$_$entitlements$_$consume ? RESTPostAPIEntitlementConsumeResult :
    P extends typeof $applications$_$entitlements ? RESTPostAPIEntitlementResult :
    // Guild
    P extends typeof $guilds ? RESTPostAPIGuildsResult :
    P extends typeof $guilds$_$channels ? RESTPostAPIGuildChannelResult :
    P extends typeof $guilds$_$bulkban ? RESTPostAPIGuildBulkBanResult :
    P extends typeof $guilds$_$roles ? RESTPostAPIGuildRoleResult :
    P extends typeof $guilds$_$mfa ? RESTPostAPIGuildsMFAResult :
    P extends typeof $guilds$_$prune ? RESTPostAPIGuildPruneResult :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents ? RESTPostAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof $guilds$templates$_ ? RESTPostAPITemplateCreateGuildResult :
    P extends typeof $guilds$_$templates ? RESTPostAPIGuildTemplatesResult :
    // Message
    P extends typeof $channels$_$messages ? RESTPostAPIChannelMessageResult :
    P extends typeof $channels$_$messages$_$crosspost ? RESTPostAPIChannelMessageCrosspostResult :
    P extends typeof $channels$_$messages$bulkdelete ? RESTPostAPIChannelMessagesBulkDeleteResult :
    // Poll
    P extends typeof $channels$_$polls$_$expire ? RESTPostAPIPollExpireResult :
    // Soundboard
    P extends typeof $guilds$_$soundboardsounds ? RESTPostAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof $stageinstances ? RESTPostAPIStageInstanceResult :
    // User
    P extends typeof $users$me$channels ? RESTPostAPICurrentUserCreateDMChannelResult | CouldNotFind :
    // Webhook
    P extends typeof $channels$_$webhooks ? RESTPostAPIChannelWebhookResult :
    P extends typeof $webhooks$_$_ ? RESTPostAPIWebhookWithTokenResult | RESTPostAPIWebhookWithTokenWaitResult :
    P extends typeof $webhooks$_$_$slack ? RESTPostAPIWebhookWithTokenSlackResult | RESTPostAPIWebhookWithTokenSlackWaitResult :
    P extends typeof $webhooks$_$_$github ? RESTPostAPIWebhookWithTokenGitHubResult | RESTPostAPIWebhookWithTokenGitHubWaitResult :
    never
  : M extends 'PATCH' ?
    // Receiving and Responding
    P extends typeof $webhooks$_$_$messages$original ? RESTPatchAPIInteractionOriginalResponseResult :
    P extends typeof $webhooks$_$_$messages$_ ? RESTPatchAPIInteractionFollowupResult :
    // Application Commands
    P extends typeof $applications$_$commands$_ ? RESTPatchAPIApplicationCommandResult :
    P extends typeof $applications$_$guilds$_$commands$_ ? RESTPatchAPIApplicationGuildCommandResult :
    // Application
    P extends typeof $applications$me ? RESTPatchCurrentApplicationResult :
    // Auto Moderation
    P extends typeof $guilds$_$automoderation$rules$_ ? RESTPatchAPIAutoModerationRuleResult :
    // Channel
    P extends typeof $channels$_ ? RESTPatchAPIChannelResult :
    // Emoji
    P extends typeof $guilds$_$emojis$_ ? RESTPatchAPIGuildEmojiResult :
    P extends typeof $applications$_$emojis$_ ? RESTPatchAPIApplicationEmojiResult :
    // Guild
    P extends typeof $guilds$_ ? RESTPatchAPIGuildResult :
    P extends typeof $guilds$_$channels ? RESTPatchAPIGuildChannelPositionsResult :
    P extends typeof $guilds$_$members$_ ? RESTPatchAPIGuildMemberResult :
    P extends typeof $guilds$_$members$me ? CouldNotFind :
    P extends typeof $guilds$_$members$me$nick ? RESTPatchAPICurrentGuildMemberNicknameResult :
    P extends typeof $guilds$_$roles ? RESTPatchAPIGuildRolePositionsResult :
    P extends typeof $guilds$_$roles$_ ? RESTPatchAPIGuildRoleResult :
    P extends typeof $guilds$_$widget ? RESTPatchAPIGuildWidgetSettingsResult :
    P extends typeof $guilds$_$welcomescreen ? RESTPatchAPIGuildWelcomeScreenResult :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents$_ ? RESTPatchAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof $guilds$_$templates$_ ? RESTPatchAPIGuildTemplateResult :
    // Message
    P extends typeof $channels$_$messages$_ ? RESTPatchAPIChannelMessageResult :
    // Soundboard
    P extends typeof $guilds$_$soundboardsounds$_ ? RESTPatchAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof $stageinstances$_ ? RESTPatchAPIStageInstanceResult :
    // Sticker
    P extends typeof $guilds$_$stickers$_ ? RESTPatchAPIGuildStickerResult :
    // User
    P extends typeof $users$me ? RESTPatchAPICurrentUserResult :
    // Voice
    P extends typeof $guilds$_$voicestates$me ? RESTPatchAPIGuildVoiceStateCurrentMemberResult :
    P extends typeof $guilds$_$voicestates$_ ? RESTPatchAPIGuildVoiceStateUserResult :
    // Webhook
    P extends typeof $webhooks$_ ? RESTPatchAPIWebhookResult :
    P extends typeof $webhooks$_$_ ? RESTPatchAPIWebhookWithTokenResult :
    P extends typeof $webhooks$_$_$messages$_ ? RESTPatchAPIWebhookWithTokenMessageResult :
    never
  : M extends 'DELETE' ?
    // Channel
    P extends typeof $channels$_ ? RESTDeleteAPIChannelResult :
    P extends typeof $channels$_$permissions$_ ? RESTDeleteAPIChannelPermissionResult :
    P extends typeof $channels$_$pins$_ ? RESTDeleteAPIChannelPinResult :
    P extends typeof $channels$_$recipients$_ ? RESTDeleteAPIChannelRecipientResult :
    P extends typeof $channels$_$threadmembers$me ? RESTDeleteAPIChannelThreadMembersResult :
    P extends typeof $channels$_$threadmembers$_ ? RESTDeleteAPIChannelThreadMembersResult :
    // Emoji
    P extends typeof $guilds$_$emojis$_ ? RESTDeleteAPIGuildEmojiResult :
    P extends typeof $applications$_$emojis$_ ? RESTDeleteAPIApplicationEmojiResult :
    // Entitlement
    P extends typeof $applications$_$entitlements$_ ? RESTDeleteAPIEntitlementResult :
    // Guild
    P extends typeof $guilds$_ ? RESTDeleteAPIGuildResult :
    P extends typeof $guilds$_$members$_$roles$_ ? RESTDeleteAPIGuildMemberRoleResult :
    P extends typeof $guilds$_$members$_ ? RESTDeleteAPIGuildMemberResult :
    P extends typeof $guilds$_$bans$_ ? RESTDeleteAPIGuildBanResult :
    P extends typeof $guilds$_$roles$_ ? RESTDeleteAPIGuildRoleResult :
    P extends typeof $guilds$_$integrations$_ ? RESTDeleteAPIGuildIntegrationResult :
    // Guild Schedule Event
    P extends typeof $guilds$_$scheduledevents$_ ? RESTDeleteAPIGuildScheduledEventResult :
    // Guild Template
    P extends typeof $guilds$_$templates$_ ? RESTDeleteAPIGuildTemplateResult :
    // Invite
    P extends typeof $invites$_ ? RESTDeleteAPIInviteResult :
    // Message
    P extends typeof $channels$_$messages$_$reactions$_$me ? RESTDeleteAPIChannelMessageOwnReactionResult :
    P extends typeof $channels$_$messages$_$reactions$_$_ ? RESTDeleteAPIChannelMessageUserReactionResult :
    P extends typeof $channels$_$messages$_$reactions ? CouldNotFind :
    P extends typeof $channels$_$messages$_$reactions$_ ? RESTDeleteAPIChannelMessageReactionResult :
    P extends typeof $channels$_$messages$_ ? RESTDeleteAPIChannelMessageResult :
    // Soundboard
    P extends typeof $guilds$_$soundboardsounds$_ ? RESTDeleteAPIGuildSoundboardSoundResult :
    // Stage Instance
    P extends typeof $stageinstances$_ ? RESTDeleteAPIStageInstanceResult :
    // Sticker
    P extends typeof $guilds$_$stickers$_ ? RESTDeleteAPIGuildStickerResult :
    // User
    P extends typeof $users$me$guilds$_ ? RESTDeleteAPICurrentUserGuildResult :
    // Webhook
    P extends typeof $webhooks$_ ? RESTDeleteAPIWebhookResult :
    P extends typeof $webhooks$_$_ ? RESTDeleteAPIWebhookWithTokenResult :
    P extends typeof $webhooks$_$_$messages$_ ? RESTDeleteAPIWebhookWithTokenMessageResult :
    never
  : never

export type Rest = {
  <M extends RestMethod, P extends RestPathNV<M>>(
    method: M,
    path: P,
    variables?: RestVariables<P> | [...RestVariables<P>, RestQuery<M, P>],
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVars<M>>(
    method: M,
    path: P,
    variables: RestVariables<P> | [...RestVariables<P>, RestQuery<M, P>],
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsQueryRequired<M>>(
    method: M,
    path: P,
    variables: [...RestVariables<P>, RestQuery<M, P>],
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsData<M>>(
    method: M,
    path: P,
    variables: RestVariables<P> | [...RestVariables<P>, RestQuery<M, P>],
    data: RestData<M, P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
  <M extends RestMethod, P extends RestPathVarsDataFile<M>>(
    method: M,
    path: P,
    variables: RestVariables<P> | [...RestVariables<P>, RestQuery<M, P>],
    data: RestData<M, P>,
    file?: RestFile<M, P>,
  ): Promise<TypedResponse<RestResult<M, P>>>
}
