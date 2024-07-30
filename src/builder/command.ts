import type {
  APIApplicationCommand,
  APIApplicationCommandAttachmentOption, // 11
  APIApplicationCommandBasicOption,
  APIApplicationCommandBooleanOption, // 5
  APIApplicationCommandChannelOption, // 7
  APIApplicationCommandIntegerOption, // 4
  APIApplicationCommandMentionableOption, // 9
  APIApplicationCommandNumberOption, // 10
  APIApplicationCommandOption,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandRoleOption, // 8
  APIApplicationCommandStringOption, // 3
  APIApplicationCommandSubcommandGroupOption, // 2
  APIApplicationCommandSubcommandOption, // 1
  APIApplicationCommandUserOption, // 6
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChannelType,
  InteractionContextType,
} from 'discord-api-types/v10'
import type { ApplicationCommand } from '../types'
import { warnNotUse } from '../utils'

type OptionClass =
  | Option<any>
  | NumberOption
  | BooleanOption
  | UserOption
  | ChannelOption
  | RoleOption
  | MentionableOption
  | AttachmentOption

type OptionAllClass = OptionClass | SubCommand | SubGroup

export class Command {
  #command: ApplicationCommand
  /**
   * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
   * @param name 1-32 character name
   * @param description 1-100 character description for CHAT_INPUT commands, empty string for USER and MESSAGE commands
   */
  constructor(name: string, description = '') {
    this.#command = { name, description }
  }
  build = () => this.#command
  #assign = (command: Omit<ApplicationCommand, 'name' | 'description'>) => {
    Object.assign(this.#command, command)
    return this
  }
  id = (e: string) => this.#assign({ id: e })
  application_id = (e: string) => this.#assign({ application_id: e })
  guild_id = (e: string) => this.#assign({ guild_id: e })
  /**
   * [Application Command Types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types)
   */
  type = (e: ApplicationCommandType) => this.#assign({ type: e })
  name_localizations = (e: APIApplicationCommand['name_localizations']) => this.#assign({ name_localizations: e })
  description_localizations = (e: APIApplicationCommand['description_localizations']) =>
    this.#assign({ description_localizations: e })
  default_member_permissions = (e: string | null) => this.#assign({ default_member_permissions: e })
  /**
   * @deprecated Use `contexts` instead
   */
  dm_permission = (e = true) => this.#assign({ dm_permission: e })
  nsfw = (e = true) => this.#assign({ nsfw: e })
  /**
   * [Application Integration Types](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
   */
  integration_types = (...e: ApplicationIntegrationType[]) => this.#assign({ integration_types: e })
  /**
   * [Interaction Context Types](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
   */
  contexts = (...e: InteractionContextType[]) => this.#assign({ contexts: e })
  version = (e: string) => this.#assign({ version: e })
  options = (...e: (OptionAllClass | APIApplicationCommandOption)[]) => {
    const options = e.map(opt => {
      if (
        opt instanceof SubCommand ||
        opt instanceof SubGroup ||
        opt instanceof Option ||
        opt instanceof NumberOption ||
        opt instanceof BooleanOption ||
        opt instanceof UserOption ||
        opt instanceof ChannelOption ||
        opt instanceof RoleOption ||
        opt instanceof MentionableOption ||
        opt instanceof AttachmentOption
      )
        return opt.build()
      return opt
    })
    return this.#assign({ options })
  }
}

class OptionBase {
  #option: APIApplicationCommandOption
  constructor(name: string, description: string, type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11) {
    // @ts-expect-error
    this.#option = { name, description, type }
  }
  build = () => this.#option
  protected a = (
    option:
      | Omit<APIApplicationCommandSubcommandOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandSubcommandGroupOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandStringOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandIntegerOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandBooleanOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandUserOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandChannelOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandRoleOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandMentionableOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandNumberOption, 'name' | 'description' | 'type'>
      | Omit<APIApplicationCommandAttachmentOption, 'name' | 'description' | 'type'>,
  ) => {
    Object.assign(this.#option, option)
    return this
  }
  /**
   * available: ALL
   */
  name_localizations = (e: APIApplicationCommandOption['name_localizations']) => this.a({ name_localizations: e })
  /**
   * available: ALL
   */
  description_localizations = (e: APIApplicationCommandOption['description_localizations']) =>
    this.a({ description_localizations: e })
  /**
   * available: ALL
   */
  required = (e = true) => this.a({ required: e })
}

export class SubCommand extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 1)
  }
  options = (...e: (OptionClass | APIApplicationCommandBasicOption)[]) => {
    const options = e.map(opt => {
      if (
        opt instanceof Option ||
        opt instanceof NumberOption ||
        opt instanceof BooleanOption ||
        opt instanceof UserOption ||
        opt instanceof ChannelOption ||
        opt instanceof RoleOption ||
        opt instanceof MentionableOption ||
        opt instanceof AttachmentOption
      )
        return opt.build() as APIApplicationCommandBasicOption
      return opt
    })
    return this.a({ options })
  }
}

