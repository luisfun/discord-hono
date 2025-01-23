# 🔥 Discord Hono [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/discord-hono)](https://bundlephobia.com/package/discord-hono) [![Discord](https://img.shields.io/discord/1331893810501914694?label=Discord)](https://discord.gg/KFAgHFwBsr)

**This library enables you to easily build Discord bots on Cloudflare Workers**

[👉 Documentation](https://discord-hono.luis.fun)

This project is influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors!

## Features

- **Intuitive API** - Influenced by Hono, offering a familiar and easy-to-use interface
- **Lightweight** - Zero dependencies, optimized for performance
- **Type-Safe** - Native support for TypeScript

## Install

```shell
npm i discord-hono
npm i -D discord-api-types # When using TypeScript
```

## Example Code

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

## References

- [Hono](https://github.com/honojs/hono) - [MIT License](https://github.com/honojs/hono/blob/main/LICENSE)
- [Discord App](https://github.com/discord/cloudflare-sample-app) - [MIT License](https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE)
- [Verify for Workers](https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1)
