import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "src/auth/decorators/user.decorator";
import { ProductCreateDTO } from "./dtos/product-create.dto";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";

@Controller("restaurant/:restaurantId/category/:categoryId/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  async create(
    @User() user: IJwtPayload,
    @Param("restaurantId") restaurantId: string,
    @Param("categoryId") categoryId: string,
    @Body() createBody: ProductCreateDTO,
  ) {
    try {
      return await this.productService.create(
        user.id,
        restaurantId,
        categoryId,
        createBody,
      );
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
