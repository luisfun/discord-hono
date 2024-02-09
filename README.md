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

## 📑 Sample Code

[sample-discord-hono](https://github.com/LuisFun/sample-discord-hono)

### index.ts

```ts
import type { ScheduledHandler } from "discord-hono"
import { DiscordHono } from "discord-hono"
import { commands } from "./commands"

type Bindings = {
  db: D1Database
}
export type Env = { Bindings: Bindings }

const scheduled: ScheduledHandler<Env> = async c => {
  console.log("Run Scheduled")
}

const app = new DiscordHono<Env>()
app.setCommands(commands)
app.setScheduled("", scheduled)
export default app
```

### commands.ts

```ts
import type { Env } from "."
import type { Commands, Context } from "discord-hono"

export const commands: Commands<Env> = [
  [
    {
      name: "ping",
      description: "response Pong",
    },
    c => c.resText("Pong"),
  ],
  [
    {
      name: "img",
      description: "response Image",
      options: [
        {
          type: 3,
          name: "content",
          description: "response text",
        },
      ],
    },
    async c => {
      //const db = c.env.db
      c.executionCtx.waitUntil(handler(c))
      return c.resDefer()
    },
  ],
]

const handler = async (c: Context<Env>) => {
  try {
    const imageResponse = await fetch("https://luis.fun/luisfun.png")
    const arrayBuffer = await imageResponse.arrayBuffer()
    const blob = new Blob([arrayBuffer])
    await c.followup({ content: c.command.values[0] }, { blob, name: "image.png" })
  } catch {
    await c.followupText("error")
  }
}
```

### register.ts

```ts
import dotenv from "dotenv"
import process from "node:process"
import type { RegisterArg } from "discord-hono"
import { register } from "discord-hono"
import { commands } from "./commands.js" // '.js' is necessary for 'npm run register'.

dotenv.config({ path: ".dev.vars" })

const arg: RegisterArg = {
  commands: commands,
  applicationId: process.env.DISCORD_APPLICATION_ID,
  token: process.env.DISCORD_TOKEN,
  //guildId: process.env.DISCORD_TEST_GUILD_ID,
}

await register(arg)
```
