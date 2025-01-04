// Reference
// https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

const Ed25519 = { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519', public: true } as const

const hex2bin = (hex: string) => {
  const bin = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0, len = bin.length; i < len; i++) {
    bin[i] = Number.parseInt(hex.substr(i * 2, 2), 16)
  }
  return bin
}

export const verify = async (
  body: string,
  signature: string | null,
  timestamp: string | null,
  publicKey: string,
  subtle: SubtleCrypto = crypto.subtle,
  algorithm: 'Ed25519' | typeof Ed25519 = Ed25519,
) => {
  if (!body || !signature || !timestamp) return false
  return await subtle.verify(
    'NODE-ED25519',
    await subtle.importKey('raw', hex2bin(publicKey), algorithm, true, ['verify']),
    hex2bin(signature),
    new TextEncoder().encode(timestamp + body),
  )
}
