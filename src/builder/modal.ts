import type { APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10'
import { Builder } from './utils'

export class Modal {
  #uniqueStr: string
  #data: APIModalInteractionResponseCallbackData
  /**
   * @param {string} unique_id
   * @param {string} title
   */
  constructor(unique_id: string, title: string) {
    this.#uniqueStr = `${unique_id};`
    this.#data = { title, custom_id: this.#uniqueStr, components: [] }
  }
  /**
   * export data
   * @returns {APIModalInteractionResponseCallbackData}
   */
  _build = () => this.#data
  /**
   * @param {string} e
   * @returns {this}
   */
  custom_id = (e: string) => {
    this.#data.custom_id = this.#uniqueStr + e
    return this
  }
  /**
   * @param {...(TextInput | APITextInputComponent)} e
   * @returns {this}
   */
  row = (...e: (TextInput | APITextInputComponent)[]) => {
    this.#data.components.push({
      type: 1,
      components: e.map(component => ('_build' in component ? component._build() : component)),
    })
    return this
  }
}

export class TextInput extends Builder<APITextInputComponent> {
  /**
   * [Text Input Structure](https://discord.com/developers/docs/interactions/message-components#text-input-object)
   * @param {string} custom_id
   * @param {string} label
   * @param {"Single" | "Multi"} [input_style="Single"]
   */
  constructor(custom_id: string, label: string, input_style?: 'Single' | 'Multi') {
    super({ type: 4, custom_id, label, style: input_style === 'Multi' ? 2 : 1 })
  }
  /**
   * @param {number} e
   * @returns {this}
   */
  min_length = (e: number) => this.a({ min_length: e })
  /**
   * @param {number} e
   * @returns {this}
   */
  max_length = (e: number) => this.a({ max_length: e })
  /**
   * Whether or not this text input is required or not
   * @param {boolean} [e=true]
   * @returns {this}
   */
  required = (e = true) => this.a({ required: e })
  /**
   * The pre-filled text in the text input
   * @param {string} e
   * @returns {this}
   */
  value = (e: string) => this.a({ value: e })
  /**
   * @param {string} e
   * @returns {this}
   */
  placeholder = (e: string) => this.a({ placeholder: e })
}
