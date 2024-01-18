"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
// cloudflare-sample-app
// Copyright (c) 2022 Justin Beckwith
// https://github.com/discord/cloudflare-sample-app/blob/main/LICENSE
const register = async (arg) => {
    if (!arg.token)
        throw new Error('The DISCORD_TOKEN environment variable is required.');
    if (!arg.applicationId)
        throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
    const url = arg.guildId
        ? `https://discord.com/api/v10/applications/${arg.applicationId}/guilds/${arg.guildId}/commands`
        : `https://discord.com/api/v10/applications/${arg.applicationId}/commands`;
    const applicationCommands = arg.commands.map(cmd => cmd[0]);
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${arg.token}`,
        },
        method: 'PUT',
        body: JSON.stringify(applicationCommands),
    });
    if (response.ok) {
        console.log('Registered all commands');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    }
    else {
        console.error('Error registering commands');
        let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
        try {
            const error = await response.text();
            if (error) {
                errorText = `${errorText} \n\n ${error}`;
            }
        }
        catch (err) {
            console.error('Error reading body from request:', err);
        }
        console.error(errorText);
    }
};
exports.register = register;
//# sourceMappingURL=register.js.map