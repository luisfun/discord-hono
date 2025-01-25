import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CronContext } from './context'
import { DiscordHono } from './discord-hono'

describe('DiscordHono', () => {
  let discordHono: DiscordHono

  beforeEach(() => {
    discordHono = new DiscordHono()
  })

  it('should create an instance of DiscordHono', () => {
    expect(discordHono).toBeInstanceOf(DiscordHono)
  })

  it('should register a command handler', () => {
    const handler = vi.fn()
    discordHono.command('test', handler)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should register a component handler', () => {
    const handler = vi.fn()
    discordHono.component('test', handler)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should register an autocomplete handler', () => {
    const handler = vi.fn()
    discordHono.autocomplete('test', handler)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should register a modal handler', () => {
    const handler = vi.fn()
    discordHono.modal('test', handler)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should register a cron handler', () => {
    const handler = vi.fn()
    discordHono.cron('0 0 * * *', handler)
    expect(handler).not.toHaveBeenCalled()
  })

  describe('fetch', () => {
    it('should return "Operational🔥" for GET requests', async () => {
      const request = new Request('https://example.com', { method: 'GET' })
      const response = await discordHono.fetch(request)
      expect(await response.text()).toBe('Operational🔥')
    })

    it('should return 404 for unsupported methods', async () => {
      const request = new Request('https://example.com', { method: 'PUT' })
      const response = await discordHono.fetch(request)
      expect(response.status).toBe(404)
    })

    // Note: Testing POST requests would require mocking the verify function and interaction data
  })

  describe('scheduled', () => {
    it('should call the registered cron handler', async () => {
      const handler = vi.fn()
      discordHono.cron('0 0 * * *', handler)

      const event = { cron: '0 0 * * *', type: '', scheduledTime: 0 }
      const env = {}
      await discordHono.scheduled(event, env)

      expect(handler).toHaveBeenCalledWith(expect.any(CronContext))
    })
  })
})
