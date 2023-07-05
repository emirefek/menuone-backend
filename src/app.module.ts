import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { RedisModule } from "./redis/redis.module";
import { TabsModule } from "./tabs/tabs.module";
import { RestaurantModule } from "./restaurant/restaurant.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [".env.development", ".env"],
      isGlobal: true,
    }),
    DrizzleModule,
    RedisModule,
    TabsModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "APP_PIPE",
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          transform: true,
        });
      },
    },
  ],
})
export class AppModule {}
