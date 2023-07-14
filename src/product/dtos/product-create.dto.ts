import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
