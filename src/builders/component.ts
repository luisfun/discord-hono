// biome-ignore-all lint/nursery/useExplicitType: temporary, remove in PR
// biome-ignore-all lint/correctness/noUnusedVariables: temporary, remove in PR

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
import { toJSON } from '../utils'
import { type JsonBuilder, type JsonBuilderOptions, jsonBuilder } from './json-builder'

type ExtendComponentInActionRow = APIComponentInActionRow | JsonBuilder<any, APIComponentInActionRow, any>

/**
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
type APIComponent =
  // @ts-expect-error
  | APIActionRowComponent<ExtendComponentInActionRow>
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

export const actionRowBuilder = <_ extends { type: 1; components: T }, T extends ExtendComponentInActionRow>(
  components: T[],
  options?: JsonBuilderOptions,
) => componentBuilder({ type: 1, components: components.map(toJSON) }, options)
//const testActionRow = actionRowBuilder([componentBuilder({ type: 2, style: 2, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])
//const testActionRow = actionRowBuilder([]).components([componentBuilder({ type: 2, style: 1, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])

export const buttonBuilder = <_ extends { type: 2; style: NomalButtonStyle; custom_id: T }, T extends string>(
  custom_id: T,
  style: NomalButtonStyle = 1,
  options?: JsonBuilderOptions,
) => componentBuilder({ type: 2, style, custom_id }, options)
export const buttonLinkBuilder = (url: string, options?: JsonBuilderOptions) =>
  componentBuilder<{ type: 2; style: 5; url: string }, 'type' | 'style'>({ type: 2, style: 5, url }, options)
export const buttonPremiumBuilder = (sku_id: string, options?: JsonBuilderOptions) =>
  componentBuilder<{ type: 2; style: 6; sku_id: string }, 'type' | 'style'>({ type: 2, style: 6, sku_id }, options)
//const testButton = buttonBuilder('test')
//const testButtonLink = buttonLinkBuilder('https://example.com')
//const testActionRow = actionRowBuilder([buttonLinkBuilder('https://example.com')]).components([buttonLinkBuilder('https://example.com')])

export const stringSelectBuilder = <
  _ extends { type: 3; custom_id: T; options: O },
  T extends string,
  O extends APIStringSelectComponent['options'],
>(
  custom_id: T,
  options: O,
  builderOptions?: JsonBuilderOptions,
) => componentBuilder({ type: 3, custom_id, options }, builderOptions)
//const testStringSelect = stringSelectBuilder('test', [{ label: 'Option 1', value: 'option1' }])
