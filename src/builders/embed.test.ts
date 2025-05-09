import type { APIEmbedField, EmbedType } from 'discord-api-types/v10'
import { describe, expect, it } from 'vitest'
import { Embed } from './embed'

describe('Embed', () => {
  it('should create an empty embed', () => {
    const embed = new Embed()
    expect(embed.toJSON()).toEqual({})
  })

  it('should set title', () => {
    const embed = new Embed().title('Test Title')
    expect(embed.toJSON()).toEqual({ title: 'Test Title' })
  })

  it('should set type', () => {
    const embed = new Embed().type('rich' as EmbedType)
    expect(embed.toJSON()).toEqual({ type: 'rich' })
  })

  it('should set description', () => {
    const embed = new Embed().description('Test Description')
    expect(embed.toJSON()).toEqual({ description: 'Test Description' })
  })

  it('should set url', () => {
    const embed = new Embed().url('https://example.com')
    expect(embed.toJSON()).toEqual({ url: 'https://example.com' })
  })

  it('should set timestamp', () => {
    const timestamp = '2023-01-01T00:00:00.000Z'
    const embed = new Embed().timestamp(timestamp)
    expect(embed.toJSON()).toEqual({ timestamp })
  })

  it('should set color', () => {
    const embed = new Embed().color(0xff0000)
    expect(embed.toJSON()).toEqual({ color: 0xff0000 })
  })

  it('should set footer', () => {
    const footer = { text: 'Footer Text' }
    const embed = new Embed().footer(footer)
    expect(embed.toJSON()).toEqual({ footer })
  })

  it('should set image', () => {
    const image = { url: 'https://example.com/image.png' }
    const embed = new Embed().image(image)
    expect(embed.toJSON()).toEqual({ image })
  })

  it('should set thumbnail', () => {
    const thumbnail = { url: 'https://example.com/thumbnail.png' }
    const embed = new Embed().thumbnail(thumbnail)
    expect(embed.toJSON()).toEqual({ thumbnail })
  })

  it('should set video', () => {
    const video = { url: 'https://example.com/video.mp4' }
    const embed = new Embed().video(video)
    expect(embed.toJSON()).toEqual({ video })
  })

  it('should set provider', () => {
    const provider = { name: 'Provider Name' }
    const embed = new Embed().provider(provider)
    expect(embed.toJSON()).toEqual({ provider })
  })

  it('should set author', () => {
    const author = { name: 'Author Name' }
    const embed = new Embed().author(author)
    expect(embed.toJSON()).toEqual({ author })
  })

  it('should set fields', () => {
    const fields: APIEmbedField[] = [
      { name: 'Field 1', value: 'Value 1' },
      { name: 'Field 2', value: 'Value 2' },
    ]
    const embed = new Embed().fields(...fields)
    expect(embed.toJSON()).toEqual({ fields })
  })

  it('should chain multiple methods', () => {
    const embed = new Embed()
      .title('Test Title')
      .description('Test Description')
      .color(0xff0000)
      .fields({ name: 'Field 1', value: 'Value 1' })

    expect(embed.toJSON()).toEqual({
      title: 'Test Title',
      description: 'Test Description',
      color: 0xff0000,
      fields: [{ name: 'Field 1', value: 'Value 1' }],
    })
  })
})
