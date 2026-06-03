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
import { isArray, isString, toJSON } from '../utils'
import { type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

type TemplatedUnfurledMediaItem = Omit<APIUnfurledMediaItem, 'url'> & {
  url: `${'http' | 'https' | 'attachment'}://${string}`
}
type TemplatedUnfurledMediaItemOnlyAttachment = Omit<APIUnfurledMediaItem, 'url'> & {
  url: `attachment://${string}`
}

type ExtendedComponentInActionRow =
  | APIComponentInActionRow
  | JsonBuilder<APIComponentInActionRow, APIComponentInActionRow, any>

type ExtendedSectionComponent = Omit<APISectionComponent, 'components' | 'accessory'> & {
  components:
    | APISectionComponent['components']
    | JsonBuilder<APISectionComponent['components'][number], APISectionComponent['components'][number], any>[]
  accessory:
    | APISectionComponent['accessory']
    | JsonBuilder<APISectionComponent['accessory'], APISectionComponent['accessory'], any>
}

type ExtendedThumbnailComponent = Omit<APIThumbnailComponent, 'media'> & {
  media: TemplatedUnfurledMediaItem | JsonBuilder<TemplatedUnfurledMediaItem, TemplatedUnfurledMediaItem, any>
}

type ExtendedMediaGalleryItem = Omit<APIMediaGalleryItem, 'media'> & {
  media: TemplatedUnfurledMediaItem | JsonBuilder<TemplatedUnfurledMediaItem, TemplatedUnfurledMediaItem, any>
}
type TemplatedMediaGalleryItem = Omit<APIMediaGalleryItem, 'media'> & { media: TemplatedUnfurledMediaItem }

type ExtendedMediaGalleryComponent = Omit<APIMediaGalleryComponent, 'items'> & {
  items: (TemplatedMediaGalleryItem | JsonBuilder<TemplatedMediaGalleryItem, TemplatedMediaGalleryItem, any>)[]
}
type TemplatedMediaGalleryComponent = Omit<APIMediaGalleryComponent, 'items'> & {
  items: TemplatedMediaGalleryItem[]
}

type ExtendedFileComponent = Omit<APIFileComponent, 'file'> & {
  file:
    | TemplatedUnfurledMediaItemOnlyAttachment
    | JsonBuilder<TemplatedUnfurledMediaItemOnlyAttachment, TemplatedUnfurledMediaItemOnlyAttachment, any>
}
type TemplatedFileComponent = Omit<APIFileComponent, 'file'> & {
  file: TemplatedUnfurledMediaItemOnlyAttachment
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

type ExtendedContainerComponent = Omit<APIContainerComponent, 'components'> & {
  components: (
    | TemplatedComponentInContainer
    | JsonBuilder<TemplatedComponentInContainer, TemplatedComponentInContainer, any>
  )[]
}

type ExtendedLabelComponent = Omit<APILabelComponent, 'component'> & {
  component:
    | APILabelComponent['component']
    | JsonBuilder<APILabelComponent['component'], APILabelComponent['component'], any>
}

type ExtendedRadioGroupComponent = Omit<APIRadioGroupComponent, 'options'> & {
  options: (APIRadioGroupOption | JsonBuilder<APIRadioGroupOption, APIRadioGroupOption, any>)[]
}

type ExtendedCheckboxGroupComponent = Omit<APICheckboxGroupComponent, 'options'> & {
  options: (APICheckboxGroupOption | JsonBuilder<APICheckboxGroupOption, APICheckboxGroupOption, any>)[]
}

/**
 * @see https://docs.discord.com/developers/components/reference#component-object
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
type APIComponent =
  // @ts-expect-erro
  | APIActionRowComponent<APIComponentInActionRow>
  | APIButtonComponentWithCustomId
  | APIButtonComponentWithURL
  | APIButtonComponentWithSKUId
  | APIStringSelectComponent
  | APITextInputComponent
  | APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>
  | APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>
  | APIBaseAutoPopulatedSelectMenuComponent<
      ComponentType.MentionableSelect,
      SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role
    >
  | APIChannelSelectComponent
  | APISectionComponent
  | APITextDisplayComponent
  | APIThumbnailComponent
  | APIMediaGalleryComponent
  | APIFileComponent
  | APISeparatorComponent
  | APIContainerComponent
  | APILabelComponent
  | APIFileUploadComponent
  | APIRadioGroupComponent
  | APICheckboxGroupComponent
  | APICheckboxComponent

type InteractionButtonStyle = ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger

type AddCustomValue<T> = T extends any
  ? 'custom_id' extends keyof T
    ? T & { custom_value?: T['custom_id'] }
    : T
  : never

type ComponentObject<I extends AddCustomValue<APIComponent>> = Extract<
  AddCustomValue<APIComponent>,
  ComponentType.Button extends I['type']
    ? {
        type: I['type']
        style: 'style' extends keyof I
          ? I['style'] extends InteractionButtonStyle
            ? InteractionButtonStyle
            : I['style']
          : never
      }
    : { type: I['type'] }
>

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
} as const

export const buttonStyle = {
  Primary: 1,
  Secondary: 2,
  Success: 3,
  Danger: 4,
  Link: 5,
  Premium: 6,
} as const

export const textInputStyle = {
  Short: 1,
  Paragraph: 2,
} as const

// biome-ignore-start lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.

/**
 * Accepts raw JSON or the result of a builder's toJSON().
 * @param init
 * @param options
 * @returns
 */
export const componentBuilder = <I extends AddCustomValue<APIComponent>, E extends string = 'type' | 'custom_id'>(
  init: I & Record<Exclude<keyof I, keyof ComponentObject<I>>, never>,
  options?: JsonBuilderOptions,
) => jsonBuilder<I, ComponentObject<I>, E>(init, options)

//const test1 = componentBuilder({ type: componentType.ActionRow, components: [] }).toJSON()
//const test2 = componentBuilder({ type: componentType.Button, style: 1, custom_id: 'test', error_key: 'test', custom_value: 'test' })
//const test3 = componentBuilder({ type: componentType.Button, style: 6, sku_id: 'test' })
//const test4 = componentBuilder({ type: componentType.TextInput, style: 1, custom_id: 'test' })
//  .custom_value('test2')
//  .required(true)
//  .toJSON()
//const test5 = componentBuilder({ type: componentType.StringSelect, custom_id: 'test', options: [] })

export const actionRowBuilder = <T extends ExtendedComponentInActionRow>(
  components: T[],
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 1, components: components.map(toJSON) }, builderOptions)
//const testActionRow = actionRowBuilder([componentBuilder({ type: 2, style: 2, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])
//const testActionRow = actionRowBuilder([]).components([componentBuilder({ type: 2, style: 1, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])

interface ButtonBuilder {
  <C extends string, S extends InteractionButtonStyle = 1>(
    custom_id: C,
    label?: undefined,
    style?: S,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<
    { type: 2; style: S; custom_id: C },
    AddCustomValue<APIButtonComponentWithCustomId>,
    'type' | 'custom_id'
  >
  <C extends string, L extends string, S extends InteractionButtonStyle = 1>(
    custom_id: C,
    label: L,
    style?: S,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<
    { type: 2; style: S; custom_id: C; label: L },
    AddCustomValue<APIButtonComponentWithCustomId>,
    'type' | 'custom_id'
  >
  <C extends string, E extends string, L extends string, S extends InteractionButtonStyle = 1>(
    custom_id: C,
    label: [emoji: E, label: L],
    style?: S,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<
    { type: 2; style: S; custom_id: C; label: L; emoji: { name: E } },
    AddCustomValue<APIButtonComponentWithCustomId>,
    'type' | 'custom_id'
  >
}
interface ButtonBuilderInit {
  type: 2
  style: InteractionButtonStyle
  custom_id: string
  label: string
  emoji: { name: string }
}

export const buttonBuilder: ButtonBuilder = (
  custom_id: string,
  label: string | [string, string] | undefined = undefined,
  style: InteractionButtonStyle = 1,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = componentBuilder({ type: 2, style, custom_id } as ButtonBuilderInit, builderOptions)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}

interface LinkButtonBuilder {
  <U extends string>(
    url: U,
    label?: undefined,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<{ type: 2; style: 5; url: U }, APIButtonComponentWithURL, 'type' | 'style'>
  <U extends string, L extends string>(
    url: U,
    label: L,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<{ type: 2; style: 5; url: U; label: L }, APIButtonComponentWithURL, 'type' | 'style'>
  <U extends string, E extends string, L extends string>(
    url: U,
    label: [emoji: E, label: L],
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<
    { type: 2; style: 5; url: U; label: L; emoji: { name: E } },
    APIButtonComponentWithURL,
    'type' | 'style'
  >
}
interface LinkButtonBuilderInit {
  type: 2
  style: 5
  url: string
  label: string
  emoji: { name: string }
}

export const linkButtonBuilder: LinkButtonBuilder = (
  url: string,
  label: string | [string, string] | undefined = undefined,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = componentBuilder({ type: 2, style: 5, url } as LinkButtonBuilderInit, builderOptions)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}

export const premiumButtonBuilder = <S extends string>(sku_id: S, builderOptions?: JsonBuilderOptions) =>
  componentBuilder<{ type: 2; style: 6; sku_id: S }, 'type' | 'style'>({ type: 2, style: 6, sku_id }, builderOptions)

//const testButton = buttonBuilder('test', ['🔥', 'Fire']).custom_value('test2').delete('custom_value') //.toJSON()
//const testLinkButton = linkButtonBuilder('https://example.com', ['🔗', 'Link'])
//const testPremiumButton = premiumButtonBuilder('test_sku_id')
//const testActionRow = actionRowBuilder([linkButtonBuilder('https://example.com')])//.components([buttonBuilder('id', 'Btn', 3).style(2).custom_value('value').disabled(true)])

export const stringSelectBuilder = <C extends string, O extends APIStringSelectComponent['options']>(
  custom_id: C,
  options: O,
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 3, custom_id, options }, builderOptions)
//const testStringSelect = stringSelectBuilder('test', [{ label: 'Option 1', value: 'option1' }])

interface TextInputBuilder {
  <C extends string, S extends TextInputStyle = 1>(
    custom_id: C,
    label?: undefined,
    style?: S,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<{ type: 4; custom_id: C; style: S }, AddCustomValue<APITextInputComponent>, 'type' | 'custom_id'>
  <C extends string, L extends string, S extends TextInputStyle = 1>(
    custom_id: C,
    label: L,
    style?: S,
    builderOptions?: JsonBuilderOptions,
  ): JsonBuilder<
    { type: 4; custom_id: C; style: S; label: L },
    AddCustomValue<APITextInputComponent>,
    'type' | 'custom_id'
  >
}
interface TextInputBuilderInit {
  type: 4
  custom_id: string
  style: TextInputStyle
  label: string
}

export const textInputBuilder: TextInputBuilder = (
  custom_id: string,
  label: string | undefined = undefined,
  style: TextInputStyle = 1,
  builderOptions?: JsonBuilderOptions,
) =>
  componentBuilder(
    (label ? { type: 4, custom_id, style, label } : { type: 4, custom_id, style }) as TextInputBuilderInit,
    builderOptions,
  )
//const testTextInput = textInputBuilder('test').label('Text Input').style(2).toJSON()

export const userSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 5, custom_id }, builderOptions)
//const testUserSelect = userSelectBuilder('test')

export const roleSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 6, custom_id }, builderOptions)
//const testRoleSelect = roleSelectBuilder('test')

export const mentionableSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 7, custom_id }, builderOptions)
//const testMentionableSelect = mentionableSelectBuilder('test')

export const channelSelectBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 8, custom_id }, builderOptions)
//const testChannelSelect = channelSelectBuilder('test')

