// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIEmbed,
  EmbedType,
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
} as const satisfies Record<string, EmbedType>

export const embedBuilder = (builderOptions?: JsonBuilderOptions) => jsonBuilder<{}, APIEmbed>( {}, builderOptions )

const testEmbed = embedBuilder().type('rich')//.title('Test Embed').description('This is a test embed').color(0xff0000).url('https://example.com').timestamp(new Date().toISOString()).footer({ text: 'Footer text' }).toJSON()
