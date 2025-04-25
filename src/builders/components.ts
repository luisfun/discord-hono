import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIChannelSelectComponent,
  APIComponentInMessageActionRow,
  APIMentionableSelectComponent,
  APIMessageComponentEmoji,
  APIRoleSelectComponent,
  APISelectMenuOption,
  APIStringSelectComponent,
  APIUserSelectComponent,
  ChannelType,
} from 'discord-api-types/v10'
import { CUSTOM_ID_SEPARATOR, toJSON } from '../utils'
import { Builder, ifThrowHasSemicolon, warnBuilder } from './utils'

/**
 * [Message Components](https://discord.com/developers/docs/interactions/message-components)
 */
export class Components {
  #components: APIActionRowComponent<APIComponentInMessageActionRow>[] = []
  /**
   * push component
   * @param {...(Button | Select | APIComponentInMessageActionRow)} e
   * @returns {this}
   */
  row = (...e: (Button<any> | Select<any> | APIComponentInMessageActionRow)[]) => {
    // biome-ignore lint: console
    if (this.#components.length >= 5) console.warn('You can have up to 5 Action Rows per message')
    this.#components.push({
      type: 1,
      components: e.map(toJSON),
    })
    return this
  }
  /**
   * export json object
   * @returns {Obj}
   */
  toJSON = () => this.#components
}

type ButtonStyle = 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link' | 'SKU'
export class Button<T extends ButtonStyle = 'Primary'> extends Builder<APIButtonComponent> {
  #style: ButtonStyle
  #uniqueStr = ''
  #assign = (method: string, doNotStyle: ButtonStyle[], obj: Partial<APIButtonComponent>) => {
    if (doNotStyle.includes(this.#style)) {
      warnBuilder('Button', this.#style, method)
      return this
    }
    return this.a(obj)
  }
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object)
   * @param {string} str Basic: unique_id, Link: URL, SKU: sku_id
   * @param {string} label The label to be displayed on the button. max 80 characters - Ignore: SKU
   * @param {"Primary" | "Secondary" | "Success" | "Danger" | "Link" | "SKU"} [button_style="Primary"]
   */
  constructor(
    str: string,
    labels: T extends 'SKU' ? '' | undefined : string | [string | APIMessageComponentEmoji, string],
    button_style: T = 'Primary' as T,
  ) {
    const styleNum = {
      Primary: 1,
      Secondary: 2,
      Success: 3,
      Danger: 4,
      Link: 5,
      SKU: 6,
    } as const
    const style = styleNum[button_style] || 1
    const custom_id = str + CUSTOM_ID_SEPARATOR
    const isArrayLabels = Array.isArray(labels)
    const label: string | undefined = isArrayLabels ? labels[1] : labels
    let obj: APIButtonComponent
    switch (style) {
      case 5:
        obj = { type: 2, label, style, url: str }
        break
      case 6:
        obj = { type: 2, style, sku_id: str }
        break
      default:
        ifThrowHasSemicolon(str)
        obj = { type: 2, label, style, custom_id }
    }
    super(obj)
    this.#style = button_style
    this.#uniqueStr = custom_id
    if (isArrayLabels) this.emoji(labels[0] as T extends 'SKU' ? undefined : string | APIMessageComponentEmoji)
  }
  /**
   * available: Primary, Secondary, Success, Danger, Link
   * @param {string | APIMessageComponentEmoji} e
   * @returns {this}
   */
  emoji = (e: T extends 'SKU' ? undefined : string | APIMessageComponentEmoji) =>
    this.#assign('emoji', ['SKU'], { emoji: typeof e === 'string' ? { name: e } : e })
  /**
   * available: Primary, Secondary, Success, Danger
   * @param {string} e
   * @returns {this}
   */
  custom_id = (e: T extends 'Link' | 'SKU' ? undefined : string) =>
    this.#assign('custom_id', ['Link', 'SKU'], { custom_id: this.#uniqueStr + e })
  /**
   * available: ALL
   * @param {boolean} [e=true]
   * @returns {this}
   */
  disabled = (e = true) => this.a({ disabled: e })
  /**
   * Overwrite label
   *
   * available: Primary, Secondary, Success, Danger, Link
   * @param {string} e
   * @returns {this}
   */
  label = (e: T extends 'SKU' ? undefined : string) => this.#assign('emoji', ['SKU'], { label: e })
}

