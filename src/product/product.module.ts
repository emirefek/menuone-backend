import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { RedisModule } from "src/redis/redis.module";
import { ProductController } from "./product.controller";

@Module({
  providers: [ProductService],
  imports: [DrizzleModule, RedisModule],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
