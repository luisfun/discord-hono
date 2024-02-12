🔥 This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors! [Hono LICENSE](https://github.com/honojs/hono/blob/main/LICENSE)

## 🚀 Getting Started

[<img alt="Node.js" src="https://img.shields.io/badge/Node.js-20.x-%23339933?logo=Node.js" />](https://nodejs.org)

### Install

JavaScript

```shell
npm i discord-hono
```

TypeScript

```shell
npm i discord-hono
npm i -D discord-api-types
```

## 📑 [Example](https://github.com/LuisFun/sample-discord-hono)

index.ts

```ts
import type { Context } from 'discord-hono'
import { DiscordHono, Command, CommandOption } from 'discord-hono'

const imageHandler = async (c: Context) => {
  const image = await fetch('https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire/3D/fire_3d.png')
  const blob = new Blob([await image.arrayBuffer()])
  await c.followup({ content: c.command.values[0] }, { blob, name: 'image.png' })
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
