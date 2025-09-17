import type { APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10'
import { CUSTOM_ID_SEPARATOR, toJSON } from '../utils'
import { Builder, ifThrowHasSemicolon, type MergeObjects } from './utils'

type ExtractTextInputArgs<T> = T extends TextInput<infer K, infer R>
  ? { [P in K]: string } extends infer O
    ? R extends true
      ? O
      : Partial<O>
    : never
  : never

type ExtractTextInputsObject<T extends any[]> = MergeObjects<{
  [I in keyof T]: T[I] extends TextInput<any, any> ? ExtractTextInputArgs<T[I]> : never
}>

export class Modal<_V extends {} = {}> {
  #uniqueStr: string
  #data: APIModalInteractionResponseCallbackData
  /**
   * @param {string} unique_id
   * @param {string} title
   */
  constructor(unique_id: string, title: string) {
    ifThrowHasSemicolon(unique_id)
    this.#uniqueStr = unique_id + CUSTOM_ID_SEPARATOR
    this.#data = { title, custom_id: this.#uniqueStr, components: [] }
  }
  /**
   * export json data
   * @returns {APIModalInteractionResponseCallbackData}
   */
  toJSON() {
    return this.#data
  }
  /**
   * @param {string} e
   * @returns {this}
   */
  custom_id(e: string) {
    this.#data.custom_id = this.#uniqueStr + e
    return this
  }
  /**
   * @param {...(TextInput | APITextInputComponent)} e
   * @returns {this}
   */
  row<O extends (TextInput<any, any> | APITextInputComponent)[]>(...e: O): Modal<ExtractTextInputsObject<O>> {
    this.#data.components.push({
      type: 1,
      components: e.map(toJSON),
    })
    return this
  }
  /**
   * Overwrite title
   * @param {string} e
   * @returns {this}
   */
  title(e: string) {
    this.#data.title = e
    return this
  }
}

export class TextInput<K extends string, _R extends boolean = false> extends Builder<APITextInputComponent> {
  /**
   * [Text Input Structure](https://discord.com/developers/docs/interactions/message-components#text-input-object)
   * @param {string} custom_id
   * @param {string} label
   * @param {"Single" | "Multi"} [input_style="Single"]
   */
  constructor(custom_id: K, label: string, input_style?: 'Single' | 'Multi') {
    super({ type: 4, custom_id, label, style: input_style === 'Multi' ? 2 : 1 })
  }
  /**
   * @param {number} e
   * @returns {this}
   */
  min_length(e: number) {
    return this.a({ min_length: e })
  }
  /**
   * @param {number} e
   * @returns {this}
   */
  max_length(e: number) {
    return this.a({ max_length: e })
  }
  /**
   * Whether or not this text input is required or not
   * @param {boolean} [e=true]
   * @returns {this}
   */
  required<R extends boolean = true>(e: R = true as R): TextInput<K, R> {
    return this.a({ required: e })
  }
  /**
   * The pre-filled text in the text input
   * @param {string} e
   * @returns {this}
   */
  value(e: string) {
    return this.a({ value: e })
  }
  /**
   * @param {string} e
   * @returns {this}
   */
  placeholder(e: string) {
    return this.a({ placeholder: e })
  }
}
