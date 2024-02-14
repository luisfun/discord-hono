import type {
  APIApplicationCommandOption,
  APIInteractionResponseCallbackData,
  APIInteractionResponse,
  APIEmbed,
  ApplicationCommandOptionType,
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
import type { Env, Commands, CommandHandler, ApplicationCommand as Cmd } from '../types'
import type { Context } from '../context'

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

  // builder
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
  option = (e: CommandOption | APIApplicationCommandOption) => {
    const opt = e instanceof CommandOption ? e.build() : e
    this.#command.options ??= []
    this.#command.options.push(opt)
    return this
  }

  // build()
  resBase = (e: APIInteractionResponse): Commands<E>[0] => [this.#command, (c: Context) => c.resBase(e)]
  res = (e: APIInteractionResponseCallbackData): Commands<E>[0] => [this.#command, (c: Context) => c.res(e)]
  resText = (e: string): Commands<E>[0] => [this.#command, (c: Context) => c.resText(e)]
  resEmbeds = (...e: APIEmbed[]): Commands<E>[0] => [this.#command, (c: Context) => c.resEmbeds(...e)]
  resDefer = <T>(handler: (c: Context<E>, ...args1: T[]) => Promise<unknown>, ...args: T[]): Commands<E>[0] => [
    this.#command,
    (c: Context<E>) => {
      if (!c.executionCtx.waitUntil && !c.event.waitUntil)
        throw new Error('This command handler context has no waitUntil. You can use .handler(command_handler).')
      if (c.executionCtx.waitUntil) c.executionCtx.waitUntil(handler(c, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else c.event.waitUntil(handler(c, ...args))
      return c.resDefer()
    },
  ]
  handler = (handler: CommandHandler<E>): Commands<E>[0] => [this.#command, handler]
}

// prettier-ignore
type Opt<T extends ApplicationCommandOptionType> =
  T extends 1 ? APIApplicationCommandSubcommandOption :
  T extends 2 ? APIApplicationCommandSubcommandGroupOption :
  T extends 3 ? APIApplicationCommandStringOption :
  T extends 4 ? APIApplicationCommandIntegerOption :
  T extends 5 ? APIApplicationCommandBooleanOption :
  T extends 6 ? APIApplicationCommandUserOption :
  T extends 7 ? APIApplicationCommandChannelOption :
  T extends 8 ? APIApplicationCommandRoleOption :
  T extends 9 ? APIApplicationCommandMentionableOption :
  T extends 10 ? APIApplicationCommandNumberOption :
  T extends 11 ? APIApplicationCommandAttachmentOption :
  APIApplicationCommandOption

type OptOmit<T> = Omit<T, 'name' | 'description' | 'type'>

class OptionBase<T extends ApplicationCommandOptionType> {
  protected option: Opt<T>
  constructor(name: string, description: string, type: T) {
    this.option = { name, description, type } as Opt<T>
  }
  protected assign = (option: OptOmit<Opt<T>>) => {
    Object.assign(this.option, option)
    return this
  }
  name_localizations = (e: Opt<T>['name_localizations']) => this.assign({ name_localizations: e } as OptOmit<Opt<T>>)
  description_localizations = (e: Opt<T>['description_localizations']) =>
    this.assign({ description_localizations: e } as OptOmit<Opt<T>>)
  required = (e: Opt<T>['required'] = true) => this.assign({ required: e } as OptOmit<Opt<T>>)
  build = () => this.option
}

type CommandClass = CommandOption | CommandNumberOption | CommandOtherOption | CommandChannelOption

export class CommandSubOption extends OptionBase<1> {
  constructor(name: string, description: string) {
    super(name, description, 1)
  }
  options = (e: (CommandClass | APIApplicationCommandBasicOption)[]) => {
    const options = e.map(opt => {
      if (
        opt instanceof CommandOption ||
        opt instanceof CommandNumberOption ||
        opt instanceof CommandOtherOption ||
        opt instanceof CommandChannelOption
      )
        return opt.build()
      return opt
    })
    return this.assign({ options })
  }
}

export class CommandSubGroupOption extends OptionBase<2> {
  constructor(name: string, description: string) {
    super(name, description, 2)
  }
  options = (...e: (CommandSubOption | APIApplicationCommandSubcommandOption)[]) => {
    const options = e.map(opt => (opt instanceof CommandSubOption ? opt.build() : opt))
    return this.assign({ options })
  }
}

export class CommandOption extends OptionBase<3> {
  /**
   * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
   * @param name 1-32 character name
   * @param description 1-100 character description
   */
  constructor(name: string, description: string) {
    super(name, description, 3)
  }
  choices = (...e: APIApplicationCommandOptionChoice<string>[]) => this.assign({ choices: e })
  min_length = (e: Opt<3>['min_length']) => this.assign({ min_length: e })
  max_length = (e: Opt<3>['max_length']) => this.assign({ max_length: e })
  autocomplete = (e: Opt<3>['autocomplete']) => this.assign({ autocomplete: e })
}

export class CommandNumberOption extends OptionBase<4 | 10> {
  constructor(name: string, description: string, type?: 'integer') {
    super(name, description, type === 'integer' ? 4 : 10)
  }
  choices = (...e: APIApplicationCommandOptionChoice<number>[]) => this.assign({ choices: e })
  min_value = (e: Opt<4 | 10>['min_value']) => this.assign({ min_value: e })
  max_value = (e: Opt<4 | 10>['max_value']) => this.assign({ max_value: e })
  autocomplete = (e: Opt<4 | 10>['autocomplete']) => this.assign({ autocomplete: e })
}

export class CommandOtherOption extends OptionBase<5 | 6 | 8 | 9 | 11> {
  constructor(name: string, description: string, type: 'boolean' | 'user' | 'role' | 'mentionable' | 'attachment') {
    // prettier-ignore
    const num =
      type === 'boolean' ? 5 :
      type === 'user' ? 6 :
      type === 'role' ? 8 :
      type === 'mentionable' ? 9 :
      type === 'attachment' ? 11 :
      5
    super(name, description, num)
  }
}

export class CommandChannelOption extends OptionBase<7> {
  constructor(name: string, description: string) {
    super(name, description, 7)
  }
  channel_types = (e: Opt<7>['channel_types']) => this.assign({ channel_types: e })
}
