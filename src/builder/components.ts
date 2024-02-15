import type {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  APIButtonComponent,
  APISelectMenuComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIStringSelectComponent,
  APIUserSelectComponent,
  APIRoleSelectComponent,
  APIMentionableSelectComponent,
  APIChannelSelectComponent,
} from 'discord-api-types/v10'
import type { Env, ComponentHandler } from '../types'

type ComponentClass =
  | ComponentButton
  | ComponentButtonLink
  | ComponentSelect
  | ComponentUserSelect
  | ComponentRoleSelect
  | ComponentMentionableSelect
  | ComponentChannelSelect

export class Components<E extends Env = any> {
  #components: APIActionRowComponent<APIMessageActionRowComponent>[] = []
  #handlers: [APIMessageActionRowComponent, string, ComponentHandler<E>][] = []
  components = (
    ...e: (
      | ComponentClass
      | APIMessageActionRowComponent
      | [APIMessageActionRowComponent, string, ComponentHandler<E>]
    )[]
  ) => {
    if (this.#components.length >= 5) console.warn('You can have up to 5 Action Rows per message')
    const components = e.map(comp => {
      if (Array.isArray(comp)) {
        this.#handlers.push(comp)
        return comp[0]
      }
      if (
        comp instanceof ComponentButton ||
        comp instanceof ComponentButtonLink ||
        comp instanceof ComponentSelect ||
        comp instanceof ComponentUserSelect ||
        comp instanceof ComponentRoleSelect ||
        comp instanceof ComponentMentionableSelect ||
        comp instanceof ComponentChannelSelect
      )
        return comp.build()
      return comp
    })
    this.#components.push({ type: 1, components })
    return this
  }
  build = () => this.#components
  handlers = () => this.#handlers
}

type OmitButton =
  | Omit<APIButtonComponentWithCustomId, 'type' | 'style'>
  | Omit<APIButtonComponentWithURL, 'type' | 'style' | 'url'>
class ButtonBase<E extends Env> {
  protected uniqueStr: string
  protected component: APIButtonComponent
  // ***************************** label or emoji でいけるのか検証したい
  constructor(str: string, label: string, style: 1 | 2 | 3 | 4 | 5) {
    this.uniqueStr = str + ';'
    this.component =
      style === 5 ? { type: 2, label, style, url: str } : { type: 2, label, style, custom_id: this.uniqueStr }
  }
  protected assign = (component: OmitButton) => {
    Object.assign(this.component, component)
    return this
  }
  emoji = (e: APIButtonComponent['emoji']) => this.assign({ emoji: e })
  disabled = (e: APIButtonComponent['disabled']) => this.assign({ disabled: e })
  build = () => this.component
  handler = (handler: ComponentHandler<E>) => [this.component, this.uniqueStr.replace(';', ''), handler]
}

type ButtonStyle = 'Primary' | 'Secondary' | 'Success' | 'Danger'

export class ComponentButton<E extends Env = any> extends ButtonBase<E> {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   * @param buttonStyle default 'Primary'
   */
  constructor(uniqueId: string, label: string, buttonStyle: ButtonStyle = 'Primary') {
    // prettier-ignore
    const style =
      buttonStyle === 'Primary' ? 1 :
      buttonStyle === 'Secondary' ? 2 :
      buttonStyle === 'Success' ? 3 :
      buttonStyle === 'Danger' ? 4 :
      1
    super(uniqueId, label, style)
  }
  custom_id = (e: APIButtonComponentWithCustomId['custom_id']) => this.assign({ custom_id: this.uniqueStr + e })
}
export class ComponentButtonLink<E extends Env = any> extends ButtonBase<E> {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   */
  constructor(url: string, label: string) {
    super(url, label, 5)
  }
}

type OmitSelect =
  | Omit<APIStringSelectComponent, 'type' | 'custom_id'>
  | Omit<APIUserSelectComponent, 'type' | 'custom_id'>
  | Omit<APIRoleSelectComponent, 'type' | 'custom_id'>
  | Omit<APIMentionableSelectComponent, 'type' | 'custom_id'>
  | Omit<APIChannelSelectComponent, 'type' | 'custom_id'>
class SelectBase<E extends Env> {
  protected uniqueStr: string
  protected component: APISelectMenuComponent
  constructor(uniqueId: string, type: 3 | 5 | 6 | 7 | 8) {
    this.uniqueStr = uniqueId + ';'
    this.component = type === 3 ? { type, custom_id: this.uniqueStr, options: [] } : { type, custom_id: this.uniqueStr }
  }
  protected assign = (component: OmitSelect | { custom_id?: string }) => {
    Object.assign(this.component, component)
    return this
  }
  custom_id = (e: APISelectMenuComponent['custom_id']) => this.assign({ custom_id: this.uniqueStr + e })
  placeholder = (e: APISelectMenuComponent['placeholder']) => this.assign({ placeholder: e })
  min_values = (e: APISelectMenuComponent['min_values']) => this.assign({ min_values: e })
  max_values = (e: APISelectMenuComponent['max_values']) => this.assign({ max_values: e })
  disabled = (e: APISelectMenuComponent['disabled']) => this.assign({ disabled: e })
  build = () => this.component
  handler = (handler: ComponentHandler<E>) => [this.component, this.uniqueStr.replace(';', ''), handler]
}

export class ComponentSelect<E extends Env = any> extends SelectBase<E> {
  /**
   * [Select Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-menu-structure)
   * .options() require
   */
  constructor(uniqueId: string) {
    super(uniqueId, 3)
  }
  options = (e: APIStringSelectComponent['options']) => this.assign({ options: e })
}
export class ComponentUserSelect<E extends Env = any> extends SelectBase<E> {
  constructor(uniqueId: string) {
    super(uniqueId, 5)
  }
  default_values = (e: APIUserSelectComponent['default_values']) => this.assign({ default_values: e })
}
export class ComponentRoleSelect<E extends Env = any> extends SelectBase<E> {
  constructor(uniqueId: string) {
    super(uniqueId, 6)
  }
  default_values = (e: APIRoleSelectComponent['default_values']) => this.assign({ default_values: e })
}
export class ComponentMentionableSelect<E extends Env = any> extends SelectBase<E> {
  constructor(uniqueId: string) {
    super(uniqueId, 7)
  }
  default_values = (e: APIMentionableSelectComponent['default_values']) => this.assign({ default_values: e })
}
export class ComponentChannelSelect<E extends Env = any> extends SelectBase<E> {
  constructor(uniqueId: string) {
    super(uniqueId, 8)
  }
  channel_types = (e: APIChannelSelectComponent['channel_types']) => this.assign({ channel_types: e })
  default_values = (e: APIChannelSelectComponent['default_values']) => this.assign({ default_values: e })
}
