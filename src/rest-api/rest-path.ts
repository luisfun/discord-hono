////////// Application //////////
// https://discord.com/developers/docs/resources/application

export const _applications_me = '/applications/@me' as const
export const _applications_$_activityinstances_$ =
  '/applications/{application.id}/activity-instances/{instance_id}' as const

////////// Messages //////////
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
