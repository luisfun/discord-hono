import type {
  APIActionRowComponent,
  APIBaseSelectMenuComponent,
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithSKUId,
  APIButtonComponentWithURL,
  APIChannelSelectComponent,
  APIMentionableSelectComponent,
  APIMessageActionRowComponent,
  APIMessageComponentEmoji,
  APIRoleSelectComponent,
  APISelectMenuOption,
  APIStringSelectComponent,
  APIUserSelectComponent,
  ChannelType,
} from 'discord-api-types/v10'
import { warnNotUse } from '../utils'

type ComponentClass = Button | LinkButton | Select | UserSelect | RoleSelect | MentionableSelect | ChannelSelect

/**
 * https://discord.com/developers/docs/interactions/message-components
 */
export class Components {
  #components: APIActionRowComponent<APIMessageActionRowComponent>[] = []
  row = (...e: (ComponentClass | APIMessageActionRowComponent)[]) => {
    if (this.#components.length >= 5) console.warn('You can have up to 5 Action Rows per message')
    const components = e.map(comp => {
      if (
        comp instanceof Button ||
        comp instanceof LinkButton ||
        comp instanceof Select ||
        comp instanceof UserSelect ||
        comp instanceof RoleSelect ||
        comp instanceof MentionableSelect ||
        comp instanceof ChannelSelect
      )
        return comp.build()
      return comp
    })
    this.#components.push({ type: 1, components })
    return this
  }
  build = () => this.#components
}

export class Button<T extends 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link' | 'SKU' = 'Primary'> {
  #style: 1 | 2 | 3 | 4 | 5 | 6
  #uniqueStr = ''
  #component: APIButtonComponent
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   * @param str Basic: unique_id, Link: URL, SKU: sku_id
   * @param label Ignore: SKU
   * @param buttonStyle Default: 'Primary'
   */
  constructor(str: string, label: string, buttonStyle: T = 'Primary' as T) {
    const styleNum = {
      Primary: 1,
      Secondary: 2,
      Success: 3,
      Danger: 4,
      Link: 5,
      SKU: 6,
    } as const
    const style = styleNum[buttonStyle] || 1
    this.#style = style
    switch (style) {
      case 5:
        this.#component = { type: 2, label, style, url: str }
        break
      case 6:
        this.#component = { type: 2, style, sku_id: str }
        break
      default:
        this.#uniqueStr = `${str};`
        this.#component = { type: 2, label, style, custom_id: this.#uniqueStr }
    }
  }
  // biome-ignore format: ternary operator
  build = () => this.#component as
    T extends 'Link' ? APIButtonComponentWithURL :
    T extends 'SKU' ? APIButtonComponentWithSKUId :
    APIButtonComponentWithCustomId
  #assign = (
    component:
      | Omit<APIButtonComponentWithCustomId, 'type' | 'style'>
      | Omit<APIButtonComponentWithURL, 'type' | 'style' | 'url'>
      | Omit<APIButtonComponentWithSKUId, 'type' | 'style' | 'sku_id'>,
  ) => {
    Object.assign(this.#component, component)
    return this
  }
  /**
   * available: ALL
   * @param e Default: true
   */
  disabled = (e = true) => this.#assign({ disabled: e })
  /**
   * available: Primary, Secondary, Success, Danger, Link
   */
  emoji = (e: T extends 'SKU' ? undefined : APIMessageComponentEmoji) => {
    if (this.#style === 6) {
      warnNotUse('Button.emoji')
      return this
    }
    return this.#assign({ emoji: e })
  }
  /**
   * available: Primary, Secondary, Success, Danger
   */
  custom_id = (e: T extends 'Link' | 'SKU' ? undefined : string) => {
    if (this.#style === 5 || this.#style === 6) {
      warnNotUse('Button.custom_id')
      return this
    }
    return this.#assign({ custom_id: this.#uniqueStr + e })
  }
}
/**
 * @deprecated Integrated into Button
 */
export class LinkButton extends Button<'Link'> {
  constructor(url: string, label: string) {
    super(url, label, 'Link')
  }
}

