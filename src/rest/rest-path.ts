////////// Duplication //////////

export const $webhooks$_$_ = '/webhooks/{}/{}' as
  | '/webhooks/{application.id}/{interaction.token}'
  | '/webhooks/{webhook.id}/{webhook.token}'
export const $webhooks$_$_$messages$_ = '/webhooks/{}/{}/messages/{}' as
  | '/webhooks/{application.id}/{interaction.token}/messages/{message.id}'
  | '/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}'

////////// Receiving and Responding //////////
// https://discord.com/developers/docs/interactions/receiving-and-responding
// ✅ 25/02/07
export const $interactions$_$_$callback = '/interactions/{interaction.id}/{interaction.token}/callback' as const
// Compressed because it's used in Context
export const $webhooks$_$_$messages$original =
  '/webhooks/{}/{}/messages/@original' as '/webhooks/{application.id}/{interaction.token}/messages/@original'

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

////////// Application //////////
// https://discord.com/developers/docs/resources/application
// ✅ 25/02/07
export const $applications$me = '/applications/@me' as const
export const $applications$_$activityinstances$_ =
  '/applications/{application.id}/activity-instances/{instance_id}' as const

////////// Application Role Connection Metadata //////////
// https://discord.com/developers/docs/resources/application-role-connection-metadata
// ✅ 25/02/07
export const $applications$_$roleconnections$metadata =
  '/applications/{application.id}/role-connections/metadata' as const

////////// Audit Log //////////
// https://discord.com/developers/docs/resources/audit-log
// ✅ 25/02/07
export const $guilds$_$auditlogs = '/guilds/{guild.id}/audit-logs' as const

////////// Auto Moderation //////////
// https://discord.com/developers/docs/resources/auto-moderation
// ✅ 25/02/07
export const $guilds$_$automoderation$rules = '/guilds/{guild.id}/auto-moderation/rules' as const
export const $guilds$_$automoderation$rules$_ =
  '/guilds/{guild.id}/auto-moderation/rules/{auto_moderation_rule.id}' as const

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

////////// Emoji //////////
// https://discord.com/developers/docs/resources/emoji
// ✅ 25/02/08
export const $guilds$_$emojis = '/guilds/{guild.id}/emojis' as const
export const $guilds$_$emojis$_ = '/guilds/{guild.id}/emojis/{emoji.id}' as const
export const $applications$_$emojis = '/applications/{application.id}/emojis' as const
export const $applications$_$emojis$_ = '/applications/{application.id}/emojis/{emoji.id}' as const

////////// Entitlement //////////
// https://discord.com/developers/docs/resources/entitlement
// ✅ 25/02/08
export const $applications$_$entitlements = '/applications/{application.id}/entitlements' as const
export const $applications$_$entitlements$_ = '/applications/{application.id}/entitlements/{entitlement.id}' as const
export const $applications$_$entitlements$_$consume =
  '/applications/{application.id}/entitlements/{entitlement.id}/consume' as const

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

////////// Guild Scheduled Event //////////
// https://discord.com/developers/docs/resources/guild-scheduled-event
// ✅ 25/02/08
export const $guilds$_$scheduledevents = '/guilds/{guild.id}/scheduled-events' as const
export const $guilds$_$scheduledevents$_ = '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}' as const
export const $guilds$_$scheduledevents$_$users =
  '/guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users' as const

////////// Guild Template //////////
// https://discord.com/developers/docs/resources/guild-template
// ✅ 25/02/08
export const $guilds$templates$_ = '/guilds/templates/{template.code}' as const
export const $guilds$_$templates = '/guilds/{guild.id}/templates' as const
export const $guilds$_$templates$_ = '/guilds/{guild.id}/templates/{template.code}' as const

////////// Invite //////////
// https://discord.com/developers/docs/resources/invite
// ✅ 25/02/08
export const $invites$_ = '/invites/{invite.code}' as const

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

////////// Poll //////////
// https://discord.com/developers/docs/resources/poll
// ✅ 25/02/08
export const $channels$_$polls$_$answers$_ = '/channels/{channel.id}/polls/{message.id}/answers/{answer_id}' as const
export const $channels$_$polls$_$expire = '/channels/{channel.id}/polls/{message.id}/expire' as const

////////// SKU //////////
// https://discord.com/developers/docs/resources/sku
// ✅ 25/02/08
export const $applications$_$skus = '/applications/{application.id}/skus' as const

////////// Soundboard //////////
// https://discord.com/developers/docs/resources/soundboard
// ✅ 25/02/08
export const $channels$_$sendsoundboardsound = '/channels/{channel.id}/send-soundboard-sound' as const
export const $soundboarddefaultsounds = '/soundboard-default-sounds' as const
export const $guilds$_$soundboardsounds = '/guilds/{guild.id}/soundboard-sounds' as const
export const $guilds$_$soundboardsounds$_ = '/guilds/{guild.id}/soundboard-sounds/{sound.id}' as const

////////// Stage Instance //////////
// https://discord.com/developers/docs/resources/stage-instance
// ✅ 25/02/09
export const $stageinstances = '/stage-instances' as const
export const $stageinstances$_ = '/stage-instances/{channel.id}' as const

////////// Sticker //////////
// https://discord.com/developers/docs/resources/sticker
// ✅ 25/02/09
export const $stickers$_ = '/stickers/{sticker.id}' as const
export const $stickerpacks = '/sticker-packs' as const
export const $stickerpacks$_ = '/sticker-packs/{pack.id}' as const
export const $guilds$_$stickers = '/guilds/{guild.id}/stickers' as const
export const $guilds$_$stickers$_ = '/guilds/{guild.id}/stickers/{sticker.id}' as const

///// Not supported yet /////
// [Create Guild Sticker](https://discord.com/developers/docs/resources/sticker#create-guild-sticker) // https://discord-api-types.dev/search?q=RESTPostAPIGuildSticker

////////// Subscription //////////
// https://discord.com/developers/docs/resources/subscription
// ✅ 25/02/09
export const $skus$_$subscriptions = '/skus/{sku.id}/subscriptions' as const
export const $skus$_$subscriptions$_ = '/skus/{sku.id}/subscriptions/{subscription.id}' as const

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

////////// Voice //////////
// https://discord.com/developers/docs/resources/voice
// ✅ 25/02/09
export const $voice$regions = '/voice/regions' as const
export const $guilds$_$voicestates$me = '/guilds/{guild.id}/voice-states/@me' as const
export const $guilds$_$voicestates$_ = '/guilds/{guild.id}/voice-states/{user.id}' as const

////////// Webhook //////////
// https://discord.com/developers/docs/resources/webhook
// ✅ 25/02/09
export const $channels$_$webhooks = '/channels/{channel.id}/webhooks' as const
export const $guilds$_$webhooks = '/guilds/{guild.id}/webhooks' as const
export const $webhooks$_ = '/webhooks/{webhook.id}' as const
export const $webhooks$_$_$slack = '/webhooks/{webhook.id}/{webhook.token}/slack' as const
export const $webhooks$_$_$github = '/webhooks/{webhook.id}/{webhook.token}/github' as const
