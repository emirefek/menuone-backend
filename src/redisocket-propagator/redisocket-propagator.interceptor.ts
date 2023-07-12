import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { WsResponse } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { UniqueWebSocket } from "src/socket/socket.adapter";

import { RedisocketPropagatorService } from "./redisocket-propagator.service";

@Injectable()
export class RedisocketPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>>
{
  public constructor(
    private readonly redisocketPropagatorService: RedisocketPropagatorService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: UniqueWebSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        this.redisocketPropagatorService.propagateEvent({
          data: data,
          socket: socket,
        });
      }),
    );
  }
}
