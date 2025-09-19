import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIComponentInMessageActionRow,
  APIContainerComponent,
  APIFileComponent,
  APIMediaGalleryComponent,
  APISectionComponent,
  APISeparatorComponent,
  APITextDisplayComponent,
  APIThumbnailComponent,
} from 'discord-api-types/v10'
import type { ExcludeMethods } from '../types'
import { toJSON } from '../utils'
import type { Button, Select } from './components'
import { Builder } from './utils'

type LayoutStyle = 'Action Row' | 'Section' | 'Separator' | 'Container'
// biome-ignore format: ternary operator
type LayoutComponent<T extends LayoutStyle> =
  T extends 'Action Row' ? APIActionRowComponent<APIComponentInMessageActionRow> :
  T extends 'Section' ? APISectionComponent :
  T extends 'Separator' ? APISeparatorComponent :
  T extends 'Container' ? APIContainerComponent :
  never
class LayoutImpl<T extends LayoutStyle> extends Builder<LayoutComponent<T>> {
  /**
   * required: flags("IS_COMPONENTS_V2")
   *
   * [Layout Style Structure](https://discord.com/developers/docs/components/reference#component-object)
   * @param {"Action Row" | "Section" | "Separator" | "Container"} style
   */
  constructor(style: T) {
    const typeNum = {
      'Action Row': 1,
      Section: 9,
      Separator: 14,
      Container: 17,
    } as const
    super({ type: typeNum[style] } as LayoutComponent<T>)
  }
  /**
   * available: ALL
   * @param {number} e
   * @returns {this}
   */
  id(e: number): this {
    return this.a({ id: e } as Partial<LayoutComponent<T>>)
  }
  /**
   * required: [Action Row](https://discord.com/developers/docs/components/reference#action-row-action-row-structure), [Section](https://discord.com/developers/docs/components/reference#section-section-structure), [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param e
   * @returns {this}
   */
  components(
    ...e: (
      // biome-ignore format: ternary operator
      T extends 'Action Row' ? APIComponentInMessageActionRow | Button<any> | Select<any, any> :
      T extends 'Section' ? APISectionComponent | ContentTextDisplay :
      T extends 'Container' ?
        | APIContainerComponent
        | LayoutActionRow | LayoutSection | LayoutSeparator
        | ContentTextDisplay | ContentMediaGallery | ContentFile :
      never
    )[]
  ): this {
    // @ts-expect-error
    return this.a({ components: e.map(toJSON) })
  }
  /**
   * available: [Section](https://discord.com/developers/docs/components/reference#section-section-structure)
   * @param {APIButtonComponent | APIThumbnailComponent} e
   * @returns {this}
   */
  accessory(
    e: T extends 'Section' ? APIButtonComponent | APIThumbnailComponent | Button<any> | ContentThumbnail : never,
  ): this {
    // @ts-expect-error
    return this.a({ accessory: toJSON(e) })
  }
  /**
   * available: [Separator](https://discord.com/developers/docs/components/reference#separator-separator-structure)
   * @param {boolean} e
   * @returns {this}
   */
  divider(e: T extends 'Separator' ? boolean : never): this {
    // @ts-expect-error
    return this.a({ divider: e })
  }
  /**
   * available: [Separator](https://discord.com/developers/docs/components/reference#separator-separator-structure)
   * @param {1 | 2} e
   * @returns {this}
   */
  spacing(e: T extends 'Separator' ? 1 | 2 : never): this {
    // @ts-expect-error
    return this.a({ spacing: e })
  }
  /**
   * available: [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param {number} e
   * @returns {this}
   */
  accent_color(e: T extends 'Container' ? number : never): this {
    // @ts-expect-error
    return this.a({ accent_color: e })
  }
  /**
   * available: [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param {boolean} [e=true] default: true
   * @returns {this}
   */
  // @ts-expect-error
  spoiler(e: T extends 'Container' ? boolean : never = true): this {
    // @ts-expect-error
    return this.a({ spoiler: e })
  }
}

export type LayoutActionRow = ExcludeMethods<
  LayoutImpl<'Action Row'>,
  'accessory' | 'divider' | 'spacing' | 'accent_color' | 'spoiler'
>
export type LayoutSection = ExcludeMethods<LayoutImpl<'Section'>, 'divider' | 'spacing' | 'accent_color' | 'spoiler'>
export type LayoutSeparator = ExcludeMethods<
  LayoutImpl<'Separator'>,
  'components' | 'accessory' | 'accent_color' | 'spoiler'
