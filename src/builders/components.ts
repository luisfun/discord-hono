import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIChannelSelectComponent,
  APIComponentInMessageActionRow,
  APIContainerComponent,
  APIFileComponent,
  APIMediaGalleryComponent,
  APIMentionableSelectComponent,
  APIMessageComponentEmoji,
  APIRoleSelectComponent,
  APISectionComponent,
  APISelectMenuOption,
  APISeparatorComponent,
  APIStringSelectComponent,
  APITextDisplayComponent,
  APIThumbnailComponent,
  APIUserSelectComponent,
  ChannelType,
} from 'discord-api-types/v10'
import { CUSTOM_ID_SEPARATOR, toJSON } from '../utils'
import { Builder, ifThrowHasSemicolon, warnBuilder } from './utils'

type LayoutStyle = 'Action Row' | 'Section' | 'Separator' | 'Container'
// biome-ignore format: ternary operator
type LayoutComponent<T extends LayoutStyle> =
  T extends 'Action Row' ? APIActionRowComponent<APIComponentInMessageActionRow> :
  T extends 'Section' ? APISectionComponent :
  T extends 'Separator' ? APISeparatorComponent :
  T extends 'Container' ? APIContainerComponent :
  never
export class Layout<T extends LayoutStyle> extends Builder<LayoutComponent<T>> {
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
  id = (e: number) => this.a({ id: e } as Partial<LayoutComponent<T>>)
  /**
   * required: [Action Row](https://discord.com/developers/docs/components/reference#action-row-action-row-structure), [Section](https://discord.com/developers/docs/components/reference#section-section-structure), [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param e
   * @returns {this}
   */
  components = (
    ...e: (
      // biome-ignore format: ternary operator
      T extends 'Action Row' ? APIActionRowComponent<APIComponentInMessageActionRow> | Button<any> | Select<any> :
      T extends 'Section' ? APISectionComponent | Content<'Text Display'> :
      T extends 'Container' ?
        | APIContainerComponent
        | Layout<'Action Row' | 'Section' | 'Separator'>
        | Content<'Text Display' | 'Media Gallery' | 'File'> :
      never
    )[]
  ) =>
    // @ts-expect-error
    this.a({ components: e.map(toJSON) })
  /**
   * available: [Section](https://discord.com/developers/docs/components/reference#section-section-structure)
   * @param {APIButtonComponent | APIThumbnailComponent} e
   * @returns {this}
   */
  accessory = (
    e: T extends 'Section' ? APIButtonComponent | APIThumbnailComponent | Button<any> | Content<'Thumbnail'> : never,
  ) =>
    // @ts-expect-error
    this.a({ accessory: toJSON(e) })
  /**
   * available: [Separator](https://discord.com/developers/docs/components/reference#separator-separator-structure)
   * @param {boolean} e
   * @returns {this}
   */
  // @ts-expect-error
  divider = (e: T extends 'Separator' ? boolean : never) => this.a({ divider: e })
  /**
   * available: [Separator](https://discord.com/developers/docs/components/reference#separator-separator-structure)
   * @param {1 | 2} e
   * @returns {this}
   */
  // @ts-expect-error
  spacing = (e: T extends 'Separator' ? 1 | 2 : never) => this.a({ spacing: e })
  /**
   * available: [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param {number} e
   * @returns {this}
   */
  // @ts-expect-error
  accent_color = (e: T extends 'Container' ? number : never) => this.a({ accent_color: e })
  /**
   * available: [Container](https://discord.com/developers/docs/components/reference#container-container-structure)
   * @param {boolean} [e=true] default: true
   * @returns {this}
   */
  // @ts-expect-error
  spoiler = (e: T extends 'Container' ? boolean : never = true) => this.a({ spoiler: e })
}

