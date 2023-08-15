import config from "config";
import express, { Express } from "express";
import { createServer } from "http";
import { Server as SocketIO } from 'socket.io';
import passport from "passport";

import "./auth";
import session from "./auth/session";
import sequelize, { ensureDatabaseExists } from './database';
import api_router from "./routes";
import { setServer } from './socket';

const environment = process.env.NODE_ENV;
const dev = environment !== "production";

function getExpressApp(): Express {
  const app = express();

  app.use(session);
  app.use(passport.authenticate("session"));
  app.use(passport.authenticate("bearer", { session: false }));

  app.use("/api", api_router);

  return app;
}

function getServer(app: Express) {
  const server = createServer(app);

  const io = new SocketIO(server);
  setServer(io);

  return server;
}

async function main() {
  await ensureDatabaseExists();
  await sequelize.sync();

  const app = getExpressApp();
  const server = getServer(app);

  const listen = config.get("listen");

  if (typeof listen.port !== "number" || typeof listen.host !== "string") {
    throw new Error("Listen host/port are incorrectly configured.")
  }

  server.listen(listen.port, listen.host, () => {
    console.log(`> Server listening on http://${listen.host}:${listen.port} as ${dev ? "development" : environment}`);
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
