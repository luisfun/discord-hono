// biome-ignore-all lint/nursery/useExplicitType: 一時的 PR時に削除

import { CUSTOM_ID_SEPARATOR, isProto, newError } from '../utils'

/*
 * jsonBuilder
 * const builder = jsonBuilder({ type: 1, custom_id: 'test' })
 * jsonBuilderの引数は、特定の型でガードレールがかけられている
 * これにより作成されたbuilderは、型情報として、{ type: 1, custom_id: 'test' }を持つ
 */

type RemoveCustomValue<T> = T extends any ? { [K in keyof T as K extends 'custom_value' ? never : K]: T[K] } : never

type toJSONOptions = {
  clone?: boolean
}

export type JsonBuilder<T extends Record<PropertyKey, unknown>, E extends string = never> = {
  toJSON(options?: toJSONOptions): RemoveCustomValue<T>
} & {
  [K in keyof Required<T> as K extends E ? never : K]: (value: Exclude<Required<T>[K], undefined>) => JsonBuilder<T, E>
}

export const jsonBuilder = <T extends Record<PropertyKey, unknown>, E extends string = never>(
  initial: T,
): JsonBuilder<T, E> => {
  const data = { ...initial } as Record<PropertyKey, unknown>
  const proxy = new Proxy(
    {},
    {
      get(target, prop) {
        if (isProto(prop)) throw newError('jsonBuilder', `Invalid key: ${String(prop)}`)
        if (prop in Object.prototype) return Reflect.get(target, prop, proxy)
        if (prop === 'toJSON') {
          const { custom_id, custom_value, ...rest } = data
          if (custom_id || custom_value)
            // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
            rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
          return (options?: toJSONOptions) =>
            (options?.clone ? globalThis.structuredClone(rest) : rest) as RemoveCustomValue<T>
        }
        return (value: unknown) => {
          data[prop] = value
          return proxy
        }
      },
    },
  ) as JsonBuilder<T, E>
  return proxy
}

/* 利用のされかた
jsonBuilderは、他のビルダークラスの基底クラスとして利用されることを想定している
createComponentの実態をjsonBuilderとし、型情報を付与することで、ComponentBuilderクラスのようなビルダークラスを作成することができる

const builder = jsonBuilder({ type: 1, custom_id: 'test' })
builder.custom_value('test-value')
builder.key_name(['value1', 'value2']) // 型で許可されているキーならなんでも受け入れる
const json = builder.toJSON() // toJSONは、builderに保持されている値を元に、特定のルールに従ってJSONオブジェクトを生成する

builder.key_not_defined('value') // 型で許可されていないキーはTSエラーを出力
*/
/*
type AttachToJSON<T extends Record<string, unknown>> = { toJSON(): T } & T

export const attachToJSON = <T extends Record<string, unknown>>(initial: T): AttachToJSON<T> => ({
  ...initial,
  toJSON() {
    const { custom_id, custom_value, toJSON, ...rest } = this
    if (custom_id || custom_value)
      // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
      rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
    return rest as T
  },
})
*/
