// Reference
// https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1
// https://github.com/discord/discord-interactions-js/blob/main/src/util.ts

import { errorOther } from './utils'

const hex2bin = (hex: string) => {
  const bin = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0; i < bin.length; i++) bin[i] = Number.parseInt(hex.substr(i * 2, 2), 16)
  return bin
}

export const verify = async (body: string, signature: string | null, timestamp: string | null, publicKey: string) => {
  if (!body || !signature || !timestamp) return false
  // biome-ignore format: ternary operator
  const subtle: SubtleCrypto | undefined =
    typeof window !== 'undefined' && window.crypto ? window.crypto.subtle :
    typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto.subtle :
    typeof crypto !== 'undefined' ? crypto.subtle :
    undefined
  if (subtle === undefined) throw errorOther('Crypto API')
  return await subtle.verify(
    { name: 'Ed25519' },
    await subtle.importKey('raw', hex2bin(publicKey), { name: 'Ed25519' }, false, ['verify']),
    hex2bin(signature),
    new TextEncoder().encode(timestamp + body),
  )
}
