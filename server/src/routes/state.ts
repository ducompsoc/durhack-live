import { ServerRoute } from '@hapi/hapi';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

import { requireAdmin } from '../auth';
import { setHackathonState } from '../state';
import { IHackathonState } from '../types';
import { getServer } from '../socket';


export const loginRoute: ServerRoute = {
    method: 'PUT',
    path: '/api/state',
    options: {
        validate: {
            payload: {
                // todo
            },
        },
    },
    async handler(req) {
        await requireAdmin(req);

        const state = <IHackathonState>req.payload;
        setHackathonState(state);
        getServer().to('state:global').emit('globalState', state);
    },
};
