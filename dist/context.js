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
var _Context_executionCtx, _Context_interaction, _Context_command, _Context_var;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_interactions_1 = require("discord-interactions");
const jsonResponse_1 = require("./utils/jsonResponse");
//export const TEXT_PLAIN = 'text/plain; charset=UTF-8'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Context {
    constructor(req, env, executionCtx, interaction) {
        var _a;
        this.env = {};
        _Context_executionCtx.set(this, void 0);
        _Context_interaction.set(this, void 0);
        _Context_command.set(this, { options: {} });
        _Context_var.set(this, {});
        this.set = (key, value) => {
            var _a;
            __classPrivateFieldSet(this, _Context_var, (_a = __classPrivateFieldGet(this, _Context_var, "f")) !== null && _a !== void 0 ? _a : {}, "f");
            __classPrivateFieldGet(this, _Context_var, "f")[key] = value;
        };
        this.get = (key) => {
            return __classPrivateFieldGet(this, _Context_var, "f") ? __classPrivateFieldGet(this, _Context_var, "f")[key] : undefined;
        };
        this.resJson = (json) => new jsonResponse_1.JsonResponse(json);
        /**
         * @param obj content: string, embeds: APIEmbed[]
         * @returns Response
         */
        this.res = (obj) => {
            const data = {
                content: obj.content,
                embeds: obj.embeds,
            };
            return this.resJson({ data, type: 4 }); // InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE = 4
        };
        this.resText = (content) => this.res({ content });
        this.resEmbed = (embed) => this.res({ embeds: [embed] });
        this.resDefer = () => new jsonResponse_1.JsonResponse({ type: discord_interactions_1.InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
        this.sendBody = async (body) => {
            var _a, _b;
            if (!((_a = this.env) === null || _a === void 0 ? void 0 : _a.DISCORD_APPLICATION_ID))
                throw new Error('DISCORD_APPLICATION_ID is not set.');
            if (!((_b = __classPrivateFieldGet(this, _Context_interaction, "f")) === null || _b === void 0 ? void 0 : _b.token))
                throw new Error('interaction is not set.');
            const url = `https://discord.com/api/v10/webhooks/${this.env.DISCORD_APPLICATION_ID}/${__classPrivateFieldGet(this, _Context_interaction, "f").token}`;
            const res = await fetch(url, { method: 'POST', body, });
            return new Response('Sent to Discord', { status: res.status });
        };
        this.sendJson = async (json) => {
            return await this.sendBody(JSON.stringify(json));
        };
        /**
         * @param obj content: string, embeds: embed[], files: (File | Blob)[]
         * @returns Promise<Response>
         */
        this.send = async (obj) => {
            const body = new FormData();
            if (obj.content)
                body.append('content', obj.content);
            if (obj.embeds)
                body.append('embeds', JSON.stringify(obj.embeds)); // 未検証
            if (obj.files) {
                for (let i = 0; i < obj.files.length; i++) {
                    body.append(`files${i}`, obj.files[i], `image${i}.png`);
                }
            }
            return await this.sendBody(body);
        };
        this.sendText = async (content) => await this.send({ content });
        this.sendEmbed = async (embed) => await this.send({ embeds: [embed] });
        this.sendImageBuffer = async (imageBuffer) => await this.send({ files: [new Blob([imageBuffer])] });
        this.req = req;
        if (env)
            this.env = env;
        if (executionCtx)
            __classPrivateFieldSet(this, _Context_executionCtx, executionCtx, "f");
        if (interaction)
            __classPrivateFieldSet(this, _Context_interaction, interaction, "f");
        if ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.data) === null || _a === void 0 ? void 0 : _a.options) {
            __classPrivateFieldGet(this, _Context_command, "f").options = interaction.data.options.reduce((obj, e) => {
                // @ts-expect-error
                obj[e.name] = e.value;
                return obj;
            }, {});
        }
    }
    get event() {
        if (__classPrivateFieldGet(this, _Context_executionCtx, "f") && 'respondWith' in __classPrivateFieldGet(this, _Context_executionCtx, "f")) {
            return __classPrivateFieldGet(this, _Context_executionCtx, "f");
        }
        else {
            throw Error('This context has no FetchEvent');
        }
    }
    get executionCtx() {
        if (__classPrivateFieldGet(this, _Context_executionCtx, "f")) {
            return __classPrivateFieldGet(this, _Context_executionCtx, "f");
        }
        else {
            throw Error('This context has no ExecutionContext');
        }
    }
    get interaction() {
        if (__classPrivateFieldGet(this, _Context_interaction, "f")) {
            return __classPrivateFieldGet(this, _Context_interaction, "f");
        }
        else {
            throw Error('This context has no Interaction');
        }
    }
    get command() {
        return __classPrivateFieldGet(this, _Context_command, "f");
    }
    // c.var.propName is a read-only
    get var() {
        return Object.assign({}, __classPrivateFieldGet(this, _Context_var, "f"));
    }
}
exports.Context = Context;
_Context_executionCtx = new WeakMap(), _Context_interaction = new WeakMap(), _Context_command = new WeakMap(), _Context_var = new WeakMap();
//# sourceMappingURL=context.js.map