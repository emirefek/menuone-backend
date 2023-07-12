import { Injectable } from "@nestjs/common";
import { REDIS_SOCKET_TAB_UPDATES } from "./redisocket-propagator.constants";

import { RedisSocketEventRecievedDTO } from "./dtos/socket-event-recieved.dto";
import { Server } from "ws";

import { RedisService } from "src/redis/redis.service";
import { SocketService } from "src/socket/socket.service";
import { tap } from "rxjs";
import { RedisSocketEventTransmitDTO } from "./dtos/socket-event-transmit.dto";

@Injectable()
export class RedisocketPropagatorService {
  private socketServer: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_TAB_UPDATES)
      .pipe(tap(this.consumeTabUpdates))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisocketPropagatorService {
    this.socketServer = server;
    return this;
  }

  private consumeTabUpdates = (eventInfo: RedisSocketEventRecievedDTO) => {
    const { data, restaurantId } = eventInfo;

    const sockets = this.socketService.getSocket(restaurantId);

    // console.log("sockets to push new message", sockets);

    sockets.forEach((socket) => {
      socket.send(JSON.stringify(eventInfo));
    });
  };

  public propagateEvent(eventInfo: RedisSocketEventTransmitDTO): boolean {
    if (!eventInfo.data) {
      return false;
    }
    // console.log(
    //   "propagating event",
    //   eventInfo.data + " " + eventInfo.socket.id,
    // );

    // if (eventInfo.data.event === "login") {
    //   this.socketService.loginSocket(eventInfo.socket, eventInfo.data.data);
    // }

    // this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);

    return true;
  }
}
