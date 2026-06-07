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
import { type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

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

type ExtendedEmbed = Omit<
  APIEmbed,
  'type' | 'footer' | 'image' | 'thumbnail' | 'video' | 'provider' | 'author' | 'fields'
> & {
  type?: (typeof embedType)[keyof typeof embedType]
  footer?: APIEmbedFooter | JsonBuilder<APIEmbedFooter, APIEmbedFooter, any>
  image?: APIEmbedImage | JsonBuilder<APIEmbedImage, APIEmbedImage, any>
  thumbnail?: APIEmbedImage | JsonBuilder<APIEmbedImage, APIEmbedImage, any>
  video?: APIEmbedVideo | JsonBuilder<APIEmbedVideo, APIEmbedVideo, any>
  provider?: APIEmbedProvider | JsonBuilder<APIEmbedProvider, APIEmbedProvider, any>
  author?: APIEmbedAuthor | JsonBuilder<APIEmbedAuthor, APIEmbedAuthor, any>
  fields?: (APIEmbedField | JsonBuilder<APIEmbedField, APIEmbedField, any>)[]
}

export const embedBuilder = (builderOptions?: JsonBuilderOptions) => jsonBuilder<{}, ExtendedEmbed>({}, builderOptions)

export const embedFooterBuilder = <T extends string>(text: T, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ text: T }, APIEmbedFooter>({ text }, builderOptions)

export const embedImageBuilder = <U extends string>(url: U, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ url: U }, APIEmbedImage>({ url }, builderOptions)

export const embedVideoBuilder = (builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{}, APIEmbedVideo>({}, builderOptions)

export const embedProviderBuilder = (builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{}, APIEmbedProvider>({}, builderOptions)

export const embedAuthorBuilder = <N extends string>(name: N, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ name: N }, APIEmbedAuthor>({ name }, builderOptions)

export const embedFieldBuilder = <N extends string, V extends string>(
  name: N,
  value: V,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ name: N; value: V }, APIEmbedField>({ name, value }, builderOptions)

/*
const _testEmbed = embedBuilder()
  .type(embedType.Rich)
  .title('Test Embed')
  .footer(embedFooterBuilder('Footer Text'))
  .image(embedImageBuilder('https://example.com/image.png'))
  .author(embedAuthorBuilder('Author Name'))
  .fields([embedFieldBuilder('Field 1', 'Value 1'), embedFieldBuilder('Field 2', 'Value 2')])
*/
