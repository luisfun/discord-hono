import type {
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIEmbed,
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10'
import type { Env } from '../types'
import type { ComponentContext, ModalContext } from '../context'
import type { Modal } from './modal'

type OutputHandler<C extends ComponentContext | ModalContext> = (c: C) => Promise<Response> | Response
type Output<C extends ComponentContext | ModalContext> = [string, OutputHandler<C>]

class HandlerBase<C extends ComponentContext | ModalContext> {
  protected uniqueId: string
  constructor(uniqueId: string) {
    this.uniqueId = uniqueId
  }

  resBase = (e: APIInteractionResponse): Output<C> => [this.uniqueId, (c: C) => c.resBase(e)]
  res = (e: APIInteractionResponseCallbackData): Output<C> => [this.uniqueId, (c: C) => c.res(e)]
  resText = (content: string) => this.res({ content })
  resEmbeds = (...embeds: APIEmbed[]) => this.res({ embeds })
  resDefer = <T>(handler: (c: C, ...args1: T[]) => Promise<unknown>, ...args: T[]): Output<C> => [
    this.uniqueId,
    (c: C) => {
      if (!c.executionCtx.waitUntil && !c.event.waitUntil)
        throw new Error('This command handler context has no waitUntil. You can use .handler(command_handler).')
      if (c.executionCtx.waitUntil) c.executionCtx.waitUntil(handler(c, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else c.event.waitUntil(handler(c, ...args))
      return c.resDefer()
    },
  ]
  handler = (handler: OutputHandler<C>): Output<C> => [this.uniqueId, handler]
}

export class Handler<E extends Env = any> extends HandlerBase<ComponentContext<E>> {
  constructor(uniqueId: string) {
    super(uniqueId)
  }

  resUpdate = (e: APIInteractionResponseCallbackData): Output<ComponentContext<E>> => [
    this.uniqueId,
    (c: ComponentContext<E>) => c.resUpdate(e),
  ]
  resUpdateText = (content: string) => this.resUpdate({ content })
  resUpdateEmbeds = (...embeds: APIEmbed[]) => this.resUpdate({ embeds })
  resUpdateDefer = <T>(
    handler: (c: ComponentContext<E>, ...args1: T[]) => Promise<unknown>,
    ...args: T[]
  ): Output<ComponentContext<E>> => [
    this.uniqueId,
    (c: ComponentContext<E>) => {
      if (!c.executionCtx.waitUntil && !c.event.waitUntil)
        throw new Error('This command handler context has no waitUntil. You can use .handler(command_handler).')
      if (c.executionCtx.waitUntil) c.executionCtx.waitUntil(handler(c, ...args))
      // @ts-expect-error ****************** おそらくworkers以外のプラットフォーム、型をexecutionCtx.waitUntilと同じにしても問題ないか確認すること
      else c.event.waitUntil(handler(c, ...args))
      return c.resUpdateDefer()
    },
  ]
  resModal = (e: Modal | APIModalInteractionResponseCallbackData): Output<ComponentContext<E>> => [
    this.uniqueId,
    (c: ComponentContext<E>) => c.resModal(e),
  ]
}

export class ModalHandler<E extends Env = any> extends HandlerBase<ModalContext<E>> {
  constructor(uniqueId: string) {
    super(uniqueId)
  }
}
