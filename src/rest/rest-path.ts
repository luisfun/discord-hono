////////// Duplication //////////

export const $webhooks$_$_ = '/webhooks/{}/{}' as
  | '/webhooks/{application.id}/{interaction.token}'
  | '/webhooks/{webhook.id}/{webhook.token}'
export const $webhooks$_$_$messages$_ = '/webhooks/{}/{}/messages/{}' as
  | '/webhooks/{application.id}/{interaction.token}/messages/{message.id}'
  | '/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}'
/**
 * @deprecated Use `$webhooks$_$_` instead
 */
export const _webhooks_$_$: typeof $webhooks$_$_ = $webhooks$_$_
/**
 * @deprecated Use `$webhooks$_$_$messages$_` instead
 */
export const _webhooks_$_$_messages_$: typeof $webhooks$_$_$messages$_ = $webhooks$_$_$messages$_

////////// Receiving and Responding //////////
// https://discord.com/developers/docs/interactions/receiving-and-responding
// ✅ 25/02/07
export const $interactions$_$_$callback = '/interactions/{interaction.id}/{interaction.token}/callback' as const
// Compressed because it's used in Context
export const $webhooks$_$_$messages$original =
  '/webhooks/{}/{}/messages/@original' as '/webhooks/{application.id}/{interaction.token}/messages/@original'
/**
 * @deprecated Use `$interactions$_$_$callback` instead
 */
export const _interactions_$_$_callback: typeof $interactions$_$_$callback = $interactions$_$_$callback
/**
 * @deprecated Use `$webhooks$_$_$messages$original` instead
 */
export const _webhooks_$_$_messages_original: typeof $webhooks$_$_$messages$original = $webhooks$_$_$messages$original

////////// Application Commands //////////
// https://discord.com/developers/docs/interactions/application-commands
// ✅ 25/02/07
export const $applications$_$commands = '/applications/{application.id}/commands' as const
export const $applications$_$commands$_ = '/applications/{application.id}/commands/{command.id}' as const
export const $applications$_$guilds$_$commands = '/applications/{application.id}/guilds/{guild.id}/commands' as const
export const $applications$_$guilds$_$commands$_ =
  '/applications/{application.id}/guilds/{guild.id}/commands/{command.id}' as const
export const $applications$_$guilds$_$commands$permissions =
  '/applications/{application.id}/guilds/{guild.id}/commands/permissions' as const
export const $applications$_$guilds$_$commands$_$permissions =
  '/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions' as const
/**
 * @deprecated Use `$applications$_$commands` instead
 */
export const _applications_$_commands: typeof $applications$_$commands = $applications$_$commands
/**
 * @deprecated Use `$applications$_$commands$_` instead
 */
export const _applications_$_commands_$: typeof $applications$_$commands$_ = $applications$_$commands$_
/**
 * @deprecated Use `$applications$_$guilds$_$commands` instead
 */
export const _applications_$_guilds_$_commands: typeof $applications$_$guilds$_$commands =
  $applications$_$guilds$_$commands
/**
 * @deprecated Use `$applications$_$guilds$_$commands$_` instead
 */
export const _applications_$_guilds_$_commands_$: typeof $applications$_$guilds$_$commands$_ =
  $applications$_$guilds$_$commands$_
/**
 * @deprecated Use `$applications$_$guilds$_$commands$permissions` instead
 */
export const _applications_$_guilds_$_commands_permissions: typeof $applications$_$guilds$_$commands$permissions =
  $applications$_$guilds$_$commands$permissions
/**
 * @deprecated Use `$applications$_$guilds$_$commands$_$permissions` instead
 */
export const _applications_$_guilds_$_commands_$_permissions: typeof $applications$_$guilds$_$commands$_$permissions =
  $applications$_$guilds$_$commands$_$permissions

////////// Application //////////
// https://discord.com/developers/docs/resources/application
// ✅ 25/02/07
export const $applications$me = '/applications/@me' as const
export const $applications$_$activityinstances$_ =
  '/applications/{application.id}/activity-instances/{instance_id}' as const
/**
 * @deprecated Use `$applications$me` instead
 */
export const _applications_me: typeof $applications$me = $applications$me
/**
 * @deprecated Use `$applications$_$activityinstances$_` instead
 */
export const _applications_$_activityinstances_$: typeof $applications$_$activityinstances$_ =
  $applications$_$activityinstances$_

