import { UseInterceptors } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WsResponse,
  MessageBody,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { RedisocketPropagatorInterceptor } from "src/redisocket-propagator/redisocket-propagator.interceptor";
import { UniqueWebSocket } from "src/socket/socket.adapter";
import { SocketService } from "src/socket/socket.service";

@UseInterceptors(RedisocketPropagatorInterceptor)
@WebSocketGateway()
export class EventGateway {
  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage("login")
  public async loginEvent(
    @ConnectedSocket() socket: UniqueWebSocket,
    @MessageBody() body: any,
  ): Promise<string> {
    console.log("event gateway", socket.id);
    console.log("event gateway", body);

    if (!body.access_token) {
      return "failure";
    }

    const resp = await this.socketService.loginSocket(
      socket,
      body.access_token,
    );

    console.log("event gateway LOGIN RESP", resp);

    return resp ? "success" : "failure";
  }

  @SubscribeMessage("details")
  public detailsEvent(
    @ConnectedSocket() socket: UniqueWebSocket,
    @MessageBody() body: any,
  ): object {
    return {
      id: socket.id,
      userId: socket.userId,
      restaurantId: socket.restaurantId,
    };
  }

  @SubscribeMessage("switchRestaurant")
  public async switchRestaurantEvent(
    @ConnectedSocket() socket: UniqueWebSocket,
    @MessageBody() body: any,
  ): Promise<string> {
    if (!body.restaurantId) {
      return "failure";
    }

    const resp = await this.socketService.switchRestaurant(
      socket,
      body.restaurantId,
    );

    return resp ? "success" : "failure";
  }
}
