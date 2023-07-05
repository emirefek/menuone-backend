import { Inject, Injectable } from "@nestjs/common";
import { REDIS_CONNECTION } from "src/constants";
import { RedisClient } from "src/redis/redis.interface";

@Injectable()
export class TabsService {
  constructor(@Inject(REDIS_CONNECTION) private redis: RedisClient) {}

  async create(key: string, value: string) {
    const resp = await this.redis.set(key, value);
    return resp;
  }

  async get(key: string) {
    const resp = await this.redis.get(key);
    return resp;
  }
}
