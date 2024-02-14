import type {
  APIMessageComponent,
  APIModalComponent,
  APIActionRowComponent,
  APIButtonComponent,
  APISelectMenuComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIStringSelectComponent,
  APIUserSelectComponent,
  APIRoleSelectComponent,
  APIMentionableSelectComponent,
  APIChannelSelectComponent,
  APITextInputComponent,
} from 'discord-api-types/v10'

type ButtonSelectClass =
  | ComponentButton
  | ComponentButtonLink
  | ComponentSelect
  | ComponentUserSelect
  | ComponentRoleSelect
  | ComponentMentionableSelect
  | ComponentChannelSelect

type RowComponent = APIButtonComponent | APISelectMenuComponent | APITextInputComponent

export const componentsBuilder = (
  ...components: (ButtonSelectClass | ComponentRow)[]
): (APIMessageComponent | APIModalComponent)[] => components.map(e => e.build())

export class ComponentRow {
  #component: APIActionRowComponent<any> = { type: 1, components: [] }
  /**
   * [Action Rows](https://discord.com/developers/docs/interactions/message-components#action-rows)
   */
  constructor(...components: RowComponent[] | (ButtonSelectClass | ComponentTextInput)[]) {
    this.#component.components = components.map(component => {
      if (
        component instanceof ComponentButton ||
        component instanceof ComponentButtonLink ||
        component instanceof ComponentSelect ||
        component instanceof ComponentUserSelect ||
        component instanceof ComponentRoleSelect ||
        component instanceof ComponentMentionableSelect ||
        component instanceof ComponentChannelSelect ||
        component instanceof ComponentTextInput
      )
        return component.build()
      return component
    })
  }
  build = () => this.#component
}

type But<T extends 1 | 2 | 3 | 4 | 5> = T extends 5 ? APIButtonComponentWithURL : APIButtonComponentWithCustomId
type ButOmit<T> = Omit<T, 'type' | 'style' | 'url'>

class ButtonBase<T extends 1 | 2 | 3 | 4 | 5> {
  protected uniqueStr: string
  protected component: But<T>
  constructor(str: string, style: T) {
    this.uniqueStr = str + ';'
    this.component = (
      style === 5 ? { type: 2, style, url: str } : { type: 2, style, custom_id: this.uniqueStr }
    ) as But<T>
  }
  protected assign = (component: ButOmit<But<T>>) => {
    Object.assign(this.component, component)
    return this
  }
  label = (e: But<T>['label']) => this.assign({ label: e } as ButOmit<But<T>>)
  emoji = (e: But<T>['emoji']) => this.assign({ emoji: e } as ButOmit<But<T>>)
  disabled = (e: But<T>['disabled']) => this.assign({ disabled: e } as ButOmit<But<T>>)
  build = () => this.component
}

type ButtonStyle = 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link'

export class ComponentButton extends ButtonBase<1 | 2 | 3 | 4> {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   * @param buttonStyle default 'Primary'
   */
  constructor(uniqueId: string, buttonStyle: ButtonStyle = 'Primary') {
    // prettier-ignore
    const style =
      buttonStyle === 'Primary' ? 1 :
      buttonStyle === 'Secondary' ? 2 :
      buttonStyle === 'Success' ? 3 :
      buttonStyle === 'Danger' ? 4 :
      1
    super(uniqueId, style)
  }
  custom_id = (e: APIButtonComponentWithCustomId['custom_id']) => this.assign({ custom_id: this.uniqueStr + e })
}
export class ComponentButtonLink extends ButtonBase<5> {
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
   */
  constructor(url: string) {
    super(url, 5)
  }
}

// prettier-ignore
type Sel<T extends 3 | 5 | 6 | 7 | 8> =
  T extends 3 ? APIStringSelectComponent :
  T extends 5 ? APIUserSelectComponent :
  T extends 6 ? APIRoleSelectComponent :
  T extends 7 ? APIMentionableSelectComponent :
  T extends 8 ? APIChannelSelectComponent :
  APIStringSelectComponent

