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
//import type { ExcludeMethods } from '../types'
//import { CUSTOM_ID_SEPARATOR } from '../utils'
import { jsonFactory } from './json-factory'

/**
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
type ComponentObject =
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

type Test = Extract<ComponentObject, { type: 2; style: 1 | 2 | 3 | 4 }>

/*
type ComponentObject<T extends ComponentType> = T extends ComponentType.ActionRow
  ? APIActionRowComponent<APIComponentInActionRow>
  : T extends ComponentType.Button
    ? ComponentButtonObject<ButtonStyle>
    : T extends ComponentType.StringSelect
      ? APIStringSelectComponent
      : T extends ComponentType.TextInput
        ? APITextInputComponent
        : T extends ComponentType.UserSelect
          ? APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>
          : T extends ComponentType.RoleSelect
            ? APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>
            : T extends ComponentType.MentionableSelect
              ? APIBaseAutoPopulatedSelectMenuComponent<
                  ComponentType.MentionableSelect,
                  SelectMenuDefaultValueType.User | SelectMenuDefaultValueType.Role
                >
              : T extends ComponentType.ChannelSelect
                ? APIChannelSelectComponent
                : T extends ComponentType.Section
                  ? APISectionComponent
                  : T extends ComponentType.TextDisplay
                    ? APITextDisplayComponent
                    : T extends ComponentType.Thumbnail
                      ? APIThumbnailComponent
                      : T extends ComponentType.MediaGallery
                        ? APIMediaGalleryComponent
                        : T extends ComponentType.File
                          ? APIFileComponent
                          : T extends ComponentType.Separator
                            ? APISeparatorComponent
                            : T extends ComponentType.Container
                              ? APIContainerComponent
                              : T extends ComponentType.Label
                                ? APILabelComponent
                                : T extends ComponentType.FileUpload
                                  ? APIFileUploadComponent
                                  : T extends ComponentType.RadioGroup
                                    ? APIRadioGroupComponent
                                    : T extends ComponentType.CheckboxGroup
                                      ? APICheckboxGroupComponent
                                      : T extends ComponentType.Checkbox
                                        ? APICheckboxComponent
                                        : never
type ComponentButtonObject<S extends ButtonStyle> = S extends
  | ButtonStyle.Primary
  | ButtonStyle.Secondary
  | ButtonStyle.Success
  | ButtonStyle.Danger
  ? APIButtonComponentWithCustomId
  : S extends ButtonStyle.Link
    ? APIButtonComponentWithURL
    : S extends ButtonStyle.Premium
      ? APIButtonComponentWithSKUId
      : never
*/

type AddCustomValue<T> = T extends any
  ? 'custom_id' extends keyof T
    ? T & { custom_value?: T['custom_id'] }
    : T
  : never

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

export const createComponent = <I extends AddCustomValue<ComponentObject>>(init: I) =>
  jsonFactory<Extract<AddCustomValue<ComponentObject>, { type: I['type'] }>>(init)

const test1 = createComponent({ type: componentType.ActionRow, components: [] }).toJSON()
const test2 = createComponent({ type: componentType.Button, style: 1, custom_id: 'test' })
const test3 = createComponent({ type: componentType.Button, style: 6, sku_id: 'test' })
const test4 = createComponent({ type: componentType.TextInput, style: 1, custom_id: 'test' })
  .custom_value('test2')
  .required(true)
  .toJSON()
const test5 = createComponent({ type: componentType.StringSelect, custom_id: 'test', options: [] })
