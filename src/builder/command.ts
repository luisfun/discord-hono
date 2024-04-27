// biome-ignore lint: parameter order
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption, // 1
  APIApplicationCommandSubcommandGroupOption, // 2
  APIApplicationCommandStringOption, // 3
  APIApplicationCommandIntegerOption, // 4
  APIApplicationCommandBooleanOption, // 5
  APIApplicationCommandUserOption, // 6
  APIApplicationCommandChannelOption, // 7
  APIApplicationCommandRoleOption, // 8
  APIApplicationCommandMentionableOption, // 9
  APIApplicationCommandNumberOption, // 10
  APIApplicationCommandAttachmentOption, // 11
  APIApplicationCommandBasicOption,
  APIApplicationCommandOptionChoice,
} from 'discord-api-types/v10'
import type { ApplicationCommand as Cmd } from '../types'

type OptionClass =
  | Option
  | NumberOption
  | BooleanOption
  | UserOption
  | ChannelOption
  | RoleOption
  | MentionableOption
  | AttachmentOption

type OptionAllClass = OptionClass | SubCommand | SubGroup
/**
 * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
 */
export class Command {
  #command: Cmd
  /**
   * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
   * @param name 1-32 character name
   * @param description 1-100 character description for CHAT_INPUT commands, empty string for USER and MESSAGE commands
   */
  constructor(name: Cmd['name'], description: Cmd['description'] = '') {
    this.#command = { name, description }
  }

  private assign = (command: Omit<Cmd, 'name' | 'description'>) => {
    Object.assign(this.#command, command)
    return this
  }
  id = (e: Cmd['id']) => this.assign({ id: e })
  application_id = (e: Cmd['application_id']) => this.assign({ application_id: e })
  guild_id = (e: Cmd['guild_id']) => this.assign({ guild_id: e })
  type = (e: Cmd['type']) => this.assign({ type: e })
  name_localizations = (e: Cmd['name_localizations']) => this.assign({ name_localizations: e })
  description_localizations = (e: Cmd['description_localizations']) => this.assign({ description_localizations: e })
  default_member_permissions = (e: Cmd['default_member_permissions']) => this.assign({ default_member_permissions: e })
  dm_permission = (e: Cmd['dm_permission'] = true) => this.assign({ dm_permission: e })
  nsfw = (e: Cmd['nsfw'] = true) => this.assign({ nsfw: e })
  // @ts-expect-error
  integration_types = (e: (0 | 1)[] /*Cmd['integration_types']*/) => this.assign({ integration_types: e })
  // @ts-expect-error
  contexts = (e: (0 | 1 | 2)[] /*Cmd['contexts']*/) => this.assign({ contexts: e })
  version = (e: Cmd['version']) => this.assign({ version: e })
  // options
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
    return this.assign({ options })
  }
  build = () => this.#command
}

type OmitOption =
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
  | Omit<APIApplicationCommandAttachmentOption, 'name' | 'description' | 'type'>
class OptionBase {
  protected option: APIApplicationCommandOption
  constructor(name: string, description: string, type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11) {
    // @ts-expect-error *************** 型定義がおかしい？ 分からない
    this.option = { name, description, type }
  }
  protected assign = (option: OmitOption) => {
    Object.assign(this.option, option)
    return this
  }
  name_localizations = (e: APIApplicationCommandOption['name_localizations']) => this.assign({ name_localizations: e })
  description_localizations = (e: APIApplicationCommandOption['description_localizations']) =>
    this.assign({ description_localizations: e })
  required = (e: APIApplicationCommandOption['required'] = true) => this.assign({ required: e })
  build = () => this.option
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
    return this.assign({ options })
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
    return this.assign({ options })
  }
}

export class Option extends OptionBase {
  /**
   * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
   * @param name 1-32 character name
   * @param description 1-100 character description
   */
  constructor(name: string, description: string) {
    super(name, description, 3)
  }
  choices = (...e: APIApplicationCommandOptionChoice<string>[]) => this.assign({ choices: e })
  min_length = (e: APIApplicationCommandStringOption['min_length']) => this.assign({ min_length: e })
  max_length = (e: APIApplicationCommandStringOption['max_length']) => this.assign({ max_length: e })
  autocomplete = (e: APIApplicationCommandStringOption['autocomplete']) => this.assign({ autocomplete: e })
}

type TypeNumberOption = APIApplicationCommandIntegerOption | APIApplicationCommandNumberOption
export class NumberOption extends OptionBase {
  /**
   * @param type default 'number'
   */
  constructor(name: string, description: string, type?: 'integer' | 'number') {
    super(name, description, type === 'integer' ? 4 : 10)
  }
  choices = (...e: APIApplicationCommandOptionChoice<number>[]) => this.assign({ choices: e })
  min_value = (e: TypeNumberOption['min_value']) => this.assign({ min_value: e })
  max_value = (e: TypeNumberOption['max_value']) => this.assign({ max_value: e })
  autocomplete = (e: TypeNumberOption['autocomplete']) => this.assign({ autocomplete: e })
}

export class BooleanOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 5)
  }
}

export class UserOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 6)
  }
}

export class ChannelOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 7)
  }
  channel_types = (e: APIApplicationCommandChannelOption['channel_types']) => this.assign({ channel_types: e })
}

export class RoleOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 8)
  }
}

export class MentionableOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 9)
  }
}

export class AttachmentOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 11)
  }
}
