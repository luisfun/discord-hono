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
import { type AddCustomValue, type JsonBuilderOptions, type JsonSerializable, makeJsonBuilder } from './json-builder'

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
export const makeActionRow = <T extends JsonSerializable<APIComponentInActionRow>>(
  components: T[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 1; components: ToJSON<T>[] }, APIActionRowComponent<APIComponentInActionRow>, 'type'>(
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
export const makeButton = <
  C extends string,
  const T extends ButtonContext = undefined,
  S extends InteractionButtonStyle = 1,
>(
  custom_id: C,
  label: T = undefined as T,
  style: S = 1 as S,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = makeJsonBuilder<
    ButtonJson<C, T, S>,
    AddCustomValue<APIButtonComponentWithCustomId>,
    'type' | 'custom_id'
  >({ type: 2, style, custom_id } as ButtonJson<C, T, S>, builderOptions)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testButton = makeButton('test', ['🔥', 'Fire']).custom_value('test2')//.delete('custom_value') //.toJSON()

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
export const makeLinkButton = <U extends string, const T extends LinkButtonContext = undefined>(
  url: U,
  label: T = undefined as T,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = makeJsonBuilder<LinkButtonJson<U, T>, APIButtonComponentWithURL, 'type' | 'style'>(
    { type: 2, style: 5, url } as LinkButtonJson<U, T>,
    builderOptions,
  )
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testLinkButton = makeLinkButton('https://example.com', ['🔗', 'Link'])

/**
 * Component Premium Button
 * @param sku_id
 * @param builderOptions
 * @returns
 */
export const makePremiumButton = <S extends string>(sku_id: S, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 2; style: 6; sku_id: S }, APIButtonComponentWithSKUId, 'type' | 'style'>(
    { type: 2, style: 6, sku_id },
    builderOptions,
  )
//const testPremiumButton = makePremiumButton('test_sku_id')

//const testActionRow = makeActionRow([makeLinkButton('https://example.com')]).components([makeButton('id', 'Btn', 3).style(2).custom_value('value').disabled(true)])

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
export const makeStringSelectOption = <V extends string, const L extends StringSelectOptionContext>(
  value: V,
  label: L,
) => {
  const builder = makeJsonBuilder<StringSelectOptionJson<V, L>, APIStringSelectComponent['options'][number]>({
    value,
  } as StringSelectOptionJson<V, L>)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}
//const testStringSelectOption = makeStringSelectOption('option1', ['🔥', 'Option'])

interface StringSelectOptionInput {
  0: string
  1: StringSelectOptionContext
}
type StringSelectOptionJsonFromInput<I extends StringSelectOptionInput> = I extends readonly [
  infer V extends string,
  infer L extends StringSelectOptionContext,
]
  ? ToJSON<ReturnType<typeof makeStringSelectOption<V, L>>>
  : never

/**
 * Component String Select
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const makeStringSelect = <C extends string, const O extends StringSelectOptionInput>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<
    { type: 3; custom_id: C; options: StringSelectOptionJsonFromInput<O>[] },
    AddCustomValue<APIStringSelectComponent>,
    'type' | 'custom_id'
  >(
    {
      type: 3,
      custom_id,
      options: options.map(o => makeStringSelectOption(o[0], o[1]).toJSON()) as StringSelectOptionJsonFromInput<O>[],
    },
    builderOptions,
  )
//const testStringSelect = makeStringSelect('test', [['value1', 'Option 1'], ['value2', ['🔥', 'Option 2']]]).options([makeStringSelectOption('option1', ['🔥', 'Option 1']), makeStringSelectOption('option2', 'Option 2')])

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
export const makeTextInput = <C extends string, L extends TextInputContext = undefined, S extends TextInputStyle = 1>(
  custom_id: C,
  label: L = undefined as L,
  style: S = 1 as S,
  builderOptions?: JsonBuilderOptions,
) => {
  const builder = makeJsonBuilder<TextInputJson<C, L, S>, AddCustomValue<APITextInputComponent>, 'type' | 'custom_id'>(
    { type: 4, custom_id, style } as TextInputJson<C, L, S>,
    builderOptions,
  )
  if (isString(label)) builder.label(label)
  return builder
}
//const testTextInput = makeTextInput('id', 'Text').label('Text Input').style(2).toJSON()

/**
 * Component User Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeUserSelect = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<
    { type: 5; custom_id: C },
    AddCustomValue<APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>>,
    'type' | 'custom_id'
  >({ type: 5, custom_id }, builderOptions)
//const testUserSelect = makeUserSelect('test')

/**
 * Component Role Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeRoleSelect = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<
    { type: 6; custom_id: C },
    AddCustomValue<APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>>,
    'type' | 'custom_id'
  >({ type: 6, custom_id }, builderOptions)
//const testRoleSelect = makeRoleSelect('test')

/**
 * Component Mentionable Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeMentionableSelect = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<
    { type: 7; custom_id: C },
    AddCustomValue<
      APIBaseAutoPopulatedSelectMenuComponent<
        ComponentType.MentionableSelect,
        SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role
      >
    >,
    'type' | 'custom_id'
  >({ type: 7, custom_id }, builderOptions)
//const testMentionableSelect = makeMentionableSelect('test')

/**
 * Component Channel Select
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeChannelSelect = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 8; custom_id: C }, AddCustomValue<APIChannelSelectComponent>, 'type' | 'custom_id'>(
    { type: 8, custom_id },
    builderOptions,
  )
//const testChannelSelect = makeChannelSelect('test')

/**
 * Component Section
 * @param components
 * @param accessory
 * @param builderOptions
 * @returns
 */
export const makeSection = <
  const C extends JsonSerializable<APISectionComponent['components'][number]>,
  const A extends JsonSerializable<APISectionComponent['accessory']>,
>(
  components: C[],
  accessory: A,
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<
    { type: 9; components: ToJSON<C>[]; accessory: ToJSON<A> },
    AddCustomValue<APISectionComponent>,
    'type'
  >({ type: 9, components: components.map(toJSON), accessory: toJSON(accessory) }, builderOptions)
//const testSection = makeSection([{ type: 10, content: 'Test' }], { type: 11, media: { url: 'Test' } })

/**
 * Component Text Display
 * @param content
 * @param builderOptions
 * @returns
 */
export const makeTextDisplay = <C extends string>(content: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 10; content: C }, AddCustomValue<APITextDisplayComponent>, 'type'>(
    { type: 10, content },
    builderOptions,
  )
//const testTextDisplay = makeTextDisplay('This is a text display component.')
//const testSection = makeSection([makeTextDisplay('Test'), makeTextDisplay('Second')], makeButton('test', 'Button'))

/**
 * Component Thumbnail
 * @param media
 * @param builderOptions
 * @returns
 */
export const makeThumbnail = <M extends JsonSerializable<TemplatedThumbnailComponent['media']>>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 11; media: ToJSON<M> }, AddCustomValue<TemplatedThumbnailComponent>, 'type'>(
    { type: 11, media: toJSON(media) },
    builderOptions,
  )
//const testThumbnail = makeThumbnail({ url: 'https://example.com/image.png'})

/**
 * Component Media Gallery
 * @param items
 * @param builderOptions
 * @returns
 */
export const makeMediaGallery = <I extends JsonSerializable<TemplatedMediaGalleryComponent['items'][number]>>(
  items: I[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 12; items: ToJSON<I>[] }, AddCustomValue<TemplatedMediaGalleryComponent>, 'type'>(
    { type: 12, items: items.map(toJSON) },
    builderOptions,
  )
//const testMediaGallery1 = makeMediaGallery([{ media: { url: 'https://example.com/image1.png' } }, { media: { url: 'https://example.com/image2.png' } }])

/**
 * Component File
 * @param file MediaItem with a URL consisting only of `attachment://`
 * @param builderOptions
 * @returns
 */
export const makeFile = <F extends JsonSerializable<TemplatedFileComponent['file']>>(
  file: F,
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 13; file: ToJSON<F> }, AddCustomValue<TemplatedFileComponent>, 'type'>(
    { type: 13, file: toJSON(file) },
    builderOptions,
  )
//const testFile = makeFile({ url: 'attachment://file.png' })

/**
 * Component Separator
 * @param builderOptions
 * @returns
 */
export const makeSeparator = (builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 14 }, APISeparatorComponent, 'type'>({ type: 14 }, builderOptions)

/**
 * Component Container
 * @param components
 * @param builderOptions
 * @returns
 */
export const makeContainer = <C extends JsonSerializable<TemplatedContainerComponent['components'][number]>>(
  components: C[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 17; components: ToJSON<C>[] }, AddCustomValue<TemplatedContainerComponent>, 'type'>(
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
export const makeLabel = <L extends string, C extends JsonSerializable<APILabelComponent['component']>>(
  label: L,
  component: C,
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<{ type: 18; label: L; component: ToJSON<C> }, AddCustomValue<APILabelComponent>, 'type'>(
    { type: 18, label, component: toJSON(component) },
    builderOptions,
  )
//const testLabel = makeLabel('Label', textInputBuilder('test', 'Input'))

/**
 * Component File Upload
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeFileUpload = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 19; custom_id: C }, AddCustomValue<APIFileUploadComponent>, 'type' | 'custom_id'>(
    { type: 19, custom_id },
    builderOptions,
  )
//const testFileUpload = makeFileUpload('test')

/**
 * Child Component Radio Group Option
 * @param value
 * @param label
 * @param builderOptions
 * @returns
 */
export const makeRadioGroupOption = <V extends APIRadioGroupOption['value'], L extends APIRadioGroupOption['label']>(
  value: V,
  label: L,
  builderOptions?: JsonBuilderOptions,
) => makeJsonBuilder<{ value: V; label: L }, APIRadioGroupOption>({ value, label }, builderOptions)
//const testRadioOption = makeRadioGroupOption('Option 1', 'option1')

interface RadioGroupOptionInput {
  0: string
  1: string
}
type RadioGroupOptionJsonFromInput<I extends RadioGroupOptionInput> = I extends readonly [
  infer V extends string,
  infer L extends string,
]
  ? { label: L; value: V }
  : never

/**
 * Component Radio Group
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const makeRadioGroup = <C extends string, const O extends RadioGroupOptionInput>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<
    { type: 21; custom_id: C; options: RadioGroupOptionJsonFromInput<O>[] },
    AddCustomValue<APIRadioGroupComponent>,
    'type' | 'custom_id'
  >(
    {
      type: 21,
      custom_id,
      options: options.map(o => makeRadioGroupOption(o[0], o[1]).toJSON()) as RadioGroupOptionJsonFromInput<O>[],
    },
    builderOptions,
  )
//const testRadioGroup = makeRadioGroup('test', [['value 1', 'V1'], ['value 2', 'Display 2']])

/**
 * Child Component Checkbox Group Option
 * @param value
 * @param label
 * @param builderOptions
 * @returns
 */
export const makeCheckboxGroupOption = <
  V extends APICheckboxGroupOption['value'],
  L extends APICheckboxGroupOption['label'],
>(
  value: V,
  label: L,
  builderOptions?: JsonBuilderOptions,
) => makeJsonBuilder<{ value: V; label: L }, APICheckboxGroupOption>({ value, label }, builderOptions)
//const testCheckboxOption = makeCheckboxGroupOption('Option 1', 'option1')

interface CheckboxGroupOptionInput {
  0: string
  1: string
}
type CheckboxGroupOptionJsonFromInput<I extends CheckboxGroupOptionInput> = I extends readonly [
  infer V extends string,
  infer L extends string,
]
  ? { label: L; value: V }
  : never

/**
 * Component Checkbox Group
 * @param custom_id
 * @param options
 * @param builderOptions
 * @returns
 */
export const makeCheckboxGroup = <C extends string, const O extends CheckboxGroupOptionInput>(
  custom_id: C,
  options: O[],
  builderOptions?: JsonBuilderOptions,
) =>
  makeJsonBuilder<
    { type: 22; custom_id: C; options: CheckboxGroupOptionJsonFromInput<O>[] },
    AddCustomValue<APICheckboxGroupComponent>,
    'type' | 'custom_id'
  >(
    {
      type: 22,
      custom_id,
      options: options.map(o => makeCheckboxGroupOption(o[0], o[1]).toJSON()) as CheckboxGroupOptionJsonFromInput<O>[],
    },
    builderOptions,
  )
//const testCheckboxGroup = makeCheckboxGroup('test', [['value 1', 'V1'], ['value 2', 'Display 2']])

/**
 * Component Checkbox
 * @param custom_id
 * @param builderOptions
 * @returns
 */
export const makeCheckbox = <C extends string>(custom_id: C, builderOptions?: JsonBuilderOptions) =>
  makeJsonBuilder<{ type: 23; custom_id: C }, AddCustomValue<APICheckboxComponent>, 'type' | 'custom_id'>(
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
export const makeMediaGalleryItem = <M extends JsonSerializable<TemplatedMediaGalleryItem['media']>>(
  media: M,
  builderOptions?: JsonBuilderOptions,
) => makeJsonBuilder<{ media: ToJSON<M> }, APIMediaGalleryItem>({ media: toJSON(media) }, builderOptions)
//const testMediaGalleryItem = makeMediaGalleryItem({ url: 'https://example.com/image.png' })

/**
 * Child Component Unfurled Media Item
 * @param url
 * @param builderOptions
 * @returns
 */
export const makeUnfurledMediaItem = <U extends TemplatedUnfurledMediaItem['url']>(
  url: U,
  builderOptions?: JsonBuilderOptions,
) => makeJsonBuilder<{ url: U }, TemplatedUnfurledMediaItem>({ url }, builderOptions)
//const testUMI = makeUnfurledMediaItem('htps://example.com/image.png')
//const testThumbnail = makeThumbnail(makeUnfurledMediaItem('https://example.com/image.png'))
//const testMediaItem = makeMediaGalleryItem(makeUnfurledMediaItem('https://example.com/image.png'))
//const testMediaGallery = makeMediaGallery([testMediaItem])
//const testFile = makeFile(makeUnfurledMediaItem('attachment://file.png'))
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
