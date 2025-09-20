import { describe, expect, it } from 'vitest'
import { testVerifyTrue } from './verify'

describe('testVerifyTrue', () => {
  it('should always return true', async () => {
    const result = await testVerifyTrue('dummy', 'dummy', 'dummy', 'f'.repeat(64))
    expect(result).toBe(true)
  })
})
