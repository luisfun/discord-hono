////////// Receiving and Responding //////////
// https://discord.com/developers/docs/interactions/receiving-and-responding
// ✅
export const _interactions_$_$_callback = '/interactions/{interaction.id}/{interaction.token}/callback' as const
export const _webhooks_$_$_messages_original =
  '/webhooks/{application.id}/{interaction.token}/messages/@original' as const
export const _webhooks_$_$ = '/webhooks/{application.id}/{interaction.token}' as const
export const _webhooks_$_$_messages_$ = '/webhooks/{application.id}/{interaction.token}/messages/{message.id}' as const

////////// Application Commands //////////
// https://discord.com/developers/docs/interactions/application-commands

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

export const _applications_me = '/applications/@me' as const
//export const _applications_$_activityinstances_$ = '/applications/{application.id}/activity-instances/{instance_id}' as const

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

////////// Channel //////////
// https://discord.com/developers/docs/resources/channel

export const _channels_$ = '/channels/{channel.id}' as const

////////// Guild //////////
// https://discord.com/developers/docs/resources/guild

export const _guilds_$_channels = '/guilds/{guild.id}/channels' as const
