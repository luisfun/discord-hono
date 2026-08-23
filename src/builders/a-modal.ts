// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIModalInteractionResponseCallbackComponent,
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type { JsonSerializable, NoSemicolon } from '../types'
import { type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, createJsonBuilder, type JsonBuilderOptions } from './json-builder'

export const makeModal = <
  I extends string,
  T extends string,
  C extends JsonSerializable<APIModalInteractionResponseCallbackComponent>,
>(
  custom_id: NoSemicolon<I>,
  title: T,
  components: C[],
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<
    { custom_id: NoSemicolon<I>; title: T; components: ToJSON<C>[] },
    AddCustomValue<APIModalInteractionResponseCallbackData>,
    'custom_id'
  >({ custom_id, title, components: components.map(toJSON) }, builderOptions)

/*
import { makeActionRow, makeLabel, makeTextInput } from './a-component'

const modalTest = makeModal('custom_id', 'title', [
  makeActionRow([makeTextInput('id', 'label')]),
  makeLabel('label', makeTextInput('id2', 'label2')),
])
  .components([makeLabel('label3', makeTextInput('id3', 'label3'))])
  .custom_value('custom_value')
*/
