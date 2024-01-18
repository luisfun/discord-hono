
🔥 This project is heavily influenced by [Hono](https://github.com/honojs/hono).  
Thank you for [Yusuke Wada](https://github.com/yusukebe) and Hono contributors! [Hono LICENSE](https://github.com/honojs/hono/blob/main/LICENSE)

## 🚀 Getting Started

### 0. Environment Installation

[<img alt="Node.js" src="https://img.shields.io/badge/Node.js-20.x-%23339933?logo=Node.js" />](https://nodejs.org)

### 1. Install

```shell
npm i discord-hono
```

### 2. Coding

[Sample Code](https://github.com/LuisFun/sample-discord-hono)

## Imports

```js
import { DiscordHono } from "discord-hono"

import { register } from "discord-hono"

import type {
  APIEmbed,
  ApplicationCommand,
  CommandHandler,
  Commands,
  ScheduledHandler,
  WaitUntilHandler,
  RegisterArg,
  Context,
} from "discord-hono"
```

## Methods

```js
app.setCommands(commands) // commands as Commands
app.setScheduled("", scheduled) // scheduled as ScheduledHandler

return c.res(content)
await c.edit(content)

c.waitUntil(handler) // handler as WaitUntilHandler
return c.resDefer()
```
