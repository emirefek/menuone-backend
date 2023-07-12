import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RestaurantService } from "./restaurant.service";
import { User } from "src/auth/decorators/user.decorator";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";
import { SentryInterceptor } from "src/sentry/sentry.interceptor";

@UseInterceptors(SentryInterceptor)
@Controller("restaurant")
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  async create(@User() user: IJwtPayload, @Body() createBody: any) {
    try {
      const resp = await this.restaurantService.create(user.id, createBody);
      return resp;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get("all")
  async getAll(@User() user: IJwtPayload) {
    try {
      const resp = await this.restaurantService.getAll(user.id);
      return resp;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async getOne(@Param("id") id: string, @User() user: IJwtPayload) {
    try {
      return await this.restaurantService.getOneWithCategories(user.id, id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
