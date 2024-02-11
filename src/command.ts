import type {
  APIApplicationCommandOption,
  APIInteractionResponseCallbackData,
  APIInteractionResponse,
  APIEmbed,
} from 'discord-api-types/v10'
import { ApplicationCommandOptionType } from 'discord-api-types/v10'
import type { Env, Commands, ApplicationCommand as Cmd, ApplicationCommandOption as Opt } from './types'
import type { Context } from './context'

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
    if (!this.#command.options) this.#command.options = []
    this.#command.options.push(opt)
    return this
  }

  // build()
  resBase = (e: APIInteractionResponse): Commands[0] => [this.#command, (c: Context) => c.resBase(e)]
  res = (e: APIInteractionResponseCallbackData): Commands[0] => [this.#command, (c: Context) => c.res(e)]
  resText = (e: string): Commands[0] => [this.#command, (c: Context) => c.resText(e)]
  resEmbeds = (...e: APIEmbed[]): Commands[0] => [this.#command, (c: Context) => c.resEmbeds(...e)]
  resDefer = <T>(handler: (c: Context<E>, ...args1: T[]) => Promise<unknown>, ...args: T[]): Commands[0] => [
    this.#command,
    (c: Context<E>) => {
      if (!c.executionCtx.waitUntil) throw Error('This command handler context has no waitUntil.')
      c.executionCtx.waitUntil(handler(c, ...args))
      return c.resDefer()
    },
  ]
  handler = (handler: (...args: unknown[]) => Promise<Response> | Response): Commands[0] => [this.#command, handler]
}

/**
 * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
 */
export class CommandOption<T extends ApplicationCommandOptionType = ApplicationCommandOptionType.String> {
  #option: Opt<T>

  /**
   * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
   * @param name 1-32 character name
   * @param description 1-100 character description
   * @param type [Command Option Type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
   */
  constructor(name: Opt<T>['name'], description: Opt<T>['description'] = '', type?: T) {
    // @ts-expect-error
    this.#option = { name, description, type: type || ApplicationCommandOptionType.String }
  }

  // options builder
  private assign = (option: Omit<Opt<T>, 'name' | 'description' | 'type'>) => {
    Object.assign(this.#option, option)
    return this
  }
  // @ts-expect-error
  name_localizations = (e: Opt<T>['name_localizations']) => this.assign({ name_localizations: e })
  // @ts-expect-error
  description_localizations = (e: Opt<T>['description_localizations']) => this.assign({ description_localizations: e })
  // @ts-expect-error
  required = (e: Opt<T>['required'] = true) => this.assign({ required: e })
  // @ts-expect-error
  choices = (e: Opt<T>['choices']) => this.assign({ choices: e })
  // @ts-expect-error
  channel_types = (e: Opt<T>['channel_types']) => this.assign({ channel_types: e })
  // @ts-expect-error
  min_value = (e: Opt<T>['min_value']) => this.assign({ min_value: e })
  // @ts-expect-error
  max_value = (e: Opt<T>['max_value']) => this.assign({ max_value: e })
  // @ts-expect-error
  min_length = (e: Opt<T>['min_length']) => this.assign({ min_length: e })
  // @ts-expect-error
  max_length = (e: Opt<T>['max_length']) => this.assign({ max_length: e })
  // @ts-expect-error
  autocomplete = (e: Opt<T>['autocomplete']) => this.assign({ autocomplete: e })

  // @ts-expect-error
  options = (e: CommandOption | Opt<T>['options']) => {
    const opt = e instanceof CommandOption ? e.build() : e
    // @ts-expect-error
    this.assign({ options: e })
  }

  build = () => this.#option
}
