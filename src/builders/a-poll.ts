// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type { APIBasePollAnswer, APIPollMedia, RESTAPIPoll } from 'discord-api-types/v10'
import { isArray, isString, type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, createJsonBuilder, type JsonBuilderOptions, type JsonSerializable } from './json-builder'

type PollMediaContext = string | [emoji: string] | [emoji: string, text: string]

type PollMediaJson<T extends PollMediaContext> = T extends string
  ? { text: T }
  : T extends [infer E extends string]
    ? { emoji: { id: null; name: E } }
    : T extends [infer E extends string, infer U extends string]
      ? { text: U; emoji: { id: null; name: E } }
      : never

export const makePollMedia = <const T extends PollMediaContext>(text: T, builderOptions?: JsonBuilderOptions) => {
  const builder = createJsonBuilder<PollMediaJson<T>, APIPollMedia>({} as PollMediaJson<T>, builderOptions)
  const emj = isArray(text) ? text[0] : undefined
  const txt = isArray(text) ? text[1] : isString(text) ? text : undefined
  if (emj) builder.emoji({ id: null, name: emj })
  if (txt) builder.text(txt)
  return builder
}
//const pollMediaTest = makePollMedia(['😀', 'Test Text'])

export const makePollAnswer = <M extends JsonSerializable<APIPollMedia>>(
  poll_media: M,
  builderOptions?: JsonBuilderOptions,
) => createJsonBuilder<{ poll_media: ToJSON<M> }, APIBasePollAnswer>({ poll_media: toJSON(poll_media) }, builderOptions)

type PollMediaBuilderResult<T extends PollMediaContext> = ReturnType<typeof makePollMedia<T>> //JsonBuilder<PollMediaJson<T>, APIPollMedia, never>
type PollAnswerBuilderResult<M extends JsonSerializable<APIPollMedia>> = ReturnType<typeof makePollAnswer<M>>

export const makePoll = <const Q extends PollMediaContext, const A extends PollMediaContext>(
  question: Q,
  answers: A[],
  builderOptions?: JsonBuilderOptions,
) =>
  createJsonBuilder<
    {
      question: ToJSON<PollMediaBuilderResult<Q>>
      answers: ToJSON<PollAnswerBuilderResult<PollMediaBuilderResult<A>>>[]
    },
    AddCustomValue<RESTAPIPoll>,
    'custom_id'
  >(
    {
      question: makePollMedia(question, builderOptions).toJSON(),
      answers: answers.map(a => makePollAnswer(makePollMedia(a, builderOptions), builderOptions).toJSON()),
    },
    builderOptions,
  )
//const pollTest = makePoll('question', ['Test', ['🔥', 'Hono']])
//  .question(makePollMedia('aaa'))
//  .answers([makePollAnswer(makePollMedia('bbb')), makePollAnswer(makePollMedia(['🔥', 'Hono']))])
