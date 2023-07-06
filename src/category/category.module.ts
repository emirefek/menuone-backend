import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [DrizzleModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
