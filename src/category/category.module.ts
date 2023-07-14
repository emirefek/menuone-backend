import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { ProductModule } from "src/product/product.module";

@Module({
  imports: [DrizzleModule, ProductModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