const fixUrlAttachment = (str: string) => {
  if (URL.canParse(str) || str.startsWith('attachment://')) return str
  return `attachment://${str}`
}

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
export class Content<T extends ContentStyle = 'Text Display'> extends Builder<ContentJson<T>> {
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
        super({ type: 11, media: typeof data === 'string' ? { url: fixUrlAttachment(data) } : data } as ContentJson<T>)
        break
      case 'Media Gallery': {
        const items = (Array.isArray(data) ? data : [data]) as (string | APIMediaGalleryComponent['items'][number])[]
        super({
          type: 12,
          items: items.map(item => (typeof item === 'string' ? { media: { url: fixUrlAttachment(item) } } : item)),
        } as ContentJson<T>)
        break
      }
      case 'File':
        super({ type: 13, file: typeof data === 'string' ? { url: fixUrlAttachment(data) } : data } as ContentJson<T>)
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
  id = (e: number) => this.a({ id: e } as Partial<ContentJson<T>>)
  /**
   * available: [Thumbnail](https://discord.com/developers/docs/components/reference#thumbnail-thumbnail-structure)
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error
  description = (e: T extends 'Thumbnail' ? string : never) => this.a({ description: e })
  /**
   * available: [Thumbnail](https://discord.com/developers/docs/components/reference#thumbnail-thumbnail-structure), [File](https://discord.com/developers/docs/components/reference#file-file-structure)
   * @param {string} e
   * @returns {this}
   */
  // @ts-expect-error
  spoiler = (e: T extends 'Thumbnail' | 'File' ? boolean : never = true) => this.a({ spoiler: e })
}

/**
 * [Message Components](https://discord.com/developers/docs/interactions/message-components)
 */
export class Components {
  #components: APIActionRowComponent<APIComponentInMessageActionRow>[] = []
  /**
   * push component
   * @param {...(Button | Select | APIComponentInMessageActionRow)} e
   * @returns {this}
   */
  row = (...e: (Button<any> | Select<any> | APIComponentInMessageActionRow)[]) => {
    // biome-ignore lint: console
    if (this.#components.length >= 5) console.warn('You can have up to 5 Action Rows per message')
    this.#components.push({
      type: 1,
      components: e.map(toJSON),
    })
    return this
  }
  /**
   * export json object
   * @returns {Obj}
   */
  toJSON = () => this.#components
}

