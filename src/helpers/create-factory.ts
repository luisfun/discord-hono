import type {
  APIModalInteractionResponseCallbackData,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10'
import { DiscordHono } from '../discord-hono'
import type {
  AutocompleteHandler,
  CommandHandler,
  ComponentHandler,
  CronHandler,
  Env,
  InitOptions,
  InteractionComponent,
  JsonSerializable,
  ModalHandler,
  Simplify,
} from '../types'
import { CUSTOM_ID_SEPARATOR, newError, toJSON } from '../utils'

class DiscordHonoExtends<E extends Env> extends DiscordHono<E> {
  loader(handlers: Handler<E>[]): this {
    for (const elem of handlers) {
      if ('command' in elem) {
        if ('autocomplete' in elem) this.autocomplete(elem.command.name, elem.autocomplete)
        this.command(elem.command.name, elem.handler)
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

type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (value: infer I) => void
  ? I
  : never

type ExtractOptionValue<T> = T extends { type: 3 | 6 | 7 | 8 | 9 | 11 }
  ? string
  : T extends { type: 4 | 10 }
    ? number
    : T extends { type: 5 }
      ? boolean
      : never

type ExtractOptionVar<T> = T extends { name: infer N extends string }
  ? ExtractOptionValue<T> extends never
    ? {}
    : T extends { required: true }
      ? { [K in N]: ExtractOptionValue<T> }
      : { [K in N]?: ExtractOptionValue<T> }
  : {}

type ExtractNestedOptionVars<T> = T extends { options?: infer O }
  ? O extends ReadonlyArray<infer U>
    ? Simplify<UnionToIntersection<ExtractNestedOptionVars<U> | ExtractOptionVar<U>>>
    : {}
  : ExtractOptionVar<T>

type ExtractCommandVars<T extends RESTPostAPIApplicationCommandsJSONBody> = T extends { options?: infer O }
  ? O extends ReadonlyArray<infer U>
    ? Simplify<UnionToIntersection<ExtractNestedOptionVars<U>>>
    : {}
  : {}

type ExtractModalValue<T> = T extends { type: 4 | 21 | 23 }
  ? string
  : T extends { type: 3 | 5 | 6 | 7 | 8 | 19 | 22 }
    ? string[]
    : never

type ExtractModalKey<T> = T extends { custom_id: infer K extends string }
  ? ExtractModalValue<T> extends never
    ? {}
    : T extends { required: true } // | { type: 3 | 5 | 6 | 7 | 8 | 19 | 22 }
      ? { [P in K]: ExtractModalValue<T> }
      : { [P in K]?: ExtractModalValue<T> }
  : {}

type ExtractModalVars<T> = T extends readonly (infer U)[]
  ? Simplify<UnionToIntersection<ExtractModalVars<U>>>
  : T extends { components: infer C }
    ? ExtractModalVars<C>
    : T extends { component: infer C }
      ? ExtractModalVars<C>
      : ExtractModalKey<T>

interface Factory<E extends Env> {
  discord(init?: InitOptions<E>): DiscordHonoExtends<E>
  command<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var = ExtractCommandVars<T>>(
    command: JsonSerializable<T>,
    handler: CommandHandler<E & { Variables?: V }>,
  ): { command: T; handler: CommandHandler<E> }
  component<T extends InteractionComponent, C extends InteractionComponent>(
    component: JsonSerializable<T>,
    handler: ComponentHandler<E, C>,
  ): { component: T; handler: ComponentHandler<E, C> }
  autocomplete<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var = ExtractCommandVars<T>>(
    command: JsonSerializable<T>,
    autocomplete: AutocompleteHandler<E & { Variables?: V }>,
    handler: CommandHandler<E & { Variables?: V }>,
  ): { command: T; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E> }
  modal<T extends APIModalInteractionResponseCallbackData, V extends Var = ExtractModalVars<T>>(
    modal: JsonSerializable<T>,
    handler: ModalHandler<E & { Variables?: V }>,
  ): { modal: T; handler: ModalHandler<E> }
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
  command<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var = ExtractCommandVars<T>>(
    command: JsonSerializable<T>,
    handler: CommandHandler<E & { Variables?: V }>,
  ) {
    return { command: toJSON(command) as T, handler: handler as CommandHandler<E> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  component<T extends InteractionComponent, C extends InteractionComponent>(
    component: JsonSerializable<T>,
    handler: ComponentHandler<E, C>,
  ) {
    return { component: toJSON(component) as T, handler: handler as ComponentHandler<E, any> }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  autocomplete<T extends RESTPostAPIApplicationCommandsJSONBody, V extends Var = ExtractCommandVars<T>>(
    command: JsonSerializable<T>,
    autocomplete: AutocompleteHandler<E & { Variables?: V }>,
    handler: CommandHandler<E & { Variables?: V }>,
  ) {
    return {
      command: toJSON(command) as T,
      autocomplete: autocomplete as AutocompleteHandler<E>,
      handler: handler as CommandHandler<E>,
    }
  },
  // biome-ignore lint/nursery/useExplicitType: omitted
  modal<T extends APIModalInteractionResponseCallbackData, V extends Var = ExtractModalVars<T>>(
    modal: JsonSerializable<T>,
    handler: ModalHandler<E & { Variables?: V }>,
  ) {
    return { modal: toJSON(modal) as T, handler: handler as ModalHandler<E> }
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

import {
  makeActionRow,
  makeButton,
  makeChannelSelect,
  makeLabel,
  makeModal,
  makeSlashCommand,
  makeStringOption,
  makeStringSelect,
  makeSubCommand,
  makeSubCommandGroup,
  makeTextInput,
} from '../builders'

const testFactory = createFactory()
//const testCommand1 = testFactory.command<any, {text: string}>({ name: 'test', description: 'A test command', options: [{ name: 'text', type: 3, description: 'A string option' }] }, c => c.res(`text1: ${c.var.text}`))
//const testCommand1 = testFactory.command({ name: 'test', description: 'A test command', options: [{ name: 'text', type: 3, description: 'A string option' }] } as const, c => c.res(`text1: ${c.var.text}`))
const testCommand2 = testFactory.command(
  makeSlashCommand('test2', 'Another test command').options([
    //makeStringOption('text', 'A string option'),
    makeSubCommand('sub1', 'A subcommand').options([makeStringOption('text2', 'A string option').required(true)]),
    makeSubCommandGroup('group1', 'A subcommand group').options([
      makeSubCommand('sub2', 'Another subcommand').options([
        makeStringOption('text', 'A string option').required(true),
      ]),
    ]),
  ]),
  //c => c.res('ok'),
  c => c.res(`text1: ${c.var.text}`),
)
void testCommand2

const testButton1 = testFactory.component(makeButton('testButton', 'A test button'), c => c.res('ok'))
void testButton1
const testSelect1 = testFactory.component(makeStringSelect('select', [['opt1', 'Option 1']]), c => c.res('ok'))
void testSelect1

const testModal1 = testFactory.modal(
  makeModal('testModal', 'A test modal', [
    makeActionRow([makeTextInput('text', 'A text input')]),
    makeLabel('label1', makeChannelSelect('channel')),
  ]),
  c => c.res(`text1: ${c.var.text}, channel: ${c.var.channel}`),
)
void testModal1
