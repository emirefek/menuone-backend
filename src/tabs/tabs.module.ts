import { Module } from "@nestjs/common";
import { RedisModule } from "src/redis/redis.module";
import { TabsService } from "./tabs.service";
import { TabsController } from "./tabs.controller";

@Module({
  imports: [RedisModule],
  providers: [TabsService],
  controllers: [TabsController],
})
export class TabsModule {}
