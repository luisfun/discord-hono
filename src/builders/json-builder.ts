import type { Simplify } from '../types'
import { CUSTOM_ID_SEPARATOR, isArray, isProto, newError, toJSON } from '../utils'

/*
 * jsonBuilder
 * const builder = jsonBuilder({ type: 1, custom_id: 'test' })
 * jsonBuilderの引数は、特定の型でガードレールがかけられている
 * これにより作成されたbuilderは、型情報として、{ type: 1, custom_id: 'test' }を持つ
 */

type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]

type ResolvedToJSON<V> = V extends Array<infer U> ? ResolvedToJSON<U>[] : V extends { toJSON(): infer R } ? R : V

type CustomIdString<I, V> = V extends undefined
  ? I
  : `${Extract<I, string>}${typeof CUSTOM_ID_SEPARATOR}${Extract<V, string>}`

type JoinedCustomId<T extends object> = Simplify<{
  [K in keyof T as K extends 'custom_value' ? never : K]: K extends 'custom_id'
    ? CustomIdString<T[K], T extends { custom_value?: any } ? T['custom_value'] : undefined>
    : T[K]
}>

export interface JsonBuilderOptions {
  deepCopy?: boolean
}

export type JsonBuilder<T extends object, M extends object, E extends string = never> = {
  toJSON(): 'custom_value' extends keyof M ? JoinedCustomId<T> : T
  delete<K extends OptionalKeys<M>>(key: K): JsonBuilder<{ [P in keyof T as P extends K ? never : P]: T[P] }, M, E>
  //set<K extends Exclude<keyof M, E>>(key: K, value: M[K]): JsonBuilder<T & { [P in K]: M[K] }, M, E>
} & {
  [K in keyof Required<M> as K extends E ? never : K]: <V extends Exclude<Required<M>[K], undefined>>(
    value: V,
  ) => JsonBuilder<{ [P in keyof T | K]: P extends K ? ResolvedToJSON<V> : P extends keyof T ? T[P] : never }, M, E>
}

export const jsonBuilder = <const T extends object, M extends object, E extends string = never>(
  initial: T,
  options?: JsonBuilderOptions,
): JsonBuilder<T, M, E> => {
  const data = (options?.deepCopy ? globalThis.structuredClone(initial) : { ...initial }) as Record<
    PropertyKey,
    unknown
  >
  const proxy = new Proxy(
    {},
    {
      get(target: {}, prop: string | symbol): unknown {
        switch (prop) {
          case 'toJSON': {
            const { custom_id, custom_value, ...rest } = data
            if (custom_id || custom_value)
              // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
              rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
            return () => (options?.deepCopy ? globalThis.structuredClone(rest) : rest)
          }
          case 'delete':
            return (key: PropertyKey) => {
              delete data[key]
              return proxy
            }
          /*
          case 'set':
            return (key: keyof M, value: M[keyof M]) => {
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
  ) as JsonBuilder<T, M, E>
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
