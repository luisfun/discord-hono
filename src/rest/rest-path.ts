////////// Receiving and Responding //////////
// https://discord.com/developers/docs/interactions/receiving-and-responding
// ✅ 25/02/07
export const _interactions_$_$_callback = '/interactions/{interaction.id}/{interaction.token}/callback' as const
export const _webhooks_$_$_messages_original =
  '/webhooks/{application.id}/{interaction.token}/messages/@original' as const
export const _webhooks_$_$ = '/webhooks/{application.id}/{interaction.token}' as const
export const _webhooks_$_$_messages_$ = '/webhooks/{application.id}/{interaction.token}/messages/{message.id}' as const

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
export const _guilds_$_automoderation_rules_$ = '/guilds/{guild.id}/auto-moderation/rules/{auto_moderation_rule.id}' as const

////////// Channel //////////
// https://discord.com/developers/docs/resources/channel

export const _channels_$ = '/channels/{channel.id}' as const
export const _channels_$_permissions_$ = '/channels/{channel.id}/permissions/{overwrite.id}' as const
export const _channels_$_invites = '/channels/{channel.id}/invites' as const
export const _channels_$_followers = "/channels/{channel.id}/followers" as const
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
export const _channels_$_users_me_threads_archived_private = '/channels/{channel.id}/users/@me/threads/archived/private' as const

////////// Message //////////
// https://discord.com/developers/docs/resources/message

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

////////// Guild //////////
// https://discord.com/developers/docs/resources/guild

export const _guilds_$_channels = '/guilds/{guild.id}/channels' as const
