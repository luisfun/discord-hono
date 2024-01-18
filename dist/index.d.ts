import type { APIEmbed } from 'discord-api-types/v10';
import type { ExecutionContext, WaitUntilHandler } from './context';
import { Context } from './context';
import type { Env, ScheduledEvent, CommandHandler, Commands, SetCommandsHandler, ScheduledHandler, ScheduledArray, SetScheduledHandler, ApplicationCommand } from './types';
import type { RegisterArg } from './register';
import { register } from './register';
export type { APIEmbed, ApplicationCommand, CommandHandler, Commands, ScheduledHandler, WaitUntilHandler, RegisterArg, Context, };
export { register, };
export declare const DiscordHono: {
    new <E extends Env = Env>(): {
        "__#2@#commands": Commands | undefined;
        "__#2@#scheduled": ScheduledArray;
        fetch: (request: Request, env?: {} | E["Bindings"] | undefined, executionCtx?: ExecutionContext) => Promise<Response>;
        scheduled: (event: ScheduledEvent, env: {} | E["Bindings"], executionCtx: ExecutionContext) => Promise<void>;
        /**
         * @param commands Commands
         */
        setCommands: SetCommandsHandler<E>;
        /**
         * @param cron cron string - "": triggers all crons
         * @param scheduled ScheduledHandler
         */
        setScheduled: SetScheduledHandler<E>;
    };
};
