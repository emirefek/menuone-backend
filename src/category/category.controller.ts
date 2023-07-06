import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CategoryService } from "./category.service";
import { User } from "src/auth/decorators/user.decorator";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";
import { CreateCategoryDto } from "./dtos/create.dto";
import { UpdateCategoryDto } from "./dtos/update.dto";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  async create(
    @User() user: IJwtPayload,
    @Body() createBody: CreateCategoryDto,
  ) {
    return await this.categoryService.create(
      user.id,
      createBody.restaurantId,
      createBody.name,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(":id/delete")
  async delete(@User() user: IJwtPayload, @Param("id") id: string) {
    return await this.categoryService.delete(user.id, id);
  }

  @UseGuards(AuthGuard)
  @Patch(":id/update")
  async update(
    @User() user: IJwtPayload,
    @Param("id") id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(user.id, id, body);
  }
}
