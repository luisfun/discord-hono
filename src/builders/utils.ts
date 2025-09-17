import { CUSTOM_ID_SEPARATOR } from '../utils'

export type MergeObjects<T extends object[]> = T extends [infer F, ...infer R]
  ? F & MergeObjects<Extract<R, object[]>>
  : {}

export abstract class Builder<Obj extends {}> {
  #store: Obj
  constructor(init: Obj) {
    this.#store = init
  }
  /**
   * assign object `Object.assign(this.#store, obj)`
   */
  protected a(obj: Partial<Obj>) {
    Object.assign(this.#store, obj)
    return this
  }
  /**
   * export json object
   * @returns {Obj}
   */
  toJSON() {
    return { ...this.#store }
  }
}

export const warnBuilder = (clas: string, type: string, method: string) =>
  console.warn(`⚠️ ${clas}(${type}).${method} is not available`)

export const ifThrowHasSemicolon = (str: string) => {
  if (str.includes(CUSTOM_ID_SEPARATOR)) throw new Error(`Don't use "${CUSTOM_ID_SEPARATOR}"`)
}
