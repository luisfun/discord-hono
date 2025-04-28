import { describe, expect, it } from 'vitest'
import { Content, Layout } from './components-v2'

describe('Layout', () => {
  describe('ActionRow', () => {
    it('creates an action row with correct type', () => {
      const actionRow = new Layout('Action Row')
      expect(actionRow.toJSON()).toEqual({ type: 1 })
    })

    it('can add components to an action row', () => {
      const actionRow = new Layout('Action Row').components(
        { type: 2, style: 1, label: 'Button', custom_id: 'btn1' },
        { type: 3, custom_id: 'select1', options: [] },
      )
      expect(actionRow.toJSON()).toEqual({
        type: 1,
        components: [
          { type: 2, style: 1, label: 'Button', custom_id: 'btn1' },
          { type: 3, custom_id: 'select1', options: [] },
        ],
      })
    })

    it('can set an id', () => {
      const actionRow = new Layout('Action Row').id(123)
      expect(actionRow.toJSON()).toEqual({ type: 1, id: 123 })
    })
  })

  describe('Section', () => {
    it('creates a section with correct type', () => {
      const section = new Layout('Section')
      expect(section.toJSON()).toEqual({ type: 9 })
    })

    it('can add components to a section', () => {
      const section = new Layout('Section').components(new Content('Hello world'))
      expect(section.toJSON()).toEqual({
        type: 9,
        components: [{ type: 10, content: 'Hello world' }],
      })
    })

    it('can add an accessory', () => {
      const section = new Layout('Section').accessory({ type: 2, style: 1, label: 'Button', custom_id: 'btn1' })
      expect(section.toJSON()).toEqual({
        type: 9,
        accessory: { type: 2, style: 1, label: 'Button', custom_id: 'btn1' },
      })
    })
  })

  describe('Separator', () => {
    it('creates a separator with correct type', () => {
      const separator = new Layout('Separator')
      expect(separator.toJSON()).toEqual({ type: 14 })
    })

    it('can set divider property', () => {
      const separator = new Layout('Separator').divider(true)
      expect(separator.toJSON()).toEqual({ type: 14, divider: true })
    })

    it('can set spacing property', () => {
      const separator = new Layout('Separator').spacing(2)
      expect(separator.toJSON()).toEqual({ type: 14, spacing: 2 })
    })
  })

  describe('Container', () => {
    it('creates a container with correct type', () => {
      const container = new Layout('Container')
      expect(container.toJSON()).toEqual({ type: 17 })
    })

    it('can add components to a container', () => {
      const container = new Layout('Container').components(
        new Layout('Action Row'),
        new Layout('Section').components(new Content('Text content')),
        new Content('Another text', 'Text Display'),
      )
      expect(container.toJSON()).toEqual({
        type: 17,
        components: [
          { type: 1 },
          { type: 9, components: [{ type: 10, content: 'Text content' }] },
          { type: 10, content: 'Another text' },
        ],
      })
    })

    it('can set accent_color property', () => {
      const container = new Layout('Container').accent_color(0xff0000)
      expect(container.toJSON()).toEqual({ type: 17, accent_color: 0xff0000 })
    })

    it('can set spoiler property', () => {
      const container = new Layout('Container').spoiler(true)
      expect(container.toJSON()).toEqual({ type: 17, spoiler: true })
    })
  })
})

describe('Content', () => {
  describe('TextDisplay', () => {
    it('creates a text display with correct type and content', () => {
      const textDisplay = new Content('Hello, world!')
      expect(textDisplay.toJSON()).toEqual({ type: 10, content: 'Hello, world!' })
    })

    it('can set an id', () => {
      const textDisplay = new Content('Hello, world!').id(123)
      expect(textDisplay.toJSON()).toEqual({ type: 10, content: 'Hello, world!', id: 123 })
    })
  })

  describe('Thumbnail', () => {
    it('creates a thumbnail with correct type and media from string', () => {
      const thumbnail = new Content('image.png', 'Thumbnail')
      expect(thumbnail.toJSON()).toEqual({
        type: 11,
        media: { url: 'attachment://image.png' },
      })
    })

    it('handles URLs properly', () => {
      const thumbnail = new Content('https://example.com/image.png', 'Thumbnail')
      expect(thumbnail.toJSON()).toEqual({
        type: 11,
        media: { url: 'https://example.com/image.png' },
      })
    })

    it('can set description', () => {
      const thumbnail = new Content('image.png', 'Thumbnail').description('Image description')
      expect(thumbnail.toJSON()).toEqual({
        type: 11,
        media: { url: 'attachment://image.png' },
        description: 'Image description',
      })
    })

    it('can set spoiler', () => {
      const thumbnail = new Content('image.png', 'Thumbnail').spoiler(true)
      expect(thumbnail.toJSON()).toEqual({
        type: 11,
        media: { url: 'attachment://image.png' },
        spoiler: true,
      })
    })
  })

  describe('MediaGallery', () => {
    it('creates a media gallery with correct type and items from string', () => {
      const gallery = new Content('image.png', 'Media Gallery')
      expect(gallery.toJSON()).toEqual({
        type: 12,
        items: [{ media: { url: 'attachment://image.png' } }],
      })
    })

    it('handles multiple items', () => {
      const gallery = new Content(['image1.png', 'image2.png'], 'Media Gallery')
      expect(gallery.toJSON()).toEqual({
        type: 12,
        items: [{ media: { url: 'attachment://image1.png' } }, { media: { url: 'attachment://image2.png' } }],
      })
    })
  })

  describe('File', () => {
    it('creates a file with correct type and file from string', () => {
      const file = new Content('document.pdf', 'File')
      expect(file.toJSON()).toEqual({
        type: 13,
        file: { url: 'attachment://document.pdf' },
      })
    })

    it('can set spoiler', () => {
      const file = new Content('document.pdf', 'File').spoiler(true)
      expect(file.toJSON()).toEqual({
        type: 13,
        file: { url: 'attachment://document.pdf' },
        spoiler: true,
      })
    })
  })
})
