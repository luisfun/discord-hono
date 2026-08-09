// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedField,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedProvider,
  APIEmbedVideo,
} from 'discord-api-types/v10'
import { type JsonBuilderOptions, makeJsonBuilder } from './json-builder'

export const embedType = {
  Rich: 'rich',
  Image: 'image',
  Video: 'video',
  GIFV: 'gifv',
  Article: 'article',
  Link: 'link',
  PollResult: 'poll_result',
  //  AutoModerationMessage: "auto_moderation_message",
} as const // satisfies Record<string, APIEmbed['type']>

type FixedEmbed = Omit<APIEmbed, 'type'> & {
  type?: (typeof embedType)[keyof typeof embedType]
}

export const makeEmbed = (builderOptions?: JsonBuilderOptions) => makeJsonBuilder<{}, FixedEmbed>({}, builderOptions)

export const makeEmbedFooter = <T extends string>(text: T, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ text: T }, APIEmbedFooter>({ text }, builderOptions)

export const makeEmbedImage = <U extends string>(url: U, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ url: U }, APIEmbedImage>({ url }, builderOptions)

export const makeEmbedVideo = (builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{}, APIEmbedVideo>({}, builderOptions)

export const makeEmbedProvider = (builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{}, APIEmbedProvider>({}, builderOptions)

export const makeEmbedAuthor = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ name: N }, APIEmbedAuthor>({ name }, builderOptions)

export const makeEmbedField = <N extends string, V extends string>(
  name: N,
  value: V,
  builderOptions?: JsonBuilderOptions,
) => makeJsonBuilder<{ name: N; value: V }, APIEmbedField>({ name, value }, builderOptions)

/*
const _testEmbed = makeEmbed()
  .type(embedType.Rich)
  .title('Test Embed')
  .footer(makeEmbedFooter('Footer Text'))
  .image(makeEmbedImage('https://example.com/image.png'))
  .author(makeEmbedAuthor('Author Name'))
  .fields([makeEmbedField('Field 1', 'Value 1'), makeEmbedField('Field 2', 'Value 2')])
*/
