import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIChannelSelectComponent,
  APIMentionableSelectComponent,
  APIMessageActionRowComponent,
  APIRoleSelectComponent,
  APISelectMenuComponent,
  APIStringSelectComponent,
  APIUserSelectComponent,
} from 'discord-api-types/v10'

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

type OmitButton =
  | Omit<APIButtonComponentWithCustomId, 'type' | 'style'>
  | Omit<APIButtonComponentWithURL, 'type' | 'style' | 'url'>
class ButtonBase {
  protected uniqueStr: string
  protected component: APIButtonComponent
  // ***************************** label or emoji でいけるのか検証したい
  constructor(str: string, label: string, style: 1 | 2 | 3 | 4 | 5) {
    this.uniqueStr = `${str};`
    this.component =
      style === 5 ? { type: 2, label, style, url: str } : { type: 2, label, style, custom_id: this.uniqueStr }
  }
  protected a = (component: OmitButton) => {
    Object.assign(this.component, component)
    return this
  }
  disabled = (e: APIButtonComponent['disabled']) => this.a({ disabled: e })
  build = () => this.component
}

type ButtonStyle = 'Primary' | 'Secondary' | 'Success' | 'Danger'

export class Button extends ButtonBase {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   * @param buttonStyle default: 'Primary'
   */
  constructor(uniqueId: string, label: string, buttonStyle: ButtonStyle = 'Primary') {
    // biome-ignore format: ternary operator
    const style =
      buttonStyle === 'Primary' ? 1 :
      buttonStyle === 'Secondary' ? 2 :
      buttonStyle === 'Success' ? 3 :
      buttonStyle === 'Danger' ? 4 :
      1
    super(uniqueId, label, style)
  }
  emoji = (e: APIButtonComponentWithCustomId['emoji']) => this.a({ emoji: e })
  custom_id = //(handler: (c: ComponentContext<E>) => Promise<string> | string) => this.a({ custom_id: this.uniqueStr + (await handler()) })
    (e: APIButtonComponentWithCustomId['custom_id']) => this.a({ custom_id: this.uniqueStr + e })
}
export class LinkButton extends ButtonBase {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   */
  constructor(url: string, label: string) {
    super(url, label, 5)
  }
  emoji = (e: APIButtonComponentWithURL['emoji']) => this.a({ emoji: e })
}

type OmitSelect =
  | Omit<APIStringSelectComponent, 'type' | 'custom_id'>
  | Omit<APIUserSelectComponent, 'type' | 'custom_id'>
  | Omit<APIRoleSelectComponent, 'type' | 'custom_id'>
  | Omit<APIMentionableSelectComponent, 'type' | 'custom_id'>
  | Omit<APIChannelSelectComponent, 'type' | 'custom_id'>
class SelectBase {
  protected uniqueStr: string
  protected component: APISelectMenuComponent
  constructor(uniqueId: string, type: 3 | 5 | 6 | 7 | 8) {
    this.uniqueStr = `${uniqueId};`
    this.component = type === 3 ? { type, custom_id: this.uniqueStr, options: [] } : { type, custom_id: this.uniqueStr }
  }
  protected a = (component: OmitSelect | { custom_id?: string }) => {
    Object.assign(this.component, component)
    return this
  }
  custom_id = (e: APISelectMenuComponent['custom_id']) => this.a({ custom_id: this.uniqueStr + e })
  placeholder = (e: APISelectMenuComponent['placeholder']) => this.a({ placeholder: e })
  min_values = (e: APISelectMenuComponent['min_values']) => this.a({ min_values: e })
  max_values = (e: APISelectMenuComponent['max_values']) => this.a({ max_values: e })
  disabled = (e: APISelectMenuComponent['disabled']) => this.a({ disabled: e })
  build = () => this.component
}

export class Select extends SelectBase {
  /**
   * [Select Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-menu-structure)
   * .options() require
   */
  constructor(uniqueId: string) {
    super(uniqueId, 3)
  }
  options = (e: APIStringSelectComponent['options']) => this.a({ options: e })
}
export class UserSelect extends SelectBase {
  constructor(uniqueId: string) {
    super(uniqueId, 5)
  }
  default_values = (e: APIUserSelectComponent['default_values']) => this.a({ default_values: e })
}
export class RoleSelect extends SelectBase {
  constructor(uniqueId: string) {
    super(uniqueId, 6)
  }
  default_values = (e: APIRoleSelectComponent['default_values']) => this.a({ default_values: e })
}
export class MentionableSelect extends SelectBase {
  constructor(uniqueId: string) {
    super(uniqueId, 7)
  }
  default_values = (e: APIMentionableSelectComponent['default_values']) => this.a({ default_values: e })
}
export class ChannelSelect extends SelectBase {
  constructor(uniqueId: string) {
    super(uniqueId, 8)
  }
  channel_types = (e: APIChannelSelectComponent['channel_types']) => this.a({ channel_types: e })
  default_values = (e: APIChannelSelectComponent['default_values']) => this.a({ default_values: e })
}
