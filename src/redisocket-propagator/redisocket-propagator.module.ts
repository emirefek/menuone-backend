import { Module } from "@nestjs/common";
import { RedisModule } from "src/redis/redis.module";
import { RedisocketPropagatorService } from "./redisocket-propagator.service";
import { SocketModule } from "src/socket/socket.module";

@Module({
  imports: [RedisModule, SocketModule],
  providers: [RedisocketPropagatorService],
  exports: [RedisocketPropagatorService],
})
export class RedisocketPropagatorModule {}