type SelectType = 'String' | 'User' | 'Role' | 'Mentionable' | 'Channel'
type SelectComponent =
  | APIStringSelectComponent
  | APIUserSelectComponent
  | APIRoleSelectComponent
  | APIMentionableSelectComponent
  | APIChannelSelectComponent
export class Select<T extends SelectType = 'String'> extends Builder<SelectComponent> {
  #type: SelectType
  #uniqueStr = ''
  #assign = (method: string, doType: SelectType[], obj: Partial<SelectComponent>) => {
    if (!doType.includes(this.#type)) {
      warnBuilder('Select', this.#type, method)
      return this
    }
    return this.a(obj)
  }
  /**
   * [Select Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object)
   * @param {string} unique_id
   * @param {"String" | "User" | "Role" | "Mentionable" | "Channel"} [selectType="String"]
   */
  constructor(unique_id: string, select_type: T = 'String' as T) {
    ifThrowHasSemicolon(unique_id)
    const typeNum = {
      String: 3,
      User: 5,
      Role: 6,
      Mentionable: 7,
      Channel: 8,
    } as const
    const type = typeNum[select_type] || 3
    const custom_id = unique_id + CUSTOM_ID_SEPARATOR
    super({ type, custom_id } as SelectComponent)
    this.#type = select_type
    this.#uniqueStr = custom_id
  }
  /**
   * available: ALL
   * @param {string} e
   * @returns {this}
   */
  custom_id = (e: string) => this.a({ custom_id: this.#uniqueStr + e })
  /**
   * required and available: String
   *
   * [Select Option Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure)
   * @param {...APISelectMenuOption} e
   * @returns {this}
   */
  options = (...e: T extends 'String' ? APISelectMenuOption[] : undefined[]) =>
    this.#assign('options', ['String'], { options: e as APISelectMenuOption[] })
  /**
   * available: Channel
   *
   * [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
   * @param {...ChannelType} e
   * @returns {this}
   */
  channel_types = (...e: T extends 'Channel' ? ChannelType[] : undefined[]) =>
    this.#assign('channel_types', ['Channel'], { channel_types: e as ChannelType[] })
  /**
   * Custom placeholder text if nothing is selected, max 150 characters
   * @param {string} e
   * @returns {this}
   */
  placeholder = (e: string) => this.a({ placeholder: e })
  /**
   * available: User, Role, Channel, Mentionable
   *
   * [Select Default Value Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-default-value-structure)
   * @param {...{ id: string, type: "user" | "role" | "channel" }} e
   * @returns {this}
   */
  default_values = (
    // biome-ignore format: ternary operator
    ...e: T extends 'String' ? undefined[] :
      {
        id: string
        type:
          T extends 'User' ? 'user' :
          T extends 'Role' ? 'role' :
          T extends 'Channel' ? 'channel' :
          'user' | 'role'
      }[]
    // @ts-expect-error
  ) => this.#assign('default_values', ['User', 'Role', 'Channel', 'Mentionable'], { default_values: e })
  /**
   * The minimum number of items that must be chosen; min 0, max 25
   * @param {number} [e=1]
   * @returns {this}
   */
  min_values = (e = 1) => this.a({ min_values: e })
  /**
   * The maximum number of items that can be chosen; max 25
   * @param {number} [e=1]
   * @returns {this}
   */
  max_values = (e = 1) => this.a({ max_values: e })
  /**
   * Disable the select
   * @param {boolean} [e=true]
   * @returns {this}
   */
  disabled = (e = true) => this.a({ disabled: e })
}
