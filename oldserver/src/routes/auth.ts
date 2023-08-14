import { badGateway, badRequest } from '@hapi/boom';
import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { Op } from 'sequelize';

import { checkPassword, randomBytesAsync } from "../auth";
import { User } from '../database';

const mailgun = new Mailgun(FormData)
const mailgunClient = mailgun.client(config.get('mailgun')) // will error; mailgun-js init is different to mailgun.js


interface ILoginPayload {
    email: string;
    password: string;
    verifyCode: string;
}

export const loginRoute: ServerRoute = {
    method: 'POST',
    path: '/api/auth',
    options: {
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string(),
                verifyCode: Joi.string(),
            },
        },
    },
    async handler(req) {
        const { email, password, verifyCode } = <ILoginPayload>req.payload;

        let augmentedEmail = [email];
        if (email.endsWith('@dur.ac.uk') || email.endsWith('@durham.ac.uk')) {
            const [prefix] = email.split('@');

            augmentedEmail = [`${prefix}@dur.ac.uk`, `${prefix}@durham.ac.uk`];
        }

        const user = await User.findOne({
            where: {
                email: { [Op.or]: augmentedEmail },
            },
        });

        if (!user) {
            throw badRequest('Incorrect email.');
        }

        if (user.hashed_password) {
            if (password) {
                const comparison = await checkPassword(user, password);
                if (!comparison) {
                    throw badRequest('Incorrect password.');
                }
            } else {
                throw badRequest('Password required.');
            }
        } else {
            if (verifyCode) {
                if (verifyCode.toLowerCase() !== user.verifyCode?.toLowerCase()) {
                    throw badRequest('Incorrect verify code.');
                }
            } else {
                const token = (await randomBytesAsync(3)).toString('hex').toUpperCase();

                await user.update({
                    verifyCode: token,
                    verifySentAt: new Date(),
                });
                
                try {
                    const domain = (config.get('mailgun') as any).domain
                    await mailgunClient.messages.create(domain, {
                        from: `DurHack <noreply@${domain}>`,
                        'h:Reply-To': 'hello@durhack.com',
                        to: user.email,
                        subject: `Your DurHack verification code is ${user.verifyCode}`,
                        text: [
                            `Hi ${user.preferredName},`,
                            `Welcome to DurHack! Your verification code is ${user.verifyCode}`,
                            'If you have any questions, please chat to one of us.',
                            'Thanks,',
                            'The DurHack Team',
                            '(If you didn\'t request this code, you can safely ignore this email.)',
                        ].join('\n\n'),
                    });
                } catch (error) {
                    Error.captureStackTrace(error);
                    console.log(error.stack);
                    throw badGateway('Failed to send verification email.');
                }
                
                throw badRequest('Verification code required.');
            }
        }

        const update: Partial<User> = { lastLoggedInAt: new Date() };
        if (!user.initiallyLoggedInAt) {
            update.initiallyLoggedInAt = new Date();
        }
        await user.update(update);

        return {
            token: jsonwebtoken.sign(JSON.stringify(user.toJSON()), config.get('jwt'), { algorithm: 'HS256' }),
        };
    },
};