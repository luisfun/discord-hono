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
import { isArray, isString, toJSON } from '../utils'
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

export const actionRowBuilder = <T extends ExtendComponentInActionRow>(components: T[], options?: JsonBuilderOptions) =>
  componentBuilder({ type: 1, components: components.map(toJSON) }, options)
//const testActionRow = actionRowBuilder([componentBuilder({ type: 2, style: 2, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])
//const testActionRow = actionRowBuilder([]).components([componentBuilder({ type: 2, style: 1, custom_id: 'test' }), { type: 2, style: 1, custom_id: 'test' }])

export function buttonBuilder<C extends string, S extends NomalButtonStyle = 1>(
  custom_id: C,
  label?: undefined,
  style?: S,
  options?: JsonBuilderOptions,
): JsonBuilder<
  { type: 2; style: S; custom_id: C },
  APIButtonComponentWithCustomId & { custom_value?: string },
  'custom_id' | 'type'
>
export function buttonBuilder<C extends string, L extends string, S extends NomalButtonStyle = 1>(
  custom_id: C,
  label: L,
  style?: S,
  options?: JsonBuilderOptions,
): JsonBuilder<
  { type: 2; style: S; custom_id: C; label: L },
  APIButtonComponentWithCustomId & { custom_value?: string },
  'custom_id' | 'type'
>
export function buttonBuilder<C extends string, E extends string, L extends string, S extends NomalButtonStyle = 1>(
  custom_id: C,
  label: [E, L],
  style?: S,
  options?: JsonBuilderOptions,
): JsonBuilder<
  { type: 2; style: S; custom_id: C; label: L; emoji: { name: E } },
  APIButtonComponentWithCustomId & { custom_value?: string },
  'custom_id' | 'type'
>
export function buttonBuilder(
  custom_id: string,
  label: string | [string, string] | undefined = undefined,
  style: NomalButtonStyle = 1,
  options?: JsonBuilderOptions,
) {
  const builder = componentBuilder({ type: 2, style, custom_id }, options)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}

export function buttonLinkBuilder<U extends string>(
  url: U,
  label?: undefined,
  options?: JsonBuilderOptions,
): JsonBuilder<{ type: 2; style: 5; url: U }, APIButtonComponentWithURL, 'type' | 'style'>
export function buttonLinkBuilder<U extends string, L extends string>(
  url: U,
  label: L,
  options?: JsonBuilderOptions,
): JsonBuilder<{ type: 2; style: 5; url: U; label: L }, APIButtonComponentWithURL, 'type' | 'style'>
export function buttonLinkBuilder<U extends string, E extends string, L extends string>(
  url: U,
  label: [E, L],
  options?: JsonBuilderOptions,
): JsonBuilder<{ type: 2; style: 5; url: U; label: L; emoji: { name: E } }, APIButtonComponentWithURL, 'type' | 'style'>
export function buttonLinkBuilder(url: string, label: string | [string, string] | undefined = undefined, options?: JsonBuilderOptions) {
  const builder = componentBuilder<{ type: 2; style: 5; url: string }, 'type' | 'style'>({ type: 2, style: 5, url }, options)
  if (isString(label)) builder.label(label)
  else if (isArray(label)) builder.label(label[1]).emoji({ name: label[0] })
  return builder
}

export const buttonPremiumBuilder = <S extends string>(sku_id: S, options?: JsonBuilderOptions) =>
  componentBuilder<{ type: 2; style: 6; sku_id: S }, 'type' | 'style'>({ type: 2, style: 6, sku_id }, options)

//const testButton = buttonBuilder('test', ['🔥', 'Fire']).custom_value('test2').delete('custom_value') //.toJSON()
//const testButtonLink = buttonLinkBuilder('https://example.com', ['🔗', 'Link'])
//const testButtonPremium = buttonPremiumBuilder('test_sku_id')
//const testActionRow = actionRowBuilder([buttonLinkBuilder('https://example.com')]).components([buttonBuilder('id', 'Btn', 3).style(2).custom_value('value').disabled(true)])

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
