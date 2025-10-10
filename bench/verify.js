// @ts-check

import { bench, boxplot, compact, run, summary } from 'mitata'
import pkg from '../package.json' with { type: 'json' }

/**
 * @param {string} hex
 * @returns {Uint8Array}
 */
const hex2bin = hex => {
  const len = hex.length
  const bin = new Uint8Array(len >> 1)
  for (let i = 0; i < len; i += 2) bin[i >> 1] = parseInt(hex.slice(i, i + 2), 16)
  return bin
}

/**
 * @param {string} hex
 * @returns {Uint8Array}
 */
const hex2binNext = hex => new Uint8Array((hex.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16)))
// const hex2bin = Uint8Array.fromHex // ES2025

const benchItems = [
  { ver: pkg.devDependencies['discord-hono'], func: hex2bin },
  { ver: 'next', func: hex2binNext },
]

const benchmarks = () => {
  for (const { ver, func } of benchItems) {
    bench(`hex2bin: ${ver}`, async () => {
      func('1234123412341234123412341234123412341234123412341234123412341234') // 64 hex chars
    }).gc(false) // Feels more stable than the default (once) when set to false
  }
}

compact(benchmarks) // warm-up
boxplot(() => summary(benchmarks))

await run()
