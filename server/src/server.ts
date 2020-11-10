import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as SocketIO from 'socket.io';

import { sequelize } from './database';
import { loginRoute } from './routes/auth';
import { passwordRoute } from './routes/password';
import { setServer } from './socket';

async function init() {
    await sequelize.sync();

    const server = Hapi.server({
        port: 3001,
        host: '127.0.0.1',
        routes: {
            cors: true,
            validate: {
                async failAction(_, __, err) {
                    throw err;
                },
            },
        },
    });

    server.ext({
        type: 'onPreResponse',
        method: (request, h) => {
            if (request.response && 'isBoom' in request.response && request.response.isBoom && request.response.isServer) {
                console.log(request.response.stack);
            }

            return h.continue;
        },
    })

    server.validator(<any>Joi);

    server.route(loginRoute);
    server.route(passwordRoute);

    const io = SocketIO(server.listener);
    setServer(io);

    await server.start();

    console.log(`Server running on ${server.info.uri}.`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
