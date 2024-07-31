export abstract class Builder<Obj extends object> {
  #store: Obj
  constructor(init: Obj) {
    this.#store = init
  }
  /**
   * assign object `Object.assign(this.#store, obj)`
   */
  protected a = (obj: Partial<Obj>) => {
    Object.assign(this.#store, obj)
    return this
  }
  /**
   * export object
   * @returns {Obj}
   */
  _build = () => this.#store
}

export const warnBuilder = (clas: string, type: string, method: string) =>
  console.warn(`${clas}(${type}).${method} is not available`)
