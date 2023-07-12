import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  REDIS_CONNECTION,
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from "src/constants";
import { Redis } from "ioredis";
import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      provide: REDIS_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const connectionString = configService.get<string>("REDIS_URI");
        if (!connectionString) {
          throw new Error("REDIS_URI is not defined");
        }
        const client = new Redis(connectionString);
        return client;
      },
    },
    {
      provide: REDIS_SUBSCRIBER_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const connectionString = configService.get<string>("REDIS_URI");
        if (!connectionString) {
          throw new Error("REDIS_URI is not defined");
        }
        const client = new Redis(connectionString);
        return client;
      },
    },
    {
      provide: REDIS_PUBLISHER_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const connectionString = configService.get<string>("REDIS_URI");
        if (!connectionString) {
          throw new Error("REDIS_URI is not defined");
        }
        const client = new Redis(connectionString);
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
