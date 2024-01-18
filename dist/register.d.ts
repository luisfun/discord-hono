import type { Commands } from './types.js';
export type RegisterArg = {
    commands: Commands;
    applicationId: string | undefined;
    token: string | undefined;
    guildId?: string | undefined;
};
export declare const register: (arg: RegisterArg) => Promise<void>;