////////// Application Role Connection Metadata //////////
// https://discord.com/developers/docs/resources/application-role-connection-metadata
// ✅ 25/02/07
export const $applications$_$roleconnections$metadata =
  '/applications/{application.id}/role-connections/metadata' as const
/**
 * @deprecated Use `$applications$_$roleconnections$metadata` instead
 */
export const _applications_$_roleconnections_metadata: typeof $applications$_$roleconnections$metadata =
  $applications$_$roleconnections$metadata

////////// Audit Log //////////
// https://discord.com/developers/docs/resources/audit-log
// ✅ 25/02/07
export const $guilds$_$auditlogs = '/guilds/{guild.id}/audit-logs' as const
/**
 * @deprecated Use `$guilds$_$auditlogs` instead
 */
export const _guilds_$_auditlogs: typeof $guilds$_$auditlogs = $guilds$_$auditlogs

////////// Auto Moderation //////////
// https://discord.com/developers/docs/resources/auto-moderation
// ✅ 25/02/07
export const $guilds$_$automoderation$rules = '/guilds/{guild.id}/auto-moderation/rules' as const
export const $guilds$_$automoderation$rules$_ =
  '/guilds/{guild.id}/auto-moderation/rules/{auto_moderation_rule.id}' as const
/**
 * @deprecated Use `$guilds$_$automoderation$rules` instead
 */
export const _guilds_$_automoderation_rules: typeof $guilds$_$automoderation$rules = $guilds$_$automoderation$rules
/**
 * @deprecated Use `$guilds$_$automoderation$rules$_` instead
 */
export const _guilds_$_automoderation_rules_$: typeof $guilds$_$automoderation$rules$_ =
  $guilds$_$automoderation$rules$_

////////// Channel //////////
// https://discord.com/developers/docs/resources/channel
// ✅ 25/02/08
export const $channels$_ = '/channels/{channel.id}' as const
export const $channels$_$permissions$_ = '/channels/{channel.id}/permissions/{overwrite.id}' as const
export const $channels$_$invites = '/channels/{channel.id}/invites' as const
export const $channels$_$followers = '/channels/{channel.id}/followers' as const
export const $channels$_$typing = '/channels/{channel.id}/typing' as const
export const $channels$_$pins = '/channels/{channel.id}/pins' as const
export const $channels$_$pins$_ = '/channels/{channel.id}/pins/{message.id}' as const
export const $channels$_$recipients$_ = '/channels/{channel.id}/recipients/{user.id}' as const
export const $channels$_$messages$_$threads = '/channels/{channel.id}/messages/{message.id}/threads' as const
export const $channels$_$threads = '/channels/{channel.id}/threads' as const
export const $channels$_$threadmembers$me = '/channels/{channel.id}/thread-members/@me' as const
export const $channels$_$threadmembers$_ = '/channels/{channel.id}/thread-members/{user.id}' as const
export const $channels$_$threadmembers = '/channels/{channel.id}/thread-members' as const
export const $channels$_$threads$archived$public = '/channels/{channel.id}/threads/archived/public' as const
export const $channels$_$threads$archived$private = '/channels/{channel.id}/threads/archived/private' as const
export const $channels$_$users$me$threads$archived$private =
  '/channels/{channel.id}/users/@me/threads/archived/private' as const
/**
 * @deprecated Use `$channels$_` instead
 */
export const _channels_$: typeof $channels$_ = $channels$_
/**
 * @deprecated Use `$channels$_$permissions$_` instead
 */
export const _channels_$_permissions_$: typeof $channels$_$permissions$_ = $channels$_$permissions$_
/**
 * @deprecated Use `$channels$_$invites` instead
 */
export const _channels_$_invites: typeof $channels$_$invites = $channels$_$invites
/**
 * @deprecated Use `$channels$_$followers` instead
 */
export const _channels_$_followers: typeof $channels$_$followers = $channels$_$followers
/**
 * @deprecated Use `$channels$_$typing` instead
 */
export const _channels_$_typing: typeof $channels$_$typing = $channels$_$typing
/**
 * @deprecated Use `$channels$_$pins` instead
 */
export const _channels_$_pins: typeof $channels$_$pins = $channels$_$pins
/**
 * @deprecated Use `$channels$_$pins$_` instead
 */
