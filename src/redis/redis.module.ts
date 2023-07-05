import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REDIS_CONNECTION } from "src/constants";
import { Redis } from "ioredis";

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
  ],
  exports: [REDIS_CONNECTION],
})
export class RedisModule {}