export const sectionBuilder = <
  C extends ExtendedSectionComponent['components'][number],
  A extends ExtendedSectionComponent['accessory'],
>(
  components: C[],
  accessory: A,
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 9, components: components.map(toJSON), accessory: toJSON(accessory) }, builderOptions)
//const testSection = sectionBuilder([{ type: 10, content: 'Test' }], { type: 11, media: { url: 'Test' } })
//const testActionRow = actionRowBuilder([testSection])

export const textDisplayBuilder = <C extends string>(content: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 10, content }, builderOptions)
//const testTextDisplay = textDisplayBuilder('This is a text display component.')
//const testSection = sectionBuilder([textDisplayBuilder('Test'), textDisplayBuilder('Second')], buttonBuilder('test', 'Button'))

export const thumbnailBuilder = <M extends ExtendedThumbnailComponent['media']>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 11, media: toJSON(media) }, builderOptions)
//const testThumbnail = thumbnailBuilder({ url: 'https://example.com/image.png'})

export const mediaGalleryBuilder = <I extends ExtendedMediaGalleryComponent['items'][number]>(
  items: I[],
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 12, items: items.map(toJSON) }, builderOptions)
//const testMediaGallery1 = mediaGalleryBuilder([{ media: { url: 'https://example.com/image1.png' } }, { media: { url: 'https://example.com/image2.png' } }])

