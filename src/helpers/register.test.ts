import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _applications_$_commands, _applications_$_guilds_$_commands } from '../rest/rest-path'
import { register } from './register'

const mockRest = vi.fn()
const mockToken = vi.fn(() => 'mock-token')()

vi.mock('../utils')
vi.mock('../rest/rest', () => ({
  createRest: vi.fn(() => mockRest),
}))

describe('register function', () => {
  const mockCommands = [{ name: 'test', description: 'A test command' }]
  const mockApplicationId = '123456789'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should throw errors if token or application_id aren't provided", async () => {
    await expect(register(mockCommands, mockApplicationId, undefined)).rejects.toThrow()
    await expect(register(mockCommands, undefined, mockToken)).rejects.toThrow()
  })

  it('should register commands for a specific guild', async () => {
    const mockGuildId = '987654321'
    const mockResponse = { ok: true, status: 200, statusText: 'OK' }
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken, mockGuildId)

    expect(mockRest).toHaveBeenCalledWith(
      'PUT',
      _applications_$_guilds_$_commands,
      [mockApplicationId, mockGuildId],
      expect.any(Array),
    )
    expect(result).toContain('✅ Success')
  })

  it('should register global commands when guild_id is not provided', async () => {
    const mockResponse = { ok: true, status: 200, statusText: 'OK' }
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(mockRest).toHaveBeenCalledWith('PUT', _applications_$_commands, [mockApplicationId], expect.any(Array))
    expect(result).toContain('✅ Success')
  })

  it('should handle error responses', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      url: 'https://discord.com/api/v10/applications/123456789/commands',
      text: vi.fn().mockResolvedValue('Invalid command structure'),
    }
    mockRest.mockResolvedValue(mockErrorResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(result).toContain('⚠️ Error')
    expect(result).toContain('Error registering commands')
    expect(result).toContain('Invalid command structure')
  })

  it('should handle error when reading response body fails', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      url: 'https://discord.com/api/v10/applications/123456789/commands',
      text: vi.fn().mockRejectedValue(new Error('Failed to read body')),
    }
    mockRest.mockResolvedValue(mockErrorResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(result).toContain('⚠️ Error')
    expect(result).toContain('Error registering commands')
    expect(result).toContain('Error reading body from request')
  })
})
