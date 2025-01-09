// Reference
// https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1
// https://github.com/discord/discord-interactions-js/blob/main/src/util.ts

import { errorOther } from './utils'

const hex2bin = (hex: string) => {
  const len = hex.length
  const bin = new Uint8Array(len >> 1)
  for (let i = 0; i < len; i += 2) bin[i >> 1] = Number.parseInt(hex.substring(i, i + 2), 16)
  return bin
}

export const verify = async (body: string, signature: string | null, timestamp: string | null, publicKey: string) => {
  if (!body || !signature || !timestamp) return false
  // biome-ignore format: ternary operator
  const { subtle } =
    typeof window !== 'undefined' && window.crypto ? window.crypto :
    typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto :
    typeof crypto !== 'undefined' ? crypto : {}
  if (subtle === undefined) throw errorOther('Crypto API')
  return await subtle.verify(
    { name: 'Ed25519' },
    await subtle.importKey('raw', hex2bin(publicKey), { name: 'Ed25519' }, false, ['verify']),
    hex2bin(signature),
    new TextEncoder().encode(timestamp + body),
  )
}
