// biome-ignore-all lint/nursery/useExplicitType: 一時的 PR時に削除

import { CUSTOM_ID_SEPARATOR, isProto, newError } from '../utils'

/*
 * jsonFactory
 * const factory = jsonFactory({ type: 1, custom_id: 'test' })
 * jsonFactoryの引数は、特定の型でガードレールがかけられている
 * これにより作成されたfactoryは、型情報として、{ type: 1, custom_id: 'test' }を持つ
 */

type JsonFactory<T extends Record<string, unknown>> = {
  toJSON(): T
} & {
  [K in keyof Required<T>]: (value: Exclude<Required<T>[K], undefined>) => JsonFactory<T>
}

export const jsonFactory = <T extends Record<string, unknown>>(initial: T): JsonFactory<T> => {
  const data = { ...initial } as Record<string, unknown>
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop !== 'string' || isProto(prop)) throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_id, custom_value, ...rest } = data
          if (custom_id || custom_value)
            // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
            rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
          return () => rest as T
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
