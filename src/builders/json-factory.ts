// biome-ignore-all  lint/nursery/useExplicitType: 一時的

import { CUSTOM_ID_SEPARATOR, isProto, newError } from '../utils'

/*
 * jsonFactory
 * const factory = jsonFactory({ type: 1, custom_id: 'test' })
 * jsonFactoryの引数は、特定の型でガードレールがかけられている
 * これにより作成されたfactoryは、型情報として、{ type: 1, custom_id: 'test' }を持つ
 */

const protoNames = (proto: Object) => Object.getOwnPropertyNames(proto)
const protoSet = new Set([
  ...protoNames(Object.prototype),
  ...protoNames(Function.prototype),
  ...protoNames(Promise.prototype),
])
const isUnstableProto = (prop: string) => protoSet.has(prop)

export type JsonFactory<T extends {}> = {
  toJSON(): T
} & {
  [K in keyof Required<T>]: (value: Exclude<Required<T>[K], undefined>) => JsonFactory<T>
}

export const jsonFactory = <T extends {}>(initial: T, keys: (keyof T)[]): JsonFactory<T> => {
  const data = { ...initial } as Record<string, any>
  const builder: JsonFactory<T> = {
    toJSON() {
      const { custom_value, ...rest } = data
      return {
        ...rest,
        // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
        custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
      } as unknown as T
    },
  } as JsonFactory<T>

  keys.forEach(k => {
    // @ts-expect-error
    if (isProto(k) || isUnstableProto(k)) return
    // @ts-expect-error
    builder[k] = (v: unknown) => {
      // @ts-expect-error
      data[k] = v
      return builder
    }
  })

  return builder
}


export const jsonFactoryOnProxy = <T extends {}>(initial: T): JsonFactory<T> => {
  const data: Record<string, unknown> = initial
  const proxy: JsonFactory<T> = new Proxy(
    {},
    {
      get(_: {}, prop): (value: unknown) => JsonFactory<T> | T {
        if (typeof prop === 'symbol' || isProto(prop) || isUnstableProto(prop))
          throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_value, ...rest } = data
          return () =>
            ({
              ...rest,
              // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
              custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
            }) as unknown as T
        }
        return (value: unknown) => {
          data[prop] = value
          return proxy
        }
      },
    },
  ) as JsonFactory<T>

  return proxy
}

/* 利用のされかた
jsonFactoryは、他のビルダークラスの基底クラスとして利用されることを想定している
createComponentの実態をjsonFactoryとし、型情報を付与することで、ComponentBuilderクラスのようなビルダークラスを作成することができる

const factory = jsonFactory({ type: 1, custom_id: 'test' })
factory.custom_value('test-value')
factory.key_name(['value1', 'value2']) // 型で許可されているキーならなんでも受け入れる
const json = factory.toJSON() // toJSONは、factoryに保持されている値を元に、特定のルールに従ってJSONオブジェクトを生成する

factory.key_not_defined('value') // 型で許可されていないキーはTSエラーを出力
*/

export const jsonFactoryWithKeys = <T extends {}>(initial: T, keys: (keyof T)[]): JsonFactory<T> => {
  const data: Record<string, unknown> = initial
  const proxy: JsonFactory<T> = new Proxy(
    {},
    {
      get(_: {}, prop): (value: unknown) => JsonFactory<T> | T {
        if (typeof prop === 'symbol' || isProto(prop) || isUnstableProto(prop))
          throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_value, ...rest } = data
          return () =>
            ({
              ...rest,
              // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
              custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
            }) as unknown as T
        }
        if (keys.includes(prop as keyof T)) {
          return (value: unknown) => {
            data[prop] = value
            return proxy
          }
        }
        throw newError('jsonFactory', `Invalid key: ${prop}`)
      },
    },
  ) as JsonFactory<T>

  return proxy
}

export const makePrototypeForKeys = (keys: string[]): object => {
  const proto: any = {}
  keys.forEach(k => {
    if (isProto(k)) return
    proto[k] = function (this: any, v: unknown) {
      this.__data[k] = v
      return this
    }
  })
  proto.toJSON = function (this: any) {
    const { custom_value, ...rest } = this.__data
    return { ...rest, custom_id: (rest.custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '') }
  }
  return proto
}

const protoCache: Map<string, object> = new Map<string, object>() // キー集合 signature -> proto

export const factoryWithSharedProto = <T extends {}>(initial: T, keys: (keyof T)[]): object => {
  const signature = keys.join('|') // 単純な signature（必要ならより堅牢に）
  let proto = protoCache.get(signature)
  if (!proto) {
    // @ts-expect-error
    proto = makePrototypeForKeys(keys)
    protoCache.set(signature, proto)
  }
  const inst: any = Object.create(proto)
  inst.__data = { ...initial }
  return inst
}
