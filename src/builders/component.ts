// biome-ignore-all lint/nursery/useExplicitType: 一時的 PR時に削除
// biome-ignore-all lint/correctness/noUnusedVariables: 一時的 PR時に削除

import type {
  APIActionRowComponent,
  APIBaseAutoPopulatedSelectMenuComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithSKUId,
  APIButtonComponentWithURL,
  APIChannelSelectComponent,
  APICheckboxComponent,
  APICheckboxGroupComponent,
  APIComponentInActionRow,
  APIContainerComponent,
  APIFileComponent,
  APIFileUploadComponent,
  APILabelComponent,
  APIMediaGalleryComponent,
  APIRadioGroupComponent,
  APISectionComponent,
  APISeparatorComponent,
  APIStringSelectComponent,
  APITextDisplayComponent,
  APITextInputComponent,
  APIThumbnailComponent,
  ButtonStyle,
  ComponentType,
  SelectMenuDefaultValueType,
} from 'discord-api-types/v10'
import { type JsonBuilder, jsonBuilder } from './json-builder'

/**
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
type APIComponent =
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

type NomalButtonStyle = ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger

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
        style: 'style' extends keyof I ? (I['style'] extends NomalButtonStyle ? NomalButtonStyle : I['style']) : never
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

export const componentBuilder = <
  const P extends AddCustomValue<APIComponent>,
  C extends ComponentObject<P> = ComponentObject<P>,
>(
  init: P & Record<Exclude<keyof P, keyof C>, never>,
) => jsonBuilder(init) as unknown as JsonBuilder<C, 'type' | 'custom_id'>

//const test1 = componentBuilder({ type: componentType.ActionRow, components: [] }).toJSON()
//const test2 = componentBuilder({ type: componentType.Button, style: 1, custom_id: 'test', error_key: 'test', custom_value: 'test' })
//const test3 = componentBuilder({ type: componentType.Button, style: 6, sku_id: 'test' })
//const test4 = componentBuilder({ type: componentType.TextInput, style: 1, custom_id: 'test' })
//  .custom_value('test2')
//  .required(true)
//  .toJSON()
//const test5 = componentBuilder({ type: componentType.StringSelect, custom_id: 'test', options: [] })

export const actionRowBuilder = <_ extends { type: 1; components: T }, T extends APIComponentInActionRow>(
  components: T[],
) => componentBuilder({ type: 1, components })
//const testActionRow = actionRowBuilder([componentBuilder({ type: 2, style: 1, custom_id: 'test' }).toJSON()])

export const buttonBuilder = <_ extends { type: 2; style: NomalButtonStyle; custom_id: T }, T extends string>(
  custom_id: T,
  style: NomalButtonStyle = 1,
) => componentBuilder({ type: 2, style, custom_id })
export const buttonLinkBuilder = (url: string) => componentBuilder({ type: 2, style: 5, url })
export const buttonPremiumBuilder = (sku_id: string) => componentBuilder({ type: 2, style: 6, sku_id })
//const testButton = buttonBuilder('test')

export const stringSelectBuilder = <
  _ extends { type: 3; custom_id: T; options: O },
  T extends string,
  O extends APIStringSelectComponent['options'],
>(
  custom_id: T,
  options: O,
) => componentBuilder({ type: 3, custom_id, options })
//const testStringSelect = stringSelectBuilder('test', [{ label: 'Option 1', value: 'option1' }])
