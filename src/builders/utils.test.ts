import { CUSTOM_ID_SEPARATOR } from '../utils'
import { Builder, ifThrowHasSemicolon, warnBuilder } from './utils'

describe('Builder', () => {
  class TestBuilder extends Builder<{ test: string }> {
    constructor() {
      super({ test: '' })
    }

    setTest(value: string) {
      return this.a({ test: value })
    }
  }

  it('should create an instance with initial value', () => {
    const builder = new TestBuilder()
    expect(builder.toJSON()).toEqual({ test: '' })
  })

  it('should update the store using the "a" method', () => {
    const builder = new TestBuilder()
    builder.setTest('hello')
    expect(builder.toJSON()).toEqual({ test: 'hello' })
  })

  it('should return a new object from toJSON', () => {
    const builder = new TestBuilder()
    const json1 = builder.toJSON()
    const json2 = builder.toJSON()
    expect(json1).toEqual(json2)
    expect(json1).not.toBe(json2)
  })
})

describe('warnBuilder', () => {
  it('should log a warning message', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnBuilder('TestClass', 'TestType', 'testMethod')
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ TestClass(TestType).testMethod is not available')
    consoleSpy.mockRestore()
  })
})

describe('ifThrowHasSemicolon', () => {
  it('should throw an error if the string contains CUSTOM_ID_SEPARATOR', () => {
    expect(() => ifThrowHasSemicolon(`test${CUSTOM_ID_SEPARATOR}string`)).toThrow(`Don't use "${CUSTOM_ID_SEPARATOR}"`)
  })

  it('should not throw an error if the string does not contain CUSTOM_ID_SEPARATOR', () => {
    expect(() => ifThrowHasSemicolon('test string')).not.toThrow()
  })
})
