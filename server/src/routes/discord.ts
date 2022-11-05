import { ServerRoute } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import { get } from 'request-promise-native';

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

        const discordUser = await get('https://discord.com/api/oauth2/@me', {
            headers: {
                'Authorization': `Bearer ${(<{ accessToken: string }>req.payload).accessToken}`,
            },
            json: true,
        });

        await user.update({
            discordId: discordUser.user.id,
            discordName: `${discordUser.user.username}#${discordUser.user.discriminator}`,
        });

        return { inviteUrl: 'https://discord.gg/vCJjtzvNhH' };
    },
};