export class Select<T extends 'String' | 'User' | 'Role' | 'Mentionable' | 'Channel' = 'String'> {
  #type: 3 | 5 | 6 | 7 | 8
  #uniqueStr: string
  #component: APIBaseSelectMenuComponent<any> & { options?: APISelectMenuOption[] }
  constructor(uniqueId: string, selectType: T = 'String' as T) {
    const typeNum = {
      String: 3,
      User: 5,
      Role: 6,
      Mentionable: 7,
      Channel: 8,
    } as const
    const type = typeNum[selectType]
    this.#type = type
    this.#uniqueStr = `${uniqueId};`
    this.#component =
      type === 3 ? { type, custom_id: this.#uniqueStr, options: [] } : { type, custom_id: this.#uniqueStr }
  }
  // biome-ignore format: ternary operator
  build = () => this.#component as
    T extends 'User' ? APIUserSelectComponent :
    T extends 'Role' ? APIRoleSelectComponent :
    T extends 'Mentionable' ? APIMentionableSelectComponent :
    T extends 'Channel' ? APIChannelSelectComponent :
    APIStringSelectComponent
  #assign = (
    component: (
      | Omit<APIStringSelectComponent, 'type' | 'custom_id'>
      | Omit<APIUserSelectComponent, 'type' | 'custom_id'>
      | Omit<APIRoleSelectComponent, 'type' | 'custom_id'>
      | Omit<APIMentionableSelectComponent, 'type' | 'custom_id'>
      | Omit<APIChannelSelectComponent, 'type' | 'custom_id'>
    ) & { custom_id?: string },
  ) => {
    Object.assign(this.#component, component)
    return this
  }
  /**
   * available: ALL
   */
  custom_id = (e: string) => this.#assign({ custom_id: this.#uniqueStr + e })
  /**
   * available: ALL
   */
  placeholder = (e: string) => this.#assign({ placeholder: e })
  /**
   * available: ALL
   */
  min_values = (e: number) => this.#assign({ min_values: e })
  /**
   * available: ALL
   */
  max_values = (e: number) => this.#assign({ max_values: e })
  /**
   * available: ALL
   * @param e Default: true
   */
  disabled = (e = true) => this.#assign({ disabled: e })
  /**
   * required and available: String
   *
   * [Select Option Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure)
   */
  options = (...e: T extends 'String' ? APISelectMenuOption[] : undefined[]) => {
    if (this.#type !== 3) {
      warnNotUse('Select.options')
      return this
    }
    // @ts-expect-error
    return this.#assign({ options: e })
  }
  /**
   * available: User, Role, Channel, Mentionable
   *
   * [Select Default Value Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-default-value-structure)
   */
  default_values = (
    ...e: T extends 'String'
      ? undefined[]
      : {
          id: string
          // biome-ignore format: ternary operator
          type:
            T extends 'User' ? 'user' :
            T extends 'Role' ? 'role' :
            T extends 'Channel' ? 'channel' :
            'user' | 'role'
        }[]
  ): this => {
    if (this.#type === 3) {
      warnNotUse('Select.default_values')
      return this
    }
    // @ts-expect-error
    return this.#assign({ default_values: e })
  }
  /**
   * available: Channel
   *
   * [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
   */
  channel_types = (...e: T extends 'Channel' ? ChannelType[] : undefined[]) => {
    if (this.#type !== 8) {
      warnNotUse('Select.channel_types')
      return this
    }
    // @ts-expect-error
    return this.#assign({ channel_types: e })
  }
}

/**
 * @deprecated Integrated into Select
 */
export class UserSelect extends Select<'User'> {
  constructor(uniqueId: string) {
    super(uniqueId, 'User')
  }
}
/**
 * @deprecated Integrated into Select
 */
export class RoleSelect extends Select<'Role'> {
  constructor(uniqueId: string) {
    super(uniqueId, 'Role')
  }
}
/**
 * @deprecated Integrated into Select
 */
export class MentionableSelect extends Select<'Mentionable'> {
  constructor(uniqueId: string) {
    super(uniqueId, 'Mentionable')
  }
}
/**
 * @deprecated Integrated into Select
 */
export class ChannelSelect extends Select<'Channel'> {
  constructor(uniqueId: string) {
    super(uniqueId, 'Channel')
  }
}
