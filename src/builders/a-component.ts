// biome-ignore-all lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

import type {
  APIActionRowComponent,
  APIBaseAutoPopulatedSelectMenuComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithSKUId,
  APIButtonComponentWithURL,
  APIChannelSelectComponent,
  APICheckboxComponent,
  APICheckboxGroupComponent,
  APICheckboxGroupOption,
  APIComponentInActionRow,
  APIComponentInMessageActionRow,
  APIContainerComponent,
  APIFileComponent,
  APIFileUploadComponent,
  APILabelComponent,
  APIMediaGalleryComponent,
  APIMediaGalleryItem,
  APIRadioGroupComponent,
  APIRadioGroupOption,
  APISectionComponent,
  APISeparatorComponent,
  APIStringSelectComponent,
  APITextDisplayComponent,
  APITextInputComponent,
  APIThumbnailComponent,
  APIUnfurledMediaItem,
  ButtonStyle,
  ComponentType,
  SelectMenuDefaultValueType,
  TextInputStyle,
} from 'discord-api-types/v10'
import { isArray, isString, type ToJSON, toJSON } from '../utils'
import { type AddCustomValue, type JsonBuilderOptions, type JsonSerializable, jsonBuilder } from './json-builder'

type WebUrl = `${'http' | 'https'}://${string}`
type AttachmentUrl = `attachment://${string}`

type TemplatedUnfurledMediaItem<U extends APIUnfurledMediaItem['url'] = WebUrl | AttachmentUrl> = Omit<
  APIUnfurledMediaItem,
  'url'
> & { url: U }

type TemplatedThumbnailComponent = Omit<APIThumbnailComponent, 'media'> & { media: TemplatedUnfurledMediaItem }

type TemplatedMediaGalleryItem = Omit<APIMediaGalleryItem, 'media'> & { media: TemplatedUnfurledMediaItem }

type TemplatedMediaGalleryComponent = Omit<APIMediaGalleryComponent, 'items'> & {
  items: TemplatedMediaGalleryItem[]
}

type TemplatedFileComponent = Omit<APIFileComponent, 'file'> & {
  file: TemplatedUnfurledMediaItem<AttachmentUrl>
}

/**
 * @see https://docs.discord.com/developers/components/reference#container-container-child-components
 * @see https://discord-api-types.dev/api/discord-api-types-v10#APIComponentInContainer
 */
type TemplatedComponentInContainer =
  | APIActionRowComponent<APIComponentInMessageActionRow>
  | APITextDisplayComponent
  | APISectionComponent
  | TemplatedMediaGalleryComponent
  | APISeparatorComponent
  | TemplatedFileComponent
type TemplatedContainerComponent = Omit<APIContainerComponent, 'components'> & {
  components: TemplatedComponentInContainer[]
}

type InteractionButtonStyle = ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger

export const componentType = {
  ActionRow: 1,
  Button: 2,
  StringSelect: 3,
  TextInput: 4,
  UserSelect: 5,
  RoleSelect: 6,
  MentionableSelect: 7,
  ChannelSelect: 8,
  Section: 9,
  TextDisplay: 10,
  Thumbnail: 11,
  MediaGallery: 12,
  File: 13,
  Separator: 14,
  Container: 17,
  Label: 18,
  FileUpload: 19,
  RadioGroup: 21,
  CheckboxGroup: 22,
  Checkbox: 23,
} as const satisfies Record<string, ComponentType>

export const buttonStyle = {
  Primary: 1,
  Secondary: 2,
  Success: 3,
  Danger: 4,
  Link: 5,
  Premium: 6,
} as const satisfies Record<string, ButtonStyle>

export const textInputStyle = {
  Short: 1,
  Paragraph: 2,
} as const satisfies Record<string, TextInputStyle>

/**
 * Component Action Row
 * @param components
 * @param builderOptions
 * @returns
 */
