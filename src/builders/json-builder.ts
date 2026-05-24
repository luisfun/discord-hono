/**
 * Security considerations
 * - Consider restricting the methods accepted by jsonBuilder not only with type constraints but also by enforcing an allowlist
 */

import type { Simplify } from '../types'
import { CUSTOM_ID_SEPARATOR, isArray, isProto, newError, toJSON } from '../utils'

type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]

type ResolvedToJSON<V> = V extends Array<infer U> ? ResolvedToJSON<U>[] : V extends { toJSON(): infer R } ? R : V

type CustomIdString<I, V> = V extends undefined
  ? I
  : `${Extract<I, string>}${typeof CUSTOM_ID_SEPARATOR}${Extract<V, string>}`

type JoinedCustomId<T extends object> = {
  [K in keyof T as K extends 'custom_value' ? never : K]: K extends 'custom_id'
    ? CustomIdString<T[K], T extends { custom_value?: any } ? T['custom_value'] : undefined>
    : T[K]
}

/**
 * {@label JsonBuilderOptions}
 */
export interface JsonBuilderOptions {
  /**
  * - true: Copy using globalThis.structuredClone
  * - false: Copy using spread syntax
   * @defaultValue false
   */
  deepCopy?: boolean
}

/**
 * @typeParam T - Input type or constraints for the input
 * @typeParam M - Type constraints expected from toJSON (used for method typings)
 * @typeParam E - Keys to exclude from M when generating methods
 *
 * {@label JsonBuilder}
 */
export type JsonBuilder<T extends object, M extends object, E extends string = never> = {
  toJSON(): 'custom_value' extends keyof M ? Simplify<JoinedCustomId<T>> : T
  delete<K extends OptionalKeys<M>>(key: K): JsonBuilder<{ [P in keyof T as P extends K ? never : P]: T[P] }, M, E>
  //set<K extends Exclude<keyof M, E>>(key: K, value: M[K]): JsonBuilder<T & { [P in K]: M[K] }, M, E>
} & {
  [K in keyof Required<M> as K extends E ? never : K]: <V extends Exclude<Required<M>[K], undefined>>(
    value: V,
  ) => JsonBuilder<{ [P in keyof T | K]: P extends K ? ResolvedToJSON<V> : P extends keyof T ? T[P] : never }, M, E>
}

/**
 * Core function to construct JSON using a chainable (fluent) API
 *
 * @typeParam {@link JsonBuilder}
 * @param initial - initial value for the JSON
 * @param options - {@link JsonBuilderOptions}
 * @returns a proxy object that supports chainable method calls
 *
 * @remarks
 * - toJSON: Method that generates the JSON object
 * - delete: Method that deletes a specific key
 * - others: Methods that accept arbitrary keys and values based on the type constraints defined in M
 */
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