type SelOmit<T> = Omit<T, 'type' | 'custom_id'>

class SelectBase<T extends 3 | 5 | 6 | 7 | 8> {
  protected uniqueStr: string
  protected component: APISelectMenuComponent
  constructor(uniqueId: string, type: 3 | 5 | 6 | 7 | 8) {
    this.uniqueStr = uniqueId + ';'
    this.component = type === 3 ? { type, custom_id: this.uniqueStr, options: [] } : { type, custom_id: this.uniqueStr }
  }
  protected assign = (component: SelOmit<Sel<T>> | { custom_id?: string }) => {
    Object.assign(this.component, component)
    return this
  }
  custom_id = (e: Sel<T>['custom_id']) => this.assign({ custom_id: this.uniqueStr + e })
  placeholder = (e: Sel<T>['placeholder']) => this.assign({ placeholder: e } as SelOmit<Sel<T>>)
  min_values = (e: Sel<T>['min_values']) => this.assign({ min_values: e } as SelOmit<Sel<T>>)
  max_values = (e: Sel<T>['max_values']) => this.assign({ max_values: e } as SelOmit<Sel<T>>)
  disabled = (e: Sel<T>['disabled']) => this.assign({ disabled: e } as SelOmit<Sel<T>>)
  build = () => this.component
}

export class ComponentSelect extends SelectBase<3> {
  /**
   * [Select Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-menu-structure)
   * .options() require
   */
  constructor(uniqueId: string) {
    super(uniqueId, 3)
  }
  options = (e: Sel<3>['options']) => this.assign({ options: e })
}
export class ComponentUserSelect extends SelectBase<5> {
  constructor(uniqueId: string) {
    super(uniqueId, 5)
  }
  default_values = (e: Sel<5>['default_values']) => this.assign({ default_values: e })
}
export class ComponentRoleSelect extends SelectBase<6> {
  constructor(uniqueId: string) {
    super(uniqueId, 6)
  }
  default_values = (e: Sel<6>['default_values']) => this.assign({ default_values: e })
}
export class ComponentMentionableSelect extends SelectBase<7> {
  constructor(uniqueId: string) {
    super(uniqueId, 7)
  }
  default_values = (e: Sel<7>['default_values']) => this.assign({ default_values: e })
}
export class ComponentChannelSelect extends SelectBase<8> {
  constructor(uniqueId: string) {
    super(uniqueId, 8)
  }
  channel_types = (e: Sel<8>['channel_types']) => this.assign({ channel_types: e })
  default_values = (e: Sel<8>['default_values']) => this.assign({ default_values: e })
}

type inputStyle = 'Single' | 'Multi'

export class ComponentTextInput {
  #uniqueStr: string
  #component: APITextInputComponent
  /**
   * [Text Input Structure](https://discord.com/developers/docs/interactions/message-components#text-input-object-text-input-structure)
   * @param inputStyle default 'Single'
   */
  constructor(uniqueId: string, label: string, inputStyle: inputStyle = 'Single') {
    this.#uniqueStr = uniqueId + ';'
    this.#component = { type: 4, custom_id: this.#uniqueStr, label, style: inputStyle === 'Single' ? 1 : 2 }
  }
  #assign = (component: Omit<APITextInputComponent, 'type' | 'custom_id' | 'label' | 'style'>) => {
    Object.assign(this.#component, component)
    return this
  }
  // https://discord.com/developers/docs/interactions/message-components#text-input-object
  min_length = (e: APITextInputComponent['min_length']) => this.#assign({ min_length: e })
  max_length = (e: APITextInputComponent['max_length']) => this.#assign({ max_length: e })
  required = (e: APITextInputComponent['required']) => this.#assign({ required: e })
  value = (e: APITextInputComponent['value']) => this.#assign({ value: e })
  placeholder = (e: APITextInputComponent['placeholder']) => this.#assign({ placeholder: e })
  build = () => this.#component
}
