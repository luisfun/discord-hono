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

export function toJSON<T>(): T {
  // @ts-expect-error
  const { custom_value, ...rest } = this
  return {
    ...rest,
    custom_id: (rest.custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
  }
}

export const jsonFactory = <T extends Record<string, unknown>>(initial: T, keys: string[]): JsonFactory<T> => {
  const data = { ...initial }
  const builder = {
    toJSON() {
      const { custom_value, ...rest } = data
      return {
        ...rest,
        // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
        custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
      } as unknown as T
    },
  } as JsonFactory<T>

  keys.forEach((k: keyof T) => {
    if (isProto(k)) throw newError('jsonFactory', `Invalid key: ${String(k)}`)
    // @ts-expect-error
    builder[k] = (v: Exclude<Required<T>[typeof k], undefined>) => {
      data[k] = v
      return builder
    }
  })

  return builder
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
