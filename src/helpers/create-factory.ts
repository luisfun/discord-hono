import type { Command } from '../builder/command'
import type { Button, Select } from '../builder/components'
import type { Modal } from '../builder/modal'
import { DiscordHono } from '../discord-hono'
import type {
  AutocompleteHandler,
  CommandHandler,
  ComponentHandler,
  CronHandler,
  Env,
  InitOptions,
  ModalHandler,
} from '../types'
import { CUSTOM_ID_SEPARATOR } from '../utils'

type CreateReturn<E extends Env> = {
  discord: (init: InitOptions<E>) => DiscordHono<E>
  command: (command: Command, handler: CommandHandler<E>) => { command: Command; handler: CommandHandler<E> }
  component: (
    component: Button | Select,
    handler: ComponentHandler<E>,
  ) => { component: Button | Select; handler: ComponentHandler<E> }
  autocomplete: (
    command: Command,
    autocomplete: AutocompleteHandler<E>,
    handler: CommandHandler<E>,
  ) => { command: Command; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E> }
  modal: (modal: Modal, handler: ModalHandler<E>) => { modal: Modal; handler: ModalHandler<E> }
  cron: (cron: string, handler: CronHandler<E>) => { cron: string; handler: CronHandler<E> }
  loader: (
    app: DiscordHono<E>,
    wrappers: (
      | ReturnType<CreateReturn<E>['command']>
      | ReturnType<CreateReturn<E>['component']>
      | ReturnType<CreateReturn<E>['autocomplete']>
      | ReturnType<CreateReturn<E>['modal']>
      | ReturnType<CreateReturn<E>['cron']>
    )[],
  ) => void
}

export const createFactory = <E extends Env = Env>(): CreateReturn<E> => ({
  discord: init => new DiscordHono(init),
  command: (command, handler) => ({ command, handler }),
  component: (component, handler) => ({ component, handler }),
  autocomplete: (command, autocomplete, handler) => ({ command, autocomplete, handler }),
  modal: (modal, handler) => ({ modal, handler }),
  cron: (cron, handler) => ({ cron, handler }),
  loader: (app, wrappers) => {
    for (const w of wrappers) {
      if ('command' in w) {
        if ('autocomplete' in w) app.autocomplete(w.command.toJSON().name, w.autocomplete, w.handler)
        else app.command(w.command.toJSON().name, w.handler)
      } else if ('component' in w) {
        const json = w.component.toJSON()
        if ('custom_id' in json) app.component(json.custom_id.split(CUSTOM_ID_SEPARATOR)[0], w.handler)
      } else if ('modal' in w) app.modal(w.modal.toJSON().custom_id.split(CUSTOM_ID_SEPARATOR)[0], w.handler)
      else if ('cron' in w) app.cron(w.cron, w.handler)
      else throw Error('Interaction Loader Unknown Object')
    }
  },
})