export const _channels_$_pins_$: typeof $channels$_$pins$_ = $channels$_$pins$_
/**
 * @deprecated Use `$channels$_$recipients$_` instead
 */
export const _channels_$_recipients_$: typeof $channels$_$recipients$_ = $channels$_$recipients$_
/**
 * @deprecated Use `$channels$_$messages$_$threads` instead
 */
export const _channels_$_messages_$_threads: typeof $channels$_$messages$_$threads = $channels$_$messages$_$threads
/**
 * @deprecated Use `$channels$_$threads` instead
 */
export const _channels_$_threads: typeof $channels$_$threads = $channels$_$threads
/**
 * @deprecated Use `$channels$_$threadmembers$me` instead
 */
export const _channels_$_threadmembers_me: typeof $channels$_$threadmembers$me = $channels$_$threadmembers$me
/**
 * @deprecated Use `$channels$_$threadmembers$_` instead
 */
export const _channels_$_threadmembers_$: typeof $channels$_$threadmembers$_ = $channels$_$threadmembers$_
/**
 * @deprecated Use `$channels$_$threadmembers` instead
 */
export const _channels_$_threadmembers: typeof $channels$_$threadmembers = $channels$_$threadmembers
/**
 * @deprecated Use `$channels$_$threads$archived$public` instead
 */
export const _channels_$_threads_archived_public: typeof $channels$_$threads$archived$public =
  $channels$_$threads$archived$public
/**
 * @deprecated Use `$channels$_$threads$archived$private` instead
 */
export const _channels_$_threads_archived_private: typeof $channels$_$threads$archived$private =
  $channels$_$threads$archived$private
/**
 * @deprecated Use `$channels$_$users$me$threads$archived$private` instead
 */
export const _channels_$_users_me_threads_archived_private: typeof $channels$_$users$me$threads$archived$private =
  $channels$_$users$me$threads$archived$private

////////// Emoji //////////
// https://discord.com/developers/docs/resources/emoji
// ✅ 25/02/08
export const $guilds$_$emojis = '/guilds/{guild.id}/emojis' as const
export const $guilds$_$emojis$_ = '/guilds/{guild.id}/emojis/{emoji.id}' as const
export const $applications$_$emojis = '/applications/{application.id}/emojis' as const
export const $applications$_$emojis$_ = '/applications/{application.id}/emojis/{emoji.id}' as const
/**
 * @deprecated Use `$guilds$_$emojis` instead
 */
export const _guilds_$_emojis: typeof $guilds$_$emojis = $guilds$_$emojis
/**
 * @deprecated Use `$guilds$_$emojis$_` instead
 */
export const _guilds_$_emojis_$: typeof $guilds$_$emojis$_ = $guilds$_$emojis$_
/**
 * @deprecated Use `$applications$_$emojis` instead
 */
export const _applications_$_emojis: typeof $applications$_$emojis = $applications$_$emojis
/**
 * @deprecated Use `$applications$_$emojis$_` instead
 */
export const _applications_$_emojis_$: typeof $applications$_$emojis$_ = $applications$_$emojis$_

////////// Entitlement //////////
// https://discord.com/developers/docs/resources/entitlement
// ✅ 25/02/08
export const $applications$_$entitlements = '/applications/{application.id}/entitlements' as const
export const $applications$_$entitlements$_ = '/applications/{application.id}/entitlements/{entitlement.id}' as const
export const $applications$_$entitlements$_$consume =
  '/applications/{application.id}/entitlements/{entitlement.id}/consume' as const
/**
 * @deprecated Use `$applications$_$entitlements` instead
 */
export const _applications_$_entitlements: typeof $applications$_$entitlements = $applications$_$entitlements
/**
 * @deprecated Use `$applications$_$entitlements$_` instead
 */
export const _applications_$_entitlements_$: typeof $applications$_$entitlements$_ = $applications$_$entitlements$_
/**
 * @deprecated Use `$applications$_$entitlements$_$consume` instead
 */
export const _applications_$_entitlements_$_consume: typeof $applications$_$entitlements$_$consume =
  $applications$_$entitlements$_$consume

