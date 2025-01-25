import { verify } from './verify'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('verify function', () => {
  const mockVerify = vi.fn()
  const mockImportKey = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('crypto', {
      subtle: {
        verify: mockVerify,
        importKey: mockImportKey
      }
    })
  })

  it('should return false if body, signature, or timestamp is missing', async () => {
    expect(await verify('body', null, 'timestamp', 'publicKey')).toBe(false)
    expect(await verify('body', 'signature', null, 'publicKey')).toBe(false)
    expect(await verify('', 'signature', 'timestamp', 'publicKey')).toBe(false)
  })

  it('should throw an error if public key is invalid', async () => {
    mockImportKey.mockRejectedValue(new Error('Ed25519 raw keys must be exactly 32-bytes'))
    await expect(verify('body', 'signature', 'timestamp', 'invalidPublicKey')).rejects.toThrow('Ed25519 raw keys must be exactly 32-bytes')
  })

  it('should call subtle.verify with correct parameters', async () => {
    const body = 'testBody'
    const signature = '1234abcd'.repeat(8) // 32バイトの署名
    const timestamp = '1234567890'
    const publicKey = '0'.repeat(64) // 32バイトの公開鍵（16進数で64文字）

    mockImportKey.mockResolvedValue('importedKey')
    mockVerify.mockResolvedValue(true)

    const result = await verify(body, signature, timestamp, publicKey)

    expect(mockImportKey).toHaveBeenCalledWith(
      'raw',
      expect.any(Uint8Array),
      { name: 'Ed25519' },
      false,
      ['verify']
    )

    expect(mockVerify).toHaveBeenCalledWith(
      { name: 'Ed25519' },
      'importedKey',
      expect.any(Uint8Array),
      expect.any(Uint8Array)
    )

    expect(result).toBe(true)
  })

  it('should return the result of subtle.verify', async () => {
    const publicKey = '0'.repeat(64) // 32バイトの公開鍵（16進数で64文字）
    mockImportKey.mockResolvedValue('importedKey')
    mockVerify.mockResolvedValue(false)

    const result = await verify('body', '1234abcd'.repeat(8), 'timestamp', publicKey)

    expect(result).toBe(false)
  })
})
