import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "./drizzle.interface";

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DrizzleClient> => {
        const connectionString = configService.get<string>("DB_URI");
        const pool = new Pool({
          connectionString,
          ssl: true,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