////////// Guild //////////
// https://discord.com/developers/docs/resources/guild
// ✅ 25/02/08
export const $guilds = '/guilds' as const
export const $guilds$_ = '/guilds/{guild.id}' as const
export const $guilds$_$preview = '/guilds/{guild.id}/preview' as const
export const $guilds$_$channels = '/guilds/{guild.id}/channels' as const
export const $guilds$_$threads$active = '/guilds/{guild.id}/threads/active' as const
export const $guilds$_$members$_ = '/guilds/{guild.id}/members/{user.id}' as const
export const $guilds$_$members = '/guilds/{guild.id}/members' as const
export const $guilds$_$members$search = '/guilds/{guild.id}/members/search' as const
export const $guilds$_$members$me = '/guilds/{guild.id}/members/@me' as const
export const $guilds$_$members$me$nick = '/guilds/{guild.id}/members/@me/nick' as const
export const $guilds$_$members$_$roles$_ = '/guilds/{guild.id}/members/{user.id}/roles/{role.id}' as const
export const $guilds$_$bans = '/guilds/{guild.id}/bans' as const
export const $guilds$_$bans$_ = '/guilds/{guild.id}/bans/{user.id}' as const
export const $guilds$_$bulkban = '/guilds/{guild.id}/bulk-ban' as const
export const $guilds$_$roles = '/guilds/{guild.id}/roles' as const
export const $guilds$_$roles$_ = '/guilds/{guild.id}/roles/{role.id}' as const
export const $guilds$_$mfa = '/guilds/{guild.id}/mfa' as const
export const $guilds$_$prune = '/guilds/{guild.id}/prune' as const
export const $guilds$_$regions = '/guilds/{guild.id}/regions' as const
export const $guilds$_$invites = '/guilds/{guild.id}/invites' as const
export const $guilds$_$integrations = '/guilds/{guild.id}/integrations' as const
export const $guilds$_$integrations$_ = '/guilds/{guild.id}/integrations/{integration.id}' as const
export const $guilds$_$widget = '/guilds/{guild.id}/widget' as const
export const $guilds$_$widgetjson = '/guilds/{guild.id}/widget.json' as const
export const $guilds$_$vanityurl = '/guilds/{guild.id}/vanity-url' as const
export const $guilds$_$widgetpng = '/guilds/{guild.id}/widget.png' as const
export const $guilds$_$welcomescreen = '/guilds/{guild.id}/welcome-screen' as const
export const $guilds$_$onboarding = '/guilds/{guild.id}/onboarding' as const
export const $guilds$_$incidentactions = '/guilds/{guild.id}/incident-actions' as const
/**
 * @deprecated Use `$guilds` instead
 */
export const _guilds: typeof $guilds = $guilds
/**
 * @deprecated Use `$guilds$_` instead
 */
export const _guilds_$: typeof $guilds$_ = $guilds$_
/**
 * @deprecated Use `$guilds$_$preview` instead
 */
export const _guilds_$_preview: typeof $guilds$_$preview = $guilds$_$preview
/**
 * @deprecated Use `$guilds$_$channels` instead
 */
export const _guilds_$_channels: typeof $guilds$_$channels = $guilds$_$channels
/**
 * @deprecated Use `$guilds$_$threads$active` instead
 */
export const _guilds_$_threads_active: typeof $guilds$_$threads$active = $guilds$_$threads$active
/**
 * @deprecated Use `$guilds$_$members$_` instead
 */
export const _guilds_$_members_$: typeof $guilds$_$members$_ = $guilds$_$members$_
/**
 * @deprecated Use `$guilds$_$members` instead
 */
export const _guilds_$_members: typeof $guilds$_$members = $guilds$_$members
/**
 * @deprecated Use `$guilds$_$members$search` instead
 */
export const _guilds_$_members_search: typeof $guilds$_$members$search = $guilds$_$members$search
/**
 * @deprecated Use `$guilds$_$members$me` instead
 */
export const _guilds_$_members_me: typeof $guilds$_$members$me = $guilds$_$members$me
/**
 * @deprecated Use `$guilds$_$members$me$nick` instead
 */
export const _guilds_$_members_me_nick: typeof $guilds$_$members$me$nick = $guilds$_$members$me$nick
/**
 * @deprecated Use `$guilds$_$members$_$roles$_` instead
 */
export const _guilds_$_members_$_roles_$: typeof $guilds$_$members$_$roles$_ = $guilds$_$members$_$roles$_
/**
 * @deprecated Use `$guilds$_$bans` instead
 */
