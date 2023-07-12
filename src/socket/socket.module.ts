import { Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { RedisocketPropagatorService } from "src/redisocket-propagator/redisocket-propagator.service";
import { RestaurantModule } from "src/restaurant/restaurant.module";

@Module({
  imports: [RestaurantModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
