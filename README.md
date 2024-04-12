# 🔥 Discord Hono [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![Bundle Size](https://img.shields.io/bundlephobia/min/discord-hono)](https://bundlephobia.com/package/discord-hono)

[👉 Documentation](https://discord-hono.luis.fun)

This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors! [Hono LICENSE](https://github.com/honojs/hono/blob/main/LICENSE)

## Features

- **Easy Build** - Verify included. Code for each command is easier to write.
- **Lightweight** - We make them as light as possible. Discord Hono has zero dependencies.
- **TypeScript** - TypeScript support.

## Install

```shell
npm i discord-hono
npm i -D discord-api-types # When using TypeScript
npm i -D dotenv # When using 'npm run register'
```

## Sample Code

index.ts

```ts
import { DiscordHono } from 'discord-hono'

const app = new DiscordHono()
app.command('hello', c => c.res('world!'))

export default app
```

register.ts

```ts
import dotenv from 'dotenv'
import process from 'node:process'
import { Command, Option, register } from 'discord-hono'
dotenv.config({ path: '.dev.vars' })

const commands = [new Command('hello', 'response world')]

await register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
```

## Examples

- [Simple Example](https://github.com/LuisFun/discord-hono-example)
- [Playing with AI](https://github.com/LuisFun/discord-bot-cloudflare-ai) - Using Cloudflare AI
- [Deliver website news](https://github.com/LuisFun/discord-bot-hoyo-news) - Using Cloudflare D1, Browser Rendering, Cron

## References

The following repositories were referenced in the making of this project:

- [Hono](https://github.com/honojs/hono)
- [Official Example](https://github.com/discord/cloudflare-sample-app)
- [Verify for Workers](https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1)