export const _guilds_$_bans: typeof $guilds$_$bans = $guilds$_$bans
/**
 * @deprecated Use `$guilds$_$bans$_` instead
 */
export const _guilds_$_bans_$: typeof $guilds$_$bans$_ = $guilds$_$bans$_
/**
 * @deprecated Use `$guilds$_$bulkban` instead
 */
export const _guilds_$_bulkban: typeof $guilds$_$bulkban = $guilds$_$bulkban
/**
 * @deprecated Use `$guilds$_$roles` instead
 */
export const _guilds_$_roles: typeof $guilds$_$roles = $guilds$_$roles
/**
 * @deprecated Use `$guilds$_$roles$_` instead
 */
export const _guilds_$_roles_$: typeof $guilds$_$roles$_ = $guilds$_$roles$_
/**
 * @deprecated Use `$guilds$_$mfa` instead
 */
export const _guilds_$_mfa: typeof $guilds$_$mfa = $guilds$_$mfa
/**
 * @deprecated Use `$guilds$_$prune` instead
 */
export const _guilds_$_prune: typeof $guilds$_$prune = $guilds$_$prune
/**
 * @deprecated Use `$guilds$_$regions` instead
 */
export const _guilds_$_regions: typeof $guilds$_$regions = $guilds$_$regions
/**
 * @deprecated Use `$guilds$_$invites` instead
 */
export const _guilds_$_invites: typeof $guilds$_$invites = $guilds$_$invites
/**
 * @deprecated Use `$guilds$_$integrations` instead
 */
export const _guilds_$_integrations: typeof $guilds$_$integrations = $guilds$_$integrations
/**
 * @deprecated Use `$guilds$_$integrations$_` instead
 */
export const _guilds_$_integrations_$: typeof $guilds$_$integrations$_ = $guilds$_$integrations$_
/**
 * @deprecated Use `$guilds$_$widget` instead
 */
export const _guilds_$_widget: typeof $guilds$_$widget = $guilds$_$widget
/**
 * @deprecated Use `$guilds$_$widgetjson` instead
 */
export const _guilds_$_widgetjson: typeof $guilds$_$widgetjson = $guilds$_$widgetjson
/**
 * @deprecated Use `$guilds$_$vanityurl` instead
 */
export const _guilds_$_vanityurl: typeof $guilds$_$vanityurl = $guilds$_$vanityurl
/**
 * @deprecated Use `$guilds$_$widgetpng` instead
 */
export const _guilds_$_widgetpng: typeof $guilds$_$widgetpng = $guilds$_$widgetpng
/**
 * @deprecated Use `$guilds$_$welcomescreen` instead
 */
export const _guilds_$_welcomescreen: typeof $guilds$_$welcomescreen = $guilds$_$welcomescreen
/**
 * @deprecated Use `$guilds$_$onboarding` instead
 */
export const _guilds_$_onboarding: typeof $guilds$_$onboarding = $guilds$_$onboarding
/**
 * @deprecated Use `$guilds$_$incidentactions` instead
 */
export const _guilds_$_incidentactions: typeof $guilds$_$incidentactions = $guilds$_$incidentactions

////////// Guild Scheduled Event //////////
// https://discord.com/developers/docs/resources/guild-scheduled-event
// ✅ 25/02/08
export const $guilds$_$scheduledevents = '/guilds/{guild.id}/scheduled-events' as const
export const $guilds$_$scheduledevents$_ = '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}' as const
export const $guilds$_$scheduledevents$_$users =
  '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users' as const
/**
 * @deprecated Use `$guilds$_$scheduledevents` instead
 */
export const _guilds_$_scheduledevents: typeof $guilds$_$scheduledevents = $guilds$_$scheduledevents
/**
 * @deprecated Use `$guilds$_$scheduledevents$_` instead
 */
export const _guilds_$_scheduledevents_$: typeof $guilds$_$scheduledevents$_ = $guilds$_$scheduledevents$_
/**
 * @deprecated Use `$guilds$_$scheduledevents$_$users` instead
 */
export const _guilds_$_scheduledevents_$_users: typeof $guilds$_$scheduledevents$_$users =
  $guilds$_$scheduledevents$_$users

////////// Guild Template //////////
// https://discord.com/developers/docs/resources/guild-template
// ✅ 25/02/08
export const $guilds$templates$_ = '/guilds/templates/{template.code}' as const
export const $guilds$_$templates = '/guilds/{guild.id}/templates' as const
export const $guilds$_$templates$_ = '/guilds/{guild.id}/templates/{template.code}' as const
/**
 * @deprecated Use `$guilds$templates$_` instead
 */
