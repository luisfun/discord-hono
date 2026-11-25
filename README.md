# 🔥 Discord Hono [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/discord-hono?label=minzip)](https://bundlephobia.com/package/discord-hono) [![Discord](https://img.shields.io/discord/1331893810501914694?label=Discord)](https://discord.gg/KFAgHFwBsr)

**Easily build HTTP-based Discord bots on Cloudflare Workers — so you can focus on what matters.**

[👉 Documentation](https://discord-hono.luis.fun) │ [💥 Breaking Changes](https://discord-hono.luis.fun/migration-guides/v0/)

This project is influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors!

## Features

- **Intuitive API** - Influenced by Hono, offering a familiar and easy-to-use interface
- **Lightweight** - Zero runtime JS dependencies, optimized for performance
- **Type-Safe** - Native support for TypeScript

## Install

```shell
npm i discord-hono
npm i -D discord-api-types
# npm i -D tsx @types/node # Node/TS environment
```

## Example Code

index.ts

```ts
import { DiscordHono } from 'discord-hono'

const app = new DiscordHono().command('hello', c => c.res('Hello, World!'))

export default app
```

register.ts

```ts
import { makeSlashCommand, register } from 'discord-hono'

const commands = [makeSlashCommand('hello', 'Hello, World!')]

register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
```

## Discord Gateway on Cloudflare Workers

`GatewayDO` receives Gateway dispatch events in a single-shard Durable Object. Create a SQLite-backed Durable Object
binding and supply `DISCORD_TOKEN` as a [secret](https://developers.cloudflare.com/workers/configuration/secrets/).
Set `DISCORD_GATEWAY_INTENTS` to the required intent bitmask. For example, `33281` enables guilds, guild messages,
and message content; the latter is a privileged intent that must also be enabled in the Discord developer portal.

```ts
import { $channels$_$messages, GatewayDO, type GatewayContext } from 'discord-hono'

export class MyBot extends GatewayDO<Env> {
  override async on(c: GatewayContext<Env>): Promise<void> {
    switch (c.gateway.t) {
      case 'MESSAGE_CREATE':
        if (!c.gateway.d.author.bot && c.gateway.d.content === '!ping') {
          await c.rest('POST', $channels$_$messages, [c.gateway.d.channel_id], { content: 'pong' })
        }
        break
    }
  }
}

export default {
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    await env.GATEWAY.getByName('discord-bot').ensureConnected()
  },
} satisfies ExportedHandler<Env>
```

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "GATEWAY", "class_name": "MyBot" }],
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyBot"] }],
  "triggers": { "crons": ["*/5 * * * *"] },
  "vars": { "DISCORD_GATEWAY_INTENTS": "33281" },
}
```

Generate `Env` with `wrangler types`, including the token secret in your local development configuration. TypeScript
must use `moduleResolution: "bundler"` (or a Node mode supporting conditional exports) and
`customConditions: ["workerd"]` to resolve the Cloudflare-specific exports. Wrangler selects that condition when
bundling; other runtimes retain the existing package entry point and do not provide `GatewayDO`.

The first call to `ensureConnected()` starts the connection. The object persists its session and schedules alarms to
recover after disconnects or restarts; calling `stop()` closes it and cancels recovery. A later call to
`ensureConnected()` starts it again, including calls from the cron example. Fatal Discord close codes stop retries
until the token or intents change. Only one object should connect per bot token: multiple instances can exceed
Discord's identify limits. Outbound WebSockets do not use Durable Object hibernation and can incur duration charges.
Dispatch handlers run asynchronously; delivery and processing are not guaranteed exactly once.

## Health

[![CodeQL](https://github.com/luisfun/discord-hono/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/luisfun/discord-hono/actions/workflows/github-code-scanning/codeql) [![Codecov](https://codecov.io/github/luisfun/discord-hono/graph/badge.svg)](https://codecov.io/github/luisfun/discord-hono) [![OpenSSF](https://api.scorecard.dev/projects/github.com/luisfun/discord-hono/badge)](https://scorecard.dev/viewer/?uri=github.com/luisfun/discord-hono)

## Links

- [Examples Repository](https://github.com/luisfun/discord-hono-examples)
- [Documentation Repository](https://github.com/luisfun/discord-hono-docs)
- [DeepWiki](https://deepwiki.com/luisfun/discord-hono)

## References

- [Hono](https://github.com/honojs/hono) - [MIT License](https://github.com/honojs/hono/blob/main/LICENSE)
- [Discord App](https://github.com/discord/cloudflare-sample-app) - [MIT License](https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE)
- [Verify for Workers](https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1)
