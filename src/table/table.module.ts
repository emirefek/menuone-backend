import { Module } from "@nestjs/common";
import { TableController } from "./table.controller";
import { TableService } from "./table.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [TableController],
  imports: [DrizzleModule],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