type ButtonStyle = 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link' | 'SKU'
export class Button<T extends ButtonStyle = 'Primary'> extends Builder<APIButtonComponent> {
  #style: ButtonStyle
  #uniqueStr = ''
  #assign = (method: string, doNotStyle: ButtonStyle[], obj: Partial<APIButtonComponent>) => {
    if (doNotStyle.includes(this.#style)) {
      warnBuilder('Button', this.#style, method)
      return this
    }
    return this.a(obj)
  }
  /**
   * [Button Structure](https://discord.com/developers/docs/interactions/message-components#button-object)
   * @param {string} str Basic: unique_id, Link: URL, SKU: sku_id
   * @param {string} label The label to be displayed on the button. max 80 characters - Ignore: SKU
   * @param {"Primary" | "Secondary" | "Success" | "Danger" | "Link" | "SKU"} [button_style="Primary"]
   */
  constructor(
    str: string,
    labels: T extends 'SKU' ? '' | undefined : string | [string | APIMessageComponentEmoji, string],
    button_style: T = 'Primary' as T,
  ) {
    const styleNum = {
      Primary: 1,
      Secondary: 2,
      Success: 3,
      Danger: 4,
      Link: 5,
      SKU: 6,
    } as const
    const style = styleNum[button_style] || 1
    const custom_id = str + CUSTOM_ID_SEPARATOR
    const isArrayLabels = Array.isArray(labels)
    const label: string | undefined = isArrayLabels ? labels[1] : labels
    let obj: APIButtonComponent
    switch (style) {
      case 5:
        obj = { type: 2, label, style, url: str }
        break
      case 6:
        obj = { type: 2, style, sku_id: str }
        break
      default:
        ifThrowHasSemicolon(str)
        obj = { type: 2, label, style, custom_id }
    }
    super(obj)
    this.#style = button_style
    this.#uniqueStr = custom_id
    if (isArrayLabels) this.emoji(labels[0] as T extends 'SKU' ? undefined : string | APIMessageComponentEmoji)
  }
  /**
   * available: Primary, Secondary, Success, Danger, Link
   * @param {string | APIMessageComponentEmoji} e
   * @returns {this}
   */
  emoji = (e: T extends 'SKU' ? undefined : string | APIMessageComponentEmoji) =>
    this.#assign('emoji', ['SKU'], { emoji: typeof e === 'string' ? { name: e } : e })
  /**
   * available: Primary, Secondary, Success, Danger
   * @param {string} e
   * @returns {this}
   */
  custom_id = (e: T extends 'Link' | 'SKU' ? undefined : string) =>
    this.#assign('custom_id', ['Link', 'SKU'], { custom_id: this.#uniqueStr + e })
  /**
   * available: ALL
   * @param {boolean} [e=true]
   * @returns {this}
   */
  disabled = (e = true) => this.a({ disabled: e })
  /**
   * Overwrite label
   *
   * available: Primary, Secondary, Success, Danger, Link
   * @param {string} e
   * @returns {this}
   */
  label = (e: T extends 'SKU' ? undefined : string) => this.#assign('emoji', ['SKU'], { label: e })
}

type SelectType = 'String' | 'User' | 'Role' | 'Mentionable' | 'Channel'
type SelectComponent =
  | APIStringSelectComponent
  | APIUserSelectComponent
  | APIRoleSelectComponent
  | APIMentionableSelectComponent
  | APIChannelSelectComponent
export class Select<T extends SelectType = 'String'> extends Builder<SelectComponent> {
  #type: SelectType
  #uniqueStr = ''
  #assign = (method: string, doType: SelectType[], obj: Partial<SelectComponent>) => {
    if (!doType.includes(this.#type)) {
      warnBuilder('Select', this.#type, method)
      return this
    }
    return this.a(obj)
  }
  /**
   * [Select Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object)
   * @param {string} unique_id
   * @param {"String" | "User" | "Role" | "Mentionable" | "Channel"} [selectType="String"]
   */
  constructor(unique_id: string, select_type: T = 'String' as T) {
    ifThrowHasSemicolon(unique_id)
    const typeNum = {
      String: 3,
      User: 5,
      Role: 6,
      Mentionable: 7,
      Channel: 8,
    } as const
    const custom_id = unique_id + CUSTOM_ID_SEPARATOR
    super({ type: typeNum[select_type], custom_id } as SelectComponent)
    this.#type = select_type
    this.#uniqueStr = custom_id
  }
  /**
   * available: ALL
   * @param {string} e
   * @returns {this}
   */
  custom_id = (e: string) => this.a({ custom_id: this.#uniqueStr + e })
  /**
   * required: String
   *
   * [Select Option Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure)
   * @param {APISelectMenuOption} e
   * @returns {this}
   */
  options = (...e: T extends 'String' ? APISelectMenuOption[] : undefined[]) =>
    this.#assign('options', ['String'], { options: e as APISelectMenuOption[] })
  /**
   * available: Channel
   *
   * [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
   * @param {...ChannelType} e
   * @returns {this}
   */
  channel_types = (...e: T extends 'Channel' ? ChannelType[] : undefined[]) =>
    this.#assign('channel_types', ['Channel'], { channel_types: e as ChannelType[] })
  /**
   * Custom placeholder text if nothing is selected, max 150 characters
   * @param {string} e
   * @returns {this}
   */
  placeholder = (e: string) => this.a({ placeholder: e })
  /**
   * available: User, Role, Channel, Mentionable
   *
   * [Select Default Value Structure](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-default-value-structure)
   * @param {...{ id: string, type: "user" | "role" | "channel" }} e
   * @returns {this}
   */
  default_values = (
    // biome-ignore format: ternary operator
    ...e: T extends 'String' ? undefined[] :
      {
        id: string
        type:
          T extends 'User' ? 'user' :
          T extends 'Role' ? 'role' :
          T extends 'Channel' ? 'channel' :
          'user' | 'role'
      }[]
    // @ts-expect-error
  ) => this.#assign('default_values', ['User', 'Role', 'Channel', 'Mentionable'], { default_values: e })
  /**
   * The minimum number of items that must be chosen; min 0, max 25
   * @param {number} [e=1]
   * @returns {this}
   */
  min_values = (e = 1) => this.a({ min_values: e })
  /**
   * The maximum number of items that can be chosen; max 25
   * @param {number} [e=1]
   * @returns {this}
   */
  max_values = (e = 1) => this.a({ max_values: e })
  /**
   * Disable the select
   * @param {boolean} [e=true]
   * @returns {this}
   */
  disabled = (e = true) => this.a({ disabled: e })
}