>
export type LayoutContainer = ExcludeMethods<LayoutImpl<'Container'>, 'accessory' | 'divider' | 'spacing'>

export const Layout = LayoutImpl as {
  new (style: 'Action Row'): LayoutActionRow
  new (style: 'Section'): LayoutSection
  new (style: 'Separator'): LayoutSeparator
  new (style: 'Container'): LayoutContainer
}

interface MediaItem {
  url: string
}

const mediaItem = (str: string): MediaItem => ({
  url: URL.canParse(str) || str.startsWith('attachment://') ? str : `attachment://${str}`,
})

type ContentStyle = 'Text Display' | 'Thumbnail' | 'Media Gallery' | 'File'
// biome-ignore format: ternary operator
type ContentJson<T extends ContentStyle> =
  T extends 'Text Display' ? APITextDisplayComponent :
  T extends 'Thumbnail' ? APIThumbnailComponent :
  T extends 'Media Gallery' ? APIMediaGalleryComponent :
  T extends 'File' ? APIFileComponent :
  never
// biome-ignore format: ternary operator
type ContentData<T extends ContentStyle> =
  T extends 'Text Display' ? APITextDisplayComponent['content'] :
  T extends 'Thumbnail' ? string | APIThumbnailComponent['media'] :
  T extends 'Media Gallery' ?
    | string
    | APIMediaGalleryComponent['items'][number]
    | (string | APIMediaGalleryComponent['items'][number])[] :
  T extends 'File' ? string | APIFileComponent['file'] :
  never
class ContentImpl<T extends ContentStyle = 'Text Display'> extends Builder<ContentJson<T>> {
  /**
   * required: flags("IS_COMPONENTS_V2")
   *
   * [Content Style Structure](https://discord.com/developers/docs/components/reference#component-object)
   * @param data
   * @param {"Text Display" | "Thumbnail" | "Media Gallery" | "File"} style
   */
  constructor(data: ContentData<T>, style: T = 'Text Display' as T) {
    switch (style) {
      case 'Thumbnail':
        super({ type: 11, media: typeof data === 'string' ? mediaItem(data) : data } as ContentJson<T>)
        break
      case 'Media Gallery': {
        const items = (Array.isArray(data) ? data : [data]) as (string | APIMediaGalleryComponent['items'][number])[]
        super({
          type: 12,
          items: items.map(item => (typeof item === 'string' ? { media: mediaItem(item) } : item)),
        } as ContentJson<T>)
        break
      }
      case 'File':
        super({ type: 13, file: typeof data === 'string' ? mediaItem(data) : data } as ContentJson<T>)
        break
      default: // Text Display
        super({ type: 10, content: data } as ContentJson<T>)
    }
  }
  /**
   * available: ALL
   * @param {number} e
   * @returns {this}
   */
  id(e: number): this {
    return this.a({ id: e } as Partial<ContentJson<T>>)
  }
  /**
   * available: [Thumbnail](https://discord.com/developers/docs/components/reference#thumbnail-thumbnail-structure)
   * @param {string} e
   * @returns {this}
   */
  description(e: T extends 'Thumbnail' ? string : never): this {
    // @ts-expect-error
    return this.a({ description: e })
  }
  /**
   * available: [Thumbnail](https://discord.com/developers/docs/components/reference#thumbnail-thumbnail-structure), [File](https://discord.com/developers/docs/components/reference#file-file-structure)
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error
  spoiler(e: T extends 'Thumbnail' | 'File' ? boolean : never = true): this {
    // @ts-expect-error
    return this.a({ spoiler: e })
  }
}

export type ContentTextDisplay = ExcludeMethods<ContentImpl<'Text Display'>, 'description' | 'spoiler'>
type ContentThumbnail = ContentImpl<'Thumbnail'>
export type ContentMediaGallery = ExcludeMethods<ContentImpl<'Media Gallery'>, 'description' | 'spoiler'>
export type ContentFile = ExcludeMethods<ContentImpl<'File'>, 'description'>

export const Content = ContentImpl as {
  new (data: string, style?: 'Text Display'): ContentTextDisplay
  new (data: string | APIThumbnailComponent['media'], style: 'Thumbnail'): ContentThumbnail
  new (
    data: string | APIMediaGalleryComponent['items'][number] | (string | APIMediaGalleryComponent['items'][number])[],
    style: 'Media Gallery',
  ): ContentMediaGallery
  new (data: string | APIFileComponent['file'], style: 'File'): ContentFile
}
