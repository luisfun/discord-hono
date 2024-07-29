import type { APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10'

export class Modal {
  #uniqueStr: string
  #data: APIModalInteractionResponseCallbackData
  constructor(uniqueId: string, title: string) {
    this.#uniqueStr = `${uniqueId};`
    this.#data = { title, custom_id: this.#uniqueStr, components: [] }
  }
  build = () => this.#data
  custom_id = (e: string) => {
    this.#data.custom_id = this.#uniqueStr + e
    return this
  }
  row = (...e: (TextInput | APITextInputComponent)[]) => {
    const components = e.map(comp => (comp instanceof TextInput ? comp.build() : comp))
    this.#data.components.push({ type: 1, components })
    return this
  }
}

export class TextInput {
  #component: APITextInputComponent
  /**
   * [Text Input Structure](https://discord.com/developers/docs/interactions/message-components#text-input-object)
   * @param inputStyle default 'Single'
   */
  constructor(custom_id: string, label: string, inputStyle?: 'Single' | 'Multi') {
    this.#component = { type: 4, custom_id, label, style: inputStyle === 'Multi' ? 2 : 1 }
  }
  build = () => this.#component
  #assign = (component: Omit<APITextInputComponent, 'type' | 'custom_id' | 'label' | 'style'>) => {
    Object.assign(this.#component, component)
    return this
  }
  min_length = (e: number) => this.#assign({ min_length: e })
  max_length = (e: number) => this.#assign({ max_length: e })
  required = (e = true) => this.#assign({ required: e })
  value = (e: string) => this.#assign({ value: e })
  placeholder = (e: string) => this.#assign({ placeholder: e })
}
