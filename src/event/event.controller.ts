import { Body, Controller, Post } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { REDIS_SOCKET_TAB_UPDATES } from "src/redisocket-propagator/redisocket-propagator.constants";
import { PublishEventDTO } from "./dtos/publish-event.dto";

@Controller("event")
export class EventController {
  constructor(private redisService: RedisService) {}

  @Post("publish")
  async publish(@Body() publishBody: PublishEventDTO): Promise<string> {
    await this.redisService.publish(publishBody.event, publishBody);

    return "OK";
  }
}
