import type { Command } from '../builders/command'
import type { Button, Select } from '../builders/components'
import type { Modal } from '../builders/modal'
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

type Var = NonNullable<Env['Variables']>

type CreateReturn<E extends Env> = {
  discord: (init?: InitOptions<E>) => DiscordHono<E>
  command: <V extends Var>(
    command: Command,
    handler: CommandHandler<E & { Variables: V }>,
  ) => { command: Command; handler: CommandHandler<E> }
  component: <V extends Var, C extends Button<any> | Select<any>>(
    component: C,
    handler: ComponentHandler<E & { Variables: V }>,
  ) => { component: C; handler: ComponentHandler<E> }
  autocomplete: <V extends Var>(
    command: Command,
    autocomplete: AutocompleteHandler<E & { Variables: V }>,
    handler: CommandHandler<E & { Variables: V }>,
  ) => { command: Command; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E> }
  modal: <V extends Var>(
    modal: Modal,
    handler: ModalHandler<E & { Variables: V }>,
  ) => { modal: Modal; handler: ModalHandler<E> }
  cron: <V extends Var>(
    cron: string,
    handler: CronHandler<E & { Variables: V }>,
  ) => { cron: string; handler: CronHandler<E> }
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
  command: (command, handler) => ({ command, handler: handler as CommandHandler<E> }),
  component: (component, handler) => ({ component, handler: handler as ComponentHandler<E> }),
  autocomplete: (command, autocomplete, handler) => ({
    command,
    autocomplete: autocomplete as AutocompleteHandler<E>,
    handler: handler as CommandHandler<E>,
  }),
  modal: (modal, handler) => ({ modal, handler: handler as ModalHandler<E> }),
  cron: (cron, handler) => ({ cron, handler: handler as CronHandler<E> }),
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
