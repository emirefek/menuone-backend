import { Module } from "@nestjs/common";
import { RedisModule } from "src/redis/redis.module";
import { TabsService } from "./tabs.service";
import { TabsController } from "./tabs.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ProductModule } from "src/product/product.module";

@Module({
  imports: [RedisModule, DrizzleModule, ProductModule],
  providers: [TabsService],
  controllers: [TabsController],
})
export class TabsModule {}
