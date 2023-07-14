import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class ProductRedisDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  index: number;

  @IsUUID()
  categoryId: string;
}
