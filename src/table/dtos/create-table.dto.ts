import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTableDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
