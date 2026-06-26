// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type { APIBasePollAnswer, APIPollMedia, RESTAPIPoll } from 'discord-api-types/v10'
import { isArray, isString, toJSON } from '../utils'
import { type AddCustomValue, type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

type ExtendedPollMedia = APIPollMedia | JsonBuilder<APIPollMedia, APIPollMedia, any>

type ExtendedPollAnswer = APIBasePollAnswer | JsonBuilder<APIBasePollAnswer, APIBasePollAnswer, any>

type ExtendedPoll = Omit<RESTAPIPoll, 'answers'> & {
  answers: ExtendedPollAnswer[]
}

export const pollBuilder = <Q extends ExtendedPollMedia, A extends ExtendedPollAnswer>(
  question: Q,
  answers: A[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<
    { question: ReturnType<typeof toJSON<Q>>; answers: ReturnType<typeof toJSON<A>>[] },
    AddCustomValue<ExtendedPoll>,
    'custom_id'
  >({ question: toJSON(question), answers: answers.map(toJSON) }, builderOptions)

interface PollMediaBuilder {
  <const T extends string>(text: T, builderOptions?: JsonBuilderOptions): JsonBuilder<{ text: T }, APIPollMedia, never>
  <const E extends string>(
    text: [emoji: E],
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<{ emoji: { id: null; name: E } }, APIPollMedia, never>
  <const T extends string, const E extends string>(
    text: [emoji: E, text: T],
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<{ text: T; emoji: { id: null; name: E } }, APIPollMedia, never>
}
interface PollMediaBuilderInit {
  text: string
  emoji: { id: null; name: string }
}

export const pollMediaBuilder: PollMediaBuilder = (
  text: string | [string] | [string, string],
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = jsonBuilder<PollMediaBuilderInit, APIPollMedia>({} as PollMediaBuilderInit, builderOptions)
  const emj = isArray(text) ? text[0] : undefined
  const txt = isArray(text) ? text[1] : isString(text) ? text : undefined
  if (emj) builder.emoji({ id: null, name: emj })
  if (txt) builder.text(txt)
  return builder
}
//const pollMediaTest = pollMediaBuilder(['😀', 'Test Text'])

export const pollAnswerBuilder = <M extends ExtendedPollMedia>(poll_media: M, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ poll_media: ReturnType<typeof toJSON<M>> }, APIBasePollAnswer>(
    { poll_media: toJSON(poll_media) },
    builderOptions,
  )

/*
const pollTest = pollBuilder(pollMediaBuilder('question'), [
  pollAnswerBuilder(pollMediaBuilder(['✅', 'Test'])),
  pollAnswerBuilder(pollMediaBuilder(['🔥', 'Hono'])),
])
*/
