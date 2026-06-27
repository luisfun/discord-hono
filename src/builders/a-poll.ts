// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type { APIBasePollAnswer, APIPollMedia, RESTAPIPoll } from 'discord-api-types/v10'
import { isArray, isString, type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

type PollMediaContext = string | [emoji: string] | [emoji: string, text: string]

type PollMediaJson<T extends PollMediaContext> = T extends string
  ? { text: T }
  : T extends [infer E extends string]
    ? { emoji: { id: null; name: E } }
    : T extends [infer E extends string, infer U extends string]
      ? { text: U; emoji: { id: null; name: E } }
      : never

type ExtendedPollMedia = APIPollMedia | JsonBuilder<APIPollMedia, APIPollMedia, any>

type ExtendedPollAnswer = APIBasePollAnswer | JsonBuilder<APIBasePollAnswer, APIBasePollAnswer, any>

type ExtendedPoll = Omit<RESTAPIPoll, 'answers'> & {
  answers: ExtendedPollAnswer[]
}

export const pollMediaBuilder = <const T extends PollMediaContext>(text: T, builderOptions?: JsonBuilderOptions) => {
  const builder = jsonBuilder<PollMediaJson<T>, APIPollMedia>({} as PollMediaJson<T>, builderOptions)
  const emj = isArray(text) ? text[0] : undefined
  const txt = isArray(text) ? text[1] : isString(text) ? text : undefined
  if (emj) builder.emoji({ id: null, name: emj })
  if (txt) builder.text(txt)
  return builder
}
//const pollMediaTest = pollMediaBuilder(['😀', 'Test Text'])

export const pollAnswerBuilder = <M extends ExtendedPollMedia>(poll_media: M, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ poll_media: ToJSON<M> }, APIBasePollAnswer>({ poll_media: toJSON(poll_media) }, builderOptions)

type PollMediaBuilderResult<T extends PollMediaContext> = JsonBuilder<PollMediaJson<T>, APIPollMedia, never>
type PollAnswerBuilderResult<M extends ExtendedPollMedia> = ReturnType<typeof pollAnswerBuilder<M>>

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
    AddCustomValue<ExtendedPoll>,
    'custom_id'
  >(
    {
      question: toJSON(pollMediaBuilder(question)),
      answers: answers.map(a => toJSON(pollAnswerBuilder(pollMediaBuilder(a)))),
    },
    builderOptions,
  )
//const pollTest = pollBuilder('question', ['Test', ['🔥', 'Hono']])
