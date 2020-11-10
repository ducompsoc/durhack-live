import { ServerRoute } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import { hash } from 'bcryptjs';

import { requireUser } from '../auth';

export const passwordRoute: ServerRoute = {
    method: 'POST',
    path: '/api/password',
    options: {
        validate: {
            payload: {
                password: Joi.string().min(6).required(),
            },
        },
    },
    async handler(req) {
        const user = await requireUser(req);

        await user.update({ password: await hash((<{ password: string }>req.payload).password, 8) });

        return { status: true };
    },
};
