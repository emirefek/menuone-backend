import { IsNotEmptyObject, IsString } from "class-validator";

export class PublishEventDTO {
  @IsString()
  event: string;

  @IsString()
  restaurantId: string;

  @IsNotEmptyObject()
  data: any;
}
