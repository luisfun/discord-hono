import type { APIEmbed, APIInteractionResponseChannelMessageWithSource } from 'discord-api-types/v10';
import type { Env, FetchEventLike, Interaction } from './types';
import { JsonResponse } from './utils/jsonResponse';
export interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
}
type Command = {
    options: Record<string, string>;
};
export type WaitUntilHandler<E extends Env = any> = (c: Context<E>) => Promise<unknown>;
export interface ContextVariableMap {
}
interface Get<E extends Env> {
    <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key];
    <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key];
}
interface Set<E extends Env> {
    <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void;
    <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void;
}
export type ResObject = {
    content?: string;
    embeds?: APIEmbed[];
};
export type SendObject = {
    content?: string;
    embeds?: APIEmbed[];
    files?: (File | Blob)[];
};
export declare class Context<E extends Env = any> {
    #private;
    req: Request;
    env: E['Bindings'];
    constructor(req: Request, env?: E['Bindings'], executionCtx?: FetchEventLike | ExecutionContext | undefined, interaction?: Interaction);
    get event(): FetchEventLike;
    get executionCtx(): ExecutionContext;
    get interaction(): Interaction;
    get command(): Command;
    set: Set<E>;
    get: Get<E>;
    get var(): Readonly<E['Variables'] & ContextVariableMap>;
    resJson: (json: APIInteractionResponseChannelMessageWithSource) => JsonResponse;
    /**
     * @param obj content: string, embeds: APIEmbed[]
     * @returns Response
     */
    res: (obj: ResObject) => JsonResponse;
    resText: (content: string) => JsonResponse;
    resEmbed: (embed: APIEmbed) => JsonResponse;
    resDefer: () => JsonResponse;
    sendBody: (body: BodyInit) => Promise<Response>;
    sendJson: (json: APIInteractionResponseChannelMessageWithSource) => Promise<Response>;
    /**
     * @param obj content: string, embeds: embed[], files: (File | Blob)[]
     * @returns Promise<Response>
     */
    send: (obj: SendObject) => Promise<Response>;
    sendText: (content: string) => Promise<Response>;
    sendEmbed: (embed: APIEmbed) => Promise<Response>;
    sendImageBuffer: (imageBuffer: ArrayBuffer) => Promise<Response>;
}
export {};
