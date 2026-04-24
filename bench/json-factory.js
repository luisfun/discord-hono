import { bench, boxplot, compact, run, summary } from 'mitata'

var CUSTOM_ID_SEPARATOR = ';'
var isProto = prop => prop === '__proto__' || prop === 'constructor' || prop === 'prototype'
var newError = (funcName, message) => new Error(`[${funcName}] ${message}`)
var protoNames = proto => Object.getOwnPropertyNames(proto)
var protoSet = /* @__PURE__ */ new Set([
  ...protoNames(Object.prototype),
  ...protoNames(Function.prototype),
  ...protoNames(Promise.prototype),
])
var isUnstableProto = prop => protoSet.has(prop)
var jsonFactory = initial => {
  const data = initial
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop === 'symbol' || isProto(prop) || isUnstableProto(prop))
          throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_value, ...rest } = data
          return () => ({
            ...rest,
            // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
            custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
          })
        }
        return value => {
          data[prop] = value
          return proxy
        }
      },
    },
  )
  return proxy
}
var jsonFactoryWithKeys = (initial, keys) => {
  const data = initial
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop === 'symbol' || isProto(prop) || isUnstableProto(prop))
          throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_value, ...rest } = data
          return () => ({
            ...rest,
            // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
            custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
          })
        }
        if (keys.includes(prop)) {
          return value => {
            data[prop] = value
            return proxy
          }
        }
        throw newError('jsonFactory', `Invalid key: ${prop}`)
      },
    },
  )
  return proxy
}
var jsonFactoryOnProto = (initial, keys) => {
  const data = { ...initial }
  const builder = {
    toJSON() {
      const { custom_value, ...rest } = data
      return {
        ...rest,
        // biome-ignore lint/complexity/useLiteralKeys: Not sure if custom_id exists
        custom_id: (rest['custom_id'] ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : ''),
      }
    },
  }
  keys.forEach(k => {
    if (isProto(k) || isUnstableProto(k)) return
    builder[k] = v => {
      data[k] = v
      return builder
    }
  })
  return builder
}
var makePrototypeForKeys = keys => {
  const proto = {}
  keys.forEach(k => {
    if (isProto(k)) return
    proto[k] = function (v) {
      this.__data[k] = v
      return this
    }
  })
  proto.toJSON = function () {
    const { custom_value, ...rest } = this.__data
    return { ...rest, custom_id: (rest.custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '') }
  }
  return proto
}
var protoCache = /* @__PURE__ */ new Map()
var factoryWithSharedProto = (initial, keys) => {
  const signature = keys.join('|')
  let proto = protoCache.get(signature)
  if (!proto) {
    proto = makePrototypeForKeys(keys)
    protoCache.set(signature, proto)
  }
  const inst = Object.create(proto)
  inst.__data = { ...initial }
  return inst
}

const benchItems = [
  { ver: 'Proxy', func: jsonFactory },
  { ver: 'ProxyWithKeys', func: jsonFactoryWithKeys },
  { ver: 'OnProto', func: jsonFactoryOnProto },
  { ver: 'SharedProto', func: factoryWithSharedProto },
]

const benchmarks = () => {
  for (const { ver, func } of benchItems) {
    bench(ver, async () => {
      for (let i = 0; i < 10; i++) {
        // @ts-expect-error
        const result = func({ type: i, custom_id: `test${i}` }, ['type', 'custom_id', 'custom_value'])
        for (let j = 0; j < 10; j++) {
          // @ts-expect-error
          result.custom_value(`test-value${j}`).toJSON()
        }
      }
    }).gc(false) // Feels more stable than the default (once) when set to false
  }
}

compact(benchmarks) // warm-up
boxplot(() => summary(benchmarks))

await run()
