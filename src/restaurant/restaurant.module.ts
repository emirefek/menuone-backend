import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [RestaurantController],
  imports: [DrizzleModule],
  providers: [RestaurantService],
})
export class RestaurantModule {}
