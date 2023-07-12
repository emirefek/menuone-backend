interface IData {
  topic: "order";
  data: any;
}

export class RedisSocketEventRecievedDTO {
  public readonly restaurantId: string;
  public readonly data: IData;
}
