import { IsNotEmpty, IsString } from "class-validator";

export class CreateKeyDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
