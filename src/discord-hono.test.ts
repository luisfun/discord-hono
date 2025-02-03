import { CronContext } from './context'
import { DiscordHono } from './discord-hono'

describe('DiscordHono', () => {
  const app = new DiscordHono()
  const env = { DISCORD_PUBLIC_KEY: 'test_public_key' }
  const postRequest = (json: object) =>
    new Request('https://example.com', { method: 'POST', body: JSON.stringify(json) })

  it('should register handlers', () => {
    const commandHandler = vi.fn()
    const componentHandler = vi.fn()
    const autocompleteHandler = vi.fn()
    const modalHandler = vi.fn()
    const cronHandler = vi.fn()
    app.command('test', commandHandler)
    app.component('test', componentHandler)
    app.autocomplete('test', autocompleteHandler)
    app.autocomplete('test', autocompleteHandler, commandHandler)
    app.modal('test', modalHandler)
    app.cron('0 0 * * *', cronHandler)
    expect(commandHandler).not.toHaveBeenCalled()
    expect(componentHandler).not.toHaveBeenCalled()
    expect(autocompleteHandler).not.toHaveBeenCalled()
    expect(modalHandler).not.toHaveBeenCalled()
    expect(cronHandler).not.toHaveBeenCalled()
  })

  describe('fetch', () => {
    it('should return text for GET requests', async () => {
      const req = new Request('https://example.com', { method: 'GET' })
      const res = await app.fetch(req)
      expect(await res.text()).toBe('Operational🔥')
    })

    it('should return 4xx for bad requests', async () => {
      const req404 = new Request('https://example.com', { method: 'bad' })
      const res404 = await app.fetch(req404)
      expect(res404.status).toBe(404)
      const req401 = postRequest({})
      const res401 = await new DiscordHono({ verify: vi.fn().mockResolvedValue(false) }).fetch(req401, env)
      expect(res401.status).toBe(401)
      const req400 = postRequest({ type: -1 })
      const res400 = await new DiscordHono({ verify: vi.fn().mockResolvedValue(true) }).fetch(req400, env)
      expect(res400.status).toBe(400)
    })

    it("should throw an error if DISCORD_PUBLIC_KEY isn't set", async () => {
      const req = postRequest({})
      await expect(app.fetch(req)).rejects.toThrow()
    })

    describe('Correct POST', () => {
      const verifiedApp = new DiscordHono({ verify: vi.fn().mockResolvedValue(true) })

      it('should handle ping interaction correctly', async () => {
        const req = postRequest({ type: 1 })
        const res = await verifiedApp.fetch(req, env)
        expect(await res.json()).toEqual({ type: 1 })
      })

      it('should handle command interaction correctly', async () => {
        const req = postRequest({ type: 2, data: { name: 'test' } })
        verifiedApp.command('test', c => c.res('command'))
        const res = await verifiedApp.fetch(req, env)
        expect(await res.json()).toEqual({ type: 4, data: { content: 'command' } })
      })

      it('should handle component interaction correctly', async () => {
        const req = postRequest({ type: 3, data: { custom_id: 'test' } })
        verifiedApp.component('test', c => c.resUpdate('component'))
        const res = await verifiedApp.fetch(req, env)
        expect(await res.json()).toEqual({ type: 7, data: { content: 'component' } })
      })
    })
  })

  describe('scheduled', () => {
    it('should call the registered cron handler', async () => {
      const handler = vi.fn()
      app.cron('0 0 * * *', handler)
      const event = { cron: '0 0 * * *', type: '', scheduledTime: 0 }
      await app.scheduled(event, {})
      expect(handler).toHaveBeenCalledWith(expect.any(CronContext))
    })
  })
})

describe('HandlerMap', () => {
  it('should call the registered cron default handler', async () => {
    const handler = vi.fn()
    const app = new DiscordHono().cron('', handler)
    const event = { cron: '0 0 * * *', type: '', scheduledTime: 0 }
    await app.scheduled(event, {})
    expect(handler).toHaveBeenCalledWith(expect.any(CronContext))
  })

  it('should throw error', async () => {
    const handler = vi.fn()
    const app = new DiscordHono().cron('0 0 * * *', handler)
    const event = { cron: '0 * * * *', type: '', scheduledTime: 0 }
    await expect(app.scheduled(event, {})).rejects.toThrow()
  })
})
