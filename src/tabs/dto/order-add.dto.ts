import {
  IsInt,
  IsJWT,
  IsNotEmpty,
  IsNotEmptyObject,
  IsUUID,
} from "class-validator";

export class OrderJsonDTO {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class TabOrderAddDTO {
  @IsNotEmptyObject()
  orders: OrderJsonDTO[];

  @IsJWT()
  clientToken: string;
}
