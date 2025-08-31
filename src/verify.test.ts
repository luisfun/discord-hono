import { afterEach, describe, expect, it, vi } from 'vitest'
import { verify } from './verify'

describe('verify', () => {
  const body = 'testBody'
  const signature = '1234abcd'.repeat(8) // 32バイトの署名
  const timestamp = '1234567890'
  const publicKey = '0'.repeat(64) // 32バイトの公開鍵（16進数で64文字）

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return false if body, signature, or timestamp is missing', async () => {
    expect(await verify(body, null, timestamp, publicKey)).toBe(false)
    expect(await verify(body, signature, null, publicKey)).toBe(false)
    expect(await verify('', signature, timestamp, publicKey)).toBe(false)
  })

  it('should throw an error if crypto is undefined', async () => {
    vi.stubGlobal('crypto', undefined)
    await expect(verify(body, signature, timestamp, publicKey)).rejects.toThrow()
  })

  it('should return the result of subtle.verify (false)', async () => {
    const mockVerify = vi.fn().mockResolvedValue(false)
    const mockImportKey = vi.fn().mockResolvedValue('importedKey')
    vi.stubGlobal('crypto', {
      subtle: {
        verify: mockVerify,
        importKey: mockImportKey,
      },
    })
    expect(await verify(body, signature, timestamp, publicKey)).toBe(false)
    // subtle.verifyが呼ばれていることを確認
    expect(mockVerify).toHaveBeenCalled()
    expect(mockImportKey).toHaveBeenCalled()
  })

  it('should return the result of subtle.verify (true)', async () => {
    const mockVerify = vi.fn().mockResolvedValue(true)
    const mockImportKey = vi.fn().mockResolvedValue('importedKey')
    vi.stubGlobal('crypto', {
      subtle: {
        verify: mockVerify,
        importKey: mockImportKey,
      },
    })
    expect(await verify(body, signature, timestamp, publicKey)).toBe(true)
    expect(mockVerify).toHaveBeenCalled()
    expect(mockImportKey).toHaveBeenCalled()
  })

  describe('correct parameters', () => {
    it('should use correct parameters for importKey and verify', async () => {
      const mockImportKey = vi.fn().mockResolvedValue('importedKey')
      const mockVerify = vi.fn().mockResolvedValue(true)
      vi.stubGlobal('crypto', {
        subtle: {
          verify: mockVerify,
          importKey: mockImportKey,
        },
      })
      const result = await verify(body, signature, timestamp, publicKey)
      expect(mockImportKey).toHaveBeenCalledWith('raw', expect.any(Uint8Array), { name: 'Ed25519' }, false, ['verify'])
      expect(mockVerify).toHaveBeenCalledWith(
        { name: 'Ed25519' },
        'importedKey',
        expect.any(Uint8Array),
        expect.any(Uint8Array),
      )
      expect(result).toBe(true)
    })
  })
})
