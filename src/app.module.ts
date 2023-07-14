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
import { CategoryModule } from "./category/category.module";
import { SocketService } from "./socket/socket.service";
import { RedisocketPropagatorService } from "./redisocket-propagator/redisocket-propagator.service";
import { RedisocketPropagatorModule } from "./redisocket-propagator/redisocket-propagator.module";
import { SocketModule } from "./socket/socket.module";
import { EventModule } from "./event/event.module";
import { TableModule } from './table/table.module';
import { ProductModule } from './product/product.module';

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
    CategoryModule,
    RedisocketPropagatorModule,
    SocketModule,
    EventModule,
    TableModule,
    ProductModule,
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
    SocketService,
    RedisocketPropagatorService,
    EventModule,
  ],
})
export class AppModule {}
