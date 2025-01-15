import type { AnyHandler, Env, HandlerNumber } from './types'
import { errorDev } from './utils'

/**
 * @example
 * ```ts
 * const app = new DiscordHono<Env, RegExp>({HandlerMap: RegExpMap})
 * ```
 */
export class RegExpMap<
  E extends Env,
  N extends HandlerNumber = HandlerNumber,
  K = string | RegExp,
  V = AnyHandler<E, N>,
> {
  [0]: Map<K, V> | undefined;
  [2]: Map<K, V> | undefined;
  [3]: Map<K, V> | undefined;
  [4]: Map<K, V> | undefined;
  [5]: Map<K, V> | undefined
  s(num: N, key: K, value: V) {
    this[num] ??= new Map<K, V>()
    this[num].set(key, value)
    return this
  }
  g<N extends HandlerNumber>(num: N, key: string): AnyHandler<E, N> {
    const map = this[num]
    if (map) {
      // @ts-expect-error
      if (map.has(key)) return map.get(key)
      // @ts-expect-error
      for (const [k, v] of map) if (k instanceof RegExp && k.test(key)) return v
      // @ts-expect-error
      if (map.has('')) return map.get('')
    }
    throw errorDev('Handler')
  }
}

export class StringMap<E extends Env, N extends HandlerNumber = HandlerNumber, V = AnyHandler<E, N>> extends Map<
  string,
  V
> {
  s = (num: N, key: string, value: V) => this.set(`${num}${key}`, value)
  g = <N extends HandlerNumber>(num: N, key: string): AnyHandler<E, N> =>
    // @ts-expect-error
    this.get(`${num}${key}`) ??
    this.get(`${num}`) ??
    (() => {
      throw errorDev('Handler')
    })()
}
