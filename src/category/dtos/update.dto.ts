import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  index: number;
}
