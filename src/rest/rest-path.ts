////////// Duplication //////////

export const _webhooks_$_$ = '/webhooks/{}/{}' as
  | '/webhooks/{application.id}/{interaction.token}'
  | '/webhooks/{webhook.id}/{webhook.token}'
export const _webhooks_$_$_messages_$ = '/webhooks/{}/{}/messages/{}' as
  | '/webhooks/{application.id}/{interaction.token}/messages/{message.id}'
  | '/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}'

////////// Receiving and Responding //////////
// https://discord.com/developers/docs/interactions/receiving-and-responding
// ✅ 25/02/07
export const _interactions_$_$_callback = '/interactions/{interaction.id}/{interaction.token}/callback' as const
export const _webhooks_$_$_messages_original =
  '/webhooks/{application.id}/{interaction.token}/messages/@original' as const
//export const _webhooks_$_$ = '/webhooks/{application.id}/{interaction.token}' as const
//export const _webhooks_$_$_messages_$ = '/webhooks/{application.id}/{interaction.token}/messages/{message.id}' as const

////////// Application Commands //////////
// https://discord.com/developers/docs/interactions/application-commands
// ✅ 25/02/07
export const _applications_$_commands = '/applications/{application.id}/commands' as const
export const _applications_$_commands_$ = '/applications/{application.id}/commands/{command.id}' as const
export const _applications_$_guilds_$_commands = '/applications/{application.id}/guilds/{guild.id}/commands' as const
export const _applications_$_guilds_$_commands_$ =
  '/applications/{application.id}/guilds/{guild.id}/commands/{command.id}' as const
export const _applications_$_guilds_$_commands_permissions =
  '/applications/{application.id}/guilds/{guild.id}/commands/permissions' as const
export const _applications_$_guilds_$_commands_$_permissions =
  '/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions' as const

////////// Application //////////
// https://discord.com/developers/docs/resources/application
// ✅ 25/02/07
export const _applications_me = '/applications/@me' as const
export const _applications_$_activityinstances_$ =
  '/applications/{application.id}/activity-instances/{instance_id}' as const

////////// Application Role Connection Metadata //////////
// https://discord.com/developers/docs/resources/application-role-connection-metadata
// ✅ 25/02/07
export const _applications_$_roleconnections_metadata =
  '/applications/{application.id}/role-connections/metadata' as const

////////// Audit Log //////////
// https://discord.com/developers/docs/resources/audit-log
// ✅ 25/02/07
export const _guilds_$_auditlogs = '/guilds/{guild.id}/audit-logs' as const

////////// Auto Moderation //////////
// https://discord.com/developers/docs/resources/auto-moderation
// ✅ 25/02/07
export const _guilds_$_automoderation_rules = '/guilds/{guild.id}/auto-moderation/rules' as const
export const _guilds_$_automoderation_rules_$ =
  '/guilds/{guild.id}/auto-moderation/rules/{auto_moderation_rule.id}' as const

////////// Channel //////////
// https://discord.com/developers/docs/resources/channel
// ✅ 25/02/08
export const _channels_$ = '/channels/{channel.id}' as const
export const _channels_$_permissions_$ = '/channels/{channel.id}/permissions/{overwrite.id}' as const
export const _channels_$_invites = '/channels/{channel.id}/invites' as const
export const _channels_$_followers = '/channels/{channel.id}/followers' as const
export const _channels_$_typing = '/channels/{channel.id}/typing' as const
export const _channels_$_pins = '/channels/{channel.id}/pins' as const
export const _channels_$_pins_$ = '/channels/{channel.id}/pins/{message.id}' as const
export const _channels_$_recipients_$ = '/channels/{channel.id}/recipients/{user.id}' as const
export const _channels_$_messages_$_threads = '/channels/{channel.id}/messages/{message.id}/threads' as const
export const _channels_$_threads = '/channels/{channel.id}/threads' as const
export const _channels_$_threadmembers_me = '/channels/{channel.id}/thread-members/@me' as const
export const _channels_$_threadmembers_$ = '/channels/{channel.id}/thread-members/{user.id}' as const
export const _channels_$_threadmembers = '/channels/{channel.id}/thread-members' as const
export const _channels_$_threads_archived_public = '/channels/{channel.id}/threads/archived/public' as const
export const _channels_$_threads_archived_private = '/channels/{channel.id}/threads/archived/private' as const
export const _channels_$_users_me_threads_archived_private =
  '/channels/{channel.id}/users/@me/threads/archived/private' as const

