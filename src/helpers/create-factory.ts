import type { Command } from '../builders/command'
import type { Modal } from '../builders/modal'
import { DiscordHono } from '../discord-hono'
import type {
  AutocompleteHandler,
  CommandHandler,
  ComponentHandler,
  ComponentType,
  CronHandler,
  Env,
  InitOptions,
  ModalHandler,
} from '../types'
import { CUSTOM_ID_SEPARATOR, newError } from '../utils'

class DiscordHonoExtends<E extends Env> extends DiscordHono<E> {
  loader = (handlers: Handler<E>[]) => {
    for (const elem of handlers) {
      if ('command' in elem) {
        if ('autocomplete' in elem) this.autocomplete(elem.command.toJSON().name, elem.autocomplete, elem.handler)
        else this.command(elem.command.toJSON().name, elem.handler)
      } else if ('component' in elem) {
        const json = elem.component.toJSON()
        if ('custom_id' in json) this.component(json.custom_id.split(CUSTOM_ID_SEPARATOR)[0], elem.handler)
      } else if ('modal' in elem) this.modal(elem.modal.toJSON().custom_id.split(CUSTOM_ID_SEPARATOR)[0], elem.handler)
      else if ('cron' in elem) this.cron(elem.cron, elem.handler)
      else throw newError('.loader()', 'unknown object')
    }
    return this
  }
}

// biome-ignore lint: Null Variables
type Var = {}

type CreateReturn<E extends Env> = {
  discord: (init?: InitOptions<E>) => DiscordHonoExtends<E>
  command: <V extends Var>(
    command: Command,
    handler: CommandHandler<E & { Variables?: V }>,
  ) => { command: Command; handler: CommandHandler<E> }
  component: <V extends Var, C extends ComponentType>(
    component: C,
    handler: ComponentHandler<E & { Variables?: V }, C>,
  ) => { component: C; handler: ComponentHandler<E, C> }
  autocomplete: <V extends Var>(
    command: Command,
    autocomplete: AutocompleteHandler<E & { Variables?: V }>,
    handler: CommandHandler<E & { Variables?: V }>,
  ) => { command: Command; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E> }
  modal: <V extends Var>(
    modal: Modal,
    handler: ModalHandler<E & { Variables?: V }>,
  ) => { modal: Modal; handler: ModalHandler<E> }
  cron: <V extends Var>(
    cron: string,
    handler: CronHandler<E & { Variables?: V }>,
  ) => { cron: string; handler: CronHandler<E> }
  getCommands: (handlers: Handler<E>[]) => Command[]
}

type Handler<E extends Env> =
  | ReturnType<CreateReturn<E>['command']>
  | ReturnType<CreateReturn<E>['component']>
  | ReturnType<CreateReturn<E>['autocomplete']>
  | ReturnType<CreateReturn<E>['modal']>
  | ReturnType<CreateReturn<E>['cron']>

export const createFactory = <E extends Env = Env>(): CreateReturn<E> => ({
  discord: init => new DiscordHonoExtends<E>(init),
  command: (command, handler) => ({ command, handler: handler as CommandHandler<E> }),
  component: (component, handler) => ({ component, handler: handler as ComponentHandler<E, any> }),
  autocomplete: (command, autocomplete, handler) => ({
    command,
    autocomplete: autocomplete as AutocompleteHandler<E>,
    handler: handler as CommandHandler<E>,
  }),
  modal: (modal, handler) => ({ modal, handler: handler as ModalHandler<E> }),
  cron: (cron, handler) => ({ cron, handler: handler as CronHandler<E> }),
  getCommands: handlers => handlers.filter(e => 'command' in e).map(e => e.command),
})
