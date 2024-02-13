# 🔥 Discord Hono  [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![license](https://img.shields.io/github/license/luisfun/discord-hono)](https://github.com/LuisFun/discord-hono/blob/main/LICENSE)

This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors! [Hono LICENSE](https://github.com/honojs/hono/blob/main/LICENSE)

## 🚀 Install

[![Node.js 20.x](https://img.shields.io/badge/Node.js-20.x-%23339933?logo=Node.js)](https://nodejs.org)

```shell
npm i discord-hono
npm i -D discord-api-types # When using TypeScript
npm i -D dotenv # When using 'npm run register'
```

## 📑 [Example](https://github.com/LuisFun/discord-hono-example)

index.ts

```ts
import type { Context } from 'discord-hono'
import { DiscordHono, Command, CommandOption } from 'discord-hono'

const imageHandler = async (c: Context) => {
  const image = await fetch('https://luis.fun/images/hono.webp')
  const blob = new Blob([await image.arrayBuffer()])
  await c.followup({ content: c.command.values[0] }, { blob, name: 'image.webp' })
}

export const commands = [
  new Command('ping', 'response pong').resText('Pong!!'),
  new Command('image', 'response image file with text')
    .option(new CommandOption('content', 'response text').required())
    .resDefer(imageHandler),
]

const app = new DiscordHono()
app.commands(commands)
export default app
```

register.ts

```ts
import dotenv from 'dotenv'
import process from 'node:process'
import { register } from 'discord-hono'
import { commands } from './index.js' // '.js' is necessary for 'npm run register'.

dotenv.config({ path: '.dev.vars' })

await register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
```

### Other Examples

- [Using Cloudflare AI](https://github.com/LuisFun/discord-bot-cloudflare-ai)

## References

The following repositories were referenced in the making of this project:

- [Official Example](https://github.com/discord/cloudflare-sample-app)
- [Hono](https://github.com/honojs/hono)
