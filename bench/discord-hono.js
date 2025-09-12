// @ts-check

import { DiscordHono } from 'discord-hono'
import { bench, group, run } from 'mitata'
import { DiscordHono as NewDiscordHono } from '../dist/index.js'
import pkg from '../package.json' with { type: 'json' }

const app = new DiscordHono()
const newApp = new NewDiscordHono()

const req = new Request('http://localhost/', {
  method: 'POST',
  headers: {
    'x-signature-ed25519': 'f'.repeat(128),
    'x-signature-timestamp': '1',
    'content-type': 'application/json',
  },
  body: JSON.stringify({ type: 1 }),
})

const env = {
  DISCORD_PUBLIC_KEY: 'f'.repeat(64),
}

group('Benchmark discord-hono', () => {
  bench(`discord-hono: ${pkg.devDependencies['discord-hono']}`, async () => {
    await app.fetch(req.clone(), env)
  })
  bench('discord-hono: next', async () => {
    await newApp.fetch(req.clone(), env)
  })
})

await run()
