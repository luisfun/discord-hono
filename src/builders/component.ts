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
import type { ExcludeMethods } from '../types'
import { CUSTOM_ID_SEPARATOR } from '../utils'

/**
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
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

class ComponentClass<T extends ComponentType> {
  #obj: AddCustomValue<ComponentObject<T>>
  constructor(type: T, init: ExcludeMethods<AddCustomValue<ComponentObject<T>>, 'type'>) {
    // @ts-expect-error
    this.#obj = { ...init, type }
    return new Proxy(this, {
      get(target, prop) {
        if (prop === 'toJSON') {
          return function toJSON(): ComponentObject<T> {
            // @ts-expect-error: short code for custom_id + custom_value
            const { custom_value, ...rest } = target.#obj
            // @ts-expect-error
            return {
              ...rest,
              // @ts-expect-error
              custom_id: (rest.custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
            }
          }
        }
        return Reflect.get(target.#obj, prop)
      },
      set(target, prop, value) {
        if (prop === 'type' || prop === 'toJSON') return false
        return Reflect.set(target.#obj, prop, value)
      },
    })
  }
}

type ComponentInstance<T extends ComponentType> = ComponentClass<T> &
  ExcludeMethods<AddCustomValue<ComponentObject<T>>, 'type'> & {
    toJSON(): ComponentObject<T>
  }
type ComponentButtonInstance<S extends ButtonStyle> = ComponentClass<ComponentType.Button> &
  ExcludeMethods<AddCustomValue<ComponentButtonObject<S>>, 'type'> & {
    toJSON(): ComponentButtonObject<S>
  }

export const Component = ComponentClass as {
  new <S extends ButtonStyle>(
    type: ComponentType.Button,
    init: ExcludeMethods<AddCustomValue<ComponentButtonObject<S>>, 'type' | 'style'> & { style: S },
  ): ComponentButtonInstance<S>
  new <T extends ComponentType>(
    type: T,
    init: ExcludeMethods<AddCustomValue<ComponentObject<T>>, 'type'>,
  ): ComponentInstance<T>
}

/*
const test1 = new Component(componentType.ActionRow, { components: [] })
test1.toJSON()
const test2 = new Component(componentType.Button, { style: 1, custom_id: 'test', custom_value: 'test' })
test2.style = 4
test2.custom_value = 'test2'
const test3 = new Component(componentType.Button, { style: 6, sku_id: 'test' })
const test4 = new Component(componentType.TextInput, { style: 1, custom_id: 'test' })
test4.custom_value = 'test2'
const test5 = new Component(componentType.StringSelect, { custom_id: 'test', options: [] })
*/
//const cc = (...args: any[]) => new Component(...args)
