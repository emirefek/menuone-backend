import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { REGION_CODES } from "src/constants";

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsEnum(Object.keys(REGION_CODES))
  region: string;
}