/**
 * Component File Builder
 * @param file MediaItem with a URL consisting only of `attachment://`
 * @param builderOptions
 * @returns
 */
export const fileBuilder = <F extends ExtendedFileComponent['file']>(file: F, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 13, file: toJSON(file) }, builderOptions)
//const testFile = fileBuilder({ url: 'attachment://file.png' })

export const separatorBuilder = (builderOptions?: JsonBuilderOptions) => componentBuilder({ type: 14 }, builderOptions)

export const containerBuilder = <C extends ExtendedContainerComponent['components'][number]>(
  components: C[],
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 17, components: components.map(toJSON) }, builderOptions)
/*
const testContainer = containerBuilder([
  sectionBuilder(
    [textDisplayBuilder('Section 1'), textDisplayBuilder('Section 2')],
    thumbnailBuilder({ url: 'https://example.com/image.png' }),
  ),
  separatorBuilder(),
  mediaGalleryBuilder([{ url: 'https://example.com/image1.png' }, { url: 'https://example.com/image2.png' }]),
  fileBuilder({ url: 'attachment://file.png' }),
])
*/

export const labelBuilder = <L extends string, C extends ExtendedLabelComponent['component']>(
  label: L,
  component: C,
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 18, label, component: toJSON(component) }, builderOptions)
//const testLabel = labelBuilder('Label', textInputBuilder('test', 'Input'))

