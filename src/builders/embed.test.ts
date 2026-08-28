import { describe, expect, it } from 'vitest'
import {
  embedType,
  makeEmbed,
  makeEmbedAuthor,
  makeEmbedField,
  makeEmbedFooter,
  makeEmbedImage,
  makeEmbedProvider,
  makeEmbedVideo,
} from './embed'

describe('a-embed builders', () => {
  it('should create an empty embed', () => {
    const embed = makeEmbed()
    expect(embed.toJSON()).toEqual({})
  })

  it('should set title', () => {
    const embed = makeEmbed().title('Test Title')
    expect(embed.toJSON()).toEqual({ title: 'Test Title' })
  })

  it('should set type', () => {
    const embed = makeEmbed().type(embedType.Rich)
    expect(embed.toJSON()).toEqual({ type: 'rich' })
  })

  it('should set description', () => {
    const embed = makeEmbed().description('Test Description')
    expect(embed.toJSON()).toEqual({ description: 'Test Description' })
  })

  it('should set url', () => {
    const embed = makeEmbed().url('https://example.com')
    expect(embed.toJSON()).toEqual({ url: 'https://example.com' })
  })

  it('should set timestamp', () => {
    const timestamp = '2023-01-01T00:00:00.000Z'
    const embed = makeEmbed().timestamp(timestamp)
    expect(embed.toJSON()).toEqual({ timestamp })
  })

  it('should set color', () => {
    const embed = makeEmbed().color(0xff0000)
    expect(embed.toJSON()).toEqual({ color: 0xff0000 })
  })

  it('should set footer', () => {
    const footer = makeEmbedFooter('Footer Text')
    const embed = makeEmbed().footer(footer)
    expect(embed.toJSON()).toEqual({ footer: { text: 'Footer Text' } })
  })

  it('should set image', () => {
    const image = makeEmbedImage('https://example.com/image.png')
    const embed = makeEmbed().image(image)
    expect(embed.toJSON()).toEqual({ image: { url: 'https://example.com/image.png' } })
  })

  it('should set video', () => {
    const video = makeEmbedVideo().url('https://example.com/video.mp4')
    expect(video.toJSON()).toEqual({ url: 'https://example.com/video.mp4' })
  })

  it('should set provider', () => {
    const provider = makeEmbedProvider().name('Provider Name')
    expect(provider.toJSON()).toEqual({ name: 'Provider Name' })
  })

  it('should set author', () => {
    const author = makeEmbedAuthor('Author Name')
    const embed = makeEmbed().author(author)
    expect(embed.toJSON()).toEqual({ author: { name: 'Author Name' } })
  })

  it('should set fields', () => {
    const fields = [makeEmbedField('Field 1', 'Value 1'), makeEmbedField('Field 2', 'Value 2')]
    const embed = makeEmbed().fields(fields)
    expect(embed.toJSON()).toEqual({
      fields: [
        { name: 'Field 1', value: 'Value 1' },
        { name: 'Field 2', value: 'Value 2' },
      ],
    })
  })

  it('should chain multiple methods', () => {
    const embed = makeEmbed()
      .title('Test Title')
      .description('Test Description')
      .color(0xff0000)
      .footer(makeEmbedFooter('Footer Text'))
      .image(makeEmbedImage('https://example.com/image.png'))
      .author(makeEmbedAuthor('Author Name'))
      .fields([makeEmbedField('Field 1', 'Value 1')])

    expect(embed.toJSON()).toEqual({
      title: 'Test Title',
      description: 'Test Description',
      color: 0xff0000,
      footer: { text: 'Footer Text' },
      image: { url: 'https://example.com/image.png' },
      author: { name: 'Author Name' },
      fields: [{ name: 'Field 1', value: 'Value 1' }],
    })
  })
})
