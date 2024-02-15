import type { APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10'
import type { Env, ModalHandler } from '../types'

export class Modal<E extends Env = any> {
  #uniqueStr: string
  #data: APIModalInteractionResponseCallbackData
  #handler: ModalHandler<E> | undefined
  constructor(uniqueId: string, title: string) {
    this.#uniqueStr = uniqueId + ';'
    this.#data = { title, custom_id: this.#uniqueStr, components: [] }
  }
  custom_id = (e: APITextInputComponent['custom_id']) => {
    this.#data.custom_id = this.#uniqueStr + e
    return this
  }
  components = (...e: (ComponentTextInput | APITextInputComponent)[]) => {
    const components = e.map(comp => (comp instanceof ComponentTextInput ? comp.build() : comp))
    this.#data.components.push({ type: 1, components })
    return this
  }
  handler = (handler: ModalHandler<E>) => (this.#handler = handler)
  build = () => this.#data
  getHandler = (): [APIModalInteractionResponseCallbackData, string, ModalHandler<E>] => {
    if (!this.#handler) throw new Error('This is no handler.')
    return [this.#data, this.#uniqueStr.replace(';', ''), this.#handler]
  }
}

export class ComponentTextInput {
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
  required = (e: APITextInputComponent['required']) => this.#assign({ required: e })
  value = (e: APITextInputComponent['value']) => this.#assign({ value: e })
  placeholder = (e: APITextInputComponent['placeholder']) => this.#assign({ placeholder: e })
  build = () => this.#component
}