////////// Emoji //////////
// https://discord.com/developers/docs/resources/emoji
// ✅ 25/02/08
export const _guilds_$_emojis = '/guilds/{guild.id}/emojis' as const
export const _guilds_$_emojis_$ = '/guilds/{guild.id}/emojis/{emoji.id}' as const
export const _applications_$_emojis = '/applications/{application.id}/emojis' as const
export const _applications_$_emojis_$ = '/applications/{application.id}/emojis/{emoji.id}' as const

////////// Entitlement //////////
// https://discord.com/developers/docs/resources/entitlement
// ✅ 25/02/08
export const _applications_$_entitlements = '/applications/{application.id}/entitlements' as const
export const _applications_$_entitlements_$ = '/applications/{application.id}/entitlements/{entitlement.id}' as const
export const _applications_$_entitlements_$_consume =
  '/applications/{application.id}/entitlements/{entitlement.id}/consume' as const

////////// Guild //////////
// https://discord.com/developers/docs/resources/guild
// ✅ 25/02/08
export const _guilds = '/guilds' as const
export const _guilds_$ = '/guilds/{guild.id}' as const
export const _guilds_$_preview = '/guilds/{guild.id}/preview' as const
export const _guilds_$_channels = '/guilds/{guild.id}/channels' as const
export const _guilds_$_threads_active = '/guilds/{guild.id}/threads/active' as const
export const _guilds_$_members_$ = '/guilds/{guild.id}/members/{user.id}' as const
export const _guilds_$_members = '/guilds/{guild.id}/members' as const
export const _guilds_$_members_search = '/guilds/{guild.id}/members/search' as const
export const _guilds_$_members_me = '/guilds/{guild.id}/members/@me' as const
export const _guilds_$_members_me_nick = '/guilds/{guild.id}/members/@me/nick' as const
export const _guilds_$_members_$_roles_$ = '/guilds/{guild.id}/members/{user.id}/roles/{role.id}' as const
export const _guilds_$_bans = '/guilds/{guild.id}/bans' as const
export const _guilds_$_bans_$ = '/guilds/{guild.id}/bans/{user.id}' as const
export const _guilds_$_bulkban = '/guilds/{guild.id}/bulk-ban' as const
export const _guilds_$_roles = '/guilds/{guild.id}/roles' as const
export const _guilds_$_roles_$ = '/guilds/{guild.id}/roles/{role.id}' as const
export const _guilds_$_mfa = '/guilds/{guild.id}/mfa' as const
export const _guilds_$_prune = '/guilds/{guild.id}/prune' as const
export const _guilds_$_regions = '/guilds/{guild.id}/regions' as const
export const _guilds_$_invites = '/guilds/{guild.id}/invites' as const
export const _guilds_$_integrations = '/guilds/{guild.id}/integrations' as const
export const _guilds_$_integrations_$ = '/guilds/{guild.id}/integrations/{integration.id}' as const
export const _guilds_$_widget = '/guilds/{guild.id}/widget' as const
export const _guilds_$_widgetjson = '/guilds/{guild.id}/widget.json' as const
export const _guilds_$_vanityurl = '/guilds/{guild.id}/vanity-url' as const
export const _guilds_$_widgetpng = '/guilds/{guild.id}/widget.png' as const
export const _guilds_$_welcomescreen = '/guilds/{guild.id}/welcome-screen' as const
export const _guilds_$_onboarding = '/guilds/{guild.id}/onboarding' as const
export const _guilds_$_incidentactions = '/guilds/{guild.id}/incident-actions' as const

////////// Guild Scheduled Event //////////
// https://discord.com/developers/docs/resources/guild-scheduled-event
// ✅ 25/02/08
export const _guilds_$_scheduledevents = '/guilds/{guild.id}/scheduled-events' as const
export const _guilds_$_scheduledevents_$ = '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}' as const
export const _guilds_$_scheduledevents_$_users =
  '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users' as const

////////// Guild Template //////////
// https://discord.com/developers/docs/resources/guild-template
// ✅ 25/02/08
export const _guilds_templates_$ = '/guilds/templates/{template.code}' as const
export const _guilds_$_templates = '/guilds/{guild.id}/templates' as const
export const _guilds_$_templates_$ = '/guilds/{guild.id}/templates/{template.code}' as const

////////// Invite //////////
// https://discord.com/developers/docs/resources/invite
// ✅ 25/02/08
export const _invites_$ = '/invites/{invite.code}' as const

