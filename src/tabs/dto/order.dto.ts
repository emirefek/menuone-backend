import {
  IsEnum,
  IsJWT,
  IsNumber,
  IsSemVer,
  IsString,
  IsUUID,
} from "class-validator";

export enum OrderStatusEnum {
  OPEN = "OPEN",
  PREP = "PREP",
  SERVED = "SERVED",
  PAID = "PAID",
}

export class OrderDTO {
  @IsUUID()
  id: string;

  @IsUUID()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  description: string | null;

  @IsNumber()
  price: number;

  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsJWT()
  clientToken: string;
}
