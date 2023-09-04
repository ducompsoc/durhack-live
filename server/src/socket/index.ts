import { Server, Socket } from "socket.io";
import { ZodError } from "zod";

import User from "@/database/user";
import TokenVault from "@/auth/tokens";
import TokenType from "@/auth/token_type";
import { HackathonStateSchema } from "@/common/schema/hackathon_state";

import { getHackathonState, setHackathonState } from "./state";


class HackathonStateSocketConnection {
  declare connectedUser?: User;
  declare manager: HackathonStateSocketManager;
  declare socket: Socket;

  constructor(manager: HackathonStateSocketManager, socket: Socket) {
    this.manager = manager;
    this.socket = socket;
    this.addSocketEventListeners();
  }

  private addSocketEventListeners() {
    this.socket.on("authenticate", this.onAuthenticate.bind(this));
    this.socket.on("pushState", this.onPushState.bind(this));
    this.socket.on("disconnect", this.onDisconnect.bind(this));
  }

  private async onAuthenticate(token: unknown, cb: (err: string | null, role?: string | null) => void) {
    if (this.connectedUser) return;
    if (typeof token !== "string" || typeof cb !== "function") return;

    let decodedPayload;
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.accessToken, token)).payload;
    } catch (error) {
      return cb("Auth failed.");
    }

    let user: User;
    let scope: string[];
    try {
      ({ user, scope } = await TokenVault.getUserAndScopeClaims(decodedPayload));
    } catch (error) {
      return cb("Auth failed.");
    }

    if (!scope.includes("socket:state")) return cb("Auth failed.");

    this.connectedUser = user;

    this.socket.join("state:global");
    this.socket.join(`state:user:${this.connectedUser.id}`);
    this.socket.emit("userState", {});

    cb(null, this.connectedUser ? this.connectedUser.role : null);
    this.socket.emit("globalState", getHackathonState());
  }

  private async onPushState(state: unknown, cb: (error: Error | null) => void) {
    if (!this.connectedUser || this.connectedUser.role !== "admin") {
      return;
    }
    let parsed_state;
    try {
      parsed_state = HackathonStateSchema.parse(state);
    } catch (error) {
      if (!(error instanceof ZodError)) return console.error(error);
      return cb(error);
    }
    await setHackathonState(parsed_state);
    this.manager.server!.to("state:global").emit("globalState", getHackathonState());
    return cb(null);
  }

  private onDisconnect() {
    this.manager.connections.delete(this);
  }
}

class HackathonStateSocketManager {
  declare server?: Server;
  declare connections: Set<HackathonStateSocketConnection>;

  constructor() {
    this.connections = new Set();
  }

  public initialise(server: Server): void {
    this.server = server;
    this.addServerEventListeners();
  }

  public getServer(): Server | undefined {
    return this.server;
  }

  private addServerEventListeners(): void {
    if (!this.server) throw new Error("Manager not initialized.");

    this.server.on("connection", this.onConnection.bind(this));
  }

  private onConnection(socket: Socket) {
    if (!this.server) return;
    this.connections.add(new HackathonStateSocketConnection(this, socket));
  }
}

export default new HackathonStateSocketManager();
