import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';

import { hashPasswordText, randomBytesAsync, requireUser } from '../auth';

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

        user.password_salt = await randomBytesAsync(16);
        user.hashed_password = await hashPasswordText((req.payload as { password: string }).password, user.password_salt);
        await user.save();

        return { status: true };
    },
};
