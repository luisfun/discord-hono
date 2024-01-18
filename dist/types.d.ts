import type { APIBaseInteraction, InteractionType, APIChatInputApplicationCommandInteractionData, APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';
import type { Context } from './context';
type Bindings = Record<string, unknown>;
type Variables = Record<string, unknown>;
export type Env = {
    Bindings?: Bindings;
    Variables?: Variables;
};
export type ScheduledEvent = {
    cron: string;
    type: string;
    scheduledTime: number;
};
export type CommandHandler<E extends Env = any> = (c: Context<E>) => Promise<Response> | Response;
/**
 * [ApplicationCommand](https://discord.com/developers/docs/interactions/application-commands)
 */
export type ApplicationCommand = Omit<APIApplicationCommand, 'id' | 'type' | 'application_id' | 'default_member_permissions' | 'version'> & {
    id?: string;
    type?: ApplicationCommandType;
    application_id?: string;
    default_member_permissions?: string | null;
    version?: string;
};
/**
 * [ApplicationCommand](https://discord.com/developers/docs/interactions/application-commands)
 */
export type Commands<E extends Env = any> = [
    ApplicationCommand,
    CommandHandler<E>
][];
export type SetCommandsHandler<E extends Env = any> = (commands: Commands<E>) => void;
export type ScheduledHandler<E extends Env = any> = (c: Context<E>) => Promise<unknown>;
export type ScheduledArray<E extends Env = any> = [
    string,
    ScheduledHandler<E>
][];
export type SetScheduledHandler<E extends Env = any> = (cron: string, scheduled: ScheduledHandler<E>) => void;
export type ValidationTargets = {
    json: any;
    form: Record<string, string | File>;
    query: Record<string, string | string[]>;
    queries: Record<string, string[]>;
    param: Record<string, string>;
    header: Record<string, string>;
    cookie: Record<string, string>;
};
export declare abstract class FetchEventLike {
    abstract readonly request: Request;
    abstract respondWith(promise: Response | Promise<Response>): void;
    abstract passThroughOnException(): void;
    abstract waitUntil(promise: Promise<void>): void;
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export type Interaction = APIBaseInteraction<InteractionType, APIChatInputApplicationCommandInteractionData>;
export {};
