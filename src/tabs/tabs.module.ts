import { Module } from "@nestjs/common";
import { RedisModule } from "src/redis/redis.module";
import { TabsService } from "./tabs.service";
import { TabsController } from "./tabs.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [RedisModule, DrizzleModule],
  providers: [TabsService],
  controllers: [TabsController],
})
export class TabsModule {}
