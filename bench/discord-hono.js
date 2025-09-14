// @ts-check

import { DiscordHono } from 'discord-hono'
import { bench, run } from 'mitata'
import {
  Command,
  DiscordHono as DiscordHonoNext,
  Option,
  testCommandRequestInit,
  testVerifyTrue,
} from '../dist/index.js'
import pkg from '../package.json' with { type: 'json' }

const init = testCommandRequestInit(
  new Command('test', 'Test command').options(new Option('text', 'description').required()),
)
const env = { DISCORD_PUBLIC_KEY: 'f'.repeat(64) }

bench(`discord-hono: ${pkg.devDependencies['discord-hono']}`, async () => {
  await new DiscordHono({ verify: testVerifyTrue })
    .command('test', c => c.res('ok'))
    .fetch(new Request('http://localhost', init), env)
})
bench('discord-hono: next', async () => {
  await new DiscordHonoNext({ verify: testVerifyTrue })
    .command('test', c => c.res('ok'))
    .fetch(new Request('http://localhost', init), env)
})

await run()
