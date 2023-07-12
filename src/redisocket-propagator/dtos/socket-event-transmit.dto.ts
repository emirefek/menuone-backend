import {
  AccessToken,
  RestaurantId,
  UniqueWebSocket,
} from "src/socket/socket.adapter";

type DataType = LoginData | ChangeRestaurantData;

type LoginData = {
  event: "login";
  data: AccessToken;
};

type ChangeRestaurantData = {
  event: "switch";
  data: RestaurantId;
};

export class RedisSocketEventTransmitDTO {
  public readonly data: DataType;
  public readonly socket: UniqueWebSocket;
}
