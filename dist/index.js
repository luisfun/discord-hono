"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _commands, _scheduled, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordHono = exports.register = void 0;
const discord_interactions_1 = require("discord-interactions");
const context_1 = require("./context");
const jsonResponse_1 = require("./utils/jsonResponse");
const register_1 = require("./register");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return register_1.register; } });
const defineClass = function () {
    return class {
    };
};
exports.DiscordHono = (_a = class extends defineClass() {
        constructor() {
            super();
            _commands.set(this, undefined);
            _scheduled.set(this, []);
            this.fetch = async (request, env, executionCtx) => {
                var _b;
                if (request.method === 'GET') {
                    return new Response('powered by Discord Hono🔥');
                }
                else if (request.method === 'POST') {
                    if (!env)
                        throw new Error('There is no env.');
                    // verify
                    const signature = request.headers.get('x-signature-ed25519');
                    const timestamp = request.headers.get('x-signature-timestamp');
                    const body = await request.text();
                    const isValidRequest = signature &&
                        timestamp &&
                        // @ts-expect-error *************どうにかしてエラーを消したい
                        (0, discord_interactions_1.verifyKey)(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
                    if (!isValidRequest || !body) {
                        return new Response('Bad request signature.', { status: 401 });
                    }
                    // verify end
                    const interaction = JSON.parse(body);
                    if (interaction.type === 1) { // verify - InteractionType.PING = 1
                        return new jsonResponse_1.JsonResponse({ type: discord_interactions_1.InteractionResponseType.PONG, });
                    }
                    if (interaction.type === 2) { // InteractionType.APPLICATION_COMMAND = 2
                        if (!__classPrivateFieldGet(this, _commands, "f"))
                            throw new Error('Commands is not set.');
                        const commandName = (_b = interaction.data) === null || _b === void 0 ? void 0 : _b.name.toLowerCase();
                        const commandIndex = __classPrivateFieldGet(this, _commands, "f").findIndex(command => command[0].name.toLowerCase() === commandName);
                        const handler = __classPrivateFieldGet(this, _commands, "f")[commandIndex][1];
                        return await handler(new context_1.Context(request, env, executionCtx, interaction));
                    }
                    return new jsonResponse_1.JsonResponse({ error: 'Unknown Type' }, { status: 400 });
                }
                return new Response('Not Found.', { status: 404 });
            };
            this.scheduled = async (event, env, executionCtx) => {
                //const c = new Context(new HonoRequest(request), { env, executionCtx, })
                //executionCtx.waitUntil()
            };
            this.setCommands = (commands) => {
                __classPrivateFieldSet(this, _commands, commands, "f");
                return this;
            };
            this.setScheduled = (cron, scheduled) => {
                __classPrivateFieldGet(this, _scheduled, "f").push([cron, scheduled]);
                return this;
            };
        }
    },
    _commands = new WeakMap(),
    _scheduled = new WeakMap(),
    _a);
//# sourceMappingURL=index.js.map