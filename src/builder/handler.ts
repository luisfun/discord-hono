import type {
  Env,
  TypeCommandHandler,
  TypeComponentHandler,
  TypeModalHandler,
  TypeCronHandler,
  Handlers,
} from '../types'

class Base<H extends TypeCommandHandler | TypeComponentHandler | TypeModalHandler | TypeCronHandler> {
  #handlers: Handlers<H> = []
  on = (id: string, handler: H) => {
    this.#handlers.push([id, handler])
    return this
  }
  build = () => this.#handlers
}

export class CommandHandlers<E extends Env = any> extends Base<TypeCommandHandler<E>> {}
export class ComponentHandlers<E extends Env = any> extends Base<TypeComponentHandler<E>> {}
export class ModalHandlers<E extends Env = any> extends Base<TypeModalHandler<E>> {}
/**
 * Just setting up cron here does not execute it. Please set up a cron trigger in wrangler.toml.
 * @sample
 * ```ts
 * .on('0 0 * * *', daily_handler)
 * .on('', all_other_schedule_handler)
 * ```
 */
export class CronHandlers<E extends Env = any> extends Base<TypeCronHandler<E>> {}
