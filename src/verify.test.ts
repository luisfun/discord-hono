import { verify } from './verify'

describe('verify', () => {
  const body = 'testBody'
  const signature = '1234abcd'.repeat(8) // 32バイトの署名
  const timestamp = '1234567890'
  const publicKey = '0'.repeat(64) // 32バイトの公開鍵（16進数で64文字）

  it('should return false if body, signature, or timestamp is missing', async () => {
    expect(await verify(body, null, timestamp, publicKey)).toBe(false)
    expect(await verify(body, signature, null, publicKey)).toBe(false)
    expect(await verify('', signature, timestamp, publicKey)).toBe(false)
  })

  it('should throw an error if crypto is undefined', async () => {
    vi.stubGlobal('crypto', undefined)
    await expect(verify(body, signature, timestamp, publicKey)).rejects.toThrow()
  })

  it('should return the result of subtle.verify', async () => {
    vi.stubGlobal('crypto', {
      subtle: {
        verify: vi.fn().mockResolvedValue(false),
        importKey: vi.fn().mockResolvedValue('importedKey'),
      },
    })
    expect(await verify(body, signature, timestamp, publicKey)).toBe(false)
  })

  describe("correct parameters", () => {
    const mockImportKey = vi.fn().mockResolvedValue('importedKey')
    const mockVerify = vi.fn().mockResolvedValue(true)
    it('should use window.crypto', async () => {
      vi.stubGlobal('window', {
        crypto: {
          subtle: {
            verify: mockVerify,
            importKey: mockImportKey,
          },
        },
      })
      expect(await verify(body, signature, timestamp, publicKey)).toBe(true)
    })
/*
    it('should use globalThis.crypto', async () => {
      vi.stubGlobal('globalThis', {
        crypto: {
          subtle: {
            verify: vi.fn().mockResolvedValue(true),
            importKey: vi.fn().mockResolvedValue('importedKey'),
          },
        },
      })
      expect(await verify(body, signature, timestamp, publicKey)).toBe(true)
    })
*/
    it("should use crypto", async () => {
      vi.stubGlobal('crypto', {
        subtle: {
          verify: mockVerify,
          importKey: mockImportKey,
        },
      })
      const result = await verify(body, signature, timestamp, publicKey)
      /*
      expect(mockImportKey).toHaveBeenCalledWith('raw', expect.any(Uint8Array), { name: 'Ed25519' }, false, ['verify'])
      expect(mockVerify).toHaveBeenCalledWith(
        { name: 'Ed25519' },
        'importedKey',
        expect.any(Uint8Array),
        expect.any(Uint8Array),
      )
      */
      expect(result).toBe(true)
    })
  })
})
