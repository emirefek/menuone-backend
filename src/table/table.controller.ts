import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateTableDTO } from "./dtos/create-table.dto";
import { TableService } from "./table.service";
import { User } from "src/auth/decorators/user.decorator";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";

@Controller("restaurant/:restaurantId/table")
export class TableController {
  constructor(private tableService: TableService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  async create(
    @Param("restaurantId") restaurantId: string,
    @Body() createBody: CreateTableDTO,
    @User() user: IJwtPayload,
  ) {
    const resp = await this.tableService.create(user.id, {
      name: createBody.name,
      restaurantId: restaurantId,
    });

    return resp;
  }
}