export const _guilds_templates_$: typeof $guilds$templates$_ = $guilds$templates$_
/**
 * @deprecated Use `$guilds$_$templates` instead
 */
export const _guilds_$_templates: typeof $guilds$_$templates = $guilds$_$templates
/**
 * @deprecated Use `$guilds$_$templates$_` instead
 */
export const _guilds_$_templates_$: typeof $guilds$_$templates$_ = $guilds$_$templates$_

////////// Invite //////////
// https://discord.com/developers/docs/resources/invite
// ✅ 25/02/08
export const $invites$_ = '/invites/{invite.code}' as const
/**
 * @deprecated Use `$invites$_` instead
 */
export const _invites_$: typeof $invites$_ = $invites$_

////////// Message //////////
// https://discord.com/developers/docs/resources/message
// ✅ 25/02/08
export const $channels$_$messages = '/channels/{channel.id}/messages' as const
export const $channels$_$messages$_ = '/channels/{channel.id}/messages/{message.id}' as const
export const $channels$_$messages$_$crosspost = '/channels/{channel.id}/messages/{message.id}/crosspost' as const
export const $channels$_$messages$_$reactions$_$me =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me' as const
export const $channels$_$messages$_$reactions$_$_ =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}' as const
export const $channels$_$messages$_$reactions$_ =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}' as const
export const $channels$_$messages$_$reactions = '/channels/{channel.id}/messages/{message.id}/reactions' as const
export const $channels$_$messages$bulkdelete = '/channels/{channel.id}/messages/bulk-delete' as const
/**
 * @deprecated Use `$channels$_$messages` instead
 */
export const _channels_$_messages: typeof $channels$_$messages = $channels$_$messages
/**
 * @deprecated Use `$channels$_$messages$_` instead
 */
export const _channels_$_messages_$: typeof $channels$_$messages$_ = $channels$_$messages$_
/**
 * @deprecated Use `$channels$_$messages$_$crosspost` instead
 */
export const _channels_$_messages_$_crosspost: typeof $channels$_$messages$_$crosspost =
  $channels$_$messages$_$crosspost
/**
 * @deprecated Use `$channels$_$messages$_$reactions$_$me` instead
 */
export const _channels_$_messages_$_reactions_$_me: typeof $channels$_$messages$_$reactions$_$me =
  $channels$_$messages$_$reactions$_$me
/**
 * @deprecated Use `$channels$_$messages$_$reactions$_$_` instead
 */
export const _channels_$_messages_$_reactions_$_$: typeof $channels$_$messages$_$reactions$_$_ =
  $channels$_$messages$_$reactions$_$_
/**
 * @deprecated Use `$channels$_$messages$_$reactions$_` instead
 */
export const _channels_$_messages_$_reactions_$: typeof $channels$_$messages$_$reactions$_ =
  $channels$_$messages$_$reactions$_
/**
 * @deprecated Use `$channels$_$messages$_$reactions` instead
 */
export const _channels_$_messages_$_reactions: typeof $channels$_$messages$_$reactions =
  $channels$_$messages$_$reactions
/**
 * @deprecated Use `$channels$_$messages$bulkdelete` instead
 */
export const _channels_$_messages_bulkdelete: typeof $channels$_$messages$bulkdelete = $channels$_$messages$bulkdelete

////////// Poll //////////
// https://discord.com/developers/docs/resources/poll
// ✅ 25/02/08
export const $channels$_$polls$_$answers$_ = '/channels/{channel.id}/polls/{message.id}/answers/{answer_id}' as const
export const $channels$_$polls$_$expire = '/channels/{channel.id}/polls/{message.id}/expire' as const
/**
 * @deprecated Use `$channels$_$polls$_$answers$_` instead
 */
export const _channels_$_polls_$_answers_$: typeof $channels$_$polls$_$answers$_ = $channels$_$polls$_$answers$_
/**
 * @deprecated Use `$channels$_$polls$_$expire` instead
 */
export const _channels_$_polls_$_expire: typeof $channels$_$polls$_$expire = $channels$_$polls$_$expire

