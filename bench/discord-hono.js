// @ts-check

// biome-ignore-all lint/correctness/noUnresolvedImports: Ignore for local processing
import { DiscordHono as DiscordHonoOld } from 'discord-hono'
import { bench, boxplot, compact, run, summary } from 'mitata'
import {
  DiscordHono,
  makeSlashCommand,
  makeStringOption,
  testCommandRequestInit,
  testVerifyTrue,
} from '../dist/index.mjs'
import pkg from '../package.json' with { type: 'json' }

const init = testCommandRequestInit(
  makeSlashCommand('test', 'Test command').options([makeStringOption('text', 'description')]),
)
const env = { DISCORD_PUBLIC_KEY: 'f'.repeat(64) }

const benchItems = [
  { ver: pkg.devDependencies['discord-hono'], DiscordHono: DiscordHonoOld },
  { ver: 'next', DiscordHono },
]

const benchmarks = () => {
  for (const { ver, DiscordHono } of benchItems) {
    bench(`DiscordHono: ${ver}`, async () => {
      await new DiscordHono({ verify: testVerifyTrue })
        .command('test', c => c.res('ok'))
        .fetch(new Request('http://localhost', init), env)
    }).gc(false) // Feels more stable than the default (once) when set to false
  }
}

compact(benchmarks) // warm-up
boxplot(() => summary(benchmarks))

await run()