////////// Message //////////
// https://discord.com/developers/docs/resources/message
// ✅ 25/02/08
export const _channels_$_messages = '/channels/{channel.id}/messages' as const
export const _channels_$_messages_$ = '/channels/{channel.id}/messages/{message.id}' as const
export const _channels_$_messages_$_crosspost = '/channels/{channel.id}/messages/{message.id}/crosspost' as const
export const _channels_$_messages_$_reactions_$_me =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me' as const
export const _channels_$_messages_$_reactions_$_$ =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}' as const
export const _channels_$_messages_$_reactions_$ =
  '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}' as const
export const _channels_$_messages_$_reactions = '/channels/{channel.id}/messages/{message.id}/reactions' as const
export const _channels_$_messages_bulkdelete = '/channels/{channel.id}/messages/bulk-delete' as const

////////// Poll //////////
// https://discord.com/developers/docs/resources/poll
// ✅ 25/02/08
export const _channels_$_polls_$_answers_$ = '/channels/{channel.id}/polls/{message.id}/answers/{answer_id}' as const
export const _channels_$_polls_$_expire = '/channels/{channel.id}/polls/{message.id}/expire' as const

////////// SKU //////////
// https://discord.com/developers/docs/resources/sku
// ✅ 25/02/08
export const _applications_$_skus = '/applications/{application.id}/skus' as const

////////// Soundboard //////////
// https://discord.com/developers/docs/resources/soundboard
// ✅ 25/02/08
export const _channels_$_sendsoundboardsound = '/channels/{channel.id}/send-soundboard-sound' as const
export const _soundboarddefaultsounds = '/soundboard-default-sounds' as const
export const _guilds_$_soundboardsounds = '/guilds/{guild.id}/soundboard-sounds' as const
export const _guilds_$_soundboardsounds_$ = '/guilds/{guild.id}/soundboard-sounds/{sound.id}' as const

////////// Stage Instance //////////
// https://discord.com/developers/docs/resources/stage-instance
// ✅ 25/02/09
export const _stageinstances = '/stage-instances' as const
export const _stageinstances_$ = '/stage-instances/{channel.id}' as const

////////// Sticker //////////
// https://discord.com/developers/docs/resources/sticker
// ✅ 25/02/09
export const _stickers_$ = '/stickers/{sticker.id}' as const
export const _stickerpacks = '/sticker-packs' as const
export const _stickerpacks_$ = '/sticker-packs/{pack.id}' as const
export const _guilds_$_stickers = '/guilds/{guild.id}/stickers' as const
export const _guilds_$_stickers_$ = '/guilds/{guild.id}/stickers/{sticker.id}' as const

// 想定外パターン
// https://discord.com/developers/docs/resources/sticker#create-guild-sticker
// https://discord-api-types.dev/search?q=RESTPostAPIGuildSticker

////////// Subscription //////////
// https://discord.com/developers/docs/resources/subscription
// ✅ 25/02/09
export const _skus_$_subscriptions = '/skus/{sku.id}/subscriptions' as const
export const _skus_$_subscriptions_$ = '/skus/{sku.id}/subscriptions/{subscription.id}' as const

////////// User //////////
// https://discord.com/developers/docs/resources/user
// ✅ 25/02/09
export const _users_me = '/users/@me' as const
export const _users_$ = '/users/{user.id}' as const
export const _users_me_guilds = '/users/@me/guilds' as const
export const _users_me_guilds_$_member = '/users/@me/guilds/{guild.id}/member' as const
export const _users_me_guilds_$ = '/users/@me/guilds/{guild.id}' as const
export const _users_me_channels = '/users/@me/channels' as const
export const _users_me_connections = '/users/@me/connections' as const
export const _users_me_applications_$_roleconnection =
  '/users/@me/applications/{application.id}/role-connection' as const

////////// Voice //////////
// https://discord.com/developers/docs/resources/voice
// ✅ 25/02/09
export const _voice_regions = '/voice/regions' as const
export const _guilds_$_voicestates_me = '/guilds/{guild.id}/voice-states/@me' as const
export const _guilds_$_voicestates_$ = '/guilds/{guild.id}/voice-states/{user.id}' as const

////////// Webhook //////////
// https://discord.com/developers/docs/resources/webhook
// ✅ 25/02/09
export const _channels_$_webhooks = '/channels/{channel.id}/webhooks' as const
export const _guilds_$_webhooks = '/guilds/{guild.id}/webhooks' as const
export const _webhooks_$ = '/webhooks/{webhook.id}' as const
//export const _webhooks_$_$ = '/webhooks/{webhook.id}/{webhook.token}' as const
export const _webhooks_$_$_slack = '/webhooks/{webhook.id}/{webhook.token}/slack' as const
export const _webhooks_$_$_github = '/webhooks/{webhook.id}/{webhook.token}/github' as const
//export const _webhooks_$_$_messages_$ = '/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}' as const
