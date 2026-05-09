// biome-ignore-all lint/nursery/useExplicitType: 一時的 PR時に削除

import { CUSTOM_ID_SEPARATOR, isArray, isProto, newError, toJSON } from '../utils'

/*
 * jsonBuilder
 * const builder = jsonBuilder({ type: 1, custom_id: 'test' })
 * jsonBuilderの引数は、特定の型でガードレールがかけられている
 * これにより作成されたbuilderは、型情報として、{ type: 1, custom_id: 'test' }を持つ
 */

type RemoveCustomValue<T> = T extends any ? { [K in keyof T as K extends 'custom_value' ? never : K]: T[K] } : never

type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]

export interface JsonBuilderOptions {
  deepCopy?: boolean
}

// We would like to use 'T extends Record<PropertyKey, unknown>', but Record makes all properties required, so we use T extends object instead
export type JsonBuilder<I extends object, T extends object, E extends string = never> = {
  toJSON(): RemoveCustomValue<T>
  delete<K extends OptionalKeys<T>>(key: K): JsonBuilder<I, T, E>
  //set<K extends Exclude<keyof T, E>>(key: K, value: T[K]): JsonBuilder<I, T, E>
} & {
  [K in keyof Required<T> as K extends E ? never : K]: (
    value: Exclude<Required<T>[K], undefined>,
  ) => JsonBuilder<I, T, E>
}

export const jsonBuilder = <const I extends object, T extends Record<PropertyKey, unknown>, E extends string = never>(
  initial: I,
  options?: JsonBuilderOptions,
): JsonBuilder<I, T, E> => {
  const data = options?.deepCopy
    ? (globalThis.structuredClone(initial) as Record<PropertyKey, unknown>)
    : ({ ...initial } as Record<PropertyKey, unknown>)
  const proxy = new Proxy(
    {},
    {
      get(target, prop) {
        switch (prop) {
          case 'toJSON': {
            const { custom_id, custom_value, ...rest } = data
            if (custom_id || custom_value)
              // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
              rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
            return () => (options?.deepCopy ? globalThis.structuredClone(rest) : rest) as RemoveCustomValue<T>
          }
          case 'delete':
            return (key: Exclude<OptionalKeys<T>, E>) => {
              delete data[key]
              return proxy
            }
          /*
          case 'set':
            return (key: 'delete', value: T['delete']) => {
              if (isProto(prop)) throw newError('jsonBuilder', `Invalid key: ${String(prop)}`)
              data[key] = value
              return proxy
            }
          */
          default:
            if (isProto(prop)) throw newError('jsonBuilder', `Invalid key: ${String(prop)}`)
            if (prop in Object.prototype) return Reflect.get(target, prop, proxy)
            return (value: unknown) => {
              data[prop] = isArray(value) ? value.map(toJSON) : toJSON(value)
              return proxy
            }
        }
      },
    },
  ) as JsonBuilder<I, T, E>
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
