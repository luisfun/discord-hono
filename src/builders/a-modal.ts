// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIModalInteractionResponseCallbackComponent,
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import { type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

type ExtendedModalComponent =
  | APIModalInteractionResponseCallbackComponent
  | JsonBuilder<APIModalInteractionResponseCallbackComponent, APIModalInteractionResponseCallbackComponent, any>

type ExtendedModalData = Omit<APIModalInteractionResponseCallbackData, 'components'> & {
  components: ExtendedModalComponent[]
}

export const modalBuilder = <I extends string, T extends string, C extends ExtendedModalComponent>(
  custom_id: I,
  title: T,
  components: C[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ custom_id: I; title: T; components: ToJSON<C>[] }, AddCustomValue<ExtendedModalData>, 'custom_id'>(
    { custom_id, title, components: components.map(toJSON) },
    builderOptions,
  )

/*
import { actionRowBuilder, labelBuilder, textInputBuilder } from './a-component'

const modalTest = modalBuilder('custom_id', 'title', [
  actionRowBuilder([textInputBuilder('id', 'label')]),
  labelBuilder('label', textInputBuilder('id2', 'label2')),
])
  .components([labelBuilder('label3', textInputBuilder('id3', 'label3'))])
  .custom_value('custom_value')
*/
