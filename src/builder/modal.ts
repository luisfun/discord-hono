import type { APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10'

export class Modal {
  #uniqueStr: string
  #data: APIModalInteractionResponseCallbackData
  constructor(uniqueId: string, title: string) {
    this.#uniqueStr = uniqueId + ';'
    this.#data = { title, custom_id: this.#uniqueStr, components: [] }
  }
  custom_id = (e: APITextInputComponent['custom_id']) => {
    this.#data.custom_id = this.#uniqueStr + e
    return this
  }
  row = (...e: (TextInput | APITextInputComponent)[]) => {
    const components = e.map(comp => (comp instanceof TextInput ? comp.build() : comp))
    this.#data.components.push({ type: 1, components })
    return this
  }
  build = () => this.#data
}

export class TextInput {
  #uniqueStr: string
  #component: APITextInputComponent
  /**
   * [Text Input Structure](https://discord.com/developers/docs/interactions/message-components#text-input-object-text-input-structure)
   * @param inputStyle default 'Single'
   */
  constructor(uniqueId: string, label: string, inputStyle?: 'Single' | 'Multi') {
    this.#uniqueStr = uniqueId + ';'
    this.#component = { type: 4, custom_id: this.#uniqueStr, label, style: inputStyle === 'Multi' ? 2 : 1 }
  }
  #assign = (component: Omit<APITextInputComponent, 'type' | 'custom_id' | 'label' | 'style'>) => {
    Object.assign(this.#component, component)
    return this
  }
  // https://discord.com/developers/docs/interactions/message-components#text-input-object
  min_length = (e: APITextInputComponent['min_length']) => this.#assign({ min_length: e })
  max_length = (e: APITextInputComponent['max_length']) => this.#assign({ max_length: e })
  required = (e: APITextInputComponent['required'] = true) => this.#assign({ required: e })
  value = (e: APITextInputComponent['value']) => this.#assign({ value: e })
  placeholder = (e: APITextInputComponent['placeholder']) => this.#assign({ placeholder: e })
  build = () => this.#component
}
