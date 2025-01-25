import { Components, Embed } from '.'
import { ResponseObject, errorDev, errorSys, formData, prepareData, toJSON } from './utils'

describe('ResponseObject', () => {
  it('should create a JSON response when given an object', () => {
    const obj = { key: 'value' }
    const response = new ResponseObject(obj)

    expect(response.headers.get('content-type')).toBe('application/json')
    expect(response.status).toBe(200) // default stats
    return response.json().then(data => {
      expect(data).toEqual(obj)
    })
  })

  it('should create a FormData response when given FormData', () => {
    const formData = new FormData()
    formData.append('key', 'value')
    const response = new ResponseObject(formData)

    //expect(response.headers.get('content-type')).toBeNull()
    expect(response.status).toBe(200)
    return response.formData().then(data => {
      expect(data.get('key')).toBe('value')
    })
  })

  it('should set custom status code when provided', () => {
    const obj = { message: '400' }
    const response = new ResponseObject(obj, 400)

    expect(response.status).toBe(400)
  })

  it('should handle empty objects', () => {
    const obj = {}
    const response = new ResponseObject(obj)

    expect(response.headers.get('content-type')).toBe('application/json')
    return response.json().then(data => {
      expect(data).toEqual({})
    })
  })
})

describe('toJSON function', () => {
  it('should return the result of toJSON method if it exists', () => {
    const obj = {
      toJSON: () => ({ custom: 'json' }),
    }
    expect(toJSON(obj)).toEqual({ custom: 'json' })
  })

  it('should return the object itself if toJSON method does not exist', () => {
    const obj = { key: 'value' }
    expect(toJSON(obj)).toEqual(obj)
  })

  it('should return the object itself if toJSON is not a function', () => {
    const obj = {
      toJSON: 'not a function',
    }
    expect(toJSON(obj)).toEqual(obj)
  })

  it('should handle empty objects', () => {
    const obj = {}
    expect(toJSON(obj)).toEqual({})
  })

  it('should handle objects with nested properties', () => {
    const obj = {
      nested: {
        toJSON: () => ({ custom: 'nested json' }),
      },
    }
    expect(toJSON(obj)).toEqual(obj)
  })
})

describe('prepareData', () => {
  it('should handle string input', () => {
    const input = 'test string'
    const result = prepareData(input)
    expect(result).toEqual({ content: 'test string' })
  })

  it('should handle object input without components or embeds', () => {
    const input = { someKey: 'someValue' }
    const result = prepareData(input)
    expect(result).toEqual(input)
  })

  it('should handle object input with both components and embeds', () => {
    const input = {
      components: new Components(),
      embeds: [new Embed()],
    }
    const result = prepareData(input)
    expect(result).toEqual({
      components: [],
      embeds: [{}],
    })
  })
})

describe('formData function', () => {
  let appendSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    appendSpy = vi.fn()
    vi.stubGlobal(
      'FormData',
      vi.fn(() => ({
        append: appendSpy,
      })),
    )
  })

  it('should create FormData with payload_json when data is provided', () => {
    const mockData = { key: 'value' }
    formData(mockData)

    expect(appendSpy).toHaveBeenCalledWith('payload_json', JSON.stringify(mockData))
  })

  it('should not append payload_json when data is empty', () => {
    formData({})

    expect(appendSpy).not.toHaveBeenCalledWith('payload_json', expect.any(String))
  })

  it('should append single file when file object is provided', () => {
    const mockFile = { blob: new Blob(), name: 'test.txt' }
    formData(undefined, mockFile)

    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFile.blob, mockFile.name)
  })

  it('should append multiple files when file array is provided', () => {
    const mockFiles = [
      { blob: new Blob(), name: 'test1.txt' },
      { blob: new Blob(), name: 'test2.txt' },
    ]
    formData(undefined, mockFiles)

    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFiles[0].blob, mockFiles[0].name)
    expect(appendSpy).toHaveBeenCalledWith('files[1]', mockFiles[1].blob, mockFiles[1].name)
  })

  it('should handle both data and file', () => {
    const mockData = { key: 'value' }
    const mockFile = { blob: new Blob(), name: 'test.txt' }
    formData(mockData, mockFile)

    expect(appendSpy).toHaveBeenCalledWith('payload_json', JSON.stringify(mockData))
    expect(appendSpy).toHaveBeenCalledWith('files[0]', mockFile.blob, mockFile.name)
  })
})

describe('Error function', () => {
  it('errorSys function', () => {
    const errorMessage = 'Sys'
    const error = errorSys(errorMessage)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Sys not found')
  })

  it('errorDev function', () => {
    const errorMessage = 'Dev'
    const error = errorDev(errorMessage)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Dev is missing')
  })
})
