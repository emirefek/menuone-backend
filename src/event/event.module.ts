import { Module } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { RedisocketPropagatorModule } from "src/redisocket-propagator/redisocket-propagator.module";
import { EventController } from "./event.controller";
import { RedisModule } from "src/redis/redis.module";
import { SocketModule } from "src/socket/socket.module";

@Module({
  imports: [RedisocketPropagatorModule, RedisModule, SocketModule],
  providers: [EventGateway],
  controllers: [EventController],
})
export class EventModule {}
