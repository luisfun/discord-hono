// Reference
// https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

const hex2bin = (hex: string) => {
  const bin = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0, len = bin.length; i < len; i++) {
    // biome-ignore lint:
    bin[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bin
}

const key = (publicKey: string) =>
  crypto.subtle.importKey(
    'raw',
    hex2bin(publicKey),
    // @ts-expect-error
    { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519', public: true },
    true,
    ['verify'],
  )

export const verify = async (body: string, signature: string | null, timestamp: string | null, publicKey: string) => {
  if (!body || !signature || !timestamp) return false
  return await crypto.subtle.verify(
    'NODE-ED25519',
    await key(publicKey),
    hex2bin(signature),
    new TextEncoder().encode(timestamp + body),
  )
}
