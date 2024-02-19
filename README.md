# 🔥 Discord Hono [![npm v](https://img.shields.io/npm/v/discord-hono)](https://www.npmjs.com/package/discord-hono) [![license](https://img.shields.io/github/license/luisfun/discord-hono)](https://github.com/LuisFun/discord-hono/blob/main/LICENSE)

This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors! [Hono LICENSE](https://github.com/honojs/hono/blob/main/LICENSE)

## 🚀 Install

```shell
npm i discord-hono
npm i -D discord-api-types # When using TypeScript
npm i -D dotenv # When using 'npm run register'
```

## 📑 [Example](https://github.com/LuisFun/discord-hono-example)

index.ts

```ts
import { DiscordHono, CommandHandlers } from 'discord-hono'
import { commands } from './commands'

const handlers = new CommandHandlers()
  .on('ping', c => c.resText('Pong!!'))
  .on('image', c =>
    c.resDefer(async () => {
      const image = await fetch('https://luis.fun/images/hono.webp')
      const blob = new Blob([await image.arrayBuffer()])
      await c.followup({ content: c.values[0].toString() }, { blob, name: 'image.webp' })
    }),
  )

const app = new DiscordHono()
app.commands(commands)
app.handlers(handlers)
export default app
```

commands.ts

```ts
import { Command, Option } from 'discord-hono'

export const commands = [
  new Command('ping', 'response pong'),
  new Command('image', 'response image file').options(new Option('text', 'response text').required()),
]
```

register.ts

```ts
import dotenv from 'dotenv'
import process from 'node:process'
import { register } from 'discord-hono'
import { commands } from './commands.js' // '.js' is necessary for 'npm run register'

dotenv.config({ path: '.dev.vars' })

await register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
```

### Other Examples

- [Playing with AI](https://github.com/LuisFun/discord-bot-cloudflare-ai) - Using Cloudflare AI
- [Deliver website news](https://github.com/LuisFun/discord-bot-hoyo-news) - Using Cloudflare D1, Browser Rendering, Cron

## References

The following repositories were referenced in the making of this project:

- [Official Example](https://github.com/discord/cloudflare-sample-app)
- [Hono](https://github.com/honojs/hono)
