import { formData } from '../utils'
import { Rest } from './rest'

const mockToken = vi.fn(() => 'mock-token')()

// モックの作成
vi.mock('../utils', () => ({
  errorDev: vi.fn((message: string) => new Error(message)),
  formData: vi.fn(),
}))

describe('Rest', () => {
  let rest: Rest
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    // @ts-expect-error
    global.fetch = mockFetch
    rest = new Rest(mockToken)
  })
  /*
  it('should throw an error if token is not provided', () => {
    expect(() => new Rest(undefined)).toThrow('DISCORD_TOKEN');
    expect(errorDev).toHaveBeenCalledWith('DISCORD_TOKEN');
  });
*/
  it('should make a GET request', async () => {
    const mockResponse = { json: vi.fn().mockResolvedValue({ data: 'mock_data' }) }
    mockFetch.mockResolvedValue(mockResponse)
    // @ts-expect-error
    const result = await rest.get('/users/{user.id}', ['123'], { query: 'param' }).then(r => r.json())

    expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/v10/users/123', {
      method: 'GET',
      headers: {
        Authorization: `Bot ${mockToken}`,
        'content-type': 'application/json',
      },
      body: '{"query":"param"}',
    })
    expect(result).toEqual({ data: 'mock_data' })
  })

  it('should make a PUT request', async () => {
    mockFetch.mockResolvedValue({})
    // @ts-expect-error
    await rest.put('/guilds/{guild.id}', ['456'], { name: 'New Guild Name' })

    expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/v10/guilds/456', {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${mockToken}`,
        'content-type': 'application/json',
      },
      body: '{"name":"New Guild Name"}',
    })
  })

  it('should make a POST request with file', async () => {
    mockFetch.mockResolvedValue({})
    const mockFormData = new FormData()
    // @ts-expect-error
    formData.mockReturnValue(mockFormData)

    const fileData = { name: 'test.png', blob: new Blob(['test']) }
    await rest.post('/channels/{channel.id}/messages', ['789'], { content: 'Hello' }, fileData)

    expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/v10/channels/789/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${mockToken}`,
      },
      body: mockFormData,
    })
    expect(formData).toHaveBeenCalledWith({ content: 'Hello' }, fileData)
  })

  it('should make a PATCH request', async () => {
    mockFetch.mockResolvedValue({})

    await rest.patch('/channels/{channel.id}', ['101'], { name: 'Updated Channel' })

    expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/v10/channels/101', {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${mockToken}`,
        'content-type': 'application/json',
      },
      body: '{"name":"Updated Channel"}',
    })
  })

  it('should make a DELETE request', async () => {
    mockFetch.mockResolvedValue({})
    // @ts-expect-error
    await rest.delete('/channels/{channel.id}', ['202'])

    expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/v10/channels/202', {
      method: 'DELETE',
      headers: {
        Authorization: `Bot ${mockToken}`,
        'content-type': 'application/json',
      },
    })
  })
})
