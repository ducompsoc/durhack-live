import { Server, Socket } from "socket.io";

import User from "@/database/user";
import { getHackathonState, setHackathonState } from "./state";
import { IHackathonState } from "@/common/types";

export let io: Server | null = null;

export function getServer() {
  return io!;
}

export function setServer(server: Server) {
  io = server;
  io.on("connection", (socket: Socket) => {
    let connUser: User | null = null;

    socket.on("authenticate", async (token: string, cb: (err: string | null, role?: string | null) => void) => {
      if ((typeof token !== "string" && typeof cb !== "function") || connUser) {
        return;
      }

      if (token === "___durhack_stream_token_tA1qI0wB5pZ9oU0k") {
        socket.join("stream");
      } else {
        const jwtUser = await resolveJWT(token);
        if (!jwtUser) {
          cb("Auth failed.");
          return;
        }

        connUser = await User.findOne({ where: { id: (<{ id: number }>jwtUser).id } });
        if (!connUser) {
          cb("Auth failed.");
          return;
        }

        socket.join(`state:user:${connUser.id}`);
        socket.emit("userState", {});
      }

      socket.join("state:global");

      cb(null, connUser ? connUser.role : null);
      socket.emit("globalState", getHackathonState());
    });

    socket.on("pushState", (state: IHackathonState) => {
      if (!connUser || connUser.role !== "admin") {
        return;
      }

      setHackathonState(state);
      io!.to("state:global").emit("globalState", getHackathonState());
    });
  });
}