////////// SKU //////////
// https://discord.com/developers/docs/resources/sku
// ✅ 25/02/08
export const $applications$_$skus = '/applications/{application.id}/skus' as const
/**
 * @deprecated Use `$applications$_$skus` instead
 */
export const _applications_$_skus: typeof $applications$_$skus = $applications$_$skus

////////// Soundboard //////////
// https://discord.com/developers/docs/resources/soundboard
// ✅ 25/02/08
export const $channels$_$sendsoundboardsound = '/channels/{channel.id}/send-soundboard-sound' as const
export const $soundboarddefaultsounds = '/soundboard-default-sounds' as const
export const $guilds$_$soundboardsounds = '/guilds/{guild.id}/soundboard-sounds' as const
export const $guilds$_$soundboardsounds$_ = '/guilds/{guild.id}/soundboard-sounds/{sound.id}' as const
/**
 * @deprecated Use `$channels$_$sendsoundboardsound` instead
 */
export const _channels_$_sendsoundboardsound: typeof $channels$_$sendsoundboardsound = $channels$_$sendsoundboardsound
/**
 * @deprecated Use `$soundboarddefaultsounds` instead
 */
export const _soundboarddefaultsounds: typeof $soundboarddefaultsounds = $soundboarddefaultsounds
/**
 * @deprecated Use `$guilds$_$soundboardsounds` instead
 */
export const _guilds_$_soundboardsounds: typeof $guilds$_$soundboardsounds = $guilds$_$soundboardsounds
/**
 * @deprecated Use `$guilds$_$soundboardsounds$_` instead
 */
export const _guilds_$_soundboardsounds_$: typeof $guilds$_$soundboardsounds$_ = $guilds$_$soundboardsounds$_

////////// Stage Instance //////////
// https://discord.com/developers/docs/resources/stage-instance
// ✅ 25/02/09
export const $stageinstances = '/stage-instances' as const
export const $stageinstances$_ = '/stage-instances/{channel.id}' as const
/**
 * @deprecated Use `$stageinstances` instead
 */
export const _stageinstances: typeof $stageinstances = $stageinstances
/**
 * @deprecated Use `$stageinstances$_` instead
 */
export const _stageinstances_$: typeof $stageinstances$_ = $stageinstances$_

////////// Sticker //////////
// https://discord.com/developers/docs/resources/sticker
// ✅ 25/02/09
export const $stickers$_ = '/stickers/{sticker.id}' as const
export const $stickerpacks = '/sticker-packs' as const
export const $stickerpacks$_ = '/sticker-packs/{pack.id}' as const
export const $guilds$_$stickers = '/guilds/{guild.id}/stickers' as const
export const $guilds$_$stickers$_ = '/guilds/{guild.id}/stickers/{sticker.id}' as const
/**
 * @deprecated Use `$stickers$_` instead
 */
export const _stickers_$: typeof $stickers$_ = $stickers$_
/**
 * @deprecated Use `$stickerpacks` instead
 */
export const _stickerpacks: typeof $stickerpacks = $stickerpacks
/**
 * @deprecated Use `$stickerpacks$_` instead
 */
export const _stickerpacks_$: typeof $stickerpacks$_ = $stickerpacks$_
/**
 * @deprecated Use `$guilds$_$stickers` instead
 */
export const _guilds_$_stickers: typeof $guilds$_$stickers = $guilds$_$stickers
/**
 * @deprecated Use `$guilds$_$stickers$_` instead
 */
export const _guilds_$_stickers_$: typeof $guilds$_$stickers$_ = $guilds$_$stickers$_

///// Not supported yet /////
// [Create Guild Sticker](https://discord.com/developers/docs/resources/sticker#create-guild-sticker) // https://discord-api-types.dev/search?q=RESTPostAPIGuildSticker

////////// Subscription //////////
// https://discord.com/developers/docs/resources/subscription
// ✅ 25/02/09
export const $skus$_$subscriptions = '/skus/{sku.id}/subscriptions' as const
export const $skus$_$subscriptions$_ = '/skus/{sku.id}/subscriptions/{subscription.id}' as const
/**
 * @deprecated Use `$skus$_$subscriptions` instead
 */
export const _skus_$_subscriptions: typeof $skus$_$subscriptions = $skus$_$subscriptions
/**
 * @deprecated Use `$skus$_$subscriptions$_` instead
 */
