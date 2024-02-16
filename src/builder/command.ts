import type {
  APIApplicationCommandOption,
  APIInteractionResponseCallbackData,
  APIInteractionResponse,
  APIEmbed,
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
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type { Env, Commands, TypeCommandHandler, ApplicationCommand as Cmd } from '../types'
import type { CommandContext } from '../context'
import type { Modal } from './modal'

type OptionClass =
  | CommandOption
  | CommandNumberOption
  | CommandBooleanOption
  | CommandUserOption
  | CommandChannelOption
  | CommandRoleOption
  | CommandMentionableOption
  | CommandAttachmentOption

type OptionAllClass = OptionClass | CommandSubOption | CommandSubGroupOption
type Output<E extends Env> = Commands<E>[0]
/**
 * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
 */
export class Command<E extends Env = any> {
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
  dm_permission = (e: Cmd['dm_permission']) => this.assign({ dm_permission: e })
  nsfw = (e: Cmd['nsfw']) => this.assign({ nsfw: e })
  version = (e: Cmd['version']) => this.assign({ version: e })
  // options
  options = (...e: (OptionAllClass | APIApplicationCommandOption)[]) => {
    const options = e.map(opt => {
      if (
        opt instanceof CommandSubOption ||
        opt instanceof CommandSubGroupOption ||
        opt instanceof CommandOption ||
        opt instanceof CommandNumberOption ||
        opt instanceof CommandBooleanOption ||
        opt instanceof CommandUserOption ||
        opt instanceof CommandChannelOption ||
        opt instanceof CommandRoleOption ||
        opt instanceof CommandMentionableOption ||
        opt instanceof CommandAttachmentOption
      )
        return opt.build()
      return opt
    })
    return this.assign({ options })
  }

  // build()
  resBase = (e: APIInteractionResponse): Output<E> => [this.#command, (c: CommandContext) => c.resBase(e)]
  res = (e: APIInteractionResponseCallbackData): Output<E> => [this.#command, (c: CommandContext) => c.res(e)]
  resText = (content: string) => this.res({ content })
  resEmbeds = (...embeds: APIEmbed[]) => this.res({ embeds })
  resDefer = <T>(handler: (c: CommandContext<E>, ...args1: T[]) => Promise<unknown>, ...args: T[]): Output<E> => [
    this.#command,
    (c: CommandContext<E>) => {
      if (!c.executionCtx.waitUntil && !c.event.waitUntil)
        throw new Error('This command handler context has no waitUntil. You can use .handler(command_handler).')
      if (c.executionCtx.waitUntil) c.executionCtx.waitUntil(handler(c, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else c.event.waitUntil(handler(c, ...args))
      return c.resDefer()
    },
  ]
  resModal = (e: Modal | APIModalInteractionResponseCallbackData): Output<E> => [
    this.#command,
    (c: CommandContext) => c.resModal(e),
  ]
  handler = (handler: TypeCommandHandler<E>): Output<E> => [this.#command, handler]
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
    this.option = { name, description, type } // as APIApplicationCommandOption
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

export class CommandSubOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 1)
  }
  options = (...e: (OptionClass | APIApplicationCommandBasicOption)[]) => {
    const options = e.map(opt => {
      if (
        opt instanceof CommandOption ||
        opt instanceof CommandNumberOption ||
        opt instanceof CommandBooleanOption ||
        opt instanceof CommandUserOption ||
        opt instanceof CommandChannelOption ||
        opt instanceof CommandRoleOption ||
        opt instanceof CommandMentionableOption ||
        opt instanceof CommandAttachmentOption
      )
        return opt.build() as APIApplicationCommandBasicOption
      return opt
    })
    return this.assign({ options })
  }
}

export class CommandSubGroupOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 2)
  }
  options = (...e: (CommandSubOption | APIApplicationCommandSubcommandOption)[]) => {
    const options = e.map(opt =>
      opt instanceof CommandSubOption ? (opt.build() as APIApplicationCommandSubcommandOption) : opt,
    )
    return this.assign({ options })
  }
}

export class CommandOption extends OptionBase {
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

type NumberOption = APIApplicationCommandIntegerOption | APIApplicationCommandNumberOption
export class CommandNumberOption extends OptionBase {
  /**
   * @param type default 'number'
   */
  constructor(name: string, description: string, type?: 'integer' | 'number') {
    super(name, description, type === 'integer' ? 4 : 10)
  }
  choices = (...e: APIApplicationCommandOptionChoice<number>[]) => this.assign({ choices: e })
  min_value = (e: NumberOption['min_value']) => this.assign({ min_value: e })
  max_value = (e: NumberOption['max_value']) => this.assign({ max_value: e })
  autocomplete = (e: NumberOption['autocomplete']) => this.assign({ autocomplete: e })
}

export class CommandBooleanOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 5)
  }
}

export class CommandUserOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 6)
  }
}

export class CommandChannelOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 7)
  }
  channel_types = (e: APIApplicationCommandChannelOption['channel_types']) => this.assign({ channel_types: e })
}

export class CommandRoleOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 8)
  }
}

export class CommandMentionableOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 9)
  }
}

export class CommandAttachmentOption extends OptionBase {
  constructor(name: string, description: string) {
    super(name, description, 11)
  }
}
