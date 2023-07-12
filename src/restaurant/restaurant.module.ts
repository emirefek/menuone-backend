import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { CategoryModule } from "src/category/category.module";
import { TableModule } from "src/table/table.module";

@Module({
  controllers: [RestaurantController],
  imports: [DrizzleModule, CategoryModule, TableModule],
  exports: [RestaurantService],
  providers: [RestaurantService],
})
export class RestaurantModule {}
