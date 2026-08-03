// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type { APIBasePollAnswer, APIPollMedia, RESTAPIPoll } from 'discord-api-types/v10'
import { isArray, isString, type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, type JsonBuilderOptions, type JsonSerializable, jsonBuilder } from './json-builder'

type PollMediaContext = string | [emoji: string] | [emoji: string, text: string]

type PollMediaJson<T extends PollMediaContext> = T extends string
  ? { text: T }
  : T extends [infer E extends string]
    ? { emoji: { id: null; name: E } }
    : T extends [infer E extends string, infer U extends string]
      ? { text: U; emoji: { id: null; name: E } }
      : never

export const pollMediaBuilder = <const T extends PollMediaContext>(text: T, builderOptions?: JsonBuilderOptions) => {
  const builder = jsonBuilder<PollMediaJson<T>, APIPollMedia>({} as PollMediaJson<T>, builderOptions)
  const emj = isArray(text) ? text[0] : undefined
  const txt = isArray(text) ? text[1] : isString(text) ? text : undefined
  if (emj) builder.emoji({ id: null, name: emj })
  if (txt) builder.text(txt)
  return builder
}
//const pollMediaTest = pollMediaBuilder(['😀', 'Test Text'])

export const pollAnswerBuilder = <M extends JsonSerializable<APIPollMedia>>(
  poll_media: M,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ poll_media: ToJSON<M> }, APIBasePollAnswer>({ poll_media: toJSON(poll_media) }, builderOptions)

type PollMediaBuilderResult<T extends PollMediaContext> = ReturnType<typeof pollMediaBuilder<T>> //JsonBuilder<PollMediaJson<T>, APIPollMedia, never>
type PollAnswerBuilderResult<M extends JsonSerializable<APIPollMedia>> = ReturnType<typeof pollAnswerBuilder<M>>

export const pollBuilder = <const Q extends PollMediaContext, const A extends PollMediaContext>(
  question: Q,
  answers: A[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<
    {
      question: ToJSON<PollMediaBuilderResult<Q>>
      answers: ToJSON<PollAnswerBuilderResult<PollMediaBuilderResult<A>>>[]
    },
    AddCustomValue<RESTAPIPoll>,
    'custom_id'
  >(
    {
      question: pollMediaBuilder(question, builderOptions).toJSON(),
      answers: answers.map(a => pollAnswerBuilder(pollMediaBuilder(a, builderOptions), builderOptions).toJSON()),
    },
    builderOptions,
  )
//const pollTest = pollBuilder('question', ['Test', ['🔥', 'Hono']])
//  .question(pollMediaBuilder('aaa'))
//  .answers([pollAnswerBuilder(pollMediaBuilder('bbb')), pollAnswerBuilder(pollMediaBuilder(['🔥', 'Hono']))])
