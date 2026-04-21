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
  ComponentType,
  SelectMenuDefaultValueType,
} from 'discord-api-types/v10'
import type { ExcludeMethods } from '../types'

/**
 * @see https://discord-api-types.dev/api/discord-api-types-v10/interface/APIBaseComponent
 */
type ComponentObject<T extends ComponentType> = T extends ComponentType.ActionRow
  ? APIActionRowComponent<APIComponentInActionRow>
  : T extends ComponentType.Button
    ? APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIButtonComponentWithSKUId
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

type AddCustomValue<T> = 'custom_id' extends keyof T
  ? T & { custom_value?: T['custom_id'] }
  : T;

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

export class Component<T extends ComponentType> {
  #obj: AddCustomValue<ComponentObject<T>>
  constructor(type: T, init: AddCustomValue<ExcludeMethods<ComponentObject<T>, 'type'>>) {
    // @ts-expect-error
    this.#obj = { ...init, type }
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop === 'toJSON') {
          return () => target.#obj
        }
        return Reflect.get(target, prop, receiver)
      },
    })
  }
}

const test1 = new Component(componentType.ActionRow, { components: [], custom_value: 'test' })
const test2 = new Component(componentType.Button, { custom_id: 'test', style: 1, custom_value: 'test' })

/*
export const ComponentC = {
  create<T extends ComponentType>(type: T, obj: ExcludeMethods<ComponentObject<T>, "type">): ComponentObject<T> {
    return { ...obj, type }
  }
}
*/

export namespace Component {
  export type ActionRow = ComponentObject<ComponentType.ActionRow>
}