export const fileUploadBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 19, custom_id }, builderOptions)
//const testFileUpload = fileUploadBuilder('test')

export const radioGroupBuilder = <C extends string, O extends ExtendedRadioGroupComponent['options'][number]>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 21, custom_id, options: options.map(toJSON) }, builderOptions)

export const checkboxGroupBuilder = <C extends string, O extends ExtendedCheckboxGroupComponent['options'][number]>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 22, custom_id, options: options.map(toJSON) }, builderOptions)

export const checkboxBuilder = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  componentBuilder({ type: 23, custom_id }, builderOptions)

// Child Component

export const mediaGalleryItemBuilder = <M extends ExtendedMediaGalleryItem['media']>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ media: ReturnType<typeof toJSON<M>> }, APIMediaGalleryItem>({ media: toJSON(media) }, builderOptions)
//const testMediaGalleryItem = mediaGalleryItemBuilder({ url: 'https://example.com/image.png' })

/**
 * Component: Unfurled Media Item Builder
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

export const radioGroupOptionBuilder = <L extends APIRadioGroupOption['label'], V extends APIRadioGroupOption['value']>(
  label: L,
  value: V,
  builderOptions?: JsonBuilderOptions,
) => jsonBuilder<{ label: L; value: V }, APIRadioGroupOption>({ label, value }, builderOptions)
//const testRadioOption = radioGroupOptionBuilder('Option 1', 'option1')
//const testRadioGroup = radioGroupBuilder('test', [radioGroupOptionBuilder('Option 1', 'option1'), radioGroupOptionBuilder('Option 2', 'option2')])

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

// biome-ignore-end lint/nursery/useExplicitType: Because each builder returns a JsonBuilder, explicit type annotations are redundant.
