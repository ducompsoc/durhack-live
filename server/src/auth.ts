import { verify } from 'jsonwebtoken';
import { get } from 'config';
import { Request } from '@hapi/hapi';
import { forbidden, unauthorized } from '@hapi/boom';
import { User } from './database';

export async function resolveJWT(jwt: string) {
    try {
        return verify(jwt, get('jwt'), { algorithms: ['HS256'] });
    } catch (err) {
        return null;
    }
}

export async function requireUser(request: Request) {
    if (!request.headers.authorization && !request.headers.authorization.startsWith('Bearer ')) {
        throw unauthorized('Authorization details required');
    }

    const jwt = request.headers.authorization.split(' ')[1];
    const jwtUser = await resolveJWT(jwt);
    if (!jwtUser) {
        throw unauthorized('Incorrect authorization token provided');
    }

    const user = await User.findOne({ where: { id: (<{ id: number }>jwtUser).id } });
    if (!user) {
        throw unauthorized('Authorized user could not be found');
    }

    return user;
}

export async function requireAdmin(request: Request) {
    const user = await requireUser(request);

    if (user.role !== 'admin') {
        throw forbidden('You are not an admin');
    }

    return user;
}