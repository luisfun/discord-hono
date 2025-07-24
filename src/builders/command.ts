import type {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandSubcommandGroupOption, // 2
  APIApplicationCommandSubcommandOption, // 1
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChannelType,
  EntryPointCommandHandlerType,
  InteractionContextType,
  Locale,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10'
import { toJSON } from '../utils'
import { Builder, warnBuilder } from './utils'

type ExtractOptionArgs<T> = T extends Option<infer K, infer T2, infer R>
  ? {
      [P in K]: T2 extends 'String'
        ? string
        : T2 extends 'Integer' | 'Number'
          ? number
          : T2 extends 'Boolean'
            ? boolean
            : string // 暫定的 contextの改変を合わせて
    } extends infer O
    ? R extends true
      ? O
      : Partial<O>
    : never
  : never

type MergeObjects<T extends object[]> = T extends [infer F, ...infer R] ? F & MergeObjects<Extract<R, object[]>> : {}

type ExtractOptionsObject<T extends any[]> = MergeObjects<{
  [I in keyof T]: T[I] extends Option<any, any>
    ? ExtractOptionArgs<T[I]>
    : T[I] extends SubCommand<infer V>
      ? V
      : T[I] extends SubGroup<infer V>
        ? V
        : never
}>

abstract class CommandBase<
  Obj extends RESTPostAPIApplicationCommandsJSONBody | APIApplicationCommandOption,
> extends Builder<Obj> {
  /**
   * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
   * @param {string} name 1-32 character name; `CHAT_INPUT` command names must be all lowercase matching `^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`
   * @param {string} description 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands
   */
  constructor(name: string, description = '') {
    super({ name, description } as Obj)
  }
  /**
   * [Locale](https://discord.com/developers/docs/reference#locales)
   *
   * Localization dictionary for the name field. Values follow the same restrictions as name
   * @param {Partial<Record<Locale, string>>} e
   * @returns {this}
   */
  name_localizations = (e: Partial<Record<Locale, string>>) => this.a({ name_localizations: e } as Obj)
  /**
   * [Locale](https://discord.com/developers/docs/reference#locales)
   *
   * Localization dictionary for the description field. Values follow the same restrictions as description
   * @param {Partial<Record<Locale, string>>} e
   * @returns {this}
   */
  description_localizations = (e: Partial<Record<Locale, string>>) => this.a({ description_localizations: e } as Obj)
}

export class Command<_V extends {} = {}> extends CommandBase<RESTPostAPIApplicationCommandsJSONBody> {
  /**
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error ??? why
  id = (e: string) => this.a({ id: e })
  /**
   * [Application Command Types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types)
   * @param {ApplicationCommandType} e
   * @returns {this}
   */
  type = (e: ApplicationCommandType) => this.a({ type: e })
  /**
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error ??? why
  application_id = (e: string) => this.a({ application_id: e })
  /**
   * Guild id of the command, if not global
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error ??? why
  guild_id = (e: string) => this.a({ guild_id: e })
  /**
   * Valid Types: 1:CHAT_INPUT
   * @param {...(Option | APIApplicationCommandOption)} e
   * @returns {this}
   */
  options = <O extends (Option<any, any> | SubGroup | SubCommand | APIApplicationCommandOption)[]>(
    ...e: O
  ): Command<ExtractOptionsObject<O>> => this.a({ options: e.map(toJSON) })
  /**
   * @param {string | null} e
   * @returns {this}
   */
  default_member_permissions = (e: string | null) => this.a({ default_member_permissions: e })
  /**
   * @deprecated Use `contexts` instead
   * @param {boolean} [e=true]
   * @returns {this}
   */
  dm_permission = (e = true) => this.a({ dm_permission: e })
  /**
   * Whether the command is enabled by default when the app is added to a guild
   *
   * If missing, this property should be assumed as `true`
   * @deprecated Use `default_member_permissions` instead
   * @param {boolean} [e=true]
   * @returns {this}
   */
  default_permission = (e = true) => this.a({ default_permission: e })
  /**
   * Indicates whether the command is age-restricted
   * @param {boolean} [e=true]
   * @returns {this}
   */
  nsfw = (e = true) => this.a({ nsfw: e })
  /**
   * [Application Integration Types](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
   *
   * Installation context(s) where the command is available, only for globally-scoped commands.
   * @unstable
   * @param {...ApplicationIntegrationType} e
   * @returns {this}
   */
  integration_types = (...e: ApplicationIntegrationType[]) => this.a({ integration_types: e })
  /**
   * [Interaction Context Types](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
   *
   * Interaction context(s) where the command can be used, only for globally-scoped commands.
   * @unstable
   * @param {...InteractionContextType} e
   * @returns {this}
   */
  contexts = (...e: InteractionContextType[]) => this.a({ contexts: e })
  /**
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error ??? why
  version = (e: string) => this.a({ version: e })
  /**
   * Valid Types: 4:PRIMARY_ENTRY_POINT
   *
   * [Hander Types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-entry-point-command-handler-types)
   * @param e
   * @returns
   */
  handler = (e: EntryPointCommandHandlerType) => this.a({ handler: e })
}

export class SubGroup<_V extends {} = {}> extends CommandBase<APIApplicationCommandSubcommandGroupOption> {
  /**
   * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
   * @param {string} name 1-32 character name
   * @param {string} description 1-100 character description
   */
  constructor(name: string, description = '') {
    super(name, description)
    this.a({ type: 2 })
  }
  /**
   * @param {...(SubCommand | APIApplicationCommandSubcommandOption)} e
   * @returns {this}
   */
  options = <O extends (SubCommand | APIApplicationCommandSubcommandOption)[]>(
    ...e: O
  ): SubGroup<ExtractOptionsObject<O>> => this.a({ options: e.map(toJSON) })
}

export class SubCommand<_V extends {} = {}> extends CommandBase<APIApplicationCommandSubcommandOption> {
  /**
   * [Command Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
   * @param {string} name 1-32 character name
   * @param {string} description 1-100 character description
   */
  constructor(name: string, description = '') {
    super(name, description)
    this.a({ type: 1 })
  }
  /**
   * @param {...(Option | APIApplicationCommandBasicOption)} e
   * @returns {this}
   */
  options = <O extends (Option<any, any> | APIApplicationCommandBasicOption)[]>(
    ...e: O
  ): SubCommand<ExtractOptionsObject<O>> => this.a({ options: e.map(toJSON) })
}

type OptionType =
  | 'String'
  | 'Integer'
  | 'Number'
  | 'Boolean'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Mentionable'
  | 'Attachment'
export class Option<
  K extends string,
  T extends OptionType = 'String',
  _R extends boolean = false,
> extends CommandBase<APIApplicationCommandBasicOption> {
  #type: OptionType
  #assign = (method: string, doType: OptionType[], obj: Partial<APIApplicationCommandBasicOption>) => {
    if (!doType.includes(this.#type)) {
      warnBuilder('Option', this.#type, method)
      return this
    }
    return this.a(obj)
  }
  /**
   * [Command Option Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
   * @param {string} name 1-32 character name
   * @param {string} description 1-100 character description
   * @param {"String" | "Integer" | "Number" | "Boolean" | "User" | "Channel" | "Role" | "Mentionable" | "Attachment"} [option_type="String"]
   */
  constructor(name: K, description: string, option_type: T = 'String' as T) {
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
    super(name, description)
    this.a({ type: typeNum[option_type] || 3 })
    this.#type = option_type
  }
  /**
   * @param {boolean} [e=true]
   * @returns {this}
   */
  required = <R extends boolean = true>(e: R = true as R): Option<K, T, R> => this.a({ required: e })
  /**
   * available: String, Integer, Number
   * @param {...APIApplicationCommandOptionChoice<string | number>} e
   * @returns {this}
   */
  choices = (
    // biome-ignore format: ternary operator
    ...e:
      T extends 'String' ? APIApplicationCommandOptionChoice<string>[] :
      T extends 'Integer' | 'Number' ? APIApplicationCommandOptionChoice<number>[] :
      undefined[]
  ) =>
    this.#assign('choices', ['String', 'Integer', 'Number'], { choices: e as APIApplicationCommandOptionChoice<any>[] })
  /**
   * available: Channel
   *
   * [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
   * @param {...ChannelType} e
   * @returns {this}
   */
  channel_types = (...e: T extends 'Channel' ? ChannelType[] : undefined[]) =>
    // @ts-expect-error
    this.#assign('channel_types', ['Channel'], { channel_types: e as ChannelType[] })
  /**
   * available: Integer, Number
   * @param e
   * @returns {this}
   */
  min_value = (e: T extends 'Integer' | 'Number' ? number : undefined) =>
    this.#assign('min_value', ['Integer', 'Number'], { min_value: e })
  /**
   * available: Integer, Number
   * @param e
   * @returns {this}
   */
  max_value = (e: T extends 'Integer' | 'Number' ? number : undefined) =>
    this.#assign('max_value', ['Integer', 'Number'], { max_value: e })
  /**
   * available: String
   * @param e 0 - 6000
   * @returns {this}
   */
  min_length = (e: T extends 'String' ? number : undefined) => this.#assign('min_length', ['String'], { min_length: e })
  /**
   * available: String
   * @param e 1 - 6000
   * @returns {this}
   */
  max_length = (e: T extends 'String' ? number : undefined) => this.#assign('max_length', ['String'], { max_length: e })
  /**
   * available: String, Integer, Number
   * @param e default: true
   * @returns {this}
   */
  autocomplete = (e?: T extends 'String' | 'Integer' | 'Number' ? boolean : undefined) =>
    this.#assign('autocomplete', ['String', 'Integer', 'Number'], { autocomplete: e !== false })
}
