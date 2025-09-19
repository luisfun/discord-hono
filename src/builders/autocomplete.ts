import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10'
import { Builder } from './utils'

export class Autocomplete extends Builder<APICommandAutocompleteInteractionResponseCallbackData> {
  #search: string
  constructor(search?: string | number) {
    super({})
    this.#search = search?.toString() || ''
  }
  choices(...e: Required<APICommandAutocompleteInteractionResponseCallbackData>['choices']): this {
    const choices = e.filter(e2 => {
      if (e2.name.includes(this.#search)) return true
      if (Object.values(e2.name_localizations || {}).some(e3 => e3?.includes(this.#search))) return true
      if (e2.value.toString().includes(this.#search)) return true
      return false
    })
    if (choices.length > 25) choices.length = 25
    return this.a({ choices })
  }
}
