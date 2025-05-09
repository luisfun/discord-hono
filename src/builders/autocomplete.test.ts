import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10'
import { describe, expect, it } from 'vitest'
import { Autocomplete } from './autocomplete'

describe('Autocomplete', () => {
  it('should filter choices based on search string', () => {
    const autocomplete = new Autocomplete('test')
    const choices: APICommandAutocompleteInteractionResponseCallbackData['choices'] = [
      { name: 'test1', value: '1' },
      { name: 'test2', value: '2' },
      { name: 'other', value: '3' },
      { name: 'another', value: 'test' },
    ]

    const result = autocomplete.choices(...choices)

    expect(result.toJSON().choices).toEqual([
      { name: 'test1', value: '1' },
      { name: 'test2', value: '2' },
      { name: 'another', value: 'test' },
    ])
  })

  it('should filter choices based on localized names', () => {
    const autocomplete = new Autocomplete('テスト')
    const choices: APICommandAutocompleteInteractionResponseCallbackData['choices'] = [
      { name: 'test1', name_localizations: { ja: 'テスト1' }, value: '1' },
      { name: 'test2', name_localizations: { ja: 'テスト2' }, value: '2' },
      { name: 'other', value: '3' },
    ]

    const result = autocomplete.choices(...choices)

    expect(result.toJSON().choices).toEqual([
      { name: 'test1', name_localizations: { ja: 'テスト1' }, value: '1' },
      { name: 'test2', name_localizations: { ja: 'テスト2' }, value: '2' },
    ])
  })

  it('should limit choices to 25', () => {
    const autocomplete = new Autocomplete('a')
    const choices: APICommandAutocompleteInteractionResponseCallbackData['choices'] = new Array(30)
      .fill(null)
      .map((_, i) => ({ name: `a${i}`, value: `${i}` }))

    const result = autocomplete.choices(...choices)

    expect(result.toJSON().choices).toHaveLength(25)
  })

  it('should handle empty search string', () => {
    const autocomplete = new Autocomplete()
    const choices: APICommandAutocompleteInteractionResponseCallbackData['choices'] = [
      { name: 'test1', value: '1' },
      { name: 'test2', value: '2' },
    ]

    const result = autocomplete.choices(...choices)

    expect(result.toJSON().choices).toEqual(choices)
  })

  it('should handle numeric search', () => {
    const autocomplete = new Autocomplete(2)
    const choices: APICommandAutocompleteInteractionResponseCallbackData['choices'] = [
      { name: 'test1', value: '1' },
      { name: 'test2', value: '2' },
      { name: 'test3', value: '3' },
    ]

    const result = autocomplete.choices(...choices)

    expect(result.toJSON().choices).toEqual([{ name: 'test2', value: '2' }])
  })
})
