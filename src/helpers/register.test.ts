import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { $applications$_$commands, $applications$_$guilds$_$commands } from '../rest/rest-path'
import { register } from './register'

const mockRest: Mock = vi.fn()
const mockToken: string = vi.fn(() => 'mock-token')()

vi.mock('../rest/rest', () => ({
  createRest: vi.fn(() => mockRest),
}))

describe('register function', () => {
  const mockCommands = [{ name: 'test', description: 'A test command' }]
  const mockApplicationId = '123456789'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should throw errors if token or application_id aren't provided", async () => {
    await expect(register(mockCommands, mockApplicationId, undefined)).rejects.toThrow('DISCORD_TOKEN')
    await expect(register(mockCommands, undefined, mockToken)).rejects.toThrow('DISCORD_APPLICATION_ID')
  })

  it('should register commands for a specific guild', async () => {
    const mockGuildId = '987654321'
    const mockResponse = new Response(null, { status: 200 })
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken, mockGuildId)

    expect(mockRest).toHaveBeenCalledWith(
      'PUT',
      $applications$_$guilds$_$commands,
      [mockApplicationId, mockGuildId],
      expect.any(Array),
    )
    expect(result).toBe(mockResponse)
    expect(console.info).toHaveBeenCalledWith('✅ Success Guild Command Registration')
  })

  it('should register global commands when guild_id is not provided', async () => {
    const mockResponse = new Response(null, { status: 200 })
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(mockRest).toHaveBeenCalledWith('PUT', $applications$_$commands, [mockApplicationId], expect.any(Array))
    expect(result).toBe(mockResponse)
    expect(console.info).toHaveBeenCalledWith('✅ Success Global Command Registration')
  })

  it('should suppress logging when silent is provided for global commands', async () => {
    const mockResponse = new Response(null, { status: 200 })
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken, { silent: true })

    expect(result).toBe(mockResponse)
    expect(console.info).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should suppress logging when silent is provided for guild commands', async () => {
    const mockGuildId = '987654321'
    const mockResponse = new Response(null, { status: 200 })
    mockRest.mockResolvedValue(mockResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken, mockGuildId, { silent: true })

    expect(result).toBe(mockResponse)
    expect(mockRest).toHaveBeenCalledWith(
      'PUT',
      $applications$_$guilds$_$commands,
      [mockApplicationId, mockGuildId],
      expect.any(Array),
    )
    expect(console.info).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should not call Discord API directly', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch')
    mockRest.mockResolvedValue(new Response(null, { status: 200 }))

    await register(mockCommands, mockApplicationId, mockToken)

    expect(mockFetch).not.toHaveBeenCalled()
  })
  it('should handle error responses', async () => {
    const mockErrorResponse = Response.json(
      { message: 'Invalid command structure' },
      { status: 400, statusText: 'Bad Request' },
    )
    mockRest.mockResolvedValue(mockErrorResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(result).toBe(mockErrorResponse)
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        '⚠️ 400: \n{\n  "message": "Invalid command structure"\n}\n⚠️ Error Global Command Registration',
      ),
    )
  })

  it('should handle error when reading response body fails', async () => {
    const mockErrorResponse = new Response('not JSON', { status: 500, statusText: 'Internal Server Error' })
    mockRest.mockResolvedValue(mockErrorResponse)

    const result = await register(mockCommands, mockApplicationId, mockToken)

    expect(result).toBe(mockErrorResponse)
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ 500: \nJSON parse error\n⚠️ Error Global Command Registration'),
    )
  })
})