export const _skus_$_subscriptions_$: typeof $skus$_$subscriptions$_ = $skus$_$subscriptions$_

////////// User //////////
// https://discord.com/developers/docs/resources/user
// ✅ 25/02/09
export const $users$me = '/users/@me' as const
export const $users$_ = '/users/{user.id}' as const
export const $users$me$guilds = '/users/@me/guilds' as const
export const $users$me$guilds$_$member = '/users/@me/guilds/{guild.id}/member' as const
export const $users$me$guilds$_ = '/users/@me/guilds/{guild.id}' as const
export const $users$me$channels = '/users/@me/channels' as const
export const $users$me$connections = '/users/@me/connections' as const
export const $users$me$applications$_$roleconnection =
  '/users/@me/applications/{application.id}/role-connection' as const
/**
 * @deprecated Use `$users$me` instead
 */
export const _users_me: typeof $users$me = $users$me
/**
 * @deprecated Use `$users$_` instead
 */
export const _users_$: typeof $users$_ = $users$_
/**
 * @deprecated Use `$users$me$guilds` instead
 */
export const _users_me_guilds: typeof $users$me$guilds = $users$me$guilds
/**
 * @deprecated Use `$users$me$guilds$_$member` instead
 */
export const _users_me_guilds_$_member: typeof $users$me$guilds$_$member = $users$me$guilds$_$member
/**
 * @deprecated Use `$users$me$guilds$_` instead
 */
export const _users_me_guilds_$: typeof $users$me$guilds$_ = $users$me$guilds$_
/**
 * @deprecated Use `$users$me$channels` instead
 */
export const _users_me_channels: typeof $users$me$channels = $users$me$channels
/**
 * @deprecated Use `$users$me$connections` instead
 */
export const _users_me_connections: typeof $users$me$connections = $users$me$connections
/**
 * @deprecated Use `$users$me$applications$_$roleconnection` instead
 */
export const _users_me_applications_$_roleconnection: typeof $users$me$applications$_$roleconnection =
  $users$me$applications$_$roleconnection

////////// Voice //////////
// https://discord.com/developers/docs/resources/voice
// ✅ 25/02/09
export const $voice$regions = '/voice/regions' as const
export const $guilds$_$voicestates$me = '/guilds/{guild.id}/voice-states/@me' as const
export const $guilds$_$voicestates$_ = '/guilds/{guild.id}/voice-states/{user.id}' as const
/**
 * @deprecated Use `$voice$regions` instead
 */
export const _voice_regions: typeof $voice$regions = $voice$regions
/**
 * @deprecated Use `$guilds$_$voicestates$me` instead
 */
export const _guilds_$_voicestates_me: typeof $guilds$_$voicestates$me = $guilds$_$voicestates$me
/**
 * @deprecated Use `$guilds$_$voicestates$_` instead
 */
export const _guilds_$_voicestates_$: typeof $guilds$_$voicestates$_ = $guilds$_$voicestates$_

////////// Webhook //////////
// https://discord.com/developers/docs/resources/webhook
// ✅ 25/02/09
export const $channels$_$webhooks = '/channels/{channel.id}/webhooks' as const
export const $guilds$_$webhooks = '/guilds/{guild.id}/webhooks' as const
export const $webhooks$_ = '/webhooks/{webhook.id}' as const
export const $webhooks$_$_$slack = '/webhooks/{webhook.id}/{webhook.token}/slack' as const
export const $webhooks$_$_$github = '/webhooks/{webhook.id}/{webhook.token}/github' as const
/**
 * @deprecated Use `$channels$_$webhooks` instead
 */
export const _channels_$_webhooks: typeof $channels$_$webhooks = $channels$_$webhooks
/**
 * @deprecated Use `$guilds$_$webhooks` instead
 */
export const _guilds_$_webhooks: typeof $guilds$_$webhooks = $guilds$_$webhooks
/**
 * @deprecated Use `$webhooks$_` instead
 */
export const _webhooks_$: typeof $webhooks$_ = $webhooks$_
/**
 * @deprecated Use `$webhooks$_$_$slack` instead
 */
export const _webhooks_$_$_slack: typeof $webhooks$_$_$slack = $webhooks$_$_$slack
/**
 * @deprecated Use `$webhooks$_$_$github` instead
 */
export const _webhooks_$_$_github: typeof $webhooks$_$_$github = $webhooks$_$_$github
