import * as jsonWebToken from 'jsonwebtoken';
import config from 'config';
import { Request } from '@hapi/hapi';
import { forbidden, unauthorized } from '@hapi/boom';
import { User } from './database';
import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

export const promise_pbkdf2 = promisify(pbkdf2);
export const randomBytesAsync = promisify(randomBytes);

export async function hashPasswordText(password: string, salt: Buffer): Promise<Buffer> {
    /**
     * Returns hashed text for password storage/comparison.
     *
     * @param password - the text to hash
     * @param salt - the salt to hash with
     * @returns the hashed password bytes
     */
    const normalized_password = password.normalize();
    // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
    return await promise_pbkdf2(normalized_password, salt, 310000, 32, "sha256");
}

export async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
    /**
     * Returns whether the password attempt is correct for the provided user.
     *
     * @param user - the user to compare against
     * @param password_attempt - the password attempt to check
     * @returns whether the password attempt matches the user's password hash
     */
    if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
        throw new Error("Password has not been set");
    }

    const hashed_password_attempt = await hashPasswordText(password_attempt, user.password_salt);
    return timingSafeEqual(hashed_password_attempt, user.hashed_password);
}

export async function resolveJWT(jwt: string) {
    try {
        return jsonWebToken.verify(jwt, config.get('jwt'), { algorithms: ['HS256'] });
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