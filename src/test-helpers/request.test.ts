import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10'
import { describe, expect, it } from 'vitest'
import { Command } from '../builders'
import { testCommandRequestBodyJson, testCommandRequestInit } from './request'

describe('testCommandRequestBody', () => {
  it('should return correct JSON string for Command object', () => {
    const command = new Command('ping', 'ping')
    const result = testCommandRequestBodyJson(command)
    expect(result).toEqual({
      type: 2,
      data: {
        name: 'ping',
        id: '00000000000000000000000000000000',
        type: 1,
      },
    })
  })

  it('should return correct JSON string for toJSON result', () => {
    const commandJson = { name: 'pong' } as RESTPostAPIApplicationCommandsJSONBody
    const result = testCommandRequestBodyJson(commandJson)
    expect(result).toEqual({
      type: 2,
      data: {
        name: 'pong',
        id: '00000000000000000000000000000000',
        type: 1,
      },
    })
  })
})

describe('testCommandRequestInit', () => {
  it('should return correct RequestInit object', () => {
    const command = new Command('hello', 'hello')
    const result = testCommandRequestInit(command)
    expect(result.method).toBe('POST')
    expect(result.headers).toMatchObject({
      'x-signature-ed25519': 'f'.repeat(128),
      'x-signature-timestamp': '1',
      'content-type': 'application/json',
    })
    expect(JSON.parse(result.body as string)).toEqual({
      type: 2,
      data: {
        name: 'hello',
        id: '00000000000000000000000000000000',
        type: 1,
      },
    })
  })
})
