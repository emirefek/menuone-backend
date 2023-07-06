import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CategoryService } from "./category.service";
import { User } from "src/auth/decorators/user.decorator";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";
import { CreateCategoryDto } from "./dtos/create.dto";
import { UpdateCategoryDto } from "./dtos/update.dto";
import { SentryInterceptor } from "src/sentry/sentry.interceptor";

@UseInterceptors(SentryInterceptor)
@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  async create(
    @User() user: IJwtPayload,
    @Body() createBody: CreateCategoryDto,
  ) {
    try {
      return await this.categoryService.create(
        user.id,
        createBody.restaurantId,
        createBody.name,
      );
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(":id/delete")
  async delete(@User() user: IJwtPayload, @Param("id") id: string) {
    try {
      return await this.categoryService.delete(user.id, id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(":id/update")
  async update(
    @User() user: IJwtPayload,
    @Param("id") id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    try {
      return await this.categoryService.update(user.id, id, body);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
