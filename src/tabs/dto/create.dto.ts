import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateKeyDto {
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;
}