export const actionRowBuilder = <T extends JsonSerializable<APIComponentInActionRow>>(
  components: T[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 1; components: ToJSON<T>[] }, APIActionRowComponent<APIComponentInActionRow>, 'type'>(
    { type: 1, components: components.map(toJSON) },
    builderOptions,
  )
//const testActionRow = actionRowBuilder([{ type: 2, style: 2, custom_id: 'test' }, { type: 2, style: 1, custom_id: 'test' }])
//const testActionRow = actionRowBuilder([]).components([{ type: 2, style: 1, custom_id: 'test' }, { type: 2, style: 1, custom_id: 'test' }])

type ButtonContext = undefined | string | [emoji: string, label: string]
type ButtonJson<C extends string, T extends ButtonContext, S extends InteractionButtonStyle = 1> = T extends undefined
  ? { type: 2; style: S; custom_id: C }
  : T extends string
    ? { type: 2; style: S; custom_id: C; label: T }
    : T extends [emoji: infer E extends string, label: infer L extends string]
      ? { type: 2; style: S; custom_id: C; label: L; emoji: { name: E } }
      : never

/**
 * Component Button
 * @param custom_id
 * @param label
 * @param style
 * @param builderOptions
 * @returns
 */
export const buttonBuilder = <
  C extends string,
  const T extends ButtonContext = undefined,
  S extends InteractionButtonStyle = 1,
>(
  custom_id: C,
  label: T = undefined as T,
  style: S = 1 as S,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = jsonBuilder<
    ButtonJson<C, T, S>,
    AddCustomValue<APIButtonComponentWithCustomId>,
    'type' | 'custom_id'
  >({ type: 2, style, custom_id } as ButtonJson<C, T, S>, builderOptions)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testButton = buttonBuilder('test', ['🔥', 'Fire']).custom_value('test2')//.delete('custom_value') //.toJSON()

type LinkButtonContext = undefined | string | [emoji: string, label: string]
type LinkButtonJson<U extends string, T extends LinkButtonContext> = T extends undefined
  ? { type: 2; style: 5; url: U }
  : T extends string
    ? { type: 2; style: 5; url: U; label: T }
    : T extends [emoji: infer E extends string, label: infer L extends string]
      ? { type: 2; style: 5; url: U; label: L; emoji: { name: E } }
      : never

/**
 * Component Link Button
 * @param url
 * @param label
 * @param builderOptions
 * @returns
 */
export const linkButtonBuilder = <U extends string, const T extends LinkButtonContext = undefined>(
  url: U,
  label: T = undefined as T,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = jsonBuilder<LinkButtonJson<U, T>, APIButtonComponentWithURL, 'type' | 'style'>(
    { type: 2, style: 5, url } as LinkButtonJson<U, T>,
    builderOptions,
  )
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testLinkButton = linkButtonBuilder('https://example.com', ['🔗', 'Link'])

/**
 * Component Premium Button
 * @param sku_id
 * @param builderOptions
 * @returns
 */
export const premiumButtonBuilder = <S extends string>(sku_id: S, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 2; style: 6; sku_id: S }, APIButtonComponentWithSKUId, 'type' | 'style'>(
    { type: 2, style: 6, sku_id },
    builderOptions,
  )
//const testPremiumButton = premiumButtonBuilder('test_sku_id')

//const testActionRow = actionRowBuilder([linkButtonBuilder('https://example.com')]).components([buttonBuilder('id', 'Btn', 3).style(2).custom_value('value').disabled(true)])

type StringSelectOptionContext = string | readonly [emoji: string, label: string]
type StringSelectOptionJson<V extends string, T extends StringSelectOptionContext> = T extends string
  ? { label: T; value: V }
  : T extends readonly [emoji: infer E extends string, label: infer L extends string]
    ? { label: L; value: V; emoji: { name: E } }
    : never

/**
 * Child Component String Select Option
 * @param value
 * @param label
 * @returns
 */
export const stringSelectOptionBuilder = <V extends string, const L extends StringSelectOptionContext>(
  value: V,
  label: L,
) => {
  const builder = jsonBuilder<StringSelectOptionJson<V, L>, APIStringSelectComponent['options'][number]>({
    value,
  } as StringSelectOptionJson<V, L>)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testStringSelectOption = stringSelectOptionBuilder('option1', ['🔥', 'Option'])

interface StringSelectOptionInput {
  0: string
  1: StringSelectOptionContext
}
type StringSelectOptionJsonFromInput<I extends StringSelectOptionInput> = I extends readonly [
  infer V extends string,
  infer L extends StringSelectOptionContext,
]
  ? ToJSON<ReturnType<typeof stringSelectOptionBuilder<V, L>>>
  : never

/**
 * Component String Select
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const stringSelectBuilder = <C extends string, const O extends StringSelectOptionInput>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<
    { type: 3; custom_id: C; options: StringSelectOptionJsonFromInput<O>[] },
    AddCustomValue<APIStringSelectComponent>,
    'type' | 'custom_id'
  >(
    {
      type: 3,
      custom_id,
      options: options.map(o => toJSON(stringSelectOptionBuilder(o[0], o[1]))) as StringSelectOptionJsonFromInput<O>[],
    },
    builderOptions,
  )
//const testStringSelect = stringSelectBuilder('test', [['value1', 'Option 1'], ['value2', ['🔥', 'Option 2']]]).options([stringSelectOptionBuilder('option1', ['🔥', 'Option 1']), stringSelectOptionBuilder('option2', 'Option 2')])

type TextInputContext = undefined | string
type TextInputJson<C extends string, L extends TextInputContext, S extends TextInputStyle = 1> = L extends undefined
  ? { type: 4; custom_id: C; style: S }
  : L extends string
    ? { type: 4; custom_id: C; style: S; label: L }
    : never

/**
 * Component Text Input
 * @param custom_id
 * @param label
 * @param style
 * @param builderOptions
 * @returns
 */
export const textInputBuilder = <
  C extends string,
  L extends TextInputContext = undefined,
  S extends TextInputStyle = 1,
>(
  custom_id: C,
  label: L = undefined as L,
  style: S = 1 as S,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = jsonBuilder<TextInputJson<C, L, S>, AddCustomValue<APITextInputComponent>, 'type' | 'custom_id'>(
    { type: 4, custom_id, style } as TextInputJson<C, L, S>,
    builderOptions,
  )
  if (isString(label)) builder.label(label)
  return builder
}
//const testTextInput = textInputBuilder('id', 'Text').label('Text Input').style(2).toJSON()

/**
 * Component User Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const userSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<
    { type: 5; custom_id: C },
    AddCustomValue<APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>>,
    'type' | 'custom_id'
  >({ type: 5, custom_id }, builderOptions)
//const testUserSelect = userSelectBuilder('test')

/**
 * Component Role Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const roleSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<
    { type: 6; custom_id: C },
    AddCustomValue<APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>>,
    'type' | 'custom_id'
  >({ type: 6, custom_id }, builderOptions)
//const testRoleSelect = roleSelectBuilder('test')

/**
 * Component Mentionable Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const mentionableSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<
    { type: 7; custom_id: C },
    AddCustomValue<
      APIBaseAutoPopulatedSelectMenuComponent<
        ComponentType.MentionableSelect,
        SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role
      >
    >,
    'type' | 'custom_id'
  >({ type: 7, custom_id }, builderOptions)
//const testMentionableSelect = mentionableSelectBuilder('test')

/**
 * Component Channel Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const channelSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 8; custom_id: C }, AddCustomValue<APIChannelSelectComponent>, 'type' | 'custom_id'>(
    { type: 8, custom_id },
    builderOptions,
  )
//const testChannelSelect = channelSelectBuilder('test')

/**
 * Component Section
 * @param components
 * @param accessory
 * @param builderOptions
 * @returns
 */
export const sectionBuilder = <
  const C extends JsonSerializable<APISectionComponent['components'][number]>,
  const A extends JsonSerializable<APISectionComponent['accessory']>,
>(
  components: C[],
  accessory: A,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 9; components: ToJSON<C>[]; accessory: ToJSON<A> }, AddCustomValue<APISectionComponent>, 'type'>(
    { type: 9, components: components.map(toJSON), accessory: toJSON(accessory) },
    builderOptions,
  )
//const testSection = sectionBuilder([{ type: 10, content: 'Test' }], { type: 11, media: { url: 'Test' } })

/**
 * Component Text Display
 * @param content
 * @param builderOptions
 * @returns
 */
export const textDisplayBuilder = <C extends string>(content: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 10; content: C }, AddCustomValue<APITextDisplayComponent>, 'type'>(
    { type: 10, content },
    builderOptions,
  )
//const testTextDisplay = textDisplayBuilder('This is a text display component.')
//const testSection = sectionBuilder([textDisplayBuilder('Test'), textDisplayBuilder('Second')], buttonBuilder('test', 'Button'))

/**
 * Component Thumbnail
 * @param media
 * @param builderOptions
 * @returns
 */
export const thumbnailBuilder = <M extends JsonSerializable<TemplatedThumbnailComponent['media']>>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 11; media: ToJSON<M> }, AddCustomValue<TemplatedThumbnailComponent>, 'type'>(
    { type: 11, media: toJSON(media) },
    builderOptions,
  )
//const testThumbnail = thumbnailBuilder({ url: 'https://example.com/image.png'})

/**
 * Component Media Gallery
 * @param items
 * @param builderOptions
 * @returns
 */
export const mediaGalleryBuilder = <I extends JsonSerializable<TemplatedMediaGalleryComponent['items'][number]>>(
  items: I[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 12; items: ToJSON<I>[] }, AddCustomValue<TemplatedMediaGalleryComponent>, 'type'>(
    { type: 12, items: items.map(toJSON) },
    builderOptions,
  )
//const testMediaGallery1 = mediaGalleryBuilder([{ media: { url: 'https://example.com/image1.png' } }, { media: { url: 'https://example.com/image2.png' } }])

/**
 * Component File
 * @param file MediaItem with a URL consisting only of `attachment://`
 * @param builderOptions
 * @returns
 */
export const fileBuilder = <F extends JsonSerializable<TemplatedFileComponent['file']>>(
  file: F,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 13; file: ToJSON<F> }, AddCustomValue<TemplatedFileComponent>, 'type'>(
    { type: 13, file: toJSON(file) },
    builderOptions,
  )
//const testFile = fileBuilder({ url: 'attachment://file.png' })

/**
 * Component Separator
 * @param builderOptions
 * @returns
 */
export const separatorBuilder = (builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 14 }, APISeparatorComponent, 'type'>({ type: 14 }, builderOptions)

/**
 * Component Container
 * @param components
 * @param builderOptions
 * @returns
 */
export const containerBuilder = <C extends JsonSerializable<TemplatedContainerComponent['components'][number]>>(
  components: C[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 17; components: ToJSON<C>[] }, AddCustomValue<TemplatedContainerComponent>, 'type'>(
    { type: 17, components: components.map(toJSON) },
    builderOptions,
  )

/**
 * Component Label
 * @param label
 * @param component
 * @param builderOptions
 * @returns
 */
export const labelBuilder = <L extends string, C extends JsonSerializable<APILabelComponent['component']>>(
  label: L,
  component: C,
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<{ type: 18; label: L; component: ToJSON<C> }, AddCustomValue<APILabelComponent>, 'type'>(
    { type: 18, label, component: toJSON(component) },
    builderOptions,
  )
//const testLabel = labelBuilder('Label', textInputBuilder('test', 'Input'))

/**
 * Component File Upload
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const fileUploadBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 19; custom_id: C }, AddCustomValue<APIFileUploadComponent>, 'type' | 'custom_id'>(
    { type: 19, custom_id },
    builderOptions,
  )
//const testFileUpload = fileUploadBuilder('test')

/**
 * Component Radio Group
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const radioGroupBuilder = <
  C extends string,
  O extends JsonSerializable<APIRadioGroupComponent['options'][number]>,
>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<
    { type: 21; custom_id: C; options: ToJSON<O>[] },
    AddCustomValue<APIRadioGroupComponent>,
    'type' | 'custom_id'
  >({ type: 21, custom_id, options: options.map(toJSON) }, builderOptions)

/**
 * Component Checkbox Group
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const checkboxGroupBuilder = <
  C extends string,
  O extends JsonSerializable<APICheckboxGroupComponent['options'][number]>,
>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  jsonBuilder<
    { type: 22; custom_id: C; options: ToJSON<O>[] },
    AddCustomValue<APICheckboxGroupComponent>,
    'type' | 'custom_id'
  >({ type: 22, custom_id, options: options.map(toJSON) }, builderOptions)

/**
 * Component Checkbox
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const checkboxBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  jsonBuilder<{ type: 23; custom_id: C }, AddCustomValue<APICheckboxComponent>, 'type' | 'custom_id'>(
    { type: 23, custom_id },
    builderOptions,
  )

// Child Component

/**
 * Child Component Media Gallery Item
 * @param media
 * @param builderOptions
 * @returns
 */
export const mediaGalleryItemBuilder = <M extends JsonSerializable<TemplatedMediaGalleryItem['media']>>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ media: ToJSON<M> }, APIMediaGalleryItem>({ media: toJSON(media) }, builderOptions)
//const testMediaGalleryItem = mediaGalleryItemBuilder({ url: 'https://example.com/image.png' })

/**
 * Child Component Unfurled Media Item
 * @param url
 * @param builderOptions
 * @returns
 */
export const unfurledMediaItemBuilder = <U extends TemplatedUnfurledMediaItem['url']>(
  url: U,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ url: U }, TemplatedUnfurledMediaItem>({ url }, builderOptions)
//const testUMI = unfurledMediaItemBuilder('htps://example.com/image.png')
//const testThumbnail = thumbnailBuilder(unfurledMediaItemBuilder('https://example.com/image.png'))
//const testMediaItem = mediaGalleryItemBuilder(unfurledMediaItemBuilder('https://example.com/image.png'))
//const testMediaGallery = mediaGalleryBuilder([testMediaItem])
//const testFile = fileBuilder(unfurledMediaItemBuilder('attachment://file.png'))
/*
const testContainer = containerBuilder([
  sectionBuilder(
    [textDisplayBuilder('Section 1'), textDisplayBuilder('Section 2')],
    thumbnailBuilder({ url: 'https://example.com/image.png' }),
  ),
  separatorBuilder(),
  mediaGalleryBuilder([
    mediaGalleryItemBuilder({ url: 'https://example.com/image1.png' }),
    mediaGalleryItemBuilder({ url: 'https://example.com/image2.png' }),
  ]),
  fileBuilder({ url: 'attachment://file.png' }),
])
*/

/**
 * Child Component Radio Group Option
 * @param label
 * @param value
 * @param builderOptions
 * @returns
 */
export const radioGroupOptionBuilder = <L extends APIRadioGroupOption['label'], V extends APIRadioGroupOption['value']>(
  label: L,
  value: V,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ label: L; value: V }, APIRadioGroupOption>({ label, value }, builderOptions)
//const testRadioOption = radioGroupOptionBuilder('Option 1', 'option1')
//const testRadioGroup = radioGroupBuilder('test', [radioGroupOptionBuilder('Option 1', 'option1'), radioGroupOptionBuilder('Option 2', 'option2')])

/**
 * Child Component Checkbox Group Option
 * @param label
 * @param value
 * @param builderOptions
 * @returns
 */
export const checkboxGroupOptionBuilder = <
  L extends APICheckboxGroupOption['label'],
  V extends APICheckboxGroupOption['value'],
>(
  label: L,
  value: V,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ label: L; value: V }, APICheckboxGroupOption>({ label, value }, builderOptions)
//const testCheckboxOption = checkboxGroupOptionBuilder('Option 1', 'option1')
//const testCheckboxGroup = checkboxGroupBuilder('test', [checkboxGroupOptionBuilder('Option 1', 'option1'), checkboxGroupOptionBuilder('Option 2', 'option2')])
