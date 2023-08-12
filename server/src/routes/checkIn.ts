import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import pick from 'lodash/pick';

import { requireUser } from '../auth';

export const getCheckInRoute: ServerRoute = {
    method: 'GET',
    path: '/api/checkin',
    async handler(req) {
        const user = await requireUser(req);

        return pick(user, 'age', 'phoneNumber', 'university', 'graduationYear', 'ethnicity', 'gender', 'hUKConsent', 'hUKMarketing', 'checkedIn');
    },
};

export const doCheckInRoute: ServerRoute = {
    method: 'POST',
    path: '/api/checkin',
    options: {
        validate: {
            payload: {
                age: Joi.number().min(18).required(),
                phoneNumber: Joi.string().regex(/^\+?(\d|\s)+$/).required(),
                university: Joi.string().required(),
                graduationYear: Joi.number().min(2018).max(2028).required(),
                ethnicity: Joi.string().optional(),
                gender: Joi.string().optional(),
                hUKConsent: Joi.any().valid(true).required(),
                hUKMarketing: Joi.boolean().required(),
                checkedIn: Joi.boolean().required(),
            },
        },
    },
    async handler(req) {
        const user = await requireUser(req);

        await user.update({ ...<any>req.payload, checkedIn: true });

        return pick(user, 'age', 'phoneNumber', 'university', 'graduationYear', 'ethnicity', 'gender', 'hUKConsent', 'hUKMarketing', 'checkedIn');
    },
};
