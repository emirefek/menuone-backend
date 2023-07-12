import { INestApplicationContext, WebSocketAdapter } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";

import { RedisocketPropagatorService } from "src/redisocket-propagator/redisocket-propagator.service";
import { SocketService } from "./socket.service";
import { WebSocket, ServerOptions, Server } from "ws";
import { uuid } from "src/utils/uuid";

export type SocketId = string;
export type RestaurantId = string;
export type AccessToken = string;

export interface UniqueWebSocket extends WebSocket {
  id: SocketId;
  restaurantId: RestaurantId | undefined;
  userId: string | undefined;
}

export class SocketAdapter extends WsAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketService: SocketService,
    private readonly redisocketPropagatorService: RedisocketPropagatorService,
  ) {
    super(app);
  }

  public create(port: number, options: ServerOptions = {}): Server {
    const server: Server = super.create(port, options);
    this.redisocketPropagatorService.injectSocketServer(server);

    // server.use(async (socket: UniqueWebSocket, next: any) => {
    //   try {
    //     // fake auth
    //     socket.restaurantId = "1234";
    //     socket.userId = "5678";

    //     return next();
    //   } catch (e) {
    //     console.log(e);
    //     return next(e);
    //   }
    // });

    return server;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public bindClientConnect(server: Server, callback: Function): void {
    server.on("connection", (socket: UniqueWebSocket) => {
      socket.id = uuid();
      socket.restaurantId = "unassigned";

      this.socketService.addSocket("unassigned", socket);

      socket.on("disconnect", () => {
        this.socketService.removeSocket(socket, socket.restaurantId);

        socket.removeAllListeners("disconnect");
      });

      callback(socket);
    });
  }
}