export class SubGroup extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 2)
  }
  options = (...e: (SubCommand | APIApplicationCommandSubcommandOption)[]) => {
    const options = e.map(opt =>
      opt instanceof SubCommand ? (opt.build() as APIApplicationCommandSubcommandOption) : opt,
    )
    return this.a({ options })
  }
}

export class Option<
  T extends
    | 'String'
    | 'Integer'
    | 'Number'
    | 'Boolean'
    | 'User'
    | 'Channel'
    | 'Role'
    | 'Mentionable'
    | 'Attachment' = 'String',
> extends OptionBase {
  #type: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  /**
   * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
   * @param name 1-32 character name
   * @param description 1-100 character description
   */
  constructor(name: string, description: string, type: T = 'String' as T) {
    const typeNum = {
      String: 3,
      Integer: 4,
      Boolean: 5,
      User: 6,
      Channel: 7,
      Role: 8,
      Mentionable: 9,
      Number: 10,
      Attachment: 11,
    } as const
    super(name, description, typeNum[type])
    this.#type = typeNum[type]
  }
  /**
   * available: String, Integer, Number
   */
  choices = (
    // biome-ignore format: ternary operator
    ...e:
      T extends 'String' ? APIApplicationCommandOptionChoice<string>[] :
      T extends 'Integer' | 'Number' ? APIApplicationCommandOptionChoice<number>[] :
      undefined[]
  ) => {
    if (this.#type !== 3 && this.#type !== 4 && this.#type !== 10) {
      warnNotUse('Option.choices')
      return this
    }
    // @ts-expect-error
    return this.a({ choices: e })
  }
  /**
   * available: String, Integer, Number
   */
  min_length = (e: T extends 'String' | 'Integer' | 'Number' ? number : undefined) => {
    if (this.#type !== 3 && this.#type !== 4 && this.#type !== 10) {
      warnNotUse('Option.min_length')
      return this
    }
    return this.a({ min_length: e })
  }
  /**
   * available: String, Integer, Number
   */
  max_length = (e: T extends 'String' | 'Integer' | 'Number' ? number : undefined) => {
    if (this.#type !== 3 && this.#type !== 4 && this.#type !== 10) {
      warnNotUse('Option.max_length')
      return this
    }
    return this.a({ max_length: e })
  }
  /**
   * available: String, Integer, Number
   * @param e Default: true
   */
  autocomplete = (e?: T extends 'String' | 'Integer' | 'Number' ? boolean : undefined) => {
    if (this.#type !== 3 && this.#type !== 4 && this.#type !== 10) {
      warnNotUse('Option.autocomplete')
      return this
    }
    return this.a({ autocomplete: e !== false })
  }
  /**
   * available: Channel
   *
   * [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
   */
  channel_types = (...e: T extends 'Channel' ? ChannelType[] : undefined[]) => {
    if (this.#type !== 7) {
      warnNotUse('Option.channel_types')
      return this
    }
    // @ts-expect-error
    return this.a({ channel_types: e })
  }
}

/**
 * @deprecated
 */
export class NumberOption extends Option<'Integer' | 'Number'> {
  constructor(name: string, description: string, type?: 'integer' | 'number') {
    super(name, description, type === 'integer' ? 'Integer' : 'Number')
  }
}
/**
 * @deprecated
 */
export class BooleanOption extends Option<'Boolean'> {
  constructor(name: string, description: string) {
    super(name, description, 'Boolean')
  }
}
/**
 * @deprecated
 */
export class UserOption extends Option<'User'> {
  constructor(name: string, description: string) {
    super(name, description, 'User')
  }
}
/**
 * @deprecated
 */
export class ChannelOption extends Option<'Channel'> {
  constructor(name: string, description: string) {
    super(name, description, 'Channel')
  }
}
/**
 * @deprecated
 */
export class RoleOption extends Option<'Role'> {
  constructor(name: string, description: string) {
    super(name, description, 'Role')
  }
}
/**
 * @deprecated
 */
export class MentionableOption extends Option<'Mentionable'> {
  constructor(name: string, description: string) {
    super(name, description, 'Mentionable')
  }
}
/**
 * @deprecated
 */
export class AttachmentOption extends Option<'Attachment'> {
  constructor(name: string, description: string) {
    super(name, description, 'Attachment')
  }
}
