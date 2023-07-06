import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
