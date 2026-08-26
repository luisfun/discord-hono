import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10'
import type { Select } from '../builders/deprecated-components'
import type { Modal } from '../builders/deprecated-modal'
import { DiscordHono } from '../discord-hono'
import type {
  AutocompleteHandler,
  CommandHandler,
  ComponentHandler,
  ComponentType,
  CronHandler,
  Env,
  InitOptions,
  JsonSerializable,
  ModalHandler,
} from '../types'
import { CUSTOM_ID_SEPARATOR, newError, toJSON } from '../utils'

class DiscordHonoExtends<E extends Env> extends DiscordHono<E> {
  loader(handlers: Handler<E>[]): this {
    for (const elem of handlers) {
      if ('command' in elem) {
        const commandJson = toJSON(elem.command)
        if ('autocomplete' in elem) this.autocomplete(commandJson.name, elem.autocomplete, elem.handler)
        else this.command(commandJson.name, elem.handler)
      } else if ('component' in elem) {
        const json = toJSON(elem.component)
        if ('custom_id' in json) this.component(json.custom_id.split(CUSTOM_ID_SEPARATOR)[0] ?? '', elem.handler)
      } else if ('modal' in elem) {
        const json = toJSON(elem.modal)
        this.modal(json.custom_id.split(CUSTOM_ID_SEPARATOR)[0] ?? '', elem.handler)
      } else if ('cron' in elem) this.cron(elem.cron, elem.handler)
      else throw newError('.loader(obj)', 'obj is Invalid')
    }
    return this
  }
}

type Var = {}

type JsonCommand<V extends Var = Var> = JsonSerializable<RESTPostAPIApplicationCommandsJSONBody> & {
  __commandVars?: V
}

type ExtractComponentVars<T> = T extends Select<infer K, infer _T2> ? { [P in K]: string[] } : {}

interface Factory<E extends Env> {
  discord(init?: InitOptions<E>): DiscordHonoExtends<E>
  command<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var>(
    command: JsonSerializable<T>,
    handler: CommandHandler<E & { Variables?: V }>,
  ): { command: T; handler: CommandHandler<E> }
  component<V extends ExtractComponentVars<C>, C extends ComponentType>(
    component: C,
    handler: ComponentHandler<E & { Variables?: V }, C>,
  ): { component: C; handler: ComponentHandler<E, C> }
  autocomplete<V extends Var>(
    command: JsonCommand<V>,
    autocomplete: AutocompleteHandler<E & { Variables?: V }>,
    handler: CommandHandler<E & { Variables?: V }>,
  ): { command: JsonCommand<V>; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E> }
  modal<V extends Var>(
    modal: Modal<V>,
    handler: ModalHandler<E & { Variables?: V }>,
  ): { modal: Modal; handler: ModalHandler<E> }
  cron<V extends Var>(
    cron: string,
    handler: CronHandler<E & { Variables?: V }>,
  ): { cron: string; handler: CronHandler<E> }
  getCommands(handlers: Handler<E>[]): JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>[]
}

type Handler<E extends Env> =
  | ReturnType<Factory<E>['command']>
  | ReturnType<Factory<E>['component']>
  | ReturnType<Factory<E>['autocomplete']>
  | ReturnType<Factory<E>['modal']>
  | ReturnType<Factory<E>['cron']>

export const createFactory = <E extends Env = Env>(): Factory<E> => ({
  // biome-ignore lint/nursery/useExplicitType: omitted
  discord(init) {
    return new DiscordHonoExtends<E>(init)
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  command<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var>(
    command: JsonSerializable<T>,
    handler: CommandHandler<E & { Variables?: V }>,
  ) {
    return { command: toJSON(command) as T, handler: handler as CommandHandler<E> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  component(component, handler) {
    return { component, handler: handler as ComponentHandler<E, any> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  autocomplete(command, autocomplete, handler) {
    return {
      command,
      autocomplete: autocomplete as AutocompleteHandler<E>,
      handler: handler as CommandHandler<E>,
    }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  modal(modal, handler) {
    return { modal, handler: handler as ModalHandler<E> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  cron(cron, handler) {
    return { cron, handler: handler as CronHandler<E> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  getCommands(handlers) {
    return handlers
      .filter(e => 'command' in e)
      .map(e => e.command as JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>)
  },
})

import { makeSlashCommand, makeStringOption } from '../builders/command'

const testFactory = createFactory()
//const testCommand1 = testFactory.command({ name: 'test', description: 'A test command' } as const, c => c.res('ok'))
const _testCommand2 = testFactory.command(
  makeSlashCommand('test2', 'Another test command').options([
    makeStringOption('text', 'A string option').required(true),
  ]),
  c => c.res('ok'),
  //c => c.res(`text: ${c.var.text}`),
)
