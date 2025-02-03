import type { AnyHandler, Env, HandlerNumber } from './types'
import { errorDev } from './utils'

/**
 * @example
 * ```ts
 * const app = new DiscordHono<Env, RegExp>({HandlerMap: RegExpMap})
 * ```
 */
export class RegExpMap<E extends Env> {
  [0]: Map<string | RegExp, AnyHandler<E, 0>> | undefined;
  [2]: Map<string | RegExp, AnyHandler<E, 2>> | undefined;
  [3]: Map<string | RegExp, AnyHandler<E, 3>> | undefined;
  [4]: Map<string | RegExp, AnyHandler<E, 4>> | undefined;
  [5]: Map<string | RegExp, AnyHandler<E, 5>> | undefined
  s = <N extends HandlerNumber>(num: N, key: string | RegExp, value: AnyHandler<E, N>) => {
    // @ts-expect-error
    this[num] ??= new Map<string | RegExp, AnyHandler<E, N>>()
    // @ts-expect-error
    this[num].set(key, value)
    return this
  }
  g = <N extends HandlerNumber>(num: N, key: string): AnyHandler<E, N> => {
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

export class StringMap<E extends Env> extends Map<string, AnyHandler<E, HandlerNumber>> {
  s = <N extends HandlerNumber>(num: N, key: string, value: AnyHandler<E, N>) => this.set(`${num}${key}`, value)
  g = <N extends HandlerNumber>(num: N, key: string): AnyHandler<E, N> =>
    // @ts-expect-error
    this.get(`${num}${key}`) ??
    this.get(`${num}`) ??
    (() => {
      throw errorDev('Handler')
    })()
}
