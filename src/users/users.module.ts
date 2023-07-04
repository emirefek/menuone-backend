import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  providers: [UsersService],
  imports: [DrizzleModule],
  exports: [UsersService],
})
export class UsersModule {}
