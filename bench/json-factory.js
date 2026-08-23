// @ts-check

// biome-ignore-all lint/complexity/useLiteralKeys: Not sure if custom_id exists

// biome-ignore-all lint/correctness/noUnresolvedImports: Ignore for local processing
import { CUSTOM_ID_SEPARATOR } from 'discord-hono'
import { bench, boxplot, run, summary } from 'mitata'

// @ts-expect-error
var isProto = prop => prop === '__proto__' || prop === 'constructor' || prop === 'prototype'
// @ts-expect-error
var newError = (funcName, message) => new Error(`[${funcName}] ${message}`)

// @ts-expect-error
var attachToJSON = initial => ({
  ...initial,
  toJSON() {
    const { custom_id, custom_value, toJSON: toJSON3, ...rest } = this
    if (custom_id || custom_value)
      rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
    return rest
  },
})

// @ts-expect-error
var jsonFactory = initial => {
  const data = { ...initial }
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop !== 'string' || isProto(prop)) throw newError('jsonFactory', `Invalid key: ${String(prop)}`)
        if (prop === 'toJSON') {
          const { custom_id, custom_value, ...rest } = data
          if (custom_id || custom_value)
            rest['custom_id'] = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
          return () => rest
        }
        // @ts-expect-error
        return value => {
          data[prop] = value
          return proxy
        }
      },
    },
  )
  return proxy
}

// @ts-expect-error
var jsonFactoryOnProto = (initial, keys) => {
  const data = { ...initial }
  const builder = {
    toJSON() {
      const { custom_id, custom_value, ...rest } = data
      if (custom_id || custom_value)
        rest.custom_id = (custom_id ?? '') + (custom_value ? CUSTOM_ID_SEPARATOR + custom_value : '')
      return rest
    },
  }
  // @ts-expect-error
  keys.forEach(k => {
    if (isProto(k)) return
    // @ts-expect-error
    builder[k] = v => {
      data[k] = v
      return builder
    }
  })
  return builder
}

const keys = [
  'id',
  'custom_id',
  'custom_value',
  'components',
  'style',
  'label',
  'emoji',
  'sku_id',
  'url',
  'disabled',
  'options',
  'placeholder',
  'min_values',
  'max_values',
  'required',
  'min_length',
  'max_length',
  'value',
  'default_values',
  'channel_types',
  'accessory',
  'content',
  'media',
  'description',
  'spoiler',
  'items',
  'file',
  'name',
  'size',
  'divider',
  'spacing',
  'accent_color',
  'component',
  'default',
]

const benchItems = [
  { ver: 'attachToJSON', func: attachToJSON },
  { ver: 'Proxy', func: jsonFactory },
  { ver: 'OnProto', func: jsonFactoryOnProto },
]

const forCount = [10, 10]

const benchmarks = () => {
  for (const { ver, func } of benchItems) {
    bench(ver, async () => {
      for (let i = 0; i < forCount[0]; i++) {
        const result = func({ type: i, custom_id: `test${i}` }, keys)
        for (let j = 0; j < forCount[1]; j++) {
          // @ts-expect-error
          if (ver === 'attachToJSON') result[keys.at(j % (keys.length - 1))] = `test-value${j}`
          // @ts-expect-error
          else result[keys.at(j % (keys.length - 1))](`test-value${j}`)
        }
        result.toJSON()
      }
    }).gc(false) // Feels more stable than the default (once) when set to false
  }
}

//compact(benchmarks) // warm-up
boxplot(() => summary(benchmarks))

await run()
