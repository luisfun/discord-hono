# 🔥 Discord Hono [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![Bundle Size](https://img.shields.io/bundlephobia/min/discord-hono)](https://bundlephobia.com/package/discord-hono)

[👉 Documentation](https://discord-hono.luis.fun)

This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors!

## Features

- **Easy Build** - Verify included. Code for each command is easier to write.
- **Lightweight** - We make them as light as possible. Discord Hono has zero dependencies.
- **TypeScript** - TypeScript support.

## Install

```shell
npm i discord-hono
npm i -D discord-api-types # When using TypeScript
```

## Sample Code

index.ts

```ts
import { DiscordHono } from 'discord-hono'

const app = new DiscordHono()
  .command('hello', c => c.res('world!'))

export default app
```

register.ts

```ts
import { Command, register } from 'discord-hono'

const commands = [
  new Command('hello', 'response world'),
]

register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
```

## Examples

- [Simple Example](https://github.com/luisfun/discord-hono-example)
- [Playing with AI](https://github.com/luisfun/discord-bot-cloudflare-ai) - Using Cloudflare AI
- [Deliver website news](https://github.com/luisfun/discord-bot-hoyo-news) - Using Cloudflare D1, Browser Rendering, Cron

## References

- [Hono](https://github.com/honojs/hono) - [MIT License](https://github.com/honojs/hono/blob/main/LICENSE)
- [Official Example](https://github.com/discord/cloudflare-sample-app) - [MIT License](https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE)
- [Verify for Workers](https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1)
