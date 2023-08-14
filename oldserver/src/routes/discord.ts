import { badGateway } from '@hapi/boom';
import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import fetch from 'node-fetch';

import { requireUser } from '../auth';

export const doDiscordRoute: ServerRoute = {
    method: 'POST',
    path: '/api/discord',
    options: {
        validate: {
            payload: {
                accessToken: Joi.string().required(),
            },
        },
    },
    async handler(req) {
        const user = await requireUser(req);

        const discordUserResponse = await fetch('https://discord.com/api/oauth2/@me', {
            headers: {
                'Authorization': `Bearer ${(<{ accessToken: string }>req.payload).accessToken}`,
            },
        });

        if (!discordUserResponse.ok) {
            throw badGateway("Discord returned a non-2xx response.");
        }

        const discordUser = await discordUserResponse.json() as any;

        await user.update({
            discordId: discordUser.user.id,
            discordName: `${discordUser.user.username}#${discordUser.user.discriminator}`,
        });

        return { inviteUrl: 'https://discord.gg/a7xrC3sQZ2' };
    },
};
