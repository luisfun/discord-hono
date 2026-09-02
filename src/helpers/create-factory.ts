import type {
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIModalInteractionResponseCallbackData,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10'
import { DiscordHono } from '../discord-hono'
import type {
  AutocompleteHandler,
  CommandContext,
  CommandHandler,
  ComponentHandler,
  CronHandler,
  Env,
  InitOptions,
  InteractionComponent,
  JsonSerializable,
  ModalHandler,
  ResolvedToJSON,
  Simplify,
} from '../types'
import { CUSTOM_ID_SEPARATOR, toJSON } from '../utils'

class DiscordHonoExtends<E extends Env> extends DiscordHono<E> {
  loader(handlers: Handler<E>[]): this {
    for (const elem of handlers) {
      if ('command' in elem) {
        const command = toJSON(elem.command)
        if ('autocomplete' in elem) this.autocomplete(command.name, elem.autocomplete)
        this.command(command.name, elem.handler)
      } else if ('component' in elem) {
        const component = toJSON(elem.component)
        if ('custom_id' in component)
          this.component(component.custom_id.split(CUSTOM_ID_SEPARATOR)[0] ?? '', elem.handler)
      } else if ('modal' in elem) {
        const modal = toJSON(elem.modal)
        this.modal(modal.custom_id.split(CUSTOM_ID_SEPARATOR)[0] ?? '', elem.handler)
      } else if ('cron' in elem) this.cron(elem.cron, elem.handler)
    }
    return this
  }
}

type SubCommandHandler<E extends Env> = CommandHandler<E, RESTPostAPIChatInputApplicationCommandsJSONBody>

type ExtractSubCommand<T> = T extends { subCommand: infer U } ? U : T extends { subCommandGroup: infer U } ? U : never

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

type ExtractCommandVars<
  T extends
    | RESTPostAPIApplicationCommandsJSONBody
    | APIApplicationCommandSubcommandOption
    | APIApplicationCommandSubcommandGroupOption,
> = T extends { options?: infer O }
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
  command<
    T extends JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>,
    V extends Var = ExtractCommandVars<ResolvedToJSON<T>>,
  >(
    command: T,
    handler: CommandHandler<E & { Variables?: V }, ResolvedToJSON<T>>,
  ): { command: T; handler: CommandHandler<E, ResolvedToJSON<T>> }
  subCommand<
    T extends JsonSerializable<APIApplicationCommandSubcommandOption>,
    V extends Var = ExtractCommandVars<ResolvedToJSON<T>>,
  >(subCommand: T, handler: SubCommandHandler<E & { Variables?: V }>): { subCommand: T; handler: SubCommandHandler<E> }
  subCommandGroup<
    T extends JsonSerializable<APIApplicationCommandSubcommandGroupOption>,
    V extends Var = ExtractCommandVars<ResolvedToJSON<T>>,
  >(
    subCommandGroup: T,
    handler: SubCommandHandler<E & { Variables?: V }>,
  ): {
    subCommandGroup: T
    handler: SubCommandHandler<E>
  }
  component<T extends JsonSerializable<InteractionComponent>>(
    component: T,
    handler: ComponentHandler<E, ResolvedToJSON<T>>,
  ): { component: T; handler: ComponentHandler<E, ResolvedToJSON<T>> }
  autocomplete<
    T extends JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>,
    V extends Var = ExtractCommandVars<ResolvedToJSON<T>>,
  >(
    command: T,
    autocomplete: AutocompleteHandler<E & { Variables?: V }>,
    handler: CommandHandler<E & { Variables?: V }, ResolvedToJSON<T>>,
  ): { command: T; autocomplete: AutocompleteHandler<E>; handler: CommandHandler<E, ResolvedToJSON<T>> }
  modal<
    T extends JsonSerializable<APIModalInteractionResponseCallbackData>,
    V extends Var = ExtractModalVars<ResolvedToJSON<T>>,
  >(modal: T, handler: ModalHandler<E & { Variables?: V }>): { modal: T; handler: ModalHandler<E> }
  cron<V extends Var>(
    cron: string,
    handler: CronHandler<E & { Variables?: V }>,
  ): { cron: string; handler: CronHandler<E> }
  getCommands(handlers: Handler<E>[]): JsonSerializable<RESTPostAPIApplicationCommandsJSONBody>[]
  getSubCommands<T extends Handler<E>>(handlers: readonly T[]): ExtractSubCommand<T>[]
  subLoader(
    handlers: Handler<E>[],
    defaultHandler?: SubCommandHandler<E>,
  ): CommandHandler<E, RESTPostAPIChatInputApplicationCommandsJSONBody>
}

type Handler<E extends Env> =
  | ReturnType<Factory<E>['command']>
  | ReturnType<Factory<E>['subCommand']>
  | ReturnType<Factory<E>['subCommandGroup']>
  | ReturnType<Factory<E>['component']>
  | ReturnType<Factory<E>['autocomplete']>
  | ReturnType<Factory<E>['modal']>
  | ReturnType<Factory<E>['cron']>

export const createFactory = <E extends Env = Env>(): Factory<E> => ({
  // biome-ignore-start lint/nursery/useExplicitType: omitted
  discord(init) {
    return new DiscordHonoExtends<E>(init)
  },
  command(command, handler: any) {
    return { command, handler }
  },
  subCommand(subCommand, handler: any) {
    return { subCommand, handler }
  },
  subCommandGroup(subCommandGroup, handler: any) {
    return { subCommandGroup, handler }
  },
  component(component, handler: any) {
    return { component, handler }
  },
  autocomplete(command, autocomplete: any, handler: any) {
    return { command, autocomplete, handler }
  },
  modal(modal, handler: any) {
    return { modal, handler }
  },
  cron(cron, handler: any) {
    return { cron, handler }
  },
  getCommands(handlers) {
    return handlers.filter(e => 'command' in e).map(e => e.command)
  },
  getSubCommands(handlers) {
    return handlers
      .filter(e => 'subCommand' in e || 'subCommandGroup' in e)
      .map(e => ('subCommand' in e ? e.subCommand : e.subCommandGroup) as any)
  },
  subLoader(handlers, defaultHandler) {
    const handlerMap = new Map<`cmd:${string}` | `grp:${string}`, SubCommandHandler<E>>()
    for (const elem of handlers) {
      if ('subCommand' in elem) {
        const subCommand = toJSON(elem.subCommand)
        handlerMap.set(`cmd:${subCommand.name}`, elem.handler)
      } else if ('subCommandGroup' in elem) {
        const subCommandGroup = toJSON(elem.subCommandGroup)
        handlerMap.set(`grp:${subCommandGroup.name}`, elem.handler)
      }
    }
    return (c: CommandContext<E, RESTPostAPIChatInputApplicationCommandsJSONBody>) =>
      handlerMap.get(c.sub.group ? `grp:${c.sub.group}` : `cmd:${c.sub.command}`)?.(c) ??
      defaultHandler?.(c) ??
      Response.json({ error: 'Subcommand not found' }, { status: 400 })
  },
  // biome-ignore-end lint/nursery/useExplicitType: omitted
})
